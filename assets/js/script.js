var apiKey = "fcb06e8650a24aa8a2a205327230304";
var searchHistory = [];

var searchEl = document.getElementById("search-button");
var cityEl = document.getElementById("enter-city");
var cityNameEl = document.getElementById("city-name");
var currentPicEl = document.getElementById("current-pic");
var currentTempEl = document.getElementById("temperature");
var currentHumidityEl = document.getElementById("humidity");
var currentWindEl = document.getElementById("wind-speed");
var currentUVEl = document.getElementById("UV-index");
var historyEl = document.getElementById("history");
var fivedayEl = document.getElementById("fiveday-header");
var todayweatherEl = document.getElementById("today-weather");

function getweather(cityName) {
  //var queryUrl ='https://api.openweathermap.org/data/2.5/weather?q=' + cityName + "&appid=" +apiKey;
  var queryUrl =
    "http://api.weatherapi.com/v1/current.json?key=fcb06e8650a24aa8a2a205327230304&q=" +
    cityName +
    "&aqi=no";

  fetch(queryUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          getWeatherDetails(data);
        });
      } else {
        alert("unauthorized error");
      }
    })
    .catch(function (error) {
      alert("unauthorized response error");
    });
}

function getWeatherDetails(data) {
  todayweatherEl.classList.remove("d-none");

  var currentDate = new Date(data.current.last_updated) ;
  var month = currentDate.getMonth() + 1;
  var day = currentDate.getDate();
  var year = currentDate.getFullYear();
  cityNameEl.innerHTML = data + "(" + month + "/" + day + "/" + year + ")";

  //var weatherLogo = document.createElement("img");
  var weatheImgSrc = data.current.condition.icon;
  currentPicEl.setAttribute("src", weatheImgSrc);
  
  currentTempEl.innerHTML =
    "Temperature : " +
    data.current.temp_c +
    " and in far " +
    data.current.temp_f;
  currentHumidityEl.innerHTML = "Humidity : " + data.current.humidity;
  currentWindEl.innerHTML = "Wind speed is : " + data.current.wind_mph;
  currentUVEl.innerHTML = "UV index : " + data.current.uv;

  var lat = data.location.lat;
  var lon = data.location.lon;

  // var UVQueryURL =
  //   "http://api.weatherapi.com/v1/forecast.json?key=fcb06e8650a24aa8a2a205327230304&q=" +
  //   lat +
  //   "&lon=" +
  //   lon +
  //   "&appid=";
  // fetch(UVQueryURL).then(function (response) {
  //   var uvIndex = document.createElement("span");

  //   if (data.current.uv < 4) {
  //     uvIndex.setAttribute("class", "badge badge-success");
  //   } else if (data.current.uv < 8) {
  //     uvIndex.setAttribute("class", "badge badge-warning");
  //   } else {
  //     uvIndex.setAttribute("class", "badge badge-danger");
  //   }
  //   //console.log(data);
  //   uvIndex.innerHTML = response.data;
  //   currentUVEl.innerHTML = "UV-Index";
  //   currentUVEl.append(uvIndex);
  // });

  var cityCode = data.location.name;
  var forecastUrl =
    "http://api.weatherapi.com/v1/forecast.json?key=fcb06e8650a24aa8a2a205327230304&q=" +
    cityCode +
    "&days=6&aqi=no&alerts=no";

  fetch(forecastUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (forecastData) {
        console.log(forecastData);
        fivedayEl.classList.remove("d-none");
        var forecastEl = document.querySelectorAll(".forecast");
        var forcastDetails = forecastData.forecast.forecastday; 
        for (var i = 1; i < forcastDetails.length; i++) {
          //forecastEl[i].innerHTML = "";
          var forecastDateEl = document.createElement("p");
          var forecastDate = forecastData.forecast.forecastday[i].date.split("-"); 
          var forecastDay = forecastDate[2];
          var forecastMonth = forecastDate[1];
          var forecastYear = forecastDate[0];

          forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
          forecastDateEl.innerHTML =
            forecastMonth + "/" + forecastDay + "/" + forecastYear;
          forecastEl[i-1].append(forecastDateEl);

          var forecastWeatherEl = document.createElement("img");
          var imgSrc = forecastData.forecast.forecastday[i].day.condition.icon;
          forecastWeatherEl.setAttribute("src", imgSrc);
          forecastEl[i-1].append(forecastWeatherEl);

          var forecastTempEl = document.createElement("p");
          forecastTempEl.innerHTML =
            "Temp: " + kelvin2F(forecastData.forecast.forecastday[i].day.avgtemp_c);
          forecastEl[i-1].append(forecastTempEl);

          var forecastHumidityEl = document.createElement("p");
          forecastHumidityEl.innerHTML =
            "Humidity: " + forecastData.forecast.forecastday[i].day.avghumidity + "%";
          forecastEl[i-1].append(forecastHumidityEl);
        }
      });
    }
  });
}

function kelvin2F(K) {
  return Math.floor((K - 273.15) * 1.8 + 32);
}
searchEl.addEventListener("click", function () {
  var searchCity = cityEl.value;
  getweather(searchCity);
  searchHistory.push(searchCity);
  localStorage.setItem("search", JSON.stringify(searchHistory));
  getSearchHistory();
});

function getSearchHistory() {
  for (var i = 0; i < searchHistory.length; i++) {
    var searchedHistoryItem = document.createElement("li");
    // searchedHistoryItem.setAttribute("type", "text");
    searchedHistoryItem.setAttribute("readOnly", true);
    searchedHistoryItem.setAttribute("class", "form-control bg-white d-block");
    searchedHistoryItem.setAttribute("value", searchHistory[i]);

    searchedHistoryItem.addEventListener("click", function () {
      getweather(searchedHistoryItem.value);
    });
    historyEl.append(searchedHistoryItem);
  }
}

getSearchHistory();
