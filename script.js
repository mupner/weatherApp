const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const weatherResult = document.getElementById("weather-result");

// https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=a67c45d51fa14e1a316ed4af70aea3a8&units=metric&lang=pt-br

const API_KEY = "a67c45d51fa14e1a316ed4af70aea3a8";

async function fetchWeather(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${API_KEY}&units=metric`;

    weatherResult.innerHTML = "<p>Loading...</p>";

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();
    console.log(data);

    weatherResult.innerHTML = `<p>Data received for <strong>${data.name}</strong>! Check the console</p>`;
  } catch (error) {
    weatherResult.innerHTML = `<p style="color: red;">${error.message}</p>`;
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
