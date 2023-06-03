if(!process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}


const express = require('express');
const app = express();
const port = 8000;
const path = require('path');
const methodOverride = require('method-override');

//jab jab password jaye Bcrypt ho ke jaye isliye
const bcrypt = require('bcrypt');

const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
//const { Session } = require('inspector');


const initializePassport = require('./passportConfig');

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id == id)
)


app.set('view-engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:false}));
app.use(flash());
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

let users = [];


app.get('/',checkAuthentication,function(req,res){
    res.render('home.ejs');
})




app.get('/signup',checkNotAuthentication,function(req,res){
    res.render('signup.ejs');
})




//register signup Logic
//when error goes try and catch
app.post('/register',checkNotAuthentication,async (req,res)=>{

    try{
        const hashPassword = await bcrypt.hash(req.body.password,10);
        //iske under data chala jaye
        users.push({
            id : Date.now().toString(),
            email : req.body.email,
            password : hashPassword

        })
        res.redirect('/signin');

    }catch{
        res.redirect('back');

    }
    console.log(users);

})

app.get('/signin',checkNotAuthentication,function(req,res){
    res.render('signin.ejs');
})

app.post('/login',checkNotAuthentication,passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: 'signin',
    failureFlash:true

}))

app.delete('/logout',checkNotAuthentication, (req,res)=>{
    req.logout(function(){
        // if(err){
        //     return next(err);
        // }
        res.redirect('/signin');
    })
})

function checkAuthentication (req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/signin');
}
function checkNotAuthentication (req,res,next){
    if(req.isAuthenticated()){
        res.redirect('/');
    }
    next();
}




app.listen(port,function(err){
    if(err){
        console.log('error in running the server');
    }
    console.log('Server is fine in port number:',port);
})

