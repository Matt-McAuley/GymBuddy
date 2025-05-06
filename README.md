# GymBuddy

## Contents

- [Description](#description)
- [Images](#images)
- [Running Locally](#running-locally-ios---requires-macbook-with-xcode-and-cocoapods)
- [Authors](#authors)

## Description

This is a personal project where I created a fitness companion mobile app using Expo and React Native. The app allows
users to create custom exercises and workout programs which are then displayed on the home page. It also has integration
of spotify for media controls like shuffling, liking songs, skipping, and much more.
This project was inspired by the fact that when I go to the gym, I use Google sheets for tracking my program, a timer app
for timing rest periods (with annoying ads), and Spotify for music. I wanted to combine all of these functionalities into one
app to make my gym experience more seamless and potentially provide value to other people who want something similar. I initially
drew out what I wanted my app to look like and then started to implement the features one by one.

The app is built using Expo which is a framework for universal React applications. I decided to use Expo and React Native
instead of Swift because I already had extensive experience with React and Typescript prior to this project and this would allow
for much faster and easier development. I read a lot about the pros and cons, and it seems to be mostly personal preference for
general applications with Swift being required to do certain in depth things. 

The home tab displays the user's currently selected program which consists of multiple 'Days' each week. The name of the day
is displayed at the top in the color that the user selected to help mentally differentiate. Then, there is a timer that counts down
from whatever time was selected when the specific exercise was created. The background timer library was used to allow the timer to continue
to run when the app isn't open or the device is locked. The timer can be paused and reset and vibrates four times when
it is finished. Below that is the set counter which shows the total number of sets and reps for the given exercise as well as the 
current set the user is on which can be incremented or decremented. Lastly, there is a card at the bottom that contains the current
exercise name and weight as well as the previous and next exercises so the user can quickly switch between them. The user can swipe the
exercise card to switch between them and can swipe outside the card to switch days. I initially used global state for the current day
and exercise tracking but this led to ugly behavior when switching between them, so I decided to instead load all days and exercises
for a given program and use map to display them in a ScrollView. This looks a lot better and allows for a clean swiping motions between them.
I decided to use Zustand to manage the global state of the app as it is very lightweight and easy to use.

The programs tab displays all the user's custom workout information. It contains three tabs within it for 
'Programs', 'Days', and 'Exercises'. The 'Exercises' tab displays all the user's exercises and allows for creation and 
editing. Exercises are separated into 'Primary' and 'Accessory' with different functionalities for each and the user can
pick between them when creating. Primary exercises are the main compound lifts like bench press, squat, and deadlift, with
the ability to select rep schemes of '5x5', '3x5', and '531' (pyramid) and multiple weight and rep inputs for each scheme. 
Accessory exercises are the smaller isolation lifts like bicep curls, tricep extensions, and calf raises, with no rep schemes 
and only one weight and rep input. The 'Days' tab displays all the user's days that make up a program like 'Push', 'Pull', and 'Legs'.
You can select 2 primary exercises, 4 accessory exercises, and 2 supersets for each day along with the ordering of each. The 'Programs'
tab displays all the user's programs which are made up of multiple days. You can select a program to be the currently selected one
by clicking the check mark with a green highlight indicating which is selected. This will be the program that is displayed on the home tab.
All of this data is stored in a SQLite database on the user's device, with many DB helper functions to allow for easy querying and updating.

The music tab integrates the spotify Web API to allow for the user to log in to their account using OAuth2.0 and then control their music.
Once music is playing, the user has buttons allowing for shuffling, liking songs, pausing/playing, skipping, accessing the queue, and changing the playlist.
The user can also see the current song playing, the album cover, and the artist name. The access and refresh token are stored using local storage
and expiration is checked whenever the app is opened to refresh the access token if necessary. The user can log out of their account at any time
if they want to use a different account. I use an interval to poll the spotify API every second to update the pertinent information. This gave me some difficulties
at first because the closure for the interval does not allow state to be updated, but I was able to find a workaround by using refs for values that changed.
Spotify Web API also does not provide a way to effectively pause songs, because once the song is paused it disconnects, and you have to enter the Spotify app
to restart it which is not what I was looking for. I tried many workarounds but what I ended up doing was a pseudo-pause where the song is muted and the progress
is repeatedly set to the same value to give the appearance of a pause. This was the best solution I could come up with, and it works well enough for my purposes. It
seems like other developers also deal with this issue and there are a lot of flaws with the API that Spotify doesn't seem to respond to, but maybe it will be fixed in the future.

The app is not currently on the app store because I don't have an Apple developer account as it is $99/year. I use the free provisioning license to load
it onto my iOS device and use it at the gym for myself. I plan in the future to continue to iterate and get it on the app store so that others can use it as well.
This project really reinforced my Typescript and React knowledge and introduced me to a lot of new mobile specific challenges which were very fun to tackle. I got experience
with using Expo, Zustand, and new libraries like those that allow apps to run in the background which is not something you have to worry about for web development.
I found React Native very easy to use and file based navigation was super simple and intuitive. I had previously never used SQL from Typescript because usually
the API manages the DB so this was a new experience for me as well. The most challenging part was definitely the music tab because I had never
worked with an external API or OAuth2 before. It was a great introduction to user authentication and token management, and the Spotify API was pretty easy to use.
There were some functionalities that aren't provided which I had to make workarounds for which is the difficulty of using an external API. Overall, I'm very happy with
how the app turned out, and I'm glad I was able to use my skills to create something that I use in my daily life and solves a problem for me.

## Images

#### Home Page
<img src="https://matt-mcauley.github.io/assets/img/GymBuddy/home.PNG" alt="Home Page Image" style="height: 600px">

#### Programs Page
<img src="https://matt-mcauley.github.io/assets/img/GymBuddy/programs.PNG" alt="Programs Page Image" style="height: 600px">

#### Music Page
<img src="https://matt-mcauley.github.io/assets/img/GymBuddy/music.PNG" alt="Music Page Image" style="height: 600px">

## Running locally (iOS - requires Macbook with Xcode and cocoapods)

#### Step 1: Download the source code
Clone or download a zip file of the source code onto your device

#### Step 2: Create ios folder

Run `npx expo prebuild --platform ios` in your project directory to create the ios folder.

#### Step 3: Install dependencies
You need to install dependencies by running `pod install` in the ios folder.

#### Step 4: Sign app onto mobile device with Xcode
Open the ios folder in Xcode and sign the app onto your mobile device.

## Authors

<table style="border-collapse: collapse; border:none;">
  <tr  style="border:none;">
    <td style="border:none;"><strong>Matthew McAuley</strong></td>
  </tr>
  <tr style="border:none;">
    <td style="border:none;">mwm223@cornell.edu</td>
  </tr>
</table>
