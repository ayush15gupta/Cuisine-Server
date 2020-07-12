const express=require('express');
const morgan=require('morgan');
const bodyParser=require('body-parser');
const leaderRouter=express.Router();
leaderRouter.use(bodyParser.json());
leaderRouter.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('Will send you all the leaders!');

})
.post((req,res,next)=>{
    res.end('Will add the leader '+req.body.name+' with details: '+req.body.description);

})
.delete((req,res,next)=>{
    res.end('Deleting all the leaders');

})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported');

});
leaderRouter.route('/:leaderId')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('Will send you the detail of leader'+req.params.leaderId+' to you');

})
.post((req,res,next)=>{
    res.statusCode=403;
    res.end('POST operation not supported on /leaders/'+req.params.leaderId);

})
.delete((req,res,next)=>{
    res.end('Will delete the leader :  '+req.params.leaderId);

})
.put((req,res,next)=>{
    res.write('Will update the value of  '+req.params.leaderId+' \n');
    res.end("Will update the leader "+req.body.name+' with details:'+req.body.description);

});

module.exports=leaderRouter;