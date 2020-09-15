let express = require('express')
let router = express.Router()
let questionModel = require('../../model/questionModel/questionModel')

router.get('/getQuestion',(req,res)=>{
    questionModel.find().then(result=>{
        result = result.slice(0,20);
        result = result.map((item,index)=>{
            if(index%2===0){
                item.isEasy = false;
            }
            return item
        })
        res.send({
            code : 200,
            data : result
        }) 
        
    })
})

module.exports = router
