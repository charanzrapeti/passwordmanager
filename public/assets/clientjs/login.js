console.log("hello login.js here");
var errortext = document.querySelector(".error");
errortext.style.display = "none";
const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formdata = new FormData(form);

  const email = formdata.get("email");
  const password = formdata.get("password");

  console.log(email, password);
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({ email: email, password: password });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:3000/api/user/login", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      const resultobject = JSON.parse(result);
      console.log(resultobject);
      if (
        resultobject["message"] == "incorrect password" ||
        resultobject["message"] == "User not found"
      ) {
        throw new Error("stop it here");
      }
      console.log("after this happened");
    })

    .then(() => (window.location.href = "/dashboard"))
    .catch((error) => {
      console.log("error", error);
      errortext.style.display = "";
    });
});
