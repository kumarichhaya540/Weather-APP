// 🔑 OpenWeather API Key
const apiKey = "9004090da7b3b52dc715d3d34aa8655a";

// 🎵 Rain Sound
const rainSound = new Audio("rain.mp3");
rainSound.loop = true;

// 🌤 Get weather by city
function getWeather() {
  const city = document.getElementById("city").value.trim();
  const result = document.getElementById("result");

  if (city === "") {
    result.innerHTML = "⚠ Please enter city name";
    return;
  }

  showLoader();
  stopEffects();

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) {
        result.innerHTML = "❌ City not found";
        return;
      }
      displayWeather(data);
    })
    .catch(() => {
      result.innerHTML = "⚠ Error fetching data";
    });
}

// 📍 Auto Location Weather
function getLocationWeather() {
  if (!navigator.geolocation) {
    document.getElementById("result").innerHTML = "❌ Location not supported";
    return;
  }

  showLoader();
  stopEffects();

  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude, longitude } = pos.coords;

      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
        .then(res => res.json())
        .then(data => displayWeather(data))
        .catch(() => {
          document.getElementById("result").innerHTML = "⚠ Location error";
        });
    },
    () => {
      document.getElementById("result").innerHTML = "❌ Permission denied";
    }
  );
}

// 🌙 Dark Mode
function toggleDark() {
  document.body.classList.toggle("dark");
}

// 🌧 ❄ 🌡 DISPLAY WEATHER (ONLY ONE FUNCTION)
function displayWeather(data) {
  const temp = data.main.temp;
  const condition = data.weather[0].main;

  let icon = "☀";
  let tip = "";

  // 🔄 Reset everything
  document.body.classList.remove("cold", "normal", "hot");
  stopEffects();

  // 🌡 Temperature-based background + tips
  if (temp < 15) {
    document.body.classList.add("cold");
    tip = "❄ Wear warm clothes 🧥";
  } else if (temp <= 30) {
    document.body.classList.add("normal");
    tip = "🌤 Weather is pleasant 😊";
  } else {
    document.body.classList.add("hot");
    tip = "🔥 Stay hydrated 💧";
  }

  // 🌦 Weather condition effects
  if (condition === "Rain") {
    icon = "🌧";
    tip = "🌧 Carry an umbrella ☔";
    startRain();
    rainSound.play();
  } 
  else if (condition === "Snow") {
    icon = "❄";
    startSnow();
  } 
  else if (condition === "Clouds") {
    icon = "☁";
  }

  document.getElementById("result").innerHTML = `
    <div class="weather-icon">${icon}</div>
    <h2>${data.name}</h2>
    <h3>🌡 ${temp} °C</h3>

    <p>🌬 Wind Speed: ${data.wind.speed} m/s</p>
    <p>📈 Pressure: ${data.main.pressure} hPa</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>

    <div class="tip">${tip}</div>
  `;
}

// ⏳ Loader
function showLoader() {
  document.getElementById("result").innerHTML = `<div class="loader"></div>`;
}

// 🛑 Stop effects
function stopEffects() {
  rainSound.pause();
  rainSound.currentTime = 0;

  document.querySelector(".rain")?.remove();
  document.querySelector(".snow")?.remove();
}

// 🌧 Rain Animation
function startRain() {
  const rain = document.createElement("div");
  rain.className = "rain";

  for (let i = 0; i < 100; i++) {
    const drop = document.createElement("span");
    drop.style.left = Math.random() * 100 + "vw";
    drop.style.animationDuration = 0.5 + Math.random() + "s";
    rain.appendChild(drop);
  }

  document.body.appendChild(rain);
}

// ❄ Snow Animation
function startSnow() {
  const snow = document.createElement("div");
  snow.className = "snow";

  for (let i = 0; i < 80; i++) {
    const flake = document.createElement("span");
    flake.style.left = Math.random() * 100 + "vw";
    flake.style.animationDuration = 5 + Math.random() * 5 + "s";
    snow.appendChild(flake);
  }

  document.body.appendChild(snow);
}
