// If the user is logged  in, it doesn't allow him to be in the login page.
(function () {
  const userinfo = JSON.parse(localStorage.getItem('userinfo'));

    if(userinfo) {
        location.href = '/games.html';
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

  if (eye.src.indexOf("Off") !== -1) {
    eye.src = "../resources/icons/Eye.png";
    input.type = "password";
  } else {
    eye.src = "../resources/icons/Eye Off.png";
    input.type = "text";
  }
});

/*
############################################

    Code for the carousel functionality.

############################################
*/

const carousel = document.getElementById("bg-carousel");
const rightChevron = document.getElementById("right-chevron");
const leftChevron = document.getElementById("left-chevron");
const bottomSliderChildren = document.getElementById("bottom-slider").children;

// This array contains all the names of the dark mode images.
const imagesDm = [
  "BG.png",
  "Headphones-D.jpg",
  "Keyboard-D.jpg",
  "PsController-D.jpg",
  "VideoCard-D.jpg",
  "XboxController-D.jpg",
];

// Used an anonymous function so it is ran when it gets here, setting the previous image the user had.
(function () {
  let actualPhoto = JSON.parse(localStorage.getItem("carousel")) || {
    index: 0,
    mode: "dark",
  };

  carousel.style.backgroundImage = `url('../resources/images/${
    imagesDm[actualPhoto.index]
  }')`;
  bottomSliderChildren[actualPhoto.index + 1].style.opacity = "1";
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

  if (actualPhoto.mode === "dark") {
    carousel.style.backgroundImage = `url('../resources/images/${
      imagesDm[actualPhoto.index]
    }')`;
  }
  localStorage.setItem("carousel", JSON.stringify(actualPhoto));
};

rightChevron.addEventListener("click", handleCarousel);
leftChevron.addEventListener("click", handleCarousel);

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
    }),
    referrerPolicy: "origin",
  });
};

const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputs = e.target.elements;
  const email = inputs.email.value.trim();
  const pw = inputs.password.value.trim();
  const remember = inputs.checkbox.checked; // If selected, i should save in localStorage that it won't need to log in again everytime.

  loginUser(email, pw)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if(typeof data === 'object') {
        localStorage.setItem('userinfo', JSON.stringify(data));
        location.href = 'games.html';
      } else {
          throw new Error();
      }
    })
    .catch(() => {
      alert("The credentials don't match any user in the database.");
    });
});
