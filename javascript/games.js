// Select every element that i will use.
const userimg = document.querySelector(".user__img");
const toggle = document.querySelector("#toggle-switch");
const body = document.querySelector("body");
const gamesContainer = document.querySelector(".games-container");
const logoutButton = document.querySelector(".user__log-out");
const cardOption = document.querySelector('#card-option');
const galleryOption = document.querySelector('#gallery-option');

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
    toggle.src = './resources/icons/Off.png';
  } else {
    body.classList.remove("light-mode");
    toggle.src = './resources/icons/On.png';
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

function galleryTemplate(game) {
  return `<article class="gallery">
  <img class="gallery__image" src="${game.background_image}" />
  <img class="heart-icon" src="./resources/icons/heart-empty.svg" alt="Heart icon." />
  <div class="first-row">
    <h2 class="game-title">${game.name}</h2>
    <span class="game-ranking">#1</span>
  </div>
  <div class="second-row">
    <div class="text-container info-key">
      <p>Release date:</p>
      <p class="date-release-gallery info-value">${game.released}</p>
      <p class="genres-key-margin">Genres:</p>
      <p class="info-value genres-value-margin">${game.genres.map((genre, i) => {
        if(i + 1 === game.genres.length) {
          return genre.name;
        } 
        return genre.name + ' ';
      })}</p>
    </div>
    <div class="icon-container">
      <svg
        width="24"
        height="20"
        viewBox="0 0 24 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.55176 9.53674e-06L9.55176 18.2774L13.3605 19.5885L13.3605 4.26319C13.3605 3.54103 13.6568 3.06155 14.1321 3.22645C14.7535 3.41372 14.8743 4.07895 14.8743 4.79307L14.8743 10.9138C17.245 12.1606 19.1115 10.9131 19.1115 7.62345C19.1115 4.26188 18.0172 2.76435 14.7973 1.56033C13.5273 1.10084 11.1735 0.325457 9.55176 9.53674e-06Z"
          class="icon-color"
        />
        <path
          d="M14.3506 16.9129L20.1079 14.3203C20.7592 14.0148 20.8587 13.5998 20.3316 13.3817C19.7962 13.1596 18.8406 13.2232 18.1824 13.5222L14.3506 15.2325V12.5036L14.57 12.412C14.57 12.412 15.6792 11.9148 17.2392 11.7008C18.7962 11.4848 20.7057 11.7289 22.2065 12.4446C23.8971 13.1241 24.0866 14.1153 23.6589 14.8051C23.2249 15.4877 22.1728 15.9815 22.1728 15.9815L14.3506 19.5367"
          class="icon-color"
        />
        <path
          d="M1.7099 17.2146C-0.0868735 16.6444 -0.386499 15.4395 0.433179 14.7435C1.18926 14.1079 2.47691 13.6295 2.47691 13.6295L7.79974 11.4675V13.9281L3.97289 15.4908C3.29503 15.767 3.1934 16.1557 3.73939 16.359C4.29514 16.5706 5.28141 16.5137 5.95966 16.2286L7.79974 15.4728V17.6695C7.68114 17.6921 7.54927 17.715 7.42892 17.7384C5.5943 18.0852 3.63971 17.9428 1.7099 17.2146Z"
          class="icon-color"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M23.7661 19.4589C23.6149 19.6145 23.4164 19.7024 23.2027 19.7024C22.989 19.7024 22.784 19.6145 22.6326 19.4589C22.4831 19.3005 22.4004 19.0936 22.4004 18.8706C22.4004 18.4089 22.7591 18.0357 23.2027 18.0357C23.4164 18.0357 23.6149 18.1208 23.7661 18.2798C23.9156 18.4352 24 18.6456 24 18.8706C24 19.0936 23.9156 19.3005 23.7661 19.4589ZM22.5352 18.8707C22.5352 18.6808 22.6033 18.5067 22.7279 18.3776C22.8555 18.2458 23.0258 18.1747 23.2027 18.1747C23.3798 18.1747 23.5458 18.2458 23.6703 18.3776C23.7959 18.5067 23.8638 18.6808 23.8638 18.8707C23.8638 19.2511 23.567 19.5599 23.2027 19.5599C23.0258 19.5599 22.8555 19.4896 22.7279 19.3594C22.6033 19.2281 22.5352 19.0558 22.5352 18.8707ZM23.5677 19.2169C23.5748 19.2384 23.5835 19.2511 23.5958 19.2548L23.607 19.2614V19.3143H23.4334L23.4302 19.3036L23.4184 19.2717C23.4164 19.2548 23.4141 19.2328 23.4117 19.1957L23.404 19.0508C23.402 18.9993 23.3859 18.9694 23.3561 18.9496C23.334 18.9419 23.3039 18.9359 23.259 18.9359H23.018V19.3143H22.8599V18.3849H23.2745C23.3421 18.3849 23.399 18.3975 23.4426 18.4167C23.53 18.4596 23.5748 18.5368 23.5748 18.6455C23.5748 18.6988 23.5621 18.7487 23.5402 18.7856C23.5212 18.8116 23.4988 18.8353 23.4744 18.8585L23.4809 18.8633C23.4974 18.8754 23.5138 18.8874 23.5235 18.9051C23.5456 18.9305 23.5556 18.9731 23.5574 19.028L23.5614 19.1463C23.5621 19.1766 23.5644 19.2002 23.5677 19.2169ZM23.3807 18.7599C23.4063 18.7427 23.4184 18.7085 23.4184 18.6561C23.4184 18.6009 23.4001 18.5641 23.3642 18.5458C23.3421 18.5368 23.3146 18.5303 23.2779 18.5303H23.018V18.7914H23.2635C23.3123 18.7914 23.3511 18.7809 23.3807 18.7599Z"
          class="icon-color"
        />
      </svg>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10 0C11.9286 0 13.5238 0.616246 14.9762 1.65266C15 1.65266 15 1.68067 15 1.70868C15 1.73669 14.9762 1.73669 14.9524 1.73669C13.0952 1.2605 10.2857 3.13725 10.0238 3.33333H10H9.97619C9.71429 3.13725 6.90476 1.2605 5.04762 1.73669C5.02381 1.73669 5 1.73669 5 1.70868C5 1.68067 5 1.65266 5.02381 1.65266C6.47619 0.616246 8.07143 0 10 0ZM16.3903 17.5988C17.8903 16.0464 12.9308 10.5648 10.0035 8.33333C10.0035 8.33333 9.97935 8.33333 9.97935 8.35759C7.07626 10.5648 2.09261 16.0464 3.61674 17.5988C5.31021 19.1026 7.56011 20 10.0035 20C12.447 20 14.6727 19.1026 16.3903 17.5988ZM2.73973 3.38078C2.72831 3.38078 2.7226 3.38705 2.7169 3.39332C2.71119 3.39959 2.70548 3.40585 2.69406 3.40585C1.0274 5.2358 0 7.76763 0 10.5501C0 12.8313 0.707763 14.9621 1.87215 16.6416C1.87215 16.6667 1.89498 16.6667 1.91781 16.6667C1.94064 16.6667 1.94064 16.6416 1.91781 16.6165C1.21005 14.2351 4.79452 8.4946 6.64384 6.0881L6.66667 6.06303C6.66667 6.03796 6.66667 6.03796 6.64384 6.03796C3.83562 2.9797 2.89954 3.30558 2.73973 3.38078ZM13.3333 6.05268L13.3562 6.02759C16.1644 2.99144 17.1005 3.31764 17.2374 3.36782C17.2469 3.36782 17.2525 3.36782 17.2574 3.36962C17.2642 3.37215 17.2698 3.37825 17.2831 3.39291C18.9726 5.22464 20 7.75895 20 10.5442C20 12.8276 19.2922 14.9604 18.1279 16.6416C18.1279 16.6667 18.105 16.6667 18.0822 16.6667V16.6165C18.7671 14.2327 15.2055 8.48662 13.3562 6.07777C13.3333 6.07777 13.3333 6.05268 13.3333 6.05268Z"
          class="icon-color"
        />
      </svg>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M20 9.16667H9.16667V1.53647L20 0V9.16667ZM8.33333 1.66667V9.16667H0V2.77865L8.33333 1.66667ZM8.33333 10H0V17.0992L8.33333 18.3333V10ZM9.16667 18.3262V10H20V20L9.16667 18.3262Z"
          class="icon-color"
        />
      </svg>
    </div>
  </div>
  <p class="game-description">Game's description goes over here: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
</article>`;
}

function cardTemplate(game) {
  return `<article class="card">
  <img
    class="card__image"
    src="${game.background_image}"
    alt="placeholder image"
  />
  <img class="heart-icon" src="./resources/icons/heart-empty.svg" alt="Heart icon." />
  <div class="first-row">
    <h2 class="game-title">${game.name}</h2>
    <span class="game-ranking">#1</span>
  </div>
  <div class="second-row">
    <div class="text-container info-key">
      <p>Release date:</p>
      <p class="date-release info-value">${game.released}</p>
    </div>
    <div class="icon-container">
      <svg
        width="24"
        height="20"
        viewBox="0 0 24 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.55176 9.53674e-06L9.55176 18.2774L13.3605 19.5885L13.3605 4.26319C13.3605 3.54103 13.6568 3.06155 14.1321 3.22645C14.7535 3.41372 14.8743 4.07895 14.8743 4.79307L14.8743 10.9138C17.245 12.1606 19.1115 10.9131 19.1115 7.62345C19.1115 4.26188 18.0172 2.76435 14.7973 1.56033C13.5273 1.10084 11.1735 0.325457 9.55176 9.53674e-06Z"
          class="icon-color"
        />
        <path
          d="M14.3506 16.9129L20.1079 14.3203C20.7592 14.0148 20.8587 13.5998 20.3316 13.3817C19.7962 13.1596 18.8406 13.2232 18.1824 13.5222L14.3506 15.2325V12.5036L14.57 12.412C14.57 12.412 15.6792 11.9148 17.2392 11.7008C18.7962 11.4848 20.7057 11.7289 22.2065 12.4446C23.8971 13.1241 24.0866 14.1153 23.6589 14.8051C23.2249 15.4877 22.1728 15.9815 22.1728 15.9815L14.3506 19.5367"
          class="icon-color"
        />
        <path
          d="M1.7099 17.2146C-0.0868735 16.6444 -0.386499 15.4395 0.433179 14.7435C1.18926 14.1079 2.47691 13.6295 2.47691 13.6295L7.79974 11.4675V13.9281L3.97289 15.4908C3.29503 15.767 3.1934 16.1557 3.73939 16.359C4.29514 16.5706 5.28141 16.5137 5.95966 16.2286L7.79974 15.4728V17.6695C7.68114 17.6921 7.54927 17.715 7.42892 17.7384C5.5943 18.0852 3.63971 17.9428 1.7099 17.2146Z"
          class="icon-color"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M23.7661 19.4589C23.6149 19.6145 23.4164 19.7024 23.2027 19.7024C22.989 19.7024 22.784 19.6145 22.6326 19.4589C22.4831 19.3005 22.4004 19.0936 22.4004 18.8706C22.4004 18.4089 22.7591 18.0357 23.2027 18.0357C23.4164 18.0357 23.6149 18.1208 23.7661 18.2798C23.9156 18.4352 24 18.6456 24 18.8706C24 19.0936 23.9156 19.3005 23.7661 19.4589ZM22.5352 18.8707C22.5352 18.6808 22.6033 18.5067 22.7279 18.3776C22.8555 18.2458 23.0258 18.1747 23.2027 18.1747C23.3798 18.1747 23.5458 18.2458 23.6703 18.3776C23.7959 18.5067 23.8638 18.6808 23.8638 18.8707C23.8638 19.2511 23.567 19.5599 23.2027 19.5599C23.0258 19.5599 22.8555 19.4896 22.7279 19.3594C22.6033 19.2281 22.5352 19.0558 22.5352 18.8707ZM23.5677 19.2169C23.5748 19.2384 23.5835 19.2511 23.5958 19.2548L23.607 19.2614V19.3143H23.4334L23.4302 19.3036L23.4184 19.2717C23.4164 19.2548 23.4141 19.2328 23.4117 19.1957L23.404 19.0508C23.402 18.9993 23.3859 18.9694 23.3561 18.9496C23.334 18.9419 23.3039 18.9359 23.259 18.9359H23.018V19.3143H22.8599V18.3849H23.2745C23.3421 18.3849 23.399 18.3975 23.4426 18.4167C23.53 18.4596 23.5748 18.5368 23.5748 18.6455C23.5748 18.6988 23.5621 18.7487 23.5402 18.7856C23.5212 18.8116 23.4988 18.8353 23.4744 18.8585L23.4809 18.8633C23.4974 18.8754 23.5138 18.8874 23.5235 18.9051C23.5456 18.9305 23.5556 18.9731 23.5574 19.028L23.5614 19.1463C23.5621 19.1766 23.5644 19.2002 23.5677 19.2169ZM23.3807 18.7599C23.4063 18.7427 23.4184 18.7085 23.4184 18.6561C23.4184 18.6009 23.4001 18.5641 23.3642 18.5458C23.3421 18.5368 23.3146 18.5303 23.2779 18.5303H23.018V18.7914H23.2635C23.3123 18.7914 23.3511 18.7809 23.3807 18.7599Z"
          class="icon-color"
        />
      </svg>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10 0C11.9286 0 13.5238 0.616246 14.9762 1.65266C15 1.65266 15 1.68067 15 1.70868C15 1.73669 14.9762 1.73669 14.9524 1.73669C13.0952 1.2605 10.2857 3.13725 10.0238 3.33333H10H9.97619C9.71429 3.13725 6.90476 1.2605 5.04762 1.73669C5.02381 1.73669 5 1.73669 5 1.70868C5 1.68067 5 1.65266 5.02381 1.65266C6.47619 0.616246 8.07143 0 10 0ZM16.3903 17.5988C17.8903 16.0464 12.9308 10.5648 10.0035 8.33333C10.0035 8.33333 9.97935 8.33333 9.97935 8.35759C7.07626 10.5648 2.09261 16.0464 3.61674 17.5988C5.31021 19.1026 7.56011 20 10.0035 20C12.447 20 14.6727 19.1026 16.3903 17.5988ZM2.73973 3.38078C2.72831 3.38078 2.7226 3.38705 2.7169 3.39332C2.71119 3.39959 2.70548 3.40585 2.69406 3.40585C1.0274 5.2358 0 7.76763 0 10.5501C0 12.8313 0.707763 14.9621 1.87215 16.6416C1.87215 16.6667 1.89498 16.6667 1.91781 16.6667C1.94064 16.6667 1.94064 16.6416 1.91781 16.6165C1.21005 14.2351 4.79452 8.4946 6.64384 6.0881L6.66667 6.06303C6.66667 6.03796 6.66667 6.03796 6.64384 6.03796C3.83562 2.9797 2.89954 3.30558 2.73973 3.38078ZM13.3333 6.05268L13.3562 6.02759C16.1644 2.99144 17.1005 3.31764 17.2374 3.36782C17.2469 3.36782 17.2525 3.36782 17.2574 3.36962C17.2642 3.37215 17.2698 3.37825 17.2831 3.39291C18.9726 5.22464 20 7.75895 20 10.5442C20 12.8276 19.2922 14.9604 18.1279 16.6416C18.1279 16.6667 18.105 16.6667 18.0822 16.6667V16.6165C18.7671 14.2327 15.2055 8.48662 13.3562 6.07777C13.3333 6.07777 13.3333 6.05268 13.3333 6.05268Z"
          class="icon-color"
        />
      </svg>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M20 9.16667H9.16667V1.53647L20 0V9.16667ZM8.33333 1.66667V9.16667H0V2.77865L8.33333 1.66667ZM8.33333 10H0V17.0992L8.33333 18.3333V10ZM9.16667 18.3262V10H20V20L9.16667 18.3262Z"
          class="icon-color"
        />
      </svg>
    </div>
  </div>
  <div class="third-row">
    <p class="info-key">Genres:</p>
    <p class="info-value genres-margin">${game.genres.map((genre, i) => {
      if(i + 1 === game.genres.length) {
        return genre.name;
      } 
      return genre.name + ' ';
    })}</p>
  </div>
  </article>`;
}

let gamesArray = [];

fetch('https://api.rawg.io/api/games?key=e3108f7dfa484f38bdb2d3b8372fb406')
  .then((res) => {
    return res.json();
  })
  .then((games) => {
    gamesArray = games.results;
    games.results.forEach((game) => {
      gamesContainer.innerHTML += cardTemplate(game);
    });
  })
  .catch((err) => {
    console.log(err);
  })

/*
############################################

    Code for changing the view of the cards.

############################################
*/

function handleViewChange(element) {
  const classesEnabled = ['cards-enabled-outer','cards-enabled-inside'];
  const classesDissabled = ['cards-disabled-outer', 'cards-disabled-inside'];

  const sibling = element.previousElementSibling || element.nextElementSibling;
  const siblingChildren = sibling.children;
  const children = element.children;

  // Checks whether the clicked element is already highlighted as clicked.
  if(children[0].classList.contains('cards-enabled-outer')) return;

  // Checks which view option the user selected to set the grid layout and the card styling.
  if(element.id === 'gallery-option') {
    gamesContainer.style.gridTemplateColumns = '697px';
    gamesContainer.style.gridAutoRows = '538px';
    
    // Changes the cards. 
    while(gamesContainer.firstElementChild) {
      gamesContainer.removeChild(gamesContainer.firstElementChild);
    }

    gamesArray.forEach((game) => {
      gamesContainer.innerHTML += galleryTemplate(game);
    });
  } else {
    gamesContainer.style.gridTemplateColumns = 'repeat(3, 363px)';
    gamesContainer.style.gridAutoRows = '314px';

    // Changes the cards. 
    while(gamesContainer.firstElementChild) {
      gamesContainer.removeChild(gamesContainer.firstElementChild);
    }

    gamesArray.forEach((game) => {
      gamesContainer.innerHTML += cardTemplate(game);
    });
  }

  // Swaps the classes between the children of the svg's.
  for(let i = 0; i < children.length; i++) {
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

cardOption.addEventListener('click', () => handleViewChange(cardOption));
galleryOption.addEventListener('click', () => handleViewChange(galleryOption));


/*
############################################

    Code for the log out functionality.

############################################
*/

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("userinfo");
});
