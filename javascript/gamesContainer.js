import { galleryTemplate, cardTemplate } from "./templates.js";
import { fetchGames, getGamesDetails } from "./services.js";

const GamesContainerFunctions = (function () {
  const gamesContainer = document.querySelector(".games-container");
  let currentPage = 1;
  let gamesArray = [];

  async function getGamesWithDetails() {
    let pageResults = await fetchGames(currentPage);
    pageResults = await getGamesDetails(pageResults);
    return pageResults;
  }

  return {
    isCard: function () {
      if (gamesContainer.classList.contains("center-games")) {
        return false;
      }
      return true;
    },
    /**
     * For every rendered game, it checks if the array of fetched games is the same.
     * In case it is the same, the container is allowed to fetch the next page of games.
     * This is done to avoid fetching games and re-rendering the page when seeing another content like search results.
     * @returns True if the rendered cards are the same as the fetched games (same order also). False otherwise.
     */
    isEqual: function () {
      let equal = true;
      for (let i = 0; i < gamesArray.length; i++) {
        if (
          gamesArray[i].name !==
          gamesContainer.children[i].children[2].children[0].children[0]
            .textContent
        ) {
          equal = false;
          return equal;
        }
      }

      return equal;
    },
    renderCards: function (arr, initialCount = 1) {
      arr.forEach((game, index) => {
        gamesContainer.innerHTML += cardTemplate(game, initialCount + index);
      });
    },
    renderGallery: function (arr, initialCount = 1) {
      arr.forEach((game, index) => {
        gamesContainer.innerHTML += galleryTemplate(game, initialCount + index);
      });
    },
    renderFilteredGames: function (arr) {
      gamesContainer.innerHTML = "";
      if (this.isCard()) {
        this.renderCards(arr);
      } else {
        this.renderGallery(arr);
      }
    },
    renderFetchedGames: function () {
      gamesContainer.innerHTML = "";
      if (this.isCard()) {
        this.renderCards(gamesArray);
      } else {
        this.renderGallery(gamesArray);
      }
    },
    renderNextPageGames: function (arr) {
      let initialCount = gamesArray.length === 20 ? 1 : 21;
      if (this.isCard()) {
        this.renderCards(arr, initialCount);
      } else {
        this.renderGallery(arr, initialCount);
      }
    },
    changeView: function () {
      if (!this.isCard()) {
        gamesContainer.classList.remove("center-games");
      } else gamesContainer.classList.add("center-games");
    },
    loadInitialGames: function () {
      getGamesWithDetails()
        .then((res) => {
          gamesArray.push(...res);
          currentPage++;
          this.renderFetchedGames();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    loadNextGames: function () {
      getGamesWithDetails()
        .then((res) => {
          gamesArray.push(...res);
          currentPage++;
          this.renderNextPageGames(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  };
})();

export { GamesContainerFunctions };
