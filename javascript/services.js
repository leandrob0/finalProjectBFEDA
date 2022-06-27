const baseUrl = "https://api.rawg.io/api/games";
const API_KEY = "e3108f7dfa484f38bdb2d3b8372fb406"

export const fetchGames = async (page) => {
  const response = await fetch(
    `${baseUrl}?page=${page}&key=${API_KEY}`
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
      `${baseUrl}/${game.id}?key=${API_KEY}`
    );
    let detailsJson = await details.json();
    let {description, website, released, platforms} = detailsJson;

    // Replaces the tags the description has.
    // Matches the character < / > literally (case sensitive).
    // ? Matches the previous token as many times as needed.
    // The g flag captures all instead of returning at the first encounter.
    description = description.replace(/<\/?[^>]+(>|$)/g, "");

    // Adds the description to the array of games.
    return { ...games[i], description, website, released, platforms };
  }));

  return gamesWithDescription;
};

export const searchGames = async (search) => {
  const response = await fetch(
    `${baseUrl}?search=${search}&search_precise=true&page_size=50&key=${API_KEY}`
  );

  // This handles a 404 status
  if (!response.ok) {
    return [];
  }

  const transformedResponse = await response.json();

  return transformedResponse.results;
}