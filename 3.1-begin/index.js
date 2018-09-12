const express = require('express');
const app = express();

const bodyParser = require('body-parser');

app.set('view engine', 'ejs');

/*********   
MIDDLEWARE
**********/

// permite afisarea asset-urilor din directorul "/public"
app.use('/static', express.static('public'));

app.use(bodyParser.urlencoded());


/*********   
 RUTE
**********/

// ruta pentru homepage
app.get('/', (req, res) => {
   res.render('pages/index', {preferinte:"necunoscut"})//object literal cheie: valori, separate prin ,
});

// ruta pentru '/New-page'
app.get('/New-page', (req, res) => {
  res.render('pages/new-page');
});

app.get('/hello', (req, res) => {
  res.render('pages/hello');
});

app.post('/hello', (req, res)=> {
  res.render('pages/hello', {nume: req.body.nume, email: req.body.email});
});

app.listen(5000, () => console.log(`Listening on port: 5000`))
