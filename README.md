# GymBuddy

## Contents

- [Description](#description)
- [Images](#images)
- [Running Locally](#running-locally-ios---requires-macbook-with-xcode-and-cocoapods)
- [Authors](#authors)

## Description

This is a personal project where I created a fitness companion mobile app using Expo and React Native. The app allows users to create custom exercises and workout programs which are then displayed on the home page. It also has integration of spotify for media controls like shuffling, liking songs, skipping, and much more. This project was inspired by the fact that when I go to the gym, I use Google sheets for tracking my program, a timer app for timing rest periods (with annoying ads), a counter app for tracking sets, and Spotify for music. I wanted to combine all of these functionalities into one app to make my gym experience more seamless and enjoyable. I initially drew a prototype of what I wanted my app to look like and then started to implement the features one by one. 

The app is built using Expo which is a framework for universal React applications. I decided to use Expo and React Native instead of Swift because I already had extensive experience with React and Typescript prior to this project which would allow for much faster and easier development. I read a lot about the pros and cons, and it seemed to be mostly personal preference for general applications with Swift being required to do certain in depth things. After implementing the timer Live Activity functionality it may have been better to have done the project in swift in retrospect. Because I am only developing the app for iOS, the headache of implementing a Live Activity using react native could've been eliminated and that feature alone took up a large chunk of development time.

The home tab displays the user's currently selected program which consists of multiple 'Days' each week. The name of the day is displayed at the top in the color that the user selected to help mentally differentiate. Then, there is a timer that counts down from whatever time was input when the specific exercise was created. Starting the timer activates a Live Activity on the users lock screen or in their dynamic island for newer phones. It displays the name of the exercise and shows a live countdown with the ability to pause or reset, which is then reflected in the app itself. These controls are also available within the app on the home screen. A notification is fired when the timer completes. The Live Activity and notification functionalities were done in swift using expo’s native modules feature and apple targets. This was due to the fact that functionalities related to notifications and Live Activities either do not exist or are extremely limited for react native. This took a very long time to develop and presented many difficulties as there are no direct tutorials online so documentation for each aspect of development had to be combined. Below the timer is the set counter which shows the total number of sets and reps for the given exercise as well as the current set the user is on which can be incremented or decremented. Lastly, there is a card at the bottom of the screen that contains the current exercise name and weight as well as the previous and next exercises so the user can quickly switch between them. The user can swipe the exercise card to switch between them and can click on the day to select a different choice from a bottom sheet.

The programs tab displays all the user's custom workout information. It contains three tabs within it for 'Programs', 'Days', and 'Exercises'. Each page has a button to allow for creation of all three aspects. Creating an exercise requires you to add sets, each with their own rest time, weight, and rep scheme. The sets can be reordered or deleted by swiping left and clicking the trash icon. Creating a day requires you to add exercises, specifying a normal exercise or a superset. A superset is when you alternate between two exercises without resting. Clicking on the blank exercise allows you to pick from your personal exercises from a bottom sheet. If you create a superset with a different number of sets for each exercise (i.e Squats with 4 sets and Curls with 3), it acts differently on the home page. Incrementing the current set to higher than one of the exercises contains (4 for curls), would then treat the other exercise as if it is standalone (would just show Squats). The programs tab allows selection by clicking the check mark, with a green highlight indicating which is active.  This will be the program that is displayed on the home tab. Creating a program is similar to creating a day, where you add individual days which are selected from a bottom sheet with your created days. All of this data is stored in a SQLite database on the user's device, with many DB helper functions to allow for easy querying and updating. Association tables are used to allow an unlimited number of sets for each exercise, exercises for each day, and days for each program. This was not originally the case and the DB used to have a hard-coded limit to the number for each. Editing exercises, programs, and days is also possible with the UI being almost identical to adding but including the previously input values as well as a delete option. Deleting or editing resets the active program to the first day and exercises so that there are no index out of bounds errors. If there are no exercises in the day, days in the program, or program selected (due to deletions), then the home page displays nothing.

The music tab integrates the spotify Web API to allow for the user to log in to their account using OAuth2.0 and then control their music. Once music is playing, the user has buttons allowing for shuffling, liking songs, pausing/playing, skipping, accessing the queue, and changing the playlist. The user can also see the current song playing, the album cover, and the artist name. The access and refresh token are stored using local storage and expiration is checked whenever the app is opened to refresh the access token if necessary. The user can log out of their account at any time if they want to use a different account. I use an interval to poll the spotify API every second to update the pertinent information. This gave me some difficulties at first because the closure for the interval does not allow state to be updated, but I was able to find a workaround by using refs for values that changed. Spotify Web API also does not provide a way to effectively pause songs, because once the song is paused it disconnects your device. You have to enter the Spotify app to restart it which is not what I was looking for. I tried many workarounds but what I ended up doing was a pseudo-pause where the song is muted and the progress is repeatedly set to the same value to give the appearance of a pause. This was the best solution I could come up with, and it works well enough for my purposes. It seems like other developers also deal with this issue and there are a lot of flaws with the API that Spotify doesn't seem to respond to, but maybe it will be fixed in the future. 

The app is not currently on the app store because there are many additional requirements for privacy and testing and I just created it for my personal use and as a learning experience. This project really reinforced my Typescript and React knowledge and introduced me to a lot of new mobile specific challenges which were very fun to tackle. I got experience with using Expo, Zustand, Swift, Live Activities, and new libraries like those that allow apps to run in the background which is not something you have to worry about for web development. I found React Native very easy to use and file based navigation was super simple and intuitive. I had previously never used SQL from Typescript because usually the API manages the DB so this was a new experience for me as well. The most challenging part was definitely the timer Live Activity due to the issues stated above. The Spotify web API was the most disappointing aspect of this project. There were some functionalities that weren't provided which I had to make workarounds for which is the difficulty of using an external API. Overall, I'm very happy with how the app turned out, and I'm glad I was able to use software to create something that I use in my daily life and solve a real problem.

## Images

### Home Screen

#### Splash Screen
<img src="https://mattmcauley.com/assets/projects/GymBuddy/splash.png" alt="Image" style="width: 700px">

#### Home Page
<img src="https://mattmcauley.com/assets/projects/GymBuddy/Home_Screen.PNG" alt="Image" style="width: 700px">

#### Live Activity
<img src="https://mattmcauley.com/assets/projects/GymBuddy/Live_Activity.PNG" alt="Image" style="width: 700px">

#### Superset
<img src="https://mattmcauley.com/assets/projects/GymBuddy/Home_Superset.PNG" alt="Image" style="width: 700px">

#### Day Selection Bottom Sheet
<img src="https://mattmcauley.com/assets/projects/GymBuddy/Home_Bottom_Sheet.PNG" alt="Image" style="width: 700px">

### Programs Page

#### Programs Display
<img src="https://mattmcauley.com/assets/projects/GymBuddy/Programs.PNG" alt="Image" style="width: 700px">

#### Edit Program 1
<img src="https://mattmcauley.com/assets/projects/GymBuddy/Edit_Program_Top.PNG" alt="Image" style="width: 700px">

#### Edit Program 2
<img src="https://mattmcauley.com/assets/projects/GymBuddy/Edit_Program_Bottom.PNG" alt="Image" style="width: 700px">

#### Edit Program Bottom Sheet
<img src="https://mattmcauley.com/assets/projects/GymBuddy/Program_Bottom_Sheet.PNG" alt="Image" style="width: 700px">

### Days Page

#### Days Display
<img src="https://mattmcauley.com/assets/projects/GymBuddy/Days.PNG" alt="Image" style="width: 700px">

#### Edit Day 1
<img src="https://mattmcauley.com/assets/projects/GymBuddy/Edit_Day_Top.PNG" alt="Image" style="width: 700px">

#### Edit Day 2
<img src="https://mattmcauley.com/assets/projects/GymBuddy/Edit_Day_Bottom.PNG" alt="Image" style="width: 700px">

#### Edit Day Bottom Sheet
<img src="https://mattmcauley.com/assets/projects/GymBuddy/Day_Bottom_Sheet.PNG" alt="Image" style="width: 700px">

### Exercises Page

#### Exercises Display
<img src="https://mattmcauley.com/assets/projects/GymBuddy/Exercises.PNG" alt="Image" style="width: 700px">

#### Edit Exercise 1
<img src="https://mattmcauley.com/assets/projects/GymBuddy/Edit_Exercise_Top.PNG" alt="Image" style="width: 700px">

#### Edit Exercise 2
<img src="https://mattmcauley.com/assets/projects/GymBuddy/Edit_Exercise_Bottom.PNG" alt="Image" style="width: 700px">

#### Edit Exercise Bottom Sheet
<img src="https://mattmcauley.com/assets/projects/GymBuddy/Exercise_Bottom_Sheet.PNG" alt="Image" style="width: 700px">


### Music Page

#### Home Page
<img src="https://mattmcauley.com/assets/projects/GymBuddy/Music_Home.PNG" alt="Image" style="width: 700px">

#### Pausing/Liking
<img src="https://mattmcauley.com/assets/projects/GymBuddy/Music_PausedLiked.PNG" alt="Image" style="width: 700px">

#### Playlists
<img src="https://mattmcauley.com/assets/projects/GymBuddy/Playlists.PNG" alt="Image" style="width: 700px">

#### Queue
<img src="https://mattmcauley.com/assets/projects/GymBuddy/Queue.PNG" alt="Image" style="width: 700px">

## Running locally (iOS - requires Macbook with Xcode and cocoapods)

#### Step 1: Download the source code
Clone or download a zip file of the source code onto your device.

#### Step 2: Install dependencies

Run `npm install` to install the project dependencies.

#### Step 3: Create ios folder

Run `npx expo prebuild --platform ios` in your project directory to create the ios folder.

#### Step 4: Install dependencies
Install dependencies by running `pod install` in the ios folder.

#### Step 5: Sign app onto mobile device with Xcode
Open the ios folder in Xcode to sign the app onto your mobile device.

## Authors

<table style="border-collapse: collapse; border:none;">
  <tr  style="border:none;">
    <td style="border:none;"><strong>Matthew McAuley</strong></td>
  </tr>
  <tr style="border:none;">
    <td style="border:none;">mwm223@cornell.edu</td>
  </tr>
</table>
