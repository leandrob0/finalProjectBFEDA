import { galleryTemplate, cardTemplate, searchResultTemplate } from "./templates.js";
import { renderView } from "./helpers.js";

// Select every element that i will use.
const userimg = document.querySelector(".user__img");
const toggle = document.querySelector("#toggle-switch");
const body = document.querySelector("body");
const gamesContainer = document.querySelector(".games-container");
const logoutButton = document.querySelector(".user__log-out");
const cardOption = document.querySelector("#card-option");
const galleryOption = document.querySelector("#gallery-option");
const homeButton = document.querySelector("#home");
const searchForm = document.querySelector(".search__form");
const searchInput = document.querySelector(".search__input");
const searchResults = document.querySelector(".search__results");

// When the page loads, checks if the localStorage item describing the user logged in exists.
// If it doesn't exist, it goes back to the login page (it means the user didn't log in.)
// If it exists, sets the photo from top right to the photo from the user.
// Also, gets the current color mode and sets it (because by default it is dark).
(function () {
  const userinfo = JSON.parse(localStorage.getItem("userinfo"));

  if (!userinfo) {
    location.href = "/";
  }

  userimg.src = `../resources/images/${userinfo.user.photo}`;

  const localStorageItem = JSON.parse(localStorage.getItem("carousel"));
  const mode = localStorageItem.mode;

  handleSwitchChange(mode === "dark" ? "light" : "dark");
})();

/*
############################################

    Code for the color mode switch functionality.

############################################
*/

function handleSwitchChange(mode) {
  if (mode === "dark") {
    body.classList.add("light-mode");
    toggle.src = "./resources/icons/Off.png";
  } else {
    body.classList.remove("light-mode");
    toggle.src = "./resources/icons/On.png";
  }
}

toggle.addEventListener("click", () => {
  const localStorageItem = JSON.parse(localStorage.getItem("carousel"));
  const mode = localStorageItem.mode;

  handleSwitchChange(mode);

  localStorage.setItem(
    "carousel",
    JSON.stringify({
      ...localStorageItem,
      mode: mode === "dark" ? "light" : "dark",
    })
  );
});

/*
############################################

  GAME FETCHING FUNCTIONALITY.

############################################
*/

let gamesArray = [];

async function fetchGameDetails(game) {
  try {
    let details = await fetch(
      `https://api.rawg.io/api/games/${game.id}?key=e3108f7dfa484f38bdb2d3b8372fb406`
    );
    let detailsJson = await details.json();
    let description = detailsJson.description;

    return description;
  } catch (err) {
    console.log(err);
    return 'The details could not be retrieved.';
  }
}

fetch("https://api.rawg.io/api/games?key=e3108f7dfa484f38bdb2d3b8372fb406")
  .then((res) => {
    return res.json();
  })
  .then((games) => {
    gamesArray = games.results;
    games.results.forEach(async (game, i) => {
        let description = await fetchGameDetails(game);

        // Replaces the tags the description has.
        // Matches the character < / > literally (case sensitive).
        // ? Matches the previous token as many times as needed.
        // The g flag captures all instead of returning at the first encounter.
        description = description.replace(/<\/?[^>]+(>|$)/g, "");

        // Adds the description to the array of games.
        gamesArray[i] = { ...gamesArray[i], description };
    });
  })
  .then(() => {
    renderView(gamesContainer, gamesArray, cardTemplate);
  })
  .catch((err) => {
    console.log(err);
  });

/*
############################################

    Code for changing the view of the cards.

############################################
*/

function handleViewChange(element) {
  const classesEnabled = ["cards-enabled-outer", "cards-enabled-inside"];
  const classesDissabled = ["cards-disabled-outer", "cards-disabled-inside"];

  const sibling = element.previousElementSibling || element.nextElementSibling;
  const siblingChildren = sibling.children;
  const children = element.children;

  // Checks whether the clicked element is already highlighted as clicked.
  if (children[0].classList.contains("cards-enabled-outer")) return;

  // Checks which view option the user selected to set the grid layout and the card styling.
  if (element.id === "gallery-option") {
    gamesContainer.style.gridTemplateColumns = "697px";
    gamesContainer.style.gridAutoRows = "538px";

    // Changes the cards.
    renderView(gamesContainer, gamesArray, galleryTemplate);
  } else {
    gamesContainer.style.gridTemplateColumns = "repeat(3, 363px)";
    gamesContainer.style.gridAutoRows = "314px";

    // Changes the cards.
    renderView(gamesContainer, gamesArray, cardTemplate);
  }

  // Swaps the classes between the children of the svg's.
  for (let i = 0; i < children.length; i++) {
    if (children[i].classList.contains(classesDissabled[i])) {
      children[i].classList.remove(classesDissabled[i]);
      children[i].classList.add(classesEnabled[i]);
      siblingChildren[i].classList.remove(classesEnabled[i]);
      siblingChildren[i].classList.add(classesDissabled[i]);
    } else {
      children[i].classList.add(classesDissabled[i]);
      children[i].classList.remove(classesEnabled[i]);
      siblingChildren[i].classList.add(classesEnabled[i]);
      siblingChildren[i].classList.remove(classesDissabled[i]);
    }
  }
}

cardOption.addEventListener("click", () => handleViewChange(cardOption));
galleryOption.addEventListener("click", () => handleViewChange(galleryOption));

/*
############################################

    Code for the search functionality.

############################################
*/

let filteredArr = [];

// Handles the dropdown with all the options depending on the string entered.
searchInput.addEventListener("input", (e) => {
  const searchValue = e.target.value.trim().toLowerCase();

  filteredArr = gamesArray.filter(
    (game) =>
      game.name.toLowerCase().includes(searchValue) ||
      searchValue === game.name.toLowerCase()
  );
  
  searchResults.innerHTML = "";

  if(filteredArr.length > 0 && searchValue !== "") {
    filteredArr.forEach((item, i) => {
      searchResults.innerHTML += searchResultTemplate(item.name, filteredArr.length - 1 === i);
    })
  }
});

// For every option showed with the event listener before add an event listener to each one, that on click shows that card.

// Handles showing the cards that the user filtered before when clicked on the search icon or pressed enter.
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  renderView(
    gamesContainer,
    filteredArr,
    gamesContainer.style.gridTemplateColumns === "697px"
      ? galleryTemplate
      : cardTemplate
  );
});

// Handles going back to showing all the games when clicked on the Home option on the sidebar.
homeButton.addEventListener("click", () => {
  searchInput.value = "";

  renderView(
    gamesContainer,
    gamesArray,
    gamesContainer.style.gridTemplateColumns === "697px"
      ? galleryTemplate
      : cardTemplate
  );
});

/*
############################################

    Code for the log out functionality.

############################################
*/

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("userinfo");
});
