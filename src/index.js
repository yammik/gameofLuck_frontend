let COORDS;
let LAND;
let NUMCLICKS = -1;
let CURRENTPOS;
let CLICKLIMIT = 1;

DESTINATIONS = `accounting
airport
amusement_park
aquarium
art_gallery
atm
bakery
bank
bar
beauty_salon
bicycle_store
book_store
bowling_alley
bus_station
cafe
campground
car_dealer
car_rental
car_repair
car_wash
casino
cemetery
church
city_hall
clothing_store
convenience_store
courthouse
dentist
department_store
doctor
electrician
electronics_store
embassy
fire_station
florist
funeral_home
furniture_store
gas_station
gym
hair_care
hardware_store
hindu_temple
home_goods_store
hospital
insurance_agency
jewelry_store
laundry
lawyer
library
liquor_store
local_government_office
locksmith
lodging
meal_delivery
meal_takeaway
mosque
movie_rental
movie_theater
moving_company
museum
night_club
painter
park
parking
pet_store
pharmacy
physiotherapist
plumber
police
post_office
real_estate_agency
restaurant
roofing_contractor
rv_park
school
shoe_store
shopping_mall
spa
stadium
storage
store
subway_station
supermarket
synagogue
taxi_stand
train_station
transit_station
travel_agency
veterinary_care
zoo`.split('\n');

DESTINATION = DESTINATIONS[Math.floor(Math.random()*DESTINATIONS.length)];

// Math.ceil(Math.random() * 75)

var TxtType = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtType.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
  this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
  this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

  var that = this;
  var delta = 200 - Math.random() * 100;

  if (this.isDeleting) { delta /= 2; }

  if (!this.isDeleting && this.txt === fullTxt) {
  delta = this.period;
  this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
  this.isDeleting = false;
  this.loopNum++;
  delta = 500;
  }

  setTimeout(function() {
  that.tick();
  }, delta);
};

window.onload = function() {
  var elements = document.getElementsByClassName('typewrite');
  for (var i=0; i<elements.length; i++) {
      var toRotate = elements[i].getAttribute('data-type');
      var period = elements[i].getAttribute('data-period');
      if (toRotate) {
        new TxtType(elements[i], JSON.parse(toRotate), period);
      }
  }
  // INJECT CSS
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
  document.body.appendChild(css);
};

function init() {
  let attempts = 0;
  let panorama;

  function generateRandomLong(lonMin, lonMax) {
    return (Math.random()*(lonMax-lonMin)) + lonMin;
  }

  function generateRandomLat(latMin, latMax) {
    return (Math.random()*(latMax-latMin)) + latMin;
  }

  function getCoords(country) {
    const sv = new google.maps.StreetViewService();
    let coordinates = {lat: generateRandomLat(country.bounds["lat-min"], country.bounds["lat-max"]), lng: generateRandomLong(country.bounds["lon-min"], country.bounds["lon-max"])};
    sv.getPanorama({location: coordinates, radius: 50}, processSVData);
  }

  function processSVData(data, status) {
    if (status === "OK") {
      console.log("ready");
      attempts = 0;
      // COORDS = data.l[Object.keys(data.l)[Object.keys(data.l).length - 1]];
      COORDS = {lat: 40.77355807282662, lng: -73.95148553085232}
      panorama = new google.maps.StreetViewPanorama(document.getElementById("street-view"), {
        position: COORDS,
        pov: {heading: 90, pitch: 0},
        zoom: 1,
        visible: true,
        disableDefaultUI: true,
        showRoadLabels: false
      });

      function movementLogic() {
        if(NUMCLICKS < CLICKLIMIT){
          clicksUnderLimitFn()
        }
        else {
          gameOverFn()
          // break the game
        }
      }// end of movement logic

      function clicksUnderLimitFn() {
        document.getElementById('steps-taken').innerText = `steps taken: ${NUMCLICKS}`;
        document.getElementById('moves-left').innerText = `moves left: ${CLICKLIMIT-NUMCLICKS}`;
      }

      function gameOverFn() {
        let lastUserData;
        let allUserData;
        document.getElementById('left-panel').innerHTML = ""
        const gaveOverMessage = document.createElement("div")
        gaveOverMessage.innerText = "gg no re";
        document.getElementById('left-panel').appendChild(gaveOverMessage)
        document.getElementById('street-view').innerHTML = ""
        const gameOverImg = document.createElement("img")
        gameOverImg.src = "https://www.moma.org/media/W1siZiIsIjE2NTQ1NyJdLFsicCIsImNvbnZlcnQiLCItcmVzaXplIDIwMDB4MjAwMFx1MDAzZSJdXQ.jpg?sha=33c151dba7f8de4c";
        gameOverImg.style = 'object-fit: cover; width: 100%';
        document.getElementById('street-view').appendChild(gameOverImg)

        const currentPlayerId = CURRENTPLAYER.id
        console.log(CURRENTPLAYER);
        console.log(currentPlayerId);

      } // end of game over fn

      function youWin(dest) {
        document.getElementById('title').innerText = 'wanderFOUND';
        document.getElementById('title').style += '-webkit-transform: translate(0px, 5px);';
        document.getElementById('left-panel').innerText = `you made it to ${dest.name}, at ${dest.vicinity}!`;
        document.getElementById('right-panel').innerText = 'feel free to explore more ;)';
        $("#left-panel").fadeOut(0, function() {
           setTimeout(function () {
               $("#left-panel").fadeIn(1000);
           }, 0);
        });
        $("#right-panel").fadeOut(0, function() {
           setTimeout(function () {
               $("#right-panel").fadeIn(1000);
           }, 0);
        });

        fetch(`http://localhost:3000/api/v1/players/${currentPlayerId}`, {
          method: "PATCH",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            alive: true,
            latitude: CURRENTPOS.lat,
            longitude: CURRENTPOS.lng
          })
        })
      }

      panorama.addListener('position_changed', function() {
        console.log(NUMCLICKS);
        NUMCLICKS += 1;
        if (NUMCLICKS > 0) {
          CURRENTPOS = { lat: panorama.getPosition().lat(), lng: panorama.getPosition().lng() };
          console.log(CURRENTPOS);

          fetch("http://localhost:3000/api/v1/steps", {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              latitude: CURRENTPOS.lat,
              longitude: CURRENTPOS.lng,
              no_clicks: NUMCLICKS,
            })
          })

          var map;
          var infowindow;

        (function initMap() {
          let m = document.createElement('div');
          m.style = "display: none";
          m.id = "map";
          document.getElementById('street-view').appendChild(m);
          map = new google.maps.Map(document.getElementById('map'), {
            center: CURRENTPOS,
            zoom: 15
          });

          infowindow = new google.maps.InfoWindow();
          var service = new google.maps.places.PlacesService(map);
          service.nearbySearch({
            location: CURRENTPOS,
            radius: 100,
            type: ['museum']
            // type: DESTINATION
          }, function(results, status) {
            if (status !== 'OK') return;
            // debugger
            let icon = document.createElement('img');
            icon.src = results[0].icon;
            icon.style = "width: 20px; height: 20px;"
            document.getElementById('right-panel').appendChild(icon);
            youWin(results[0]);
          });
        })()

        clicksUnderLimitFn();
        }
        movementLogic();
      });
      $('.lds-roller').fadeOut(1000);
      $('#loading').fadeOut(1000);
      $('#name-prompt').fadeIn(3000);
      $('#player-name-form').fadeIn(3000);
    } else {
      if (attempts > 50) {
        getCountry();
      } else {
        // console.error("Street View data not found for this location.");
        attempts++;
        // console.log(attempts);
        getCoords(LAND.attributes);
      }
    }
  }

  function getCountry() {
    fetch("http://localhost:3000/api/v1/countries")
    .then(resp => resp.json())
    .then(json => {
      LAND = json.data[Math.floor(Math.random() * json.data.length)];
      console.log(LAND.attributes.name);
      getCoords(LAND.attributes);
    })
  }

  getCountry();
}

document.addEventListener("DOMContentLoaded", () => {
  const playerNameForm = document.getElementById("player-name-form")
  const playerNameInput = document.getElementById("player-name-input")



  $('#title')[0].addEventListener('click', e => {
    window.location.reload();
  })

  let playerNameSubmission
  let CURRENTPLAYER;

  playerNameForm.addEventListener("submit", event => {
    event.preventDefault();
    playerNameSubmission = playerNameInput.value;
    $('#temp').fadeOut(3000);

    createNewPlayer(playerNameSubmission);


  })// end of form event listener

  document.addEventListener('click', e => {
    document.getElementById('steps-taken').innerText = `steps taken: ${NUMCLICKS}`;
    document.getElementById('moves-left').innerText = `moves left: ${CLICKLIMIT-NUMCLICKS}`;
  })

  function createNewPlayer(playerNameSubmission){
    PLAYERAGE = randomPlayerAge()
    PLAYERGENDER = randomPlayerGender()
    debugger
    fetch("http://localhost:3000/api/v1/players", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: playerNameSubmission,
        age: PLAYERAGE,
        gender: PLAYERGENDER,
        latitude: COORDS.lat,
        longitude: COORDS.lng
      })
    })
    .then(response => response.json())
    .then(playerJSON => {
      CURRENTPLAYER = playerJSON["data"];
      let url = `http://api.population.io:80/1.0/life-expectancy/remaining/${playerJSON.data.attributes.gender}/${LAND.attributes.name.replace(/ /g, '%20')}/2001-05-11/${playerJSON.data.attributes.age}y0m/`;
      fetch(url)
        .then(resp => resp.json())
        .then(lifeExpJSON => {
          CLICKLIMIT = Math.ceil(lifeExpJSON.remaining_life_expectancy) * 5;
          document.getElementById('moves-left').innerText = `moves left: ${CLICKLIMIT - NUMCLICKS}`;
          document.getElementById('goal').innerText = `you are looking for a ${DESTINATION.replace(/_/g, ' ')}`;
          welcomeName = document.createElement('div');
          welcomeName.className += 'welcome-text-first';
          welcomeName.innerText = `welcome, ${playerNameSubmission}...`;
          document.getElementById('concealer').appendChild(welcomeName);

          welcomeAgeAndGender = document.createElement('div');
          welcomeAgeAndGender.className += 'welcome-text-second';
          welcomeAgeAndGender.innerText = `you are a ${PLAYERAGE}-year old ${PLAYERGENDER === "male" ? "man" : "woman" } in the faraway country of ${LAND.attributes.name} ...`;
          document.getElementById('concealer').appendChild(welcomeAgeAndGender);

          welcomeFinish = document.createElement('div');
          welcomeFinish.className += 'welcome-text-third';
          welcomeFinish.innerText = `your mission is to find a ${DESTINATION.replace(/_/g, ' ')} within ${CLICKLIMIT} move${CLICKLIMIT > 1 ? 's' : ''}.`;
          document.getElementById('concealer').appendChild(welcomeFinish);

          welcomeFinish2 = document.createElement('div');
          welcomeFinish2.className += 'welcome-text-fourth';
          welcomeFinish2.innerText = `good luck, have fun!`;
          document.getElementById('concealer').appendChild(welcomeFinish2);

          $("#concealer").fadeIn(0, function() {
             setTimeout(function () {
                 $("#concealer").fadeOut(3000);
             }, 10000);
          });
          $("#display-name").fadeOut(0, function() {
             setTimeout(function () {
                 $("#display-name").fadeIn(3000);
             }, 8000);
          });
          $("#steps-taken").fadeOut(0, function() {
             setTimeout(function () {
                 $("#steps-taken").fadeIn(3000);
             }, 9000);
          });
          $("#moves-left").fadeOut(0, function() {
             setTimeout(function () {
                 $("#moves-left").fadeIn(3000);
             }, 10000);
          });
          $("#goal").fadeOut(0, function() {
             setTimeout(function () {
                 $("#goal").fadeIn(3000);
             }, 10000);
          });

         document.getElementById('left-panel').innerHTML = `<ul><li id="display-name" style="display: none">name: ${playerNameSubmission}</li><li id="steps-taken" style="display: none">steps taken: ${NUMCLICKS}</li><li id="moves-left" style="display: none">moves left: ${CLICKLIMIT-NUMCLICKS}</li></ul>`;
        })

    })
  }// end of create new player function

  $.fn.extend({
  animateCss: function(animationName, callback) {
    var animationEnd = (function(el) {
      var animations = {
        animation: 'animationend',
        OAnimation: 'oAnimationEnd',
        MozAnimation: 'mozAnimationEnd',
        WebkitAnimation: 'webkitAnimationEnd',
      };

      for (var t in animations) {
        if (el.style[t] !== undefined) {
          return animations[t];
        }
      }
    })(document.createElement('div'));

    this.addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass('animated ' + animationName);

      if (typeof callback === 'function') callback();
    });

    return this;
  },});
})// end of DOMContentLoaded eventlistener

function randomPlayerAge() {
  randNum = Math.floor(Math.random() * Math.floor(100))
  if (randNum > 1) {
    return randNum
  }
  else {
    randNum
  }
}

function randomPlayerGender() {
  randNumber = Math.random() * Math.floor(1)
  if (randNumber >= 0.5) {
    return "male"
  }
  else {
    return "female"
  }
}
