export const includesPlatform = (game, platformName) => {
  let isIn = false;

  if(!game.parent_platforms) return isIn;
  
  game.parent_platforms.forEach((obj) => {
    if (obj.platform.name === platformName) isIn = true;
  });

  return isIn;
};

export const renderView = (container, arr, renderOption) => {
  container.innerHTML = "";
  arr.forEach((game, index) => {
    container.innerHTML += renderOption(game, index + 1);
  });
}

export const gameInArray = (game, array) => {
  for(let i = 0; i < array.length; i++) {
    if(game.id === array[i].id) {
      return true;
    } 
  }

  return false;
}
