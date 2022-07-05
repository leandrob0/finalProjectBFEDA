import {
  searchResultTemplate,
} from "./templates.js";
import { searchAdded, resetSearch } from "./helpers.js";
import { getGamesDetails, searchGames } from "./services.js";
import { GamesContainerFunctions } from "./games-container.js";

// Select every element that i will use.
const body = document.querySelector("body");
const userimg = document.querySelectorAll(".user__img");
const toggles = document.querySelectorAll(".toggle-switch");
const logoutButton = document.querySelector(".user__log-out");
const logoutButtonMenu = document.querySelector('.bottom-section__logout');
const gamesContainer = document.querySelector(".games-container");
const cardOption = document.querySelector("#card-option");
const galleryOption = document.querySelector("#gallery-option");
const homeButton = document.querySelector("#home");
const searchForm = document.querySelector(".search__form");
const searchInput = document.querySelector(".search__input");
const searchButton = document.querySelector(".search__button");
const searchResults = document.querySelector(".search__results");
const searchResultsClear = document.querySelector(".search__icon-clear");
const backgroundSearchModal = document.querySelector(".background-modal");
const lastSearchesButton = document.querySelector("#sidebar__last-searches");

let filteredArr = []; // Variable to filter the games for the search functionality.
let lastSearches = JSON.parse(localStorage.getItem("searches")) || []; // Variable for the last searches functionality.

/*
############################################

    Code for the color mode switch functionality.

############################################
*/

function handleSwitchChange(mode) {
  if (mode === "dark") {
    body.classList.add("light-mode");
    [...toggles].forEach((toggle) => toggle.src = "./resources/icons/off.png");
  } else {
    body.classList.remove("light-mode");
    [...toggles].forEach((toggle) => toggle.src = "./resources/icons/on.png");
  }
}

function addTogglesListeners() {
  [...toggles].forEach((toggle) => {
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
    })
  })
}

// When the page loads, checks if the localStorage item describing the user logged in exists.
// If it doesn't exist, it goes back to the login page (it means the user didn't log in.)
// If it exists, sets the photo from top right to the photo from the user.
// Also, gets the current color mode and sets it (because by default it is dark).
(function () {
  const userinfo = JSON.parse(localStorage.getItem("userinfo"));

  if (!userinfo) {
    location.href = "/";
  }

  [...userimg].forEach((img) => img.src = `../resources/images/${userinfo.user.photo}`);

  const localStorageItem = JSON.parse(localStorage.getItem("carousel"));
  const mode = localStorageItem.mode;

  handleSwitchChange(mode === "dark" ? "light" : "dark");
  addTogglesListeners();
})();

/*
############################################

  GAME FETCHING FUNCTIONALITY.

############################################
*/

//GamesContainerFunctions.loadInitialGames();

/* gamesContainer.addEventListener("scroll", (e) => {
  const element = e.target;
  // Checks if the element is at the bottom of the container (can't go further). -> poor attemp of trying to block fetching when i'm seeing search results.
  if (element.scrollHeight - element.scrollTop === element.clientHeight && GamesContainerFunctions.isEqual()) {
    GamesContainerFunctions.loadNextGames();
  }
}); */

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
    GamesContainerFunctions.changeView();
    GamesContainerFunctions.renderFetchedGames();
  } else {
    GamesContainerFunctions.changeView();
    GamesContainerFunctions.renderFetchedGames();
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

    Code for the search and last searches functionality.

############################################
*/

// Handles the background for the search list, when clicked, it closes the list.
backgroundSearchModal.addEventListener("click", () => {
  resetSearch(
    backgroundSearchModal,
    searchResults,
    searchInput,
    searchResultsClear
  );
});

searchResultsClear.addEventListener("click", () => {
  resetSearch(
    backgroundSearchModal,
    searchResults,
    searchInput,
    searchResultsClear
  );
});

// Handles the dropdown with all the options depending on the string entered.
searchInput.addEventListener("input", async (e) => {
  const searchValue = e.target.value.trim().toLowerCase();

  filteredArr = await searchGames(searchValue);

  searchResults.innerHTML = "";

  if (searchValue !== "") {
    searchResultsClear.style.visibility = "visible";
    backgroundSearchModal.style.display = "block";

    if (filteredArr.length > 0) {
      filteredArr.forEach((item, i) => {
        searchResults.innerHTML += searchResultTemplate(
          item,
          filteredArr.length - 1 === i
        );
      });

      // Handles the click on a list item option.
      let searchItems = Array.from(
        document.querySelectorAll(".search__results-item")
      );
      searchItems.forEach((item) => {
        item.addEventListener("click", () => {
          // Sets the filteredArr to the game clicked, and submits the form.
          filteredArr = filteredArr.filter(
            (game) => item.textContent === game.name
          );

          // This basically handles if the game searched was not fetched before.
          // If not, it gets its details so i can change view without showing undefined on the description.
          // Otherwise it just shows it.
          if (!GamesContainerFunctions.gameInArray(filteredArr[0])) {
            getGamesDetails(filteredArr)
              .then((res) => {
                filteredArr = res;
                searchButton.click();
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            searchButton.click();
          }
        });
      });
    } else {
      searchResults.innerHTML += searchResultTemplate(
        { id: 0, name: "No results found" },
        true
      );
    }
  } else {
    resetSearch(backgroundSearchModal,searchResults,searchInput,searchResultsClear);
  }
});

// Handles showing the cards that the user filtered before when clicked on the search icon or pressed enter.
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Checks that the array has only one solution to add to the last search, and if the game searched is already in the last searches.
  if (filteredArr.length === 1 && !searchAdded(filteredArr[0], lastSearches)) {
    // If the lastSearches arr already has the last two, takes out the first (added before), and adds the new one.
    if (lastSearches.length === 2) {
      lastSearches.shift();
    }

    lastSearches.push(filteredArr[0]);
    localStorage.setItem("searches", JSON.stringify(lastSearches));
  }

  GamesContainerFunctions.renderFilteredGames(filteredArr);
});

/*
############################################

    Code for the sidebar options click.

############################################
*/

// Handles going back to showing all the games when clicked on the Home option on the sidebar.
homeButton.addEventListener("click", () => GamesContainerFunctions.renderFetchedGames());
lastSearchesButton.addEventListener("click", () => GamesContainerFunctions.renderFilteredGames(lastSearches));

/*
############################################

    Code for the log out functionality.

############################################
*/

logoutButton.addEventListener("click", () => localStorage.removeItem("userinfo"));
logoutButtonMenu.addEventListener("click", () => localStorage.removeItem("userinfo"));
