const formLogin = document.querySelector(".form-login");
const loginConnexion = document.querySelector("#login-connexion");
const errorMessageConnexion = document.querySelector("#erreur");

function passwordFalse() {
  errorMessageConnexion.textContent =
    "Erreur d'utilisateur ou de mot de passe, veuillez réessayer!";
  errorMessageConnexion.style.marginBottom = "30px";
  errorMessageConnexion.style.textDecoration = "underline";
  errorMessageConnexion.style.color = "red";
}


function sendFormConnexion(e) {
  e.preventDefault();
  let emailValue = document.querySelector("#email").value;
  let passwordValue = document.querySelector("#password").value;

  let user = {
    email: emailValue,
    password: passwordValue,
  };



  fetch(`http://localhost:5678/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  })
    .then((response) => {
      if (response.ok === false) {
        passwordFalse()
      } else {
        response.json().then((data) => {
          function passwordTrue() {
            errorMessageConnexion.textContent =
              "Connexion établie, redirection...";
            errorMessageConnexion.style.color = "green";
            window.sessionStorage.setItem("token", data.token)
            // Je récupère le token que je stocke dans le localStorage pour le récupèrer pendant les requêtes POST et DELETE
            location.href = "./admin.html";
          }
          passwordTrue()
        });
      }
    })
    .catch((err) => {
      errorMessageConnexion.textContent = "Erreur d'API ou de connexion";
    });
}

loginConnexion.addEventListener("submit", sendFormConnexion);
