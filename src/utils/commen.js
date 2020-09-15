module.exports = {
    resend(res,data={},type=true,msg='操作成功'){
        res.send({
            code : type?'200':'500',
            data,
            msg : msg
        })
    }
}