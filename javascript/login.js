// Elements used in this script.
const carousel = document.getElementById("bg-carousel");
const rightChevron = document.getElementById("right-chevron");
const leftChevron = document.getElementById("left-chevron");
const bottomSliderChildren = document.getElementById("bottom-slider").children;
const bottomSliderDots = document.querySelectorAll('.dot-color');

const headerLightMode = document.querySelector('.not-show');
const logo = document.querySelector("#logo-login");
const body = document.querySelector("body");
const loginContainer = document.querySelector("main");

const form = document.getElementById("form");
const btnSocialsIcons = document.querySelectorAll('.btn-icon');

// This array contains all the names of the images for the background.
const images = [
  { dark: "BG.png", light: "default-xbox-L.png" },
  { dark: "Headphones-D.jpg", light: "graphic-card-L.jpg" },
  { dark: "Keyboard-D.jpg", light: "keyboard-L.jpg" },
  { dark: "PsController-D.jpg", light: "ps5-controller-L.jpg" },
  { dark: "VideoCard-D.jpg", light: "Ps5-L.jpg" },
  { dark: "XboxController-D.jpg", light: "Xbox-Pink-L.jpg" },
];

// If the user is logged  in, it doesn't allow him to be in the login page.
(function () {
  const userinfo = JSON.parse(localStorage.getItem("userinfo"));

  if (userinfo) {
    location.href = "/games.html";
  }
})();



/*
############################################

    Code for the password show functionality.

############################################
*/

const eye = document.getElementById("form__password-icon");

eye.addEventListener("click", () => {
  const input = eye.previousElementSibling;
  input.classList.toggle("form__password-dots");

  if (eye.src.includes("eye-off")) {
    eye.src = "../resources/icons/eye.png";
    input.type = "password";
  } else {
    eye.src = "../resources/icons/eye-off.png";
    input.type = "text";
  }
});

/*
############################################

    Code for the carousel functionality.

############################################
*/

// Used an anonymous function so it is ran when it gets here, setting the previous image the user had.
(function () {
  let actualPhoto = JSON.parse(localStorage.getItem("carousel")) || {
    index: 0,
    mode: "dark",
  };
  const mode = actualPhoto.mode;

  // Sets the current background photo depending on the color mode.
  carousel.style.backgroundImage = `url('../resources/images/${
    mode === "dark"
      ? images[actualPhoto.index].dark
      : images[actualPhoto.index].light
  }')`;

  bottomSliderChildren[actualPhoto.index + 1].style.opacity = "1";

  // Handles the case in where the user selected light mode, so it is saved in localStorage.
  if (mode === "light") {
    logo.src = "./resources/logos/Black.svg";
    body.classList.add("light-mode");
    loginContainer.style.backgroundColor = '#F0F0F0';
    headerLightMode.setAttribute('id', 'show-header');
    btnSocialsIcons.forEach((icon) => {
      icon.classList.add('light-btn-icon');
    })
  } 

  localStorage.setItem("carousel", JSON.stringify(actualPhoto));
})();

const handleCarousel = (e) => {
  const id =
    e.target.id !== "right-chevron" || e.target.id !== "left-chevron"
      ? e.target.parentElement.id
      : e.target.id;

  let actualPhoto = JSON.parse(localStorage.getItem("carousel")) || {
    index: 0,
    mode: "dark",
  };

  if (id === "right-chevron") {
    // Sets the old photo slider dot to opacity 0.25 (not selected)
    bottomSliderChildren[actualPhoto.index + 1].style.opacity = "0.25";

    actualPhoto.index = actualPhoto.index === 5 ? 0 : actualPhoto.index + 1;

    // Sets the current photo slider dot to opacity 1 (selected)
    bottomSliderChildren[actualPhoto.index + 1].style.opacity = "1";
  } else {
    bottomSliderChildren[actualPhoto.index + 1].style.opacity = "0.25";

    actualPhoto.index = actualPhoto.index === 0 ? 5 : actualPhoto.index - 1;

    bottomSliderChildren[actualPhoto.index + 1].style.opacity = "1";
  }

  carousel.style.backgroundImage = `url('../resources/images/${
    actualPhoto.mode === "dark"
      ? images[actualPhoto.index].dark
      : images[actualPhoto.index].light
  }')`;

  localStorage.setItem("carousel", JSON.stringify(actualPhoto));
};

rightChevron.addEventListener("click", handleCarousel);
leftChevron.addEventListener("click", handleCarousel);

// Handles the bottom slider dot click to change the image.
Array.from(bottomSliderDots).forEach((dot, i) => {
  dot.addEventListener("click", () => {
    let actualPhoto = JSON.parse(localStorage.getItem("carousel")) || {
      index: 0,
      mode: "dark",
    };

    carousel.style.backgroundImage = `url('../resources/images/${
      actualPhoto.mode === "dark"
        ? images[i].dark
        : images[i].light
    }')`;

    bottomSliderChildren[actualPhoto.index + 1].style.opacity = "0.25";
    actualPhoto.index = i;
    bottomSliderChildren[actualPhoto.index + 1].style.opacity = "1";

    localStorage.setItem("carousel", JSON.stringify(actualPhoto));
  });
})

/*
############################################

    Code for the form submit functionality.

############################################
*/

const loginUser = (email, password) => {
  return fetch(`http://localhost:4000/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({
      email,
      password,
    })
  });
};


form.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputs = e.target.elements;
  const email = inputs.email.value.trim();
  const pw = inputs.password.value.trim();
  const remember = inputs.checkbox.checked;

  loginUser(email, pw)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (typeof data === "object") {
        localStorage.setItem("userinfo", JSON.stringify(data));
        location.href = "games.html";
      } else {
        throw new Error();
      }
    })
    .catch(() => {
      alert("The credentials don't match any user in the database.");
    });
});
