import { galleryTemplate, cardTemplate } from "./templates.js";
import { fetchGames, getGamesDetails } from "./services.js";

const GamesContainer = (function () {
  const gamesContainer = document.querySelector(".games-container");
  let currentPage = 1;
  let gamesArray = [];

  async function getGamesWithDetails() {
    let pageResults = await fetchGames(currentPage);
    pageResults = await getGamesDetails(pageResults, currentPage);
    return pageResults;
  }

  return {
    isCard: function () {
      if (gamesContainer.classList.contains("center-games")) {
        return false;
      }
      return true;
    },
    renderSpecific: function (arr, template) {
      arr.forEach((game, index) => {
        gamesContainer.innerHTML += template(game, index + 1);
      });
    },
    renderFetchedGames: function () {
      gamesContainer.innerHTML = '';
      if (this.isCard()) {
        gamesArray.forEach((game, index) => {
          gamesContainer.innerHTML += cardTemplate(game, index + 1);
        });
      } else {
        gamesArray.forEach((game, index) => {
          gamesContainer.innerHTML += galleryTemplate(game, index + 1);
        });
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
  };
})();

export { GamesContainer };
