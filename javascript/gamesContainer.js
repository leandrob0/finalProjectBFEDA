import { galleryTemplate, cardTemplate, xboxTemplate, playstationTemplate, pcTemplate } from "./templates.js";
import { fetchGames, getGamesDetails, getGameTrailer } from "./services.js";
import { formatPlatformsText, includesPlatform } from "./helpers.js";

const GamesContainerFunctions = (function () {
  const gamesContainer = document.querySelector(".games-container");
  const gameModal = document.querySelector(".modal-game");
  const backgroundGameModal = document.querySelector(".background-modal-game");
  let currentPage = 1;
  let gamesArray = [];

  async function getGamesWithDetails() {
    let pageResults = await fetchGames(currentPage);
    pageResults = await getGamesDetails(pageResults);
    return pageResults;
  }

  function getGameFromArray(game) {
    for(let i = 0; i < gamesArray.length; i++) {
      if(Number(game.id) === Number(gamesArray[i].id)) {
        return gamesArray[i];
      } 
    }
    return {};
  }

  backgroundGameModal.addEventListener('click', () => {
    backgroundGameModal.style.display = 'none';
    gameModal.style.display = 'none';
  });

  function populateModal(game) {

    getGameTrailer(game.id)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })

    // This will fill every field in the game modal.

    // Variables to be used.
    const modalImage = document.querySelector('.modal-image');
    const gameTitle = document.querySelector('.text-content__title');
    const platformsContainer = document.querySelector('.text-content__platforms');
    const description = document.querySelector('.text-content__description');
    const platformsText = document.getElementById('platforms-text');
    const ratingText = document.querySelector('.achievements__top');
    const releaseDateText = document.getElementById('release-date-text');
    const publisherText = document.getElementById('publisher-text');
    const websiteText = document.getElementById('website-text');
    const genreText = document.getElementById('genre-text');
    const ageText = document.getElementById('age-text');

    const xbox = includesPlatform(game, "Xbox");
    const pc = includesPlatform(game, "PC");
    const playstation = includesPlatform(game, "PlayStation");

    // Value assignation.
    modalImage.src = `${game.background_image}`;

    // Resets in case the user opened another game modal and the icons are still there.
    platformsContainer.innerHTML = '';
    if(xbox) platformsContainer.innerHTML += xboxTemplate;
    if(pc) platformsContainer.innerHTML += pcTemplate;
    if(playstation) platformsContainer.innerHTML += playstationTemplate;
    // Makes the platform icons bigger (by default they are 20x20 or 24x20 depending on the icon).
    Array.from(platformsContainer.children).forEach((child) => {
      child.classList.add('bigger-icon');
      Array.from(child.children).forEach((path) => {
        path.classList.remove('icon-color');
        path.classList.add('platforms-color');
      })
    });

    gameTitle.textContent = game.name;
    ratingText.textContent = `#${game.rating_top || ''}`;
    description.textContent = game.description;
    platformsText.setAttribute('title', formatPlatformsText(game.platforms));
    platformsText.textContent = formatPlatformsText(game.platforms);
    releaseDateText.textContent = game.released;
    publisherText.textContent = 'THQ Nordic';
    websiteText.setAttribute('href', game.website);
    websiteText.textContent = game.website;
    genreText.textContent = game.genres ? game.genres.map((genre, i) => i + 1 === game.genres.length ? genre.name : genre.name + ", ") : 'Unknown';
    ageText.textContent = game.esrb_rating.name;
  }

  function gameListener(game) {
    return () => {
      gameModal.style.display = 'flex';
      backgroundGameModal.style.display = 'block';
      const gameWithDetails = getGameFromArray(game);
      populateModal(gameWithDetails);
    }
  }

  function addModalEventListener() {
    const gameContainer = document.querySelectorAll('.game-container');
    Array.from(gameContainer).forEach(game => {
      // Si el juego ya estaba (estoy renderizando optra pagina), evito agregar mas event listeners a el mismo juego.
      game.removeEventListener('click', gameListener(game));
      game.addEventListener('click', gameListener(game));
    })
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
      addModalEventListener();
    },
    renderGallery: function (arr, initialCount = 1) {
      arr.forEach((game, index) => {
        gamesContainer.innerHTML += galleryTemplate(game, initialCount + index);
      });
      addModalEventListener();
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
    gameInArray: function (game) {
      for(let i = 0; i < gamesArray.length; i++) {
        if(game.id === gamesArray[i].id) {
          return true;
        } 
      }
      return false;
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
