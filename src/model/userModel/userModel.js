let mongoose = require('mongoose')

let schema = new mongoose.Schema({
    id : {type:Number,default:0,required:true},  // id
    userName : {type:String,default:'',required:true}, // 用户名
    age : {type:Number,default:0,required:true}, // 年龄
    phone : {type:String,default:'',required:true}, // 手机号
    manjoy : {type:String,default:'',required:true}, // 所报专业
    isTest : {type:Boolean,default:false,required:true}, // 是否考试
    easyQuestionRes : {type:Number,default:0,required:true}, // 简单题答题结果
    hardQuestionRes : {type:Number,default:0,required:true}, // 难题答题结果
    testTime : {type:String,default:'0',required:false}, // 考试时间
    totalNum : {type:Number,default:20,required:false}, // 总题目数量
    easyNum : {type:Number,default:10,required:false}, // 简单题目数量
    hardNum : {type:Number,default:10,required:false}, // 难题目数量
    level : {type:Number,default:0,required:false}, // 等级
})


let userModel = mongoose.model('user',schema);

module.exports = userModel

