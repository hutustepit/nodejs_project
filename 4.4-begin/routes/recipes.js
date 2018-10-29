const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check'); // validare

const queries = require('../data/recipes_queries.js');//iesi din director,

router.get('/', async (req, res) => { 
    const recipes = await queries.all_recipes();
    res.render('pages/recipes', {recipes});
  });
 
router.post('/create', [
    check('title', 'Trebuie sa introduci un titlu').isLength({ min: 2 }),
    check('ingredients', 'Trebuie sa introduci ingrediente').isLength({ min: 2 }),
    check('directions', 'Trebuie sa introduci indicatiile de preparare').isLength({ min: 2 })
  ], (req, res) => {
    // pune erorile din req in obiectul errors 
    const errors = validationResult(req);
    // 1) Daca nu exista erori => 
    //      - ruleaza query-ul de INSERT
    //      - seteaza un flash message
    //      - trimite un raspuns json de succes
    if (errors.isEmpty()) {  
      queries.createRecipe(req.body.title, req.body.ingredients, req.body.directions)
        .then( data => {
          req.session.flashMessage = 'Ai introdus o noua reteta';
          res.json({ // trimite un raspuns JSON formularului din front-end
            succes: true
          });
        })
        .catch(error => console.log(error));
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

/**
 * Aici trebuie sa zicem ceva inteligibil despre codul de mai jos, astfel incat sa ne fie de folos pe viitor
 */  
router.delete('/delete/:id', (req, res) => {

  queries.deleteRecipe(req.params.id)
    .then( () => {
      req.session.flashMessage = 'Ai sters cu succes reteta ';
      res.sendStatus(200);
    });   
});

router.put('/update', (req,res) =>{

  console.log(req.body);

  queries.updateRecipe(req.body.id, req.body.title, req.body.ingredients, req.body.directions)
    .then( data =>{          
      req.session.flashMessage = 'Ai updatat cu succes reteta!';
      res.sendStatus(200);
    })
    .catch(err => console.log(err));

});

module.exports = router




