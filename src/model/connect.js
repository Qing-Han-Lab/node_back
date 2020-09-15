let mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/evaluate');

let db = mongoose.connection;

db.on('errpr',()=>{
    console.log('数据库连接失败')
})

db.on('open',()=>{
    console.log('数据库连接成功')
})

module.exports = db