function city() {Add commentMore actions
    const cityName = document.getElementById("cityinput").value.trim();
    if (!cityName) {
      alert("Please enter a city name");
      return;
    }
    fetchWeather(cityName);
  }
  
  
  function getlocation() {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser.");
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        
        fetchWeather(`${lat},${lon}`);
      },
      () => {
        alert("Unable to get your location.");
      }
    );
  }
  
  
  function fetchWeather(location) {
    const url = `https://wttr.in/${encodeURIComponent(location)}?format=j1`;
  
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Network error");
        return response.json();
      })
      .then((data) => {
        const current = data.current_condition[0];
        document.getElementById("weather").innerHTML = `
          <h2>Weather in ${location}</h2>
          <p>🌡 Temperature: ${current.temp_C} °C</p>
          <p>☁️ Condition: ${current.weatherDesc[0].value}</p>
          <p>💧 Humidity: ${current.humidity}%</p>
        `;
      })
      .catch(() => {
        document.getElementById("weather").innerHTML =
          `<p style="color:red;">Could not fetch weather data.</p>`;
      });
  }