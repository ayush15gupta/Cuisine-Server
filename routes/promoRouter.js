const express=require('express');
const morgan=require('morgan');
const bodyParser=require('body-parser');
const Promotions=require('../models/promotions');
var authenticate = require('../authenticate');
const cors = require('./cors');
const promoRouter=express.Router();
promoRouter.use(bodyParser.json());
promoRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next)=>{
    Promotions.find({})
    .then((promotions)=>{
       
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promotions);
        
        

    },(err)=>next(err))
    .catch((err)=>next(err));
    
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotions.create(req.body)
    .then((promotion)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);
    },(err)=>next(err))
    .catch((err)=>err);
    
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotions.remove({})
    .then((result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    },(err)=>next(err))
    .catch((err)=>next(err));
    
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported');
    
});
promoRouter.route('/:promoId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next)=>{
    Promotions.findById(req.params.promoId)
    .then((promotion)=>{
    
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
        
        
    },(err)=>next(err))
    .catch((err)=>next(err));
    
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('POST operation not supported on /promotions/'+req.params.promoId);
    
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);

    },(err)=>next(err))
    .catch((err)=>next(err));
    
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotions.findByIdAndUpdate(req.params.promoId, {
        $set: req.body
    }, { new: true })
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
    
});

module.exports=promoRouter;