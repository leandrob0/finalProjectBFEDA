export const fetchGames = async (page) => {
  const response = await fetch(
    `https://api.rawg.io/api/games?page=${page}&key=e3108f7dfa484f38bdb2d3b8372fb406`
  );

  // This handles a 404 status
  if (!response.ok) {
    throw new Error(`An error occurred: ${response.status}`);
  }

  const transformedResponse = await response.json();

  return transformedResponse.results;
};

export const getGamesDetails = async (games) => {
  const gamesWithDescription = Promise.all(games.map(async (game, i) => {
    let details = await fetch(
      `https://api.rawg.io/api/games/${game.id}?key=e3108f7dfa484f38bdb2d3b8372fb406`
    );
    let detailsJson = await details.json();
    let description = detailsJson.description;

    // Replaces the tags the description has.
    // Matches the character < / > literally (case sensitive).
    // ? Matches the previous token as many times as needed.
    // The g flag captures all instead of returning at the first encounter.
    description = description.replace(/<\/?[^>]+(>|$)/g, "");

    // Adds the description to the array of games.
    return { ...games[i], description };
  }));

  return gamesWithDescription;
};