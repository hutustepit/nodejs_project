// documentatie modul mysql: https://github.com/mysqljs/mysql

const mysql = require('mysql');
const pool  = mysql.createPool({
  connectionLimit : 10,
  host     : 'us-cdbr-iron-east-01.cleardb.net',
  user     : 'b2059b425a1e41',
  password : '87ce3021',
  database : 'heroku_99732773938d69e'
});

module.exports = {
  
  //middleware care face disponibil pe req rezultatele interogarii tabelului cu articole
  all_recipes: (req, res, next) => {
    pool.query('SELECT * FROM recipes ORDER BY created_at DESC', (error, results) => {
      if (error) throw error;
      req.allRecipes = results;
      next(); 
    }); 
  },

};

 