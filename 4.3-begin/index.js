/***********  
INITIALIZARI
************/

const express = require('express');
const bodyParser = require('body-parser'); // citeste datele trimise prin POST
const cookieParser = require('cookie-parser'); // citeste datele din cookies
const expressSession = require('express-session'); // managementul sesiunilor
const {
  check,
  validationResult
} = require('express-validator/check'); // validare

// initializeaza o aplicatie Express
const app = express();

// portul default (pentru compatibilitate cu Heroku) 
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

const queries = require('./data/recipes_queries.js');

// seteaza template engine-ul aplicatiei
app.set('view engine', 'ejs');

/*******************   
STANDARD MIDDLEWARES
********************/

/**
 * Middleware-ul pentru parsarea requesturilor transmise prin formulare POST
 * Efect: pe obiectul req.body vor aparea perechile de chei/valori transmise prin formular
 */
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

/**
 * Middleware-ul pentru citirea si parsarea cookie-urilor
 * Efect: pe obiectul req.cookies vor aparea perechile de chei/valori din cookie-urile setate de aplicatia noastra
 */
app.use(cookieParser());

/**
 * Middleware-ul pentru gestionarea sesiunilor
 * Efect: pe req va aparea obiectul .session pe care vom putea pune diverse proprietati
 */
app.use(expressSession({
  secret: 'max',
  saveUninitialized: false,
  resave: false
}));

// seteaza directorul "/public" pentru a afisa asset-uri statice
app.use('/static', express.static('public'));

/*******************   
CUSTOM MIDDLEWARES
********************/

const email_valid = check('email', 'Formatul email-ului nu este corect').isEmail();
const name_valid = check('nume', 'Numele este prea scurt').isLength({
  min: 3
});

// Middleware custom care gestioneaza mesajele flash: 
// le pune intai pe res.locals si apoi le sterge din req.session
app.use((req, res, next) => {
  // if there's a flash message in the session, make it available in the response, then delete it
  if (req.session.flashMessage) {
    res.locals.flashMessage = req.session.flashMessage;
    delete req.session.flashMessage;
  }
  next();
});

/*********   
 RUTE
**********/

app.get('/', (req, res) => {
  res.locals.nume = req.cookies.nume;
  res.render('pages/index');
});

app.get('/hello', (req, res) => {
  res.render('pages/hello', {
    data: {},
    errors: {}
  });
});

app.post('/hello', email_valid, name_valid,
  (req, res) => {
    // pune erorile din req in obiectul errors 
    const errors = validationResult(req);

    // 1) Daca nu exista erori => redirect cu mesaj flash
    if (errors.isEmpty()) {
      req.session.flashMessage = 'Excelent, te-ai inscris cu email-ul ' + req.body.email;
      res.cookie('nume', req.body.nume)
      res.redirect('/');
    }
    // 2) Daca exista erori => afiseaza din nou formularul cu mesaje de eroare si datele completate
    else {
      res.render('pages/hello', {
        data: req.body,
        errors: errors.mapped()
      });
    }
  });

app.post('/goodbye', (req, res) => {
  res.clearCookie('nume');
  res.redirect('/hello');
});


/*************   
 SPA - Recipes
**************/

app.get('/recipes', (req, res) => {
  queries.all_recipes()
    .then(recipes => {
      console.log(recipes);
      res.render('pages/recipes', {
        recipes
      });
    })
});

app.post('/recipes/create', [
  check('title', 'Trebuie sa introduci un titlu').isLength({
    min: 2
  }),
  check('ingredients', 'Trebuie sa introduci ingrediente').isLength({
    min: 2
  }),
  check('directions', 'Trebuie sa introduci indicatiile de preparare').isLength({
    min: 2
  })
], (req, res) => {
  // pune erorile din req in obiectul errors 
  const errors = validationResult(req);
  // 1) Daca nu exista erori => 
  //      - ruleaza query-ul de INSERT
  //      - seteaza un flash message
  //      - trimite un raspuns json de succes
  if (errors.isEmpty()) {
    // TODO - apelarea modelului pentru a crea o inregistrare
    
    queries.createRecipe(req.body.title, req.body.ingredients, req.body.directons);

    req.session.flashMessage = 'Ai introdus o noua reteta';
    res.json({
      succes: true
    });
  }
  // 2) Daca exista erori => 
  //    - trimite un raspuns json de esec + datele completate + erorile 
  else {
    res.json({
      succes: false,
      form_data: req.body,
      errors: errors.mapped()
    });
  }
});


/*************/

app.listen(port, () => console.log(`Listening on port: ${port}`))