const express = require('express');
const app = express();

// importa modulul body-parser pentru a putea citi datele trimise prin POST
const bodyParser = require('body-parser');

// importa modulul cookie-parser pentru a putea citi datele din cookies
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const expressValidator = require('express-validator');

// seteaza template engine-ul aplicatiei
app.set('view engine', 'ejs');

/*********   
MIDDLEWARE
**********/

/**
 * Insereaza middleware-ul pentru parsarea requesturilor transmise prin formulare POST
 * Efect: pe obiectul req.body vor aparea perechile de chei/valori transmise prin formular
 */
app.use(bodyParser.urlencoded({extended: false}));

app.use(expressValidator());

/**
 * Insereaza middleware-ul pentru citirea si parsarea cookie-urilor
 * Efect: pe obiectul req.cookies vor aparea perechile de chei/valori din cookie-urile setate de aplicatia noastra
 */
app.use(cookieParser());

// seteaza directorul "/public" pentru a afisa asset-uri statice
app.use('/static', express.static('public'));

app.use(expressSession({secret: 'max', saveUninitialized: false, resave: false}));

app.use((req, res, next)=>{
console.log('test');
req.session.mesaj = "acesta este un mesaj custom";
next();

})

//middleware de test
app.use((req, res, next) => {
  res.mesaj = `Userul a venit de la adresa ${req.headers.referer}`;
  next();
});

/*********   
 RUTE
**********/

app.get('/', (req, res) => {  
  console.log(req.session.mesaj);
  res.render('pages/index',
  {
    nume: req.cookies.nume,
    mesaj: req.session.mesaj
  })
});

app.get('/New-page', (req, res) => {   
  res.render('pages/new-page');
});

app.get('/hello', (req, res) => {
  res.render('pages/hello', { success: true});
});


app.post('/hello', (req, res) => {
  req.check('email', 'Invalid email address').isEmail();
  req.check('nume', 'Numele este prea mic').isLength({min: 2});
  const errors = req.validationErrors();
  if (errors) {
    //req.session.errors = errors;
    //req.session.success = false;
    res.render('pages/hello', { success: false, errors : errors });
  } else {
    //req.session.success = true;
    //res.redirect('/');

    res.render('pages/hello', { success : true, errors : errors});

  }
  
});


// app.post('/hello', (req, res) => {     
//   res.cookie('nume', req.body.nume);
//   res.redirect('/');
// })

// app.post('/goodbye', (req, res) => {
//   res.clearCookie('nume');
//   res.redirect('/hello');
// })

app.listen(5000, () => console.log(`Listening on port: 5000`));