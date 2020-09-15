let commen = require('../../utils/commen')

let express = require('express');
let router = express.Router();
let userModel = require('../../model/userModel/userModel');
const e = require('express');

router.get('/resgin', (req, res) => { // 注册或者登录
    let params = req.query;
    let userName = params.userName,
        age = params.age,
        phone = params.phone,
        manjoy = params.manjoy;
    age = Number.parseInt(age)
    let msg = '',
        flag = true
    if (userName.trim() === '' && !/[0-9]+/g.test(userName)) {
        msg += '用户姓名有误 '
        flag = false
    }
    if (age < 0 || age > 120) {
        msg += '年龄有误 '
        flag = false
    }
    if (!/1(3|5|7|8)[0-9]{9}/.test(phone)) {
        msg += '手机号填写错误 '
        flag = false
    }
    if (manjoy.trim() === '') {
        msg += '所选专业有误 '
        flag = false
    }
    if (flag) {
        userModel.find().then(result => {
            if (result && result.length) {
                let index = result.findIndex(item => item.phone === phone);
                if (index === -1) { // 第一次注册
                    let id = result.length;
                    let userInfo = {
                        id,
                        userName,
                        phone,
                        age,
                        manjoy,
                        isTest: false,
                        easyQuestionRes: 0,
                        hardQuestionRes: 0,
                    }
                    userModel.insertMany([userInfo]).then(_ => {
                        commen.resend(res, {}, true, '用户注册成功')
                    }).catch(_ => {
                        commen.resend(res, {
                            netWorkErr: true
                        }, false, '服务器开小差了，用户注册失败')
                    })
                } else { // 已经注册
                    let item = result[index];
                    if (item.isTest) { // 考过了
                        commen.resend(res, {
                            isTest: true,
                            userName : item.userName,
                            phone: item.phone
                        }, false, '您已经测评过了，快去查看结果')
                    } else { // 没有
                        commen.resend(res, {
                            isTest: false,
                            userName : item.userName,
                            phone: item.phone
                        }, false, '您已经注册了，快去做题吧')
                    }
                }
            }
        }).catch(err => {
            commen.resend(res, {
                netWorkErr: true
            }, false, '服务器开小差了，用户注册失败')
        })
    } else {
        commen.resend(res, {
            netWorkErr: true
        }, false, '服务器开小差了，用户注册失败')
    }
})

router.get('/getResult', (req, res) => { // 获取用户答题结果
    let {
        phone
    } = req.headers
    if (phone) {
        userModel.find().then(result => {
            if (result) {
                let item = result.find(item => item.phone === phone);
                if (item) {
                    let model = {
                        level: item.level,
                        lev: {
                            down: 0,
                            middel: 0,
                            top: 0
                        }
                    };
                    let allTureParsent = 0;
                    result.forEach(op => {
                        let tureParsent = ((op.easyQuestionRes / op.easyNum) + (op.hardQuestionRes / op.hardNum)) / 2
                        allTureParsent += tureParsent;
                        if (op.phone === phone) {
                            model.selfRight = tureParsent
                        }
                        if (op.level === 0) {
                            model.lev.down++
                        } else if (op.level === 1) {
                            model.lev.middel++
                        } else {
                            model.lev.top++
                        }
                    })
                    allTureParsent = allTureParsent / result.length;
                    model.totalRight = allTureParsent;
                    commen.resend(res, model, true, '操作成功')
                } else {
                    commen.resend(res, {
                        netWorkErr: true
                    }, false, '服务器出错')
                }
            } else {
                commen.resend(res, {
                    netWorkErr: true
                }, false, '服务器出错')
            }
        }).catch(_ => {
            commen.resend(res, {
                netWorkErr: true
            }, false, '服务器出错')
        })
    } else {
        commen.resend(res, {
            isLogin: false
        }, false, '占未登录')
    }
})

router.get('/submit', (req, res) => { // 答题提交
    let {
        phone
    } = req.headers;
    let {
        easyRightTimes,
        hardRightTimes
    } = req.query
    if (!phone) {
        commen.resend(res, {}, false, '占未登录')
    } else {
        if (!easyRightTimes || !hardRightTimes) {
            commen.resend(res, {}, false, '参数不正确')
            return
        }
        easyRightTimes = parseInt(easyRightTimes)
        hardRightTimes = parseInt(hardRightTimes)
        userModel.find({
            phone: phone
        }).then(result => {
            if (result && result[0]) {
                if(result[0].isTest){
                    commen.resend(res, {}, false, '您已经答过题了')
                }
                let easyParsent = easyRightTimes / result[0].easyNum // 正确率
                let hardParsent = hardRightTimes / result[0].hardNum // 错误率
                console.log(easyParsent,hardParsent,'-----')
                let lev = 1; // 中等
                if (easyParsent > 0.5 && hardParsent > 0.5) lev = 2; // 优秀
                if (easyParsent < 0.5 && hardParsent < 0.5) lev = 0; // 基础
                userModel.update({
                    phone: phone
                }, {
                    isTest: true,
                    easyQuestionRes: easyRightTimes,
                    hardQuestionRes: hardRightTimes,
                    testTime: new Date().getTime().toString(),
                    level: lev
                }).then(result => {
                    commen.resend(res, {}, true, '提交成功')
                }).catch(_ => {
                    commen.resend(res, {}, false, '提交失败')
                })
            }
        }).catch(_ => {
            commen.resend(res, {}, false, '提交失败')
        })
    }

})


module.exports = router