console.log("hello from dash3 file");
const h1 = document.querySelector("h1");
h1.style.visibility = "hidden";

var token = document.cookie.split("=")[1];
var submitbutton = document.querySelector(".submitd");
submitbutton.setAttribute("value", "edit");
submitbutton.style.backgroundColor = "lightblue";

var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer " + token);
var id = document.querySelector("h1").textContent;
var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

fetch("http://localhost:3000/api/pass/" + id, requestOptions)
  .then((response) => response.text())
  .then((result) => {
    console.log(result);
    const resultobject = JSON.parse(result);
    var title = document.querySelector("#title");
    var username = document.querySelector("#username");
    const password = document.querySelector("#password");
    title.value = resultobject["title"];
    title.readOnly = true;
    title.style.color = "green";
    username.value = resultobject["username"];
    username.readOnly = true;
    username.style.color = "green";
    password.value = resultobject["password"];
    password.readOnly = true;
    password.style.color = "green";
    if (resultobject["url"]) {
      url.value = resultobject["url"];
      url.readOnly = true;
      url.style.color = "green";
    }
    if (resultobject["description"]) {
      description.value = resultobject["description"];
      description.readOnly = true;
      description.style.color = "green";
    }
    var date = document.querySelector("#date");

    date.value = resultobject["created_at"];
  })
  .catch((error) => console.log("error", error));
var count = 0;
submitbutton.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("clicked");
  count++;
  if (count == 2) {
    console.log(count);
    console.log("no change will detected");
    var title = document.querySelector("#title");
    var username = document.querySelector("#username");
    var password = document.querySelector("#password");
    var url = document.querySelector("#url");
    var description = document.querySelector("#description");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      title: title.value,
      password: password.value,
      description: description.value,
      username: username.value,
      url: url.value,
    });

    var requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:3000/api/pass/" + h1.textContent, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .then(() => (window.location.href = "/dashboard"))
      .catch((error) => console.log("error", error));
  }
  submitbutton.setAttribute("value", "submit");
  document.querySelector("#headdetails").textContent = "Edit";
  submitbutton.style.backgroundColor = "lightgreen";
  var title = document.querySelector("#title");
  var username = document.querySelector("#username");
  var password = document.querySelector("#password");
  var url = document.querySelector("#url");
  var description = document.querySelector("#description");
  title.readOnly = false;
  title.style.color = "black";
  username.readOnly = false;
  username.style.color = "black";
  password.readOnly = false;
  password.style.color = "black";
  url.readOnly = false;
  url.style.color = "black";
  description.readOnly = false;
  description.style.color = "black";
});
