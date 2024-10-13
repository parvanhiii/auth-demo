const express = require('express');
const app = express();
const User = require('./models/user');
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const session= require('express-session');
mongoose.connect('mongodb://127.0.0.1:27017/authDemo');

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("DB CONNECTED")
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({extended:true}));
app.use(session({secret:'uptonogood'}));

 //if not logged in redirect to login
const requireLogin=(req,res,next)=>{
    if(!req.session.user_id){
       return res.redirect('/login')
    }
     next();  
}

app.get('/', (req, res) => {
    res.send('this is the home page'); 
});
app.get('/register', (req, res) => {
    res.render('register'); // Render the register.ejs file
});

app.post('/register', async(req, res) => {
    const{password,username}=req.body;
    const hash=await bcrypt.hash(password,12);
    const user= new User({
        username,
        password:hash
    })
    await user.save();
    req.session.user_id=user._id;
    res.redirect('/');
});
app.get('/login', (req, res) => {
    res.render('login')
}); 

app.post('/login', async(req, res) => {
    const {username,password} = req.body;
   const user= await User.findOne({username});
  const validPassword= await bcrypt.compare(password,user.password);
  if(validPassword){
    req.session.user_id=user._id;
    res.redirect('/secret');
  }
  else{
    res.redirect('/login');
  }
});

app.post('/logout',(req,res)=>{
    //req.session.user_id=null;
    req.session.destroy();
    res.redirect('/login');
})

app.get('/secret', requireLogin,(req, res) => {
    
    res.render('secret')
});


app.listen(3000, () => {
    console.log('SERVING YOUR APP on http://localhost:3000');
});
