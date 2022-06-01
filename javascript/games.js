// When the page loads, checks if the localStorage item describing the user logged in exists.
// If it doesn't exist, it goes back to the login page (it means the user didn't log in.)
// If it exists, sets the photo from top right to the photo from the user.
(function () {
  const userimg = document.querySelector(".user__img");
  const userinfo = JSON.parse(localStorage.getItem("userinfo"));

  if (!userinfo) {
    location.href = "/";
  }

  userimg.src = `../resources/images/${userinfo.user.photo}`;
})();

// Cards simulation to test the cards visuals.
const cards = [
  { title: "Biomutant", release: "25-01-2021", genres: ["Action", "RPG"] },
  { title: "Biomutant", release: "25-01-2021", genres: ["Action", "RPG"] },
  { title: "Biomutant", release: "25-01-2021", genres: ["Action", "RPG"] },
  { title: "Biomutant", release: "25-01-2021", genres: ["Action", "RPG"] },
  { title: "Biomutant", release: "25-01-2021", genres: ["Action", "RPG"] },
  { title: "Biomutant", release: "25-01-2021", genres: ["Action", "RPG"] },
];

(function () {
    
})();

/*
############################################

    Code for the log out functionality.

############################################
*/

const logoutButton = document.querySelector(".user__log-out");

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("userinfo");
});
