# WanderLost

### What it be
Wanderlost is an exploration game on Google Maps Street View. 

### For whom?
This game is for __those who have an itch to see the world, but have no time or money to do so__.

If you are one of these things : 

- University student who does not have a rich mom and/or dad
- Bootcamp student
- Grad student in the STEM field

<a/>
    Then this is for you. I made it for you. Because I was all of these. Hang in there, you'll make it. I'm with you.
   

Also might be for you if you have time _and_ money, but just...don't feel like getting out. ~~In which case, please re-evaluate your lifestyle.~~

### How do I play?

##### Step 0
Clone the [back end](https://github.com/yammik/wanderLost_backend) of this application and start the server per its Readme.
Then clone this repo and open `index.html`.

##### Step 1
Just think of a name. You can be called whatever you want.
But you won't be **whoever** you want. How painfully realistic is that? We tried to make this model the real world as much as possible, if you're willing to overlook the very minor detail about the player's near-instantaneous geographical teleportation.

##### Step 2
Once you're in, you, the player, will be assigned some details like **gender** and **age**, as well as **the country** you were dropped off in. The **number of moves** reflect the remaining life expectancy of your particular gender and age group in that country. So the younger you are in a well-off country, the more steps you'll be able to take, and so on.

The thing to look out for is your **destination**. This is totally random. Sometimes you get funny ones. When I was testing the app once, I was a 99-year old man named Asdf in Iceland looking for a funeral home. I had 15 steps, and was dropped off in the middle of a mountain. Needless to say, things did not end well for Asdf.

Oh, and if you're unlucky, you might end up **inside** a shop or someone's backyard and not be able to leave that spot. The working title for this app was originally 'Game of Luck'. I'll let you figure out why.

##### Step 3
Once the Streetview loads, just click around to explore as you normally would. Or you can use directional keys to navigate as well, but that is not recommended as you can't travel as far in one step that way.


### Gotchas
Google Places is mostly user-reported and specified data. What this means for our app is that a 65-year old work-at-home mom living in the middle of a cornfield can declare her home address a painter's studio, and that would count as a destination for the game if you were looking for a painter. We were not anticipating this issue, but we think this makes the game more fun. In a weird way. People are weird.
