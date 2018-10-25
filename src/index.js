let COORDS;
let LAND;
let NUMCLICKS = -1;
let CURRENTPOS;
let CLICKLIMIT = 5;

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
        visible: true
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

      function clicksUnderLimitFn(){
        document.getElementById('steps-taken').innerText = `steps taken: ${NUMCLICKS}`;
        document.getElementById('moves-left').innerText = `moves left: ${CLICKLIMIT-NUMCLICKS}`;
      }

      function gameOverFn() {
        let lastUserData
        let allUserData
        document.getElementById('left-panel').innerHTML = ""
        const gaveOverMessage = document.createElement("p")
        gaveOverMessage.innerText = "Game Over Sucker!!"
        document.getElementById('map-canvas').appendChild(gaveOverMessage)
        streetViewDiv.innerHTML = ""
        const gameOverImg = document.createElement("img")
        gameOverImg.src = "https://www.moma.org/media/W1siZiIsIjE2NTQ1NyJdLFsicCIsImNvbnZlcnQiLCItcmVzaXplIDIwMDB4MjAwMFx1MDAzZSJdXQ.jpg?sha=33c151dba7f8de4c"
        streetViewDiv.appendChild(gameOverImg)

        const currentPlayerId = currentPlayer.id
        console.log(currentPlayer);
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

      }// end of game over fn

      panorama.addListener('position_changed', function() {
        console.log(NUMCLICKS);
        NUMCLICKS += 1;
        if (NUMCLICKS > 0) {
          CURRENTPOS = panorama.getPosition() + '';
          console.log(CURRENTPOS); // use the new coordinate to search for safe zone nearby
          clicksUnderLimitFn();
        }
        movementLogic();
      });



      $('#name-prompt').fadeIn('slow');
      $('#player-name-form').fadeIn('slow');
    } else {
      if (attempts > 15) {
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
  // init();
  const streetViewDiv = document.getElementById("street-view")
  const playerNameForm = document.getElementById("player-name-form")
  const playerNameInput = document.getElementById("player-name-input")
  const userInfoPanel = document.getElementById("left-panel")
  const userStatsPanel = document.getElementById("user-stats")

  let playerNameSubmission

  let currentPlayer

  playerNameForm.addEventListener("submit", event => {
    event.preventDefault();
    playerNameSubmission = playerNameInput.value;
    $('#concealer').fadeOut('slow');
    createNewPlayer(playerNameSubmission);
    $('#temp').fadeOut('slow');

    userInfoPanel.innerHTML = `<ul><li>name: ${playerNameSubmission}</li><li id="steps-taken">steps taken: ${NUMCLICKS}</li><li id="moves-left">moves left: ${CLICKLIMIT-NUMCLICKS}</li></ul>`;
  })// end of form event listener



  // let mouseWasDragged = false
  streetViewDiv.addEventListener("mousedown", (event) => {
    let mouseWasDragged = false
    event.target.addEventListener("mousemove", (event) => {
      mouseWasDragged = true
      console.log(mouseWasDragged);
    })
    event.target.addEventListener("mouseup", (event) => {
      if (!mouseWasDragged) {
        movementLogic()
      }
    })
  })



  function createNewPlayer(playerNameSubmission){
    const randPlayerAge = randomPlayerAge()
    const randPlayerGender = randomPlayerGender()
    fetch("http://localhost:3000/api/v1/players", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: playerNameSubmission,
        age: randPlayerAge,
        gender: randPlayerGender,
        latitude: COORDS["lat"],
        longitude: COORDS["lng"]
      })
    })
    .then(response => response.json())
    .then(currentPlayerRes => {
      currentPlayer = currentPlayerRes["data"]
    })


  }// end of create new player function



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
