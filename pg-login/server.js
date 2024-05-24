const express = require('express');
const app = express();
const { pool } = require("./dbConfig")
const bcrypt = require('bcrypt')
const session = require('express-session')
const flash = require('express-flash')
const passport =require('passport')

const initializePassport = require('./passportConfig')

initializePassport(passport)

const port = process.env.PORT || 4000;

app.set('view engine','ejs')
app.use(express.urlencoded({extended: false}))

app.use(session({
    secret : 'secret',
    resave : false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());


app.get('/',(req,res) => {
    res.render('index');
})

app.get('/users/register',checkAuthenticated,(req,res)=>{
    res.render('register');
})

app.get('/users/login',checkAuthenticated,(req,res)=>{
    res.render('login');
})

app.get('/users/dashboard',checkNotAuthenticated,(req,res)=>{
    res.render('dashboard', { user : req.user.name });
})

app.get('/users/logout' , (req,res,next)=> {
    req.logOut(function(err){
        if (err) {return next(err); }
        req.flash('success_msg' , 'you have logged out!!!');
        res.redirect('/users/login');
    });
});

app.post('/users/register', async (req,res) => {
    let { name , email , password , password2 } = req.body
    console.log({
        name,
        email,
        password,
        password2
    });

    let errors = [];

    if(!name || !email || !password || !password2){
        errors.push({message: 'please enter all fields!!!'})
    }

    if(password.length < 6){
        errors.push({message: "password should be at least 6 characters!!!"})
    }

    if(password != password2){
        errors.push({message:"password do not match!!!"})
    }
    
    if(errors.length > 0){
        res.render('register', {errors})
    }else{
        let hashPassword = await bcrypt.hash(password, 10);
        console.log(hashPassword);

        pool.query(
            `SELECT * FROM users
            WHERE email = $1` , [email],(err,result)=>{
                if(err) throw err;
                console.log(result.rows);

                if(result.rows.length > 0){
                    errors.push({message: "email already registered!!!"})
                    res.render('register',{errors})
                }else{
                    pool.query(`INSERT INTO users (name,email,password)
                    VALUES ($1,$2,$3)
                    RETURNING id , password` , [name,email,hashPassword], (err,result)=>{
                        if (err) throw err;
                        console.log(result.rows);
                        req.flash('success_msg', 'you are now registered. please log in');
                        res.redirect('/users/login')
                    })
                }
            }
        )
    }

})

app.post('/users/login' , passport.authenticate('local' , {
    successRedirect : '/users/dashboard',
    failureRedirect : '/users/login',
    failureFlash : true
   })
);

function checkAuthenticated(req,res,next){
    if (req.isAuthenticated()) {
        return res.redirect('/users/dashboard')
    }
    next();
}

function checkNotAuthenticated(req,res,next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/users/login')
}

app.listen(port, () => {
    console.log(`app listening ${port}`);
})