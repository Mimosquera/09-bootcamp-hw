import './styles/jass.css';

// * DOM Element Selections
const searchForm: HTMLFormElement = document.getElementById('search-form') as HTMLFormElement;
const searchInput: HTMLInputElement = document.getElementById('search-input') as HTMLInputElement;
const todayContainer = document.querySelector('#today') as HTMLDivElement;
const forecastContainer = document.querySelector('#forecast') as HTMLDivElement;
const searchHistoryContainer = document.getElementById('history') as HTMLDivElement;
const heading: HTMLHeadingElement = document.getElementById('search-title') as HTMLHeadingElement;
const weatherIcon: HTMLImageElement = document.getElementById('weather-img') as HTMLImageElement;
const tempEl: HTMLParagraphElement = document.getElementById('temp') as HTMLParagraphElement;
const windEl: HTMLParagraphElement = document.getElementById('wind') as HTMLParagraphElement;
const humidityEl: HTMLParagraphElement = document.getElementById('humidity') as HTMLParagraphElement;

/*
API Calls
*/

// Fetch weather data from the server
const fetchWeather = async (cityName: string) => {
  const response = await fetch('/api/weather/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ city: cityName }),
  });

  const data = await response.json();
  console.log('weatherData:', data);

  if (data.weather && data.weather.list && data.weather.list.length > 0) {
    renderCurrentWeather(data);
    renderForecast(data.weather.list);
  } else {
    console.error('Invalid weather data:', data);
    todayContainer.innerHTML = '<p>Weather data not available for this city.</p>';
  }
};

// Fetch search history from the server
const fetchSearchHistory = async () => {
  const history = await fetch('/api/weather/history', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return history.json();
};

// Delete a city from search history
const deleteCityFromHistory = async (id: string) => {
  await fetch(`/api/weather/history/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  renderSearchHistory();
};

/*
Render Functions
*/

// Render the current weather
const renderCurrentWeather = (weatherData: any): void => {
  const { name } = weatherData.city;
  const currentWeather = weatherData.weather.list?.[0];

  if (!currentWeather) {
    console.error('No current weather data available:', weatherData);
    todayContainer.innerHTML = '<p>Weather data is unavailable. Please try again later.</p>';
    return;
  }

  const date = new Date(currentWeather.dt * 1000).toLocaleDateString();
  const icon = currentWeather.weather[0]?.icon || '';
  const iconDescription = currentWeather.weather[0]?.description || '';
  const tempF = (currentWeather.main.temp * 9/5 - 459.67).toFixed(1);
  const windSpeed = currentWeather.wind.speed;
  const humidity = currentWeather.main.humidity;

  heading.textContent = `${name} (${date})`;
  weatherIcon.setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);
  weatherIcon.setAttribute('alt', iconDescription);
  weatherIcon.setAttribute('class', 'weather-img');

  tempEl.textContent = `Temp: ${tempF}°F`;
  windEl.textContent = `Wind: ${windSpeed} MPH`;
  humidityEl.textContent = `Humidity: ${humidity}%`;

  todayContainer.innerHTML = '';
  todayContainer.append(heading, tempEl, windEl, humidityEl);
};

// Render the 5-day forecast
const renderForecast = (forecastList: any[]): void => {
  forecastContainer.innerHTML = '';

  const headingCol = document.createElement('div');
  const heading = document.createElement('h4');
  headingCol.setAttribute('class', 'col-12');
  heading.textContent = '5-Day Forecast:';
  headingCol.append(heading);
  forecastContainer.append(headingCol);

  const dailyForecasts = forecastList.filter((_item, index) => index % 8 === 0);

  dailyForecasts.forEach((forecast) => {
    renderForecastCard(forecast);
  });
};

// Render a single forecast card
const renderForecastCard = (forecast: any) => {
  const date = new Date(forecast.dt * 1000).toLocaleDateString();
  const icon = forecast.weather[0]?.icon || '';
  const iconDescription = forecast.weather[0]?.description || '';
  const tempF = (forecast.main.temp * 9/5 - 459.67).toFixed(1);
  const windSpeed = forecast.wind.speed;
  const humidity = forecast.main.humidity;

  const card = createForecastCard();

  card.cardTitle.textContent = date;
  card.weatherIcon.setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);
  card.weatherIcon.setAttribute('alt', iconDescription);
  card.tempEl.textContent = `Temp: ${tempF}°F`;
  card.windEl.textContent = `Wind: ${windSpeed} MPH`;
  card.humidityEl.textContent = `Humidity: ${humidity}%`;

  forecastContainer.append(card.col);
};

// Render the search history
const renderSearchHistory = async () => {
  const historyList = await fetchSearchHistory();

  if (searchHistoryContainer) {
    searchHistoryContainer.innerHTML = '';

    if (!historyList.length) {
      searchHistoryContainer.innerHTML = '<p class="text-center">No Previous Search History</p>';
    }

    for (let i = historyList.length - 1; i >= 0; i--) {
      const historyItem = buildHistoryListItem(historyList[i]);
      searchHistoryContainer.append(historyItem);
    }
  }
};

/*
Helper Functions
*/

const createForecastCard = () => {
  const col = document.createElement('div');
  const card = document.createElement('div');
  const cardBody = document.createElement('div');
  const cardTitle = document.createElement('h5');
  const weatherIcon = document.createElement('img');
  const tempEl = document.createElement('p');
  const windEl = document.createElement('p');
  const humidityEl = document.createElement('p');

  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

  col.classList.add('col-auto');
  card.classList.add('forecast-card', 'card', 'text-white', 'bg-primary', 'h-100');
  cardBody.classList.add('card-body', 'p-2');
  cardTitle.classList.add('card-title');
  tempEl.classList.add('card-text');
  windEl.classList.add('card-text');
  humidityEl.classList.add('card-text');

  return { col, cardTitle, weatherIcon, tempEl, windEl, humidityEl };
};

const buildHistoryListItem = (city: any) => {
  const historyDiv = document.createElement('div');
  historyDiv.classList.add('display-flex', 'gap-2', 'col-12', 'm-1');

  const btn = document.createElement('button');
  btn.textContent = city.name;
  btn.classList.add('history-btn', 'btn', 'btn-secondary', 'col-10');
  btn.dataset.id = city.id;
  btn.addEventListener('click', () => fetchWeather(city.name));

  const delBtn = document.createElement('button');
  delBtn.setAttribute('type', 'button');
  delBtn.classList.add('fas', 'fa-trash-alt', 'delete-city', 'btn', 'btn-danger', 'col-2');
  delBtn.addEventListener('click', () => deleteCityFromHistory(city.id));

  historyDiv.append(btn, delBtn);

  return historyDiv;
};

/*
Event Handlers
*/

const handleSearchFormSubmit = (event: Event): void => {
  event.preventDefault();

  if (!searchInput.value) {
    alert('City cannot be blank');
    return;
  }

  fetchWeather(searchInput.value.trim());
  searchInput.value = '';
};

/*
Initial Render
*/

searchForm?.addEventListener('submit', handleSearchFormSubmit);
renderSearchHistory();