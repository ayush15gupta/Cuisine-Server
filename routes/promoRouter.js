const express=require('express');
const morgan=require('morgan');
const bodyParser=require('body-parser');
const promoRouter=express.Router();
promoRouter.use(bodyParser.json());
promoRouter.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('Will send you all the promotions!');

})
.post((req,res,next)=>{
    res.end('Will add the promotion '+req.body.name+' with details: '+req.body.description);

})
.delete((req,res,next)=>{
    res.end('Deleting all the promotions');

})
.put((req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported');

});
promoRouter.route('/:promoId')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.end('Will send you the details of promotion with id: '+req.params.promoId+' to you');

})
.post((req,res,next)=>{
    res.statusCode=403;
    res.end('POST operation not supported on /promotions/'+req.params.promoId);

})
.delete((req,res,next)=>{
    res.end('Will delete the promotion :  '+req.params.promoId);

})
.put((req,res,next)=>{
    res.write('Will update the value of  '+req.params.promoId+' \n');
    res.end("Will update the promotion "+req.body.name+' with details:'+req.body.description);

});

module.exports=promoRouter;