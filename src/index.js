let COORDS;
let LAND;
let NUMCLICKS = -1;
let CURRENTPOS;
let CLICKLIMIT = 1;

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
      COORDS = data.l[Object.keys(data.l)[Object.keys(data.l).length - 1]];
      panorama = new google.maps.StreetViewPanorama(document.getElementById("street-view"), {
        position: COORDS,
        pov: {heading: 90, pitch: 0},
        zoom: 1,
        visible: true,
        disableDefaultUI: true
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
        fetch(`http://localhost:3000/api/v1/players/${currentPlayerId}`, {
          method: "PATCH",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            alive: false
          })
        })

      } // end of game over fn

      panorama.addListener('position_changed', function() {
        console.log(NUMCLICKS);
        NUMCLICKS += 1;
        if (NUMCLICKS > 0) {
          CURRENTPOS = panorama.getPosition() + '';
          console.log(CURRENTPOS); // use the new coordinate to search for safe zone nearby
          DESTINATION = 'public restroom';

          fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${DESTINATION.replace(' ', '%20')}&inputtype=textquery&fields=name&locationbias=circle:50@${CURRENTPOS.lat},${CURRENTPOS.lng}&key=AIzaSyB_yMFLGXez8NFy6V2LUVe3Fk3lldgvkHI`)
            .then(resp => resp.json())
            .then(placeSearchResultJSON => {
              // if (placeSearchResultJSON.status === "OK") {
              //   (function youWon() => {
                  document.getElementById('map-canvas').innerHTML = `<div>you made it!</div>`;
                // })();
              // }
            })
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
        console.error("Street View data not found for this location.");
        attempts++;
        console.log(attempts);
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

  // $('#loading')[0].innerText.split('').forEach(l => console.log(l))
  $('#loading')[0].innerText.split('').forEach(el => setTimeout(function(animationName, callback) {
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
  }, Math.random()*2000, 'slideInLeft'));

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
    welcomeName = document.createElement('div');
    welcomeName.className += 'welcome-text-first';
    welcomeName.innerText = `welcome, ${playerNameSubmission}...`;
    document.getElementById('concealer').appendChild(welcomeName);

    welcomeAgeAndGender = document.createElement('div');
    welcomeAgeAndGender.className += 'welcome-text-second';
    welcomeAgeAndGender.innerText = `you are a ${PLAYERAGE}-year old ${PLAYERGENDER === "male" ? "man" : "woman" } in the faraway country of ${LAND.attributes.name} ...`;
    document.getElementById('concealer').appendChild(welcomeAgeAndGender)

    welcomeFinish = document.createElement('div');
    welcomeFinish.className += 'welcome-text-third';
    welcomeFinish.innerText = `your mission is to find DESSTINATEIONNN within ${CLICKLIMIT} moves`;
    document.getElementById('concealer').appendChild(welcomeFinish)


    $("#concealer").fadeIn(0, function() {
       setTimeout(function () {
           $("#concealer").fadeOut(3000);
       }, 10000);
   });

   document.getElementById('left-panel').innerHTML = `<ul><li>name: ${playerNameSubmission}</li><li id="steps-taken">steps taken: ${NUMCLICKS}</li><li id="moves-left">moves left: ${CLICKLIMIT-NUMCLICKS}</li></ul>`;

  })// end of form event listener

  document.addEventListener('click', e => {
    console.log('asdfas')
    document.getElementById('steps-taken').innerText = `steps taken: ${NUMCLICKS}`;
    document.getElementById('moves-left').innerText = `moves left: ${CLICKLIMIT-NUMCLICKS}`;
  })

  function createNewPlayer(playerNameSubmission){
    PLAYERAGE = randomPlayerAge()
    PLAYERGENDER = randomPlayerGender()
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
        latitude: COORDS["lat"],
        longitude: COORDS["lng"]
      })
    })
    .then(response => response.json())
    .then(playerJSON => {
      CURRENTPLAYER = playerJSON["data"];
      let url = `http://api.population.io:80/1.0/life-expectancy/remaining/${playerJSON.data.attributes.gender}/${LAND.attributes.name.replace(' ', '%20')}/2001-05-11/${playerJSON.data.attributes.age}y0m/`;
      fetch(url)
        .then(resp => resp.json())
        .then(lifeExpJSON => {
          CLICKLIMIT = Math.ceil(lifeExpJSON.remaining_life_expectancy);
          document.getElementById('moves-left').innerText = `moves left: ${CLICKLIMIT-NUMCLICKS}`;
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
