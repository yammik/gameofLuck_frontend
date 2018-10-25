W1024

#Frontend
- Streetview DOM should not appear until player enters name (= a game is created essentially)
<!-- - Set click numbers -->
+ Verify and identify location

#May
- UI design (May CSS)
+ street view verify coordinates
- double check click logic

#Sean
<!-- - Sean will create random generator for age, gender (before POST fetch for player) -->
<!-- - Sean will make sure POST to make new player works -->
<!-- - When game over, send PATCH request to update player's alive attribute to false and update player's step count to number of clicks on streetview -->
- find out if there's a way to pass in cooordinate and tie it to the geographical location
- make function to randomly generate number



- steps
  increment when click
  when
  set step limit

#Backend
1. May - Mortality distribution for females


#possible features
- randomly generated starbucks in high income countries for bonus steps



#URL to fetch every time user clicks:
- make sure to set goal upon init
- `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${GOAL}&inputtype=textquery&fields=formatted_address,name&locationbias=circle:50@${CURRENTPOS.lat},${CURRENTPOS.lng}&key=AIzaSyB_yMFLGXez8NFy6V2LUVe3Fk3lldgvkHI`
