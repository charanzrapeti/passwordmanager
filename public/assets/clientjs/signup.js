console.log("hello world from signup.js");
const form = document.querySelector("form");
const API_URL = "localhost:3000/api/user";
var errortext = document.querySelector(".error");
errortext.style.display = "none";
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formdata = new FormData(form);
  const named = formdata.get("name");
  const email = formdata.get("email");
  const password = formdata.get("password");
  const confirmpassword = formdata.get("confirmpassword");
  console.log(named, email, password, confirmpassword);
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    email: email,
    password: password,
    confirmpassword: confirmpassword,
    name: named,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:3000/api/user", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      const resultobject = JSON.parse(result);
      console.log(resultobject);
      if (
        resultobject["name"] == "ValidationError" ||
        resultobject["name"] == "Error" ||
        resultobject["name"] == "MongoError"
      ) {
        console.log("reached it hrer");
        throw new Error(resultobject["message"]);
      }
    })
    .then(() => (window.location.href = "/dashboard"))
    .catch((error) => {
      console.log("error", error);
      errortext.textContent = error.message;
      errortext.style.display = "";
    });
});
