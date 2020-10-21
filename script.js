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
   const temperatureSpan = document.querySelector('.temperature span');


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

               temperatureDegree.textContent = temperature;
               temperatureDescription.textContent = summary;
               locationTimezone.textContent = data.timezone;
               locationHumidity.textContent = humidity;
               locationWindspeed.textContent = windSpeed;
               locationUVIndex.textContent = uvIndex;

               //Formula for celcius

               let celsius = (temperature - 32) * (5 / 9);

               //Set Icon
               setIcons(icon, document.querySelector('.icon'));

               //change temperature to Celcius/Faranheit
               temperatureSection.addEventListener('click', ()=>{
                  if(temperatureSpan.textContent === "°F"){
                     temperatureSpan.textContent ="°C";
                     temperatureDegree.textContent = Math.floor(celsius);
                  }else{
                     temperatureSpan.textContent ="°F";
                     temperatureDegree.textContent = temperature;
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