export const includesPlatform = (game, platformName) => {
  let isIn = 0;

  game.parent_platforms.forEach((obj) => {
    if (obj.platform.name === platformName) isIn = 1;
  });

  return isIn;
};
