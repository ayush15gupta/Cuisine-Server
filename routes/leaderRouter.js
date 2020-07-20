const express=require('express');
const morgan=require('morgan');
const bodyParser=require('body-parser');
const Leaders=require('../models/leaders');
var authenticate = require('../authenticate');
const cors = require('./cors');
const leaderRouter=express.Router();
leaderRouter.use(bodyParser.json());
leaderRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next)=>{
    Leaders.find({})
    .then((leaders)=>{
       
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
        
        

    },(err)=>next(err))
    .catch((err)=>next(err));
    
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
   Leaders.create(req.body)
    .then((leader)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err)=>next(err))
    .catch((err)=>err);
    
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Leaders.remove({})
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
leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next)=>{
    Leaders.findById(req.params.leaderId)
    .then((leader)=>{
    
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
        
        
    },(err)=>next(err))
    .catch((err)=>next(err));
    
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode=403;
    res.end('POST operation not supported on /leaders/'+req.params.leaderId);
    
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);

    },(err)=>next(err))
    .catch((err)=>next(err));
    
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, { new: true })
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
    
});

module.exports=leaderRouter;