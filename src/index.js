function init() {
  let panorama;
  let COORDS;
  let LAND;

  function generateRandomLong(lonMin, lonMax) {
    return (Math.random()*(lonMax-lonMin)) + lonMin;
  }
  function generateRandomLat(latMin, latMax) {
    return (Math.random()*(latMax-latMin)) + latMin;
  }


  function getCoords(country) {
    const sv = new google.maps.StreetViewService();
    // debugger
    sv.hasSV = false;
    let coordinates = {lat: generateRandomLat(country.bounds["lat-min"], country.bounds["lat-max"]), lng: generateRandomLong(country.bounds["lon-min"], country.bounds["lon-max"])};
    sv.getPanorama({location: coordinates, radius: 60}, processSVData);
    console.log(coordinates);
  }

  function processSVData(data, status) {
    if (status === "OK") {
      console.log(data);
      console.log("worked");
      COORDS = data.l[Object.keys(data.l)[Object.keys(data.l).length - 1]];
      // (function initialize() {
        panorama = new google.maps.StreetViewPanorama(document.getElementById("street-view"), {
          position: COORDS,
          pov: {heading: 165, pitch: 0},
          zoom: 1
        });
      // })()
      // debugger
    } else {
      console.error("Street View data not found for this location.");
      getCoords(LAND.attributes);
    }
  }

  fetch("http://localhost:3000/api/v1/countries")
  .then(resp => resp.json())
  .then(json => {
    // debugger
    LAND = json.data[Math.floor(Math.random() * json.data.length)];
    console.log(LAND.attributes.name);
    getCoords(LAND.attributes);
  })
}

document.addEventListener("DOMContentLoaded", () => {
  const streetViewDiv = document.getElementById("street-view")
  const playerNameForm = document.getElementById("player-name-form")
  const playerNameInput = document.getElementById("player-name-input")
  const userInfoPanel = document.getElementById("user-info")
  const userStatsPanel = document.getElementById("user-stats")

  let numClicks = 0

  let clickLimit = 20 // will need to find a way to set this
  let playerNameSubmission

  let currentPlayer

  playerNameForm.addEventListener("submit", (event) => {
    event.preventDefault()
    playerNameSubmission = playerNameInput.value

    createNewPlayer(playerNameSubmission)

  // MAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAY
    // verify streetViewable (), determine country
    // *depending on country determination: fetch country data -> place age in age group in country"s mortality distribution
  // MAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAY

  // MAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAY
      // use .then to change display streetview to show
  // MAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAY

    event.target.reset()
  })// end of form event listener

// MAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAY
  let mouseWasDragged = false
  streetViewDiv.addEventListener("mousedown", (event) => {
    mouseWasDragged = false
  })

  streetViewDiv.addEventListener("mousemove", (event) => {
    mouseWasDragged = true
  })

  streetViewDiv.addEventListener("mouseup", (event) => {
    if (!mouseWasDragged) {
      movementLogic()
    }
  })
// MAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAY

  function createNewPlayer(playerNameSubmission){
    const randPlayerAge = randomPlayerAge()
    const randPlayerGender = randomPlayerGender()
    const userStatsPTag = document.createElement("p")

    userStatsPTag.innerText = `Welcome ${playerNameSubmission}! You are a ${randPlayerGender} who is ${randPlayerAge} years old and is currently at latitude ${randLatitude} and longitude ${randLongitude}!`

    userStatsPanel.appendChild(userStatsPTag)
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
        latitude: randLatitude,
        longitude: randLongitude
      })
    })
    .then(response => response.json())
    .then( (currentPlayerRes) => {
      currentPlayer = currentPlayerRes["data"]
    })
  }// end of create new player function

  function movementLogic() {
    if(numClicks < clickLimit){
      clicksUnderLimitFn()
    }
    else {
      gameOverFn()

      // break the game
    }
  }// end of movement logic

  function clicksUnderLimitFn(){
    numClicks++

    userInfoPanel.innerHTML = ""
    const userInfoPTag = document.createElement("p")
    userInfoPTag.innerText = `Hello ${playerNameSubmission}, you have moved ${numClicks} times and have ${clickLimit-numClicks} moves left!`
    userInfoPanel.appendChild(userInfoPTag)

  }


  function gameOverFn() {
    let lastUserData
    let allUserData
    userInfoPanel.innerHTML = ""
    const gaveOverMessage = document.createElement("p")
    gaveOverMessage.innerText = "Game Over Sucker!!"
    userInfoPanel.appendChild(gaveOverMessage)
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
