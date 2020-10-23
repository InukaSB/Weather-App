window.addEventListener('load', () => {
   let long;
   let lat;
   let longShort;
   let latShort;
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

   let darkMode = document.querySelector('.darkMode');
   const currentDate = new Date();
   const hourNow = currentDate.getHours();
   const minuteNow = currentDate.getMinutes();
   const secondsNow = currentDate.getSeconds();
   const timeNow = hourNow + ":" + minuteNow + ":" + secondsNow;
   const timeNowOneLine = timeNow.replace(/:/g, "");

   // var hourNow = getHours();
   // var minuteNow = getMinutes();
   // var timeNow = hourNow + ":" + minuteNow;

   console.log(timeNowOneLine);



   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
         long = position.coords.longitude;
         lat = position.coords.latitude;
         longShort = long.toFixed(6);
         latShort = lat.toFixed(6);


         const proxy = "https://cors-anywhere.herokuapp.com/";
         const api = `${proxy}https://api.darksky.net/forecast/ffaa6cee76469a3b80ef8e2d5766bdc0/${latShort},${longShort}`;
         const sunPositionApi = "https://api.sunrise-sunset.org/json?lat=" + latShort + "&lng=" + longShort;
         // const sunPositionApi = `https://rapidapi.p.rapidapi.com/api/sun/?latitude=${lat}&longitude=-${long}`



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

               console.log("lat:" + latShort);
               console.log("long:" + longShort);

               //Formula for celcius

               let celsius = (temperature - 32) * (5 / 9);
               let kmh = (windSpeed * 1.609);

               //Set Icon

               setIcons(icon, document.querySelector('.icon'), "white");


               // switch color mode
               darkMode.addEventListener('click', () => {

                  if (document.querySelector(".darkMode p").textContent == "Dark Mode") {
                     document.body.style.color = "white";
                     document.body.style.background = "#12505f";
                     document.querySelector(".app").style.background = "rgb(32, 32, 32)";
                     document.querySelector(".darkMode p").textContent = "Light Mode";
                     setIcons(icon, document.querySelector('.icon'), "white");
                     // document.querySelector(".darkMode").style.background = "white";
                     // document.querySelector(".darkMode p").style.color = "black";
                  } else {
                     document.body.style.color = "black";
                     document.body.style.background = "#6dd5ed";
                     document.querySelector(".app").style.background = "white";
                     document.querySelector(".darkMode p").textContent = "Dark Mode";
                     setIcons(icon, document.querySelector('.icon'), "black");                     // document.querySelector(".darkMode").style.background = "rgb(32, 32, 32)";
                     // document.querySelector(".darkMode p").style.color = "white";
                  }

               });


               //change temperature to Celcius/Faranheit
               temperatureSection.addEventListener('click', () => {
                  if (temperatureSpan.textContent === "°F") {
                     temperatureSpan.textContent = "°C";
                     temperatureSpanNonActive.textContent = "| °F";
                     temperatureDegree.textContent = Math.floor(celsius);
                     sound.currentTime = 0;
                     sound.play();
                  } else {
                     temperatureSpan.textContent = "°F";
                     temperatureDegree.textContent = Math.floor(temperature);
                     temperatureSpanNonActive.textContent = "| °C";
                     sound.currentTime = 0;
                     sound.play();
                  }
               });

               locationWindSection.addEventListener('click', () => {
                  if (windSpan.textContent === "mph") {
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

               // color Mode babsed on time

               // fetch(sunPositionApi, {
               //    "method": "GET",
               //    "headers": {
               //       "x-rapidapi-host": "sun.p.rapidapi.com",
               //       "x-rapidapi-key": "b1d2e3fa49msh854c1a5ae21195bp18bdb3jsna0d87843d988"
               //    }
               // })

               fetch(sunPositionApi)
                  .then(response => {
                     return response.json();
                  })
                  .then(data => {
                     console.log(data);
                     const { sunrise, sunset } = data.results;
                     const sunriseTime = replaceSunPositionText(sunrise);
                     const sunsetTime = replaceSunPositionText(sunset);

                     console.log("sunset:" + sunsetTime);
                     console.log('sunrise:' + sunriseTime);

                     if (timeNowOneLine >= sunsetTime && timeNowOneLine < sunriseTime) {
                        document.body.style.color = "white";
                        document.body.style.background = "#12505f";
                        document.querySelector(".app").style.background = "rgb(32, 32, 32)";
                        document.querySelector(".darkMode p").textContent = "Light Mode";
                        setIcons(icon, document.querySelector('.icon'), "white");
                        // document.querySelector(".darkMode").style.background = "white";
                        // document.querySelector(".darkMode p").style.color = "black";
                     } else {
                        document.body.style.color = "black";
                        document.body.style.background = "#6dd5ed";
                        document.querySelector(".app").style.background = "white";
                        document.querySelector(".darkMode p").textContent = "Dark Mode";
                        setIcons(icon, document.querySelector('.icon'), "black");                     // document.querySelector(".darkMode").style.background = "rgb(32, 32, 32)";
                        // document.querySelector(".darkMode p").style.color = "white";
                     }
                  });



            });
      });
   }

   function setIcons(icon, iconID, color) {
      const skycons = new Skycons({ color: color });
      const currentIcon = icon.replace(/-/g, "_").toUpperCase();
      skycons.play();
      return skycons.set(iconID, Skycons[currentIcon]);
   }

   function replaceSunPositionText(sunPosition) {
      return currentText = sunPosition.replace(/:/g, "").replace(/ /, "").replace("PM", "").replace("AM", "");

   }


});