const express = require('express');
const app = express();
const User = require('./models/user');


app.set('view engine', 'ejs');
app.set('views', 'views');


app.get('/register', (req, res) => {
    res.render('register'); // Render the register.ejs file
});


app.get('/secret', (req, res) => {
    res.send("This is a secret, login to see");
});


app.listen(3000, () => {
    console.log('SERVING YOUR APP on http://localhost:3000');
});
