const APIKey = "c8585cdef004c8be54ebfad9ed845d0d";
const searchForm = document.getElementById('city-search-form');
const city = document.getElementById('city-name');
const searchHistory = document.getElementById('search-history');
const currentWeather = document.getElementById('current-weather');
const fiveDayForecast = document.getElementById('forecast');

// retrieves current weather data for searched city
function getWeather(city) {
    baseURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;
    return fetch(baseURL)
    .then(function(response) {
        return response.json();
    });
};

// retreives 5 day forecast data for searched city
function getForecast(city) {
    baseURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + APIKey;
    return fetch(baseURL)
    .then(function(response) {
        return response.json();
    });
};

function createArticle(currentWeather) {
    var articleEl = document.createElement('article');
    var h2El = document.createElement('h2');
    var pEl = document.createElement('p');

    h2El.textContent = currentWeather.name + ' (' + new Date(currentWeather.dt * 1000).toLocaleDateString() + ')';

    var weatherIcon = currentWeather.weather[0].icon;
    var iconURL = "https://openweathermap.org/img/wn/" + weatherIcon + ".png";
    var iconEl = document.createElement('img');
    iconEl.src = iconURL;
    
    pEl.innerHTML = "Temperature: " + currentWeather.main.temp + "°F<br>"
    + "Wind: " + currentWeather.wind.speed + "MPH<br>"
    + "Humidity: " + currentWeather.main.humidity + "%";

    articleEl.append(h2El, iconEl, pEl);

    return articleEl;
};

function createForecastCard(fiveDayForecast) {
    var divEl = document.createElement('div');
    var h2El = document.createElement('h2');
    var pEl = document.createElement('p');

    h2El.textContent = new Date(fiveDayForecast.dt * 1000).toLocaleDateString() + ')';

    var forecastIcon = fiveDayForecast.weather[0].icon;
    var iconURL = "https://openweathermap.org/img/wn/" + forecastIcon + ".png";
    var iconEl = document.createElement('img');
    iconEl.src = iconURL;
    
    pEl.innerHTML = "Temperature: " + fiveDayForecast.main.temp + "°F<br>"
    + "Wind: " + fiveDayForecast.wind.speed + "MPH<br>"
    + "Humidity: " + fiveDayForecast.main.humidity + "%";

    divEl.append(h2El, iconEl, pEl);

    return divEl;
};

function displayWeather(city) {
    getWeather(city)
    .then (function(data) {
        var articleEl = createArticle(data);
        currentWeather.innerHTML = "";
        currentWeather.appendChild(articleEl);
    });

    getForecast(city) 
        .then(function(data) {
            var dailyWeather = data.list.filter(function(item) {
                return item.dt_txt.includes('12:00:00');
            });

            fiveDayForecast.innerHTML = "";
            for (var forecast of dailyWeather) {
                var forecastCard = createForecastCard(forecast);
                fiveDayForecast.appendChild(forecastCard);
            };
        });
};

searchForm.addEventListener('submit', function(event) {
    event.preventDefault();

    var cityName = city.value;

    let searchedList = JSON.parse(localStorage.getItem('searchHistory'));

    if (searchedList.indexOf(cityName) === -1) {
        searchedList.push(cityName);
        localStorage.setItem('searchHistory', JSON.stringify(searchedList));
        displaySearchHistory();
    };

    city.value = "";
    displayWeather(cityName);
});
