document.addEventListener("DOMContentLoaded", () => {
  const streetViewDiv = document.getElementById('street-view')
  const playerNameForm = document.getElementById('player-name-form')
  const playerNameInput = document.getElementById('player-name-input')
  const userInfoPanel = document.getElementById('user-info')

  let numClicks = 0

  let clickLimit = 10 // will need to find a way to set this

  playerNameForm.addEventListener("submit", (event) => {
    event.preventDefault()
    const playerNameSubmission = playerNameInput.value
    console.log(playerNameSubmission)

    fetch("API URL FOR ALL PLAYERS", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        playerName: playerNameSubmission
      })
    })
    event.target.reset()

  })

  streetViewDiv.addEventListener("click", (event) => {
    if(numClicks < clickLimit){
      numClicks++
      console.log(numClicks);
      console.log(clickLimit);
      userInfoPanel.innerHTML = ""
      const userInfoPTag = document.createElement("p")
      userInfoPTag.innerText = `You have moved ${numClicks} times and have ${clickLimit-numClicks} moves left!`
      userInfoPanel.appendChild(userInfoPTag)
    }
    else {

      userInfoPanel.innerHTML = ""
      const gaveOverMessage = document.createElement("p")
      gaveOverMessage.innerText = "Game Over Sucker!!"
      userInfoPanel.appendChild(gaveOverMessage)
      streetViewDiv.innerHTML = ""
      // fetch("API URL")
      // break the game
    }
  })

})

// LONGITUDE -180 to + 180
function generateRandomLong() {
  let num = (Math.random()*180).toFixed(3);
  let posorneg = Math.floor(Math.random());
  if (posorneg == 0) {
      num = num * -1;
  }
  return num;
  console.log(num)
}
// LATITUDE -90 to +90
function generateRandomLat() {
  let num = (Math.random()*90).toFixed(3);
  let posorneg = Math.floor(Math.random());
  if (posorneg == 0) {
      num = num * -1;
  }
  return num;
  console.log(num)
}
