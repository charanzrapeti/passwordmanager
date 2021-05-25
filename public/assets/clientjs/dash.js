console.log("script dashjs loaded");

var token = document.cookie.split("=")[1];
console.log(token);

var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer " + token);

var requestOptions = {
  method: "GET",
  headers: myHeaders,

  redirect: "follow",
};

fetch("/api/user/me", requestOptions)
  .then((response) => response.text())
  .then((result) => {
    const heading = document.querySelector(".heading");
    const resultobject = JSON.parse(result);
    heading.textContent = "Hello!, Welcome  " + resultobject.name;
    console.log(result);
  })

  .catch((error) => console.log("error", error));

var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer " + token);

var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

fetch("/api/pass", requestOptions)
  .then((response) => response.text())
  .then((result) => {
    const resultobject = JSON.parse(result);

    for (i = 0; i < resultobject.length; i++) {
      const ul = document.querySelector(".cards");
      var item1 = document.createElement("li");
      item1.className = "cards__item";

      var item2 = document.createElement("div");
      item2.className = "card";
      var item3 = document.createElement("div");
      item3.className = "card__image";
      item3.setAttribute("id", resultobject[i]._id);
      var item4 = document.createElement("div");
      item4.className = "card__title";
      item4.textContent = resultobject[i].title;
      var stem1 = document.createElement("div");
      stem1.className = "card__content";
      var stem2 = document.createElement("p");
      stem2.className = "card__text";
      stem2.textContent =
        "This is the description : username:  " +
        resultobject[i].username +
        "  ," +
        "text:  " +
        resultobject[i].description +
        "  ," +
        "created-at:   " +
        resultobject[i].created_at +
        "  ,";
      stem3 = document.createElement("button");
      stem3.classList.add("btn", "btn--block", "card__btn");
      stem3.setAttribute("id", resultobject[i]._id);
      stem3.textContent = "Delete item";

      stem1.appendChild(stem2);
      stem1.appendChild(stem3);
      item3.appendChild(item4);
      item2.appendChild(item3);
      item2.appendChild(stem1);
      item1.appendChild(item2);

      ul.appendChild(item1);
    }

    console.log(result);
  })
  .then(() => {
    document.querySelectorAll(".btn").forEach((item) => {
      item.addEventListener("click", () => {
        console.log(item.id);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        var requestOptions = {
          method: "DELETE",
          headers: myHeaders,
          redirect: "follow",
        };

        fetch("/api/task/" + item.id, requestOptions)
          .then((response) => response.text())
          .then((result) => console.log(result))
          .then(() => (window.location.href = "/dashboard"))
          .catch((error) => console.log("error", error));
      });
    });
  })
  .then(() => {
    document.querySelectorAll(".card__image").forEach((item) => {
      item.addEventListener("click", () => {
        console.log(item.id);
        window.location.href = "/dashpatch/" + item.id;
      });
    });
  })
  .then(() => {
    var logout = document.querySelector(".logout");
    logout.addEventListener("click", () => {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + token);

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch("/api/user/logout", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          console.log(result);
          window.location.href = "/";
        })
        .catch((error) => console.log("error", error));
    });
  })
  .catch((error) => console.log("error", error));

console.log("is this after fetch");

var postbutton = document.querySelector(".plus");
postbutton.addEventListener("click", () => {
  console.log("post button clickded");
  window.location.href = "/dashpost";
});
