const searchForm = document.getElementById('search-form');
const movieList = document.getElementById('movies');
const movieDetails = document.getElementById('details');
const pagination = document.getElementById('pagination');
const BASE_URL = 'https://www.omdbapi.com/';
const API_KEY = '8084fa83';  // Твій API ключ

let currentPage = 1;
let currentQuery = '';
let currentType = 'movie';


// Обробник форми
searchForm.onsubmit = handleSearch;

// Обробка пошуку фільмів
async function handleSearch(event) {
  event.preventDefault();

  movieList.innerHTML = '';
  pagination.innerHTML = '';

  currentQuery = searchForm.s.value.trim();
  currentType = document.getElementById('type').value;

  currentPage = 1;
  const results = await searchMovies(currentQuery, currentType, currentPage);

  if (results && results.length > 0) {
    renderMovieCards(results);
    setupPagination(results.totalResults);
  } else {
    movieList.innerHTML = '<p>Фільми не знайдено!</p>';
  }
}

async function handleMovieClick(event) {
  const card = event.target.closest('.movie');
  const movieId = card.dataset.id;

  if (!movieId) return;

  const movieData = await getMovieDetails(movieId);

  renderMovieDetails(movieData);
}

// Функція для пошуку фільмів
async function searchMovies(query, type, page) {
  const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${query}&type=${type}&page=${page}`);
  const data = await response.json();

  if (data.Response === "False") {
    return [];
  }

  return data.Search;
}

// Функція для отримання деталей фільму
async function getMovieDetails(movieId) {
  const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${movieId}`);
  const data = await response.json();

  return data;
}

// Відображення карток фільмів
function renderMovieCards(movies) {
  const movieCards = movies.map(buildMovieCard);
  movieList.hidden = false;
  movieList.replaceChildren(...movieCards);
  movieList.scrollIntoView({ behavior: 'smooth' });
}

// Функція побудови картки фільму
function buildMovieCard(movie) {
  const card = document.createElement('li');
  const title = document.createElement('h4');
  const year = document.createElement('p');
  const image = document.createElement('img');

  card.classList.add('movie');
  card.dataset.id = movie.imdbID;

  title.textContent = movie.Title;
  year.textContent = 'Year: ' + movie.Year;

  if (movie.Poster && movie.Poster !== 'N/A') {
    image.src = movie.Poster;
  } else {
    image.src = 'no-poster.jpg';
  }
  image.alt = movie.Title;

  card.append(image, title, year);

  return card;
}

// Відображення деталей фільму
function renderMovieDetails(movie) {
  const title = document.createElement('h3');
  const year = document.createElement('p');
  const image = document.createElement('img');
  const genre = document.createElement('p');
  const director = document.createElement('p');
  const writer = document.createElement('p');
  const actors = document.createElement('p');
  const description = document.createElement('p');

  movieDetails.hidden = false;
  movieList.hidden = true;

  title.textContent = movie.Title;
  year.textContent = 'Year: ' + movie.Year;

  if (movie.Poster && movie.Poster !== 'N/A') {
    image.src = movie.Poster;
  } else {
    image.src = 'no-poster.jpg';
  }
  image.alt = movie.Title;

  genre.textContent = 'Genre: ' + movie.Genre;
  director.textContent = 'Director: ' + movie.Director;
  writer.textContent = 'Writer: ' + movie.Writer;
  actors.textContent = 'Actors: ' + movie.Actors;
  description.textContent = movie.Plot;

  movieDetails.replaceChildren(title, year, image, genre, director, writer, actors, description);
  movieDetails.scrollIntoView({ behavior: 'smooth' });
}

// Налаштування пагінації
function setupPagination(totalResults) {
  const pages = Math.ceil(totalResults / 10); // API повертає 10 результатів на сторінку

  for (let i = 1; i <= pages; i++) {
    const button = document.createElement('span');
    button.classList.add('page-btn');
    button.textContent = i;
    button.onclick = () => {
      currentPage = i;
      searchMovies(currentQuery, currentType, currentPage).then(renderMovieCards);
    };

    pagination.appendChild(button);
  }
}
