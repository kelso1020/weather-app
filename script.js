const APIKey = "c8585cdef004c8be54ebfad9ed845d0d";
const searchForm = document.getElementById('city-search-form');
const city = document.getElementById('city-name');
const searchHistory = document.getElementById('search-history');
const currentWeather = document.getElementById('current-weather');
const fiveDayForecast = document.getElementById('forecast');

displaySearchHistory();

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

// function to retreive data for the current weather in the most recently searched/selected city
function createArticle(currentWeather) {
    // creating elements to fill currentWeather section in html
    var articleEl = document.createElement('article');
    var h2El = document.createElement('h2');
    var pEl = document.createElement('p');
    // setting heading to searched city name and date
    h2El.textContent = currentWeather.name + ' (' + new Date(currentWeather.dt * 1000).toLocaleDateString() + ')';
    // variables to identify and display weather icon
    var weatherIcon = currentWeather.weather[0].icon;
    var iconURL = "https://openweathermap.org/img/wn/" + weatherIcon + ".png";
    var iconEl = document.createElement('img');
    iconEl.src = iconURL;
    // setting retreived data to show up as a string of text in the injected paragraph element
    pEl.innerHTML = "Temperature: " + currentWeather.main.temp + "°F<br>"
    + "Wind: " + currentWeather.wind.speed + "MPH<br>"
    + "Humidity: " + currentWeather.main.humidity + "%";

    articleEl.append(h2El, iconEl, pEl);

    return articleEl;
};

// function to retrieve data for five days of the weather forecast for searched city
function createForecastCard(fiveDayForecast) {
    // creating elements to fill the forecast section in html
    var divEl = document.createElement('div');
    var h2El = document.createElement('h2');
    var pEl = document.createElement('p');
    // setting heading of each forecast card to correlating date and weather 
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

// displays retreived data from the previous 2 functions to the correct sections in html
function displayWeather(city) {
    getWeather(city)
    .then (function(data) {
        var articleEl = createArticle(data);
        currentWeather.innerHTML = "";
        currentWeather.appendChild(articleEl);
    });

    getForecast(city) 
        .then(function(data) {
            // pulling data from 12 noon each day to represent daily weather in five day forecast
            var dailyWeather = data.list.filter(function(item) {
                return item.dt_txt.includes('12:00:00');
            });
            // creates individual card for each of the five days of the forecast so data displays properly
            fiveDayForecast.innerHTML = "";
            for (var forecast of dailyWeather) {
                var forecastCard = createForecastCard(forecast);
                fiveDayForecast.appendChild(forecastCard);
            };
        });
};


function displaySearchHistory() {
    // retreives data from local storage to display on webpage
    var searchedList = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.innerHTML = "";
    // assigns each of the city names saved in local storage to its own li element to display as list under input form
    for (var city of searchedList) {
        var liEl = document.createElement('li');
        liEl.textContent = city;
        liEl.classList.add('search-history-item');
        searchHistory.appendChild(liEl);
    };
};

// event listener submit allows use of 'enter' key to submit form
searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    // the value typed into the search input
    var cityName = city.value;
    // each value entered and searched is saved to local storage
    let searchedList = JSON.parse(localStorage.getItem('searchHistory')) || [];
    // checking if a city name is already saved in local storage, and if there is push to display 
    if (searchedList.indexOf(cityName) === -1) {
        searchedList.push(cityName);
        localStorage.setItem('searchHistory', JSON.stringify(searchedList));
        displaySearchHistory();
    };
    // when a city name is typed in input and searched that city name runs through the display weather function
    city.value = "";
    displayWeather(cityName);
});
// when a list item in the search history is clicked, the webpage will load to that city's weather data
searchHistory.addEventListener('click', function(event) {
    if (event.target.matches('.search-history-item')) {
        var searchedCity = event.target.textContent;
        displayWeather(searchedCity);
    };
});


