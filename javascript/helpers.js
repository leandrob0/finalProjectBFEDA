export const includesPlatform = (game, platformName) => {
  let isIn = 0;

  game.parent_platforms.forEach((obj) => {
    if (obj.platform.name === platformName) isIn = 1;
  });

  return isIn;
};

export const renderView = (container, arr, renderOption) => {
  container.innerHTML = "";
  arr.forEach((game, index) => {
    container.innerHTML += renderOption(game, index + 1);
  });
}
