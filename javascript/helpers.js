export const includesPlatform = (game, platformName) => {
  let isIn = false;

  if(!game.parent_platforms) return isIn;
  
  game.parent_platforms.forEach((obj) => {
    if (obj.platform.name === platformName) isIn = true;
  });

  return isIn;
};

export const searchAdded = (game, array) => {
  for(let i = 0; i < array.length; i++) {
    if(game.id === array[i].id) {
      return true;
    } 
  }
  return false;
}

export const resetSearch = (background, results, input, button) => {
  background.style.display = "none";
  results.innerHTML = "";
  input.value = "";
  button.style.visibility = "hidden";
}

export const formatPlatformsText = (platforms) => {
  let formattedText = '';
  platforms.forEach((platform, i) => {
    formattedText += platform.platform.name;
    if(i + 1 !== platforms.length) formattedText += ', ';
  });

  return formattedText;
}