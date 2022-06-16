import { resetSearch , gameInArray } from "./helpers.js";
import { searchGames } from "./services.js";
import { searchResultTemplate } from "./templates";

const homeButton = document.querySelector("#home");
const searchForm = document.querySelector(".search__form");
const searchInput = document.querySelector(".search__input");
const searchButton = document.querySelector(".search__button");
const searchResultsClear = document.querySelector(".search__icon-clear");
const searchResults = document.querySelector(".search__results");
const backgroundSearchModal = document.querySelector(".background-modal");
const lastSearchesButton = document.querySelector("#sidebar__last-searches");

let filteredArr = []; // Variable to filter the games for the search functionality.
let lastSearches = JSON.parse(localStorage.getItem("searches")) || []; // Variable for the last searches functionality.

/*
############################################

    Code for the search and last searches functionality.

############################################
*/

// Handles the background for the search list, when clicked, it closes the list.
backgroundSearchModal.addEventListener("click", () => {
    resetSearch();
});

// Handles the dropdown with all the options depending on the string entered.
searchInput.addEventListener("input", async (e) => {
  const searchValue = e.target.value.trim().toLowerCase();

  filteredArr = await searchGames(searchValue);

  searchResults.innerHTML = "";

  if (searchValue !== "") {
    // Shows the button to clear the search input.
    searchResultsClear.style.visibility = "visible";

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
    } else {
      searchResults.innerHTML += searchResultTemplate(
        { id: 0, name: "No results found" },
        true
      );
    }
  } else {
    backgroundSearchModal.style.display = "none";
    searchResultsClear.style.visibility = "hidden";
  }
});

searchResultsClear.addEventListener("click", () => {
  backgroundSearchModal.style.display = "none";
  searchResults.innerHTML = "";
  searchInput.value = "";
  searchResultsClear.style.visibility = "hidden";
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
