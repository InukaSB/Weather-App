window.addEventListener('load', () => {
   let long;
   let lat;
   let temperatureDescription = document.querySelector('.temperature-discription');
   let temperatureDegree = document.querySelector('.temperature-degree');
   let locationTimezone = document.querySelector('.location-timezone');
   let temperatureSection = document.querySelector('.temperature');
   let locationHumidity = document.querySelector('.humidity');
   let locationWindspeed = document.querySelector('.windspeed');
   let locationUVIndex = document.querySelector('.UVIndex');
   let locationWindSection = document.querySelector('.wind-section');
   const temperatureSpan = document.querySelector('.temperature .active');
   const temperatureSpanNonActive = document.querySelector('.temperature .not-active');
   const windSpan = document.querySelector('.wind-section .now');
   const windSpanNext = document.querySelector('.wind-section .next');
   const sound = document.querySelector('.sound');


   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
         long = position.coords.longitude;
         lat = position.coords.latitude;

         const proxy = "https://cors-anywhere.herokuapp.com/";
         const api = `${proxy}https://api.darksky.net/forecast/ffaa6cee76469a3b80ef8e2d5766bdc0/${lat},${long}`;

         fetch(api)
            .then(response => {
               return response.json();
            })
            .then(data => {
               console.log(data);
               const { temperature, summary, icon, humidity, uvIndex, windSpeed } = data.currently;
               // set DOM Elements from the API

               temperatureDegree.textContent = Math.floor(temperature);
               temperatureDescription.textContent = summary;
               locationTimezone.textContent = data.timezone;
               locationHumidity.textContent = (humidity * 100);
               locationWindspeed.textContent = Math.floor(windSpeed);
               locationUVIndex.textContent = uvIndex;

               //Formula for celcius

               let celsius = (temperature - 32) * (5 / 9);
               let kmh = (windSpeed * 1.609);

               //Set Icon
               setIcons(icon, document.querySelector('.icon'));

               //change temperature to Celcius/Faranheit
               temperatureSection.addEventListener('click', ()=>{
                  if(temperatureSpan.textContent === "°F"){
                     temperatureSpan.textContent ="°C";
                     temperatureSpanNonActive.textContent = "| °F";
                     temperatureDegree.textContent = Math.floor(celsius);
                     sound.currentTime = 0;
                     sound.play();
                  } else {
                     temperatureSpan.textContent ="°F";
                     temperatureDegree.textContent = Math.floor(temperature);
                     temperatureSpanNonActive.textContent = "| °C";
                     sound.currentTime = 0;
                     sound.play();
                  }
               }); 

               locationWindSection.addEventListener('click', () =>{
                  if(windSpan.textContent === "mph"){
                     windSpan.textContent = "km/h";
                     windSpanNext.textContent = "| mph";
                     locationWindspeed.textContent = Math.floor(kmh);
                     sound.currentTime = 0;
                     sound.play();

                  } else {
                     windSpan.textContent = "mph";
                     windSpanNext.textContent = "| km/h";
                     locationWindspeed.textContent = Math.floor(windSpeed);
                     sound.currentTime = 0;
                     sound.play();
                  }
               });
            });
      });
   }

   function setIcons(icon, iconID){
      const skycons = new Skycons({color:"black"});
      const currentIcon = icon.replace(/-/g, "_").toUpperCase();
      skycons.play();
      return skycons.set(iconID, Skycons[currentIcon]);
   }

});