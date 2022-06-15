import {
  galleryTemplate,
  cardTemplate,
  searchResultTemplate,
} from "./templates.js";
import { renderView, gameInArray } from "./helpers.js";
import { fetchGames, getGamesDetails, searchGames } from "./services.js";

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
const searchButton = document.querySelector(".search__button");
const searchResults = document.querySelector(".search__results");
const backgroundSearchModal = document.querySelector(".background-modal");
const lastSearchesButton = document.querySelector("#sidebar__last-searches");

let gamesArray = []; // Variable for the games fetching functionality.
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

  GAME FETCHING FUNCTIONALITY.

############################################
*/

let currentPage = 1;

async function getGamesWithDetails() {
  let pageResults = await fetchGames(currentPage);
  pageResults = await getGamesDetails(pageResults, currentPage);
  gamesArray.push(...pageResults);
}

getGamesWithDetails()
  .then(() => {
    currentPage++;
    renderView(
      gamesContainer,
      gamesArray,
      gamesContainer.style.gridTemplateColumns === "697px"
        ? galleryTemplate
        : cardTemplate
    );
  })
  .catch((err) => {
    console.log(err);
  });

gamesContainer.addEventListener("scroll", (e) => {
  const element = e.target;

  // Checks if the element is at the bottom of the container (can't go further).
  if (element.scrollHeight - element.scrollTop === element.clientHeight) {
    getGamesWithDetails()
      .then(() => {
        currentPage++;
        renderView(
          gamesContainer,
          gamesArray,
          gamesContainer.style.gridTemplateColumns === "697px"
            ? galleryTemplate
            : cardTemplate
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }
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

    Code for the search and last searches functionality.

############################################
*/

// Handles the background for the search list, when clicked, it closes the list.
backgroundSearchModal.addEventListener("click", () => {
  backgroundSearchModal.style.display = "none";
  searchResults.innerHTML = "";
  searchInput.value = "";
});

// Handles the dropdown with all the options depending on the string entered.
searchInput.addEventListener("input", async (e) => {
  const searchValue = e.target.value.trim().toLowerCase();

  filteredArr = await searchGames(searchValue);

  searchResults.innerHTML = "";

  if (filteredArr.length > 0 && searchValue !== "") {
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
          (game) =>
            game.name.includes(item.textContent) ||
            item.textContent === game.name
        );

        // This basically handles if the game searched was not fetched before.
        // If not, it gets its details so i can change view without showing undefined on the description.
        // Otherwise it just shows it.
        if (!gameInArray(filteredArr[0], gamesArray)) {
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

    backgroundSearchModal.style.display = "block";
  }
});

// Handles showing the cards that the user filtered before when clicked on the search icon or pressed enter.
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Checks that the array has only one solution to add to the last search, and if the game searched is already in the last searches.
  if (filteredArr.length === 1 && !gameInArray(filteredArr[0], lastSearches)) {
    // If the lastSearches arr already has the last two, takes out the first (added before), and adds the new one.
    if (lastSearches.length === 2) {
      lastSearches.shift();
    }

    lastSearches.push(filteredArr[0]);
    localStorage.setItem("searches", JSON.stringify(lastSearches));
  }

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

lastSearchesButton.addEventListener("click", () => {
  renderView(
    gamesContainer,
    lastSearches,
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
