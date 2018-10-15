const submit = document.getElementById("submit");
const recipeList = document.getElementById("recipeList");


// Actiunea pentru butonul de "create"
submit.addEventListener("click", (event)=>{
    //anuleaza efectul default al butonului
    event.preventDefault();
    
    // trimitele datele din formular prin POST, in format JSON
    fetch('/recipes/create', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            title: document.getElementById('title').value,
            ingredients: document.getElementById('ingredients').value,
            directions: document.getElementById('directions').value
        })
    })
    // parseaza raspunsul JSON primit
    .then(response => response.json())
    // foloseste datele parsate
    .then(data => {
     
      // Daca exista erori, le pune intr-un template literal 
      // la final le afiseaza intr-un div gol din formular
      if (!data.succes) {
        let erori = 
          `<div class="alert alert-danger my-0 py-2" role="alert">
              <p>Au aparut urmatoarele erori:</p>
              <ul>`;
        Object.values(data.errors).forEach( error => {
          erori += 
                `<li>          
                    ${error.msg}
                 </li>`
        });
        erori +=  
              `</ul>
            </div>`;
            
        document.getElementById('errors').innerHTML = erori;
      } 
      // Daca nu exista erori, redirecteaza cu mesaj de succes     
      else {
        window.location.href = '/recipes';
        console.log('succes');
      }     
      
    })
    // scrie in consola eventualele erori aparute
    .catch(err => {
      console.log(err);
    });

})

recipeList.addEventListener("click", (ev)=>{
  if(ev.target.value === 'delete')
  fetch('/')
})

