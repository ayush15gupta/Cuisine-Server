const express=require('express');
const morgan=require('morgan');
const bodyParser=require('body-parser');
const Favorites=require('../models/favorite');
var authenticate = require('../authenticate');
const cors = require('./cors');
const favoriteRouter=express.Router();
favoriteRouter.use(bodyParser.json());
favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favorites.find({user:req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorite) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    }, (err) => next(err))
    .catch((err) => next(err));
    
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Favorites.findOne({user:req.user._id})
    .then((favorite) => {
        if (favorite != null) {
            //push new dishes into dishhes array if that dish does not exist before....
            
            for(var i=0;i<req.body.length;i++){
                var f=1;
                for(var j=0;j<favorite.dishes.length;j++)
                {
                    if(req.body[i]._id==favorite.dishes[j]._id)
                    {
                        f=0;
                    }
                }
                if(f==1)
                {
                    favorite.dishes.push(req.body[i]);
                }

            }
            
            favorite.save()
            .then((favorite) => {
                Favorites.findById(favorite._id)
                .populate('dishes')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })                  
            }, (err) => next(err));
        }
        else {
            //Create new favorite ... Add user:req.user._id and dishes:req.body
            
            var favorite=new Favorites({user:req.user._id,dishes:req.body});
            favorite.save()
            .then((favorite)=>{
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })  
            
            },(err)=>next(err))
            .catch((err)=>next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    Favorites.remove({user:req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err)); 

    
})
.put(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported');
    
});
favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403;
    res.end('GET operation not supported');
    
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    //post the dish with the given id 
    //1st case if the document does not exist
    //2nd case if the document does exist
    Favorites.findOne({user:req.user._id})
    .then((favorite) => {
        if (favorite != null) {
            //Add the new dish if it does not exist before
            
                var f=1;
                for(var j=0;j<favorite.dishes.length;j++)
                {
                    if(req.params.dishId==favorite.dishes[j]._id)
                    {
                        f=0;
                    }
                }
                if(f==1)
                {
                    favorite.dishes.push({_id:req.params.dishId});
                }
            
            favorite.save()
            .then((favorite) => {
                Favorites.findById(favorite._id)
                .populate('dishes')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })                  
            }, (err) => next(err));
        }
        else {
            //document does not exist
            //first create and then push new dish
            var favorite=new Favorites({user:req.user._id,dishes:[{_id:req.params.dishId}]});
            favorite.save()
            .then((favorite)=>{
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })  
            
            },(err)=>next(err))
            .catch((err)=>next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
    
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    // Delete the particular dish from dishes
    //1 st case if the document does not exit
    // 2nd case if the dish in the dishes does not exist
    // 3rd case if the dish exists  then delete this ...
    Favorites.findOne({user:req.user._id})
    .then((favorite)=>{
        
       
        var filtered = favorite.dishes.filter((el) =>{ return el._id != req.params.dishId; });
        favorite.dishes=filtered;
        
        favorite.save()
        .then((favorite)=>{
            Favorites.findById(favorite._id)
            .populate('user')
            .populate('dishes')
            .then((resp)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            })
            
        }, (err) => next(err))
        .catch((err) => next(err));
    },(err)=>next(err))
    .catch((err)=>next(err));
    
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported');
    
});
module.exports=favoriteRouter;