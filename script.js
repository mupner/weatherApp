const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const weatherResult = document.getElementById("weather-result");
const unitToggle = document.getElementById("unit-toggle");
let lastData = null;
let isCelsius = true;

// https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=a67c45d51fa14e1a316ed4af70aea3a8&units=metric&lang=pt-br

const API_KEY = "a67c45d51fa14e1a316ed4af70aea3a8";

function getLocationWeather() {
  if (!navigator.geolocation) return; // browser doesn't support it

  navigator.geolocation.displayWeather;

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

      weatherResult.innerHTML = '<div class="spinner"></div>';

      try {
        const response = await fetch(url);
        const data = await response.json();
        displayWeather(data);
      } catch (error) {
        weatherResult.innerHTML = `<p class="error">❌ Could not fetch location weather.</p>`;
      }
    },
    () => {
      // user denied location — fail silently, no error shown
    },
  );
}

// call it when page loads
getLocationWeather();

function displayWeather(data) {
  lastData = data;

  const city = data.name;
  const country = data.sys.country;
  const temp = isCelsius
    ? Math.round(data.main.temp)
    : Math.round((data.main.temp * 9) / 5 + 32);
  const feelsLike = isCelsius
    ? Math.round(data.main.feels_like)
    : Math.round((data.main.feels_like * 9) / 5 + 32);
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const description = data.weather[0].description;
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  const unit = isCelsius ? "°C" : "°F";

  weatherResult.innerHTML = `
    <div class="weather-card">
      <h2>${city}, ${country}</h2>
      <img src="${iconUrl}" alt="${description}" />
      <p class="description">${description}</p>
      <p class="temp">${temp}${unit}</p>
      <div class="details">
        <div class="detail-item">
          <span class="detail-label">Feels Like</span>
          <span class="detail-value">${feelsLike}${unit}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Humidity</span>
          <span class="detail-value">${humidity}%</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Wind</span>
          <span class="detail-value">${windSpeed} m/s</span>
        </div>
      </div>
      <button id="unit-toggle">${isCelsius ? "Switch to °F" : "Switch to °C"}</button>
    </div>
  `;

  document.getElementById("unit-toggle").addEventListener("click", () => {
    isCelsius = !isCelsius;
    displayWeather(lastData);
  });
}

async function fetchWeather(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${API_KEY}&units=metric`;

    weatherResult.innerHTML = '<div class="spinner"></div>';

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();

    displayWeather(data);

    lastData = data;

    console.log(data);
  } catch (error) {
    weatherResult.innerHTML = `<p class="error">❌ ${error.message}</p>`;
  }
}

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();

  if (city === "") {
    weatherResult.innerHTML = "<p style='color: red;'>Please enter a city</p>";
    return;
  }

  fetchWeather(city);
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchBtn.click();
  }
});
