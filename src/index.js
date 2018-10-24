document.addEventListener("DOMContentLoaded", () => {
  const streetViewDiv = document.getElementById('street-view')
  const playerNameForm = document.getElementById('player-name-form')
  const playerNameInput = document.getElementById('player-name-input')
  const userInfoPanel = document.getElementById('user-info')

  let numClicks = 0

  let clickLimit = 10 // will need to find a way to set this
  let playerNameSubmission
  playerNameForm.addEventListener("submit", (event) => {
    event.preventDefault()
    playerNameSubmission = playerNameInput.value
    console.log(playerNameSubmission)

    LAT = 23523;

  // MAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAY
    // verify streetViewable (), determine country
    // *depending on country determination: fetch country data -> place age in age group in country's mortality distribution
  // MAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAY


  // SEANSEANSEANSEANSEANSEANSEANSEANSEAN
    // randomly generate age, gender

    // *depending on country determination: fetch country data -> decide how many clicks allowed based on: gender and mortality and income lvl of country
    // set up a demo player with predetermined country and gender and age and try above

    // fetch("API URL FOR ALL PLAYERS", {
    //   method: "POST",
    //   headers: {
    //     "Accept": "application/json",
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //     name: playerNameSubmission,
    //     age: ,
    //     gender: ,
    //     latitude: ,
    //     longitude:
    //   })
    // }) // use .then to get name and display on DOM

  // SEANSEANSEANSEANSEANSEANSEANSEANSEAN

  // MAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAY
      // use .then to change display streetview to show
  // MAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAYMAY

    event.target.reset()
  })

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

  function movementLogic() {
    if(numClicks < clickLimit){
      clicksUnderLimitFn()
    }
    else {
      gameOverFn()

      // break the game
    }
  }

  function clicksUnderLimitFn(){
    numClicks++

    userInfoPanel.innerHTML = ""
    const userInfoPTag = document.createElement("p")
    userInfoPTag.innerText = `Hello ${playerNameSubmission}, you have moved ${numClicks} times and have ${clickLimit-numClicks} moves left!`
    userInfoPanel.appendChild(userInfoPTag)

  }

  function gameOverFn() {
    userInfoPanel.innerHTML = ""
    const gaveOverMessage = document.createElement("p")
    gaveOverMessage.innerText = "Game Over Sucker!!"
    userInfoPanel.appendChild(gaveOverMessage)
    streetViewDiv.innerHTML = ""
    const gameOverImg = document.createElement("img")
    gameOverImg.src = "https://www.moma.org/media/W1siZiIsIjE2NTQ1NyJdLFsicCIsImNvbnZlcnQiLCItcmVzaXplIDIwMDB4MjAwMFx1MDAzZSJdXQ.jpg?sha=33c151dba7f8de4c"
    streetViewDiv.appendChild(gameOverImg)
    // fetch("API URL")
  }

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
