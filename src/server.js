let express = require('express')
let app = express()
let db = require('./model/connect')

let userRouter = require('./router/userRouter/userRouter')
let questionRouter = require('./router/questionRouter/questionRouter')

app.use('/user',userRouter)
app.use('/question',questionRouter)

app.listen(3000,()=>{
  console.log('server start')
}) 