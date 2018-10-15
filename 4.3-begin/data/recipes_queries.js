// documentatie modul mysql: https://github.com/mysqljs/mysql

const mysql = require('mysql');

/* Aici trebuie sa va configurati datele de contact daca folositi o bd remote */
// const db_config = {
//   host     : 'Vus-cdbr-iron-east-01.cleardb.net',
//   user     : 'b2059b425a1e41',
//   password : '61f98e4d',
//   database : 'heroku_82dd816e5ec1617',
// };

/* Daca folositi serverul local */
const db_config = {
  host: 'us-cdbr-iron-east-01.cleardb.net',
  user: 'b2059b425a1e41',
  password: '87ce3021',
  database: 'heroku_99732773938d69e',
};

const pool = mysql.createPool(db_config);


module.exports = {
  //middleware care face disponibil pe res.locals rezultatele interogarii tabelului recipes
  all_recipes: () => {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM recipes ORDER BY created_at DESC', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  //creeaza o noua inregistrare; intoarce o Promise care se rezolva cu rezultatele
  createRecipe: (title, ingredients, directions) => {
    return new Promise((resolve, reject) => {

      const sql = 'INSERT INTO recipes (title, ingredients, directions) VALUES ( ? , ? , ?)';
      
      pool.query(sql, [title, ingredients, directions], (err, results) => {
        if (err) return reject();
        resolve(results);
      });
    

    });


  },

  deleteRecipe: (id) =>{

    return new Promise((resolve, reject)=>{

      const sql = "DELETE FROM recipes WHERE recipe_id = ?";
      pool.query(sql, id, (err, result)=>{
        if(err) return reject(err);
        resolve(result);
      })
    });
  }

}