console.log("dash2 script loaded");
const form = document.querySelector("form");
var date = document.querySelector("#date");
var d = new Date();
var datevalue =
  d.getDate() + " - " + parseInt(d.getMonth() + 1) + " - " + d.getFullYear();
date.value = datevalue;
console.log(form);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formdata = new FormData(form);
  const title = formdata.get("title");
  const username = formdata.get("username");
  const password = formdata.get("password");
  const url = formdata.get("url");
  const description = formdata.get("description");
  console.log(title, username, password, url, description);

  var token = document.cookie.split("=")[1];
  console.log(token);

  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);

  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    title: title,
    password: password,
    description: description,
    username: username,
    url: url,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:3000/api/pass", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      const resultobject = JSON.parse(result);
      if (resultobject["name"] == "ValidationError") {
        throw new Error("Please fill all mandatory fields");
      }
    })
    .then(() => (window.location.href = "/dashboard"))
    .catch((error) => {
      console.log("error", error);
      alert(error.message);
    });
});
