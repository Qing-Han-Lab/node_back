let mongoose = require('mongoose')

let schema  =  new mongoose.Schema({
    title : {type:String,default:'题目',required:true},
    select : {type:String,default:'',required:true},
    tureSelect : {type:String,default:'A',required:true},
    isEasy : {type:Boolean,default:true,required: true}
})


let question = mongoose.model('question',schema)

module.exports = question