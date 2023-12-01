var express = require('express');
var router = express.Router();
const passport = require('passport')
let DB = require('../config/db')
let usermodel = require('../models/user')
let user = usermodel.user

router.get('/login',function(req,res,next){
  if(!req.user)
  {
    res.render('auth/login',
    {
      title:'login',
      message: req.flash('loginMessage'),
      displayname:''
    })
  }
  else{
    return res.redirect('/index')
  }
})

router.post('/login',function(req,res,next){
  passport.authenticate('local',(err,user,info)=>{
    if(err)
    {
      return next(err)
    }
    if(!user)
    {
      req.flash('loginMessage','AuthenticationError')
      return res.redirect('/login')
    } 
    req.login(user,(err)=>{
      if(err)
      {
        return next(err)
      }
      return passport.authenticate('local')(req, res, () => {
        res.redirect('/assignments');
      });
        })
  })(req, res, next);
})

router.get('/register',function(req,res,next){
  if(!req.user)
  {
    res.render('auth/register',
    {
      title:'register',
      message:req.flash('registerMessage'),
      displayname: req.user ? req.user.displayname : '' 
    })
  }
  else{
    return res.redirect('/')
  }
})

router.post('/register',function(req,res,next){
  let newuser = new user({
    username: req.body.username,
    email: req.body.email,
    displayname: req.body.displayname
  })
  user.register(newuser, req.body.password,(err)=>
  {
    if(err)
    {
      console.log('error in inserting new user')
      if(err.name == 'UserExistError')
      {
        req.flash('registermessage',
        'Registration Error : User already exisits'
        )
      }
      return res.render('auth/register',
      {
        title:'Register',
        message: req.flash('registerMessage'),
        displayname: req.user ? req.user.displayname:''
      }
      )
    }
    else{
      return passport.authenticate('local')(req,res,()=>{
        res.redirect('assignments')
      })
    }
  })
})

router.get('/logout', function(req, res) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/index');
  });
});

let mongoose = require('mongoose')
function requireAuth(req,res,next){
  console.log('Middleware called');

  if(!req.isAuthenticated())
  {
    return res.redirect('/login')
  }
  next()
}
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'index', displayname: req.user ? req.user.displayname : ''  });
});


router.get('/index', function(req, res, next) {
  res.render('index', { title: 'index', displayname: req.user ? req.user.displayname : '' });
});

router.get('/newassignment',requireAuth, function(req, res, next) {
  res.render('newassignment', { title: 'newassignment', displayname: req.user ? req.user.displayname : ''  });
}); 
router.get('/editassignment',requireAuth, function(req, res, next) {
  res.render('editassignment', { title: 'editassignment', displayname: req.user ? req.user.displayname : ''  });
}); 




module.exports = router;