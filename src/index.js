document.addEventListener("DOMContentLoaded", () => {
  const streetViewDiv = document.getElementById('street-view')
  const playerNameForm = document.getElementById('player-name-form')
  const playerNameInput = document.getElementById('player-name-input')
  const userInfoPanel = document.getElementById('user-info')
  const userStatsPanel = document.getElementById('user-stats')

  let numClicks = 0

  let clickLimit = 2 // will need to find a way to set this
  let playerNameSubmission

  let currentPlayer

  playerNameForm.addEventListener("submit", (event) => {
    event.preventDefault()
    playerNameSubmission = playerNameInput.value

    createNewPlayer(playerNameSubmission)

  // MAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAY
    // verify streetViewable (), determine country
    // *depending on country determination: fetch country data -> place age in age group in country's mortality distribution
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
    const randLatitude = generateRandomLat()
    const randLongitude = generateRandomLong()
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

// LONGITUDE -180 to + 180
function generateRandomLong() {
  let num = (Math.random()*180).toFixed(3);
  let posorneg = Math.floor(Math.random());
  if (posorneg == 0) {
      num = num * -1;
  }
  return num;
}
// LATITUDE -90 to +90
function generateRandomLat() {
  let num = (Math.random()*90).toFixed(3);
  let posorneg = Math.floor(Math.random());
  if (posorneg == 0) {
      num = num * -1;
  }
  return num;
}

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
