# OBSAutoSwitch

Addon by @eddynadd (Eddy Naddeo)

Add-on OBS to auto-switch between scenes

How to use it ?

- Install the Node.js®

- Install the obs-websocket plugin

- Go to the addon directory and launch it with the "start.bat" file (if you want, you 
  can create a shortcut and add it to your desktop or where you want)

- To configure it, you have to change the variables (//CONFIGURATION// tab) :
    - let scenes = ["your", "scenes", "names", ...]
    - let waitingscreen = "Your waiting screen name";
    - let static = "Your static scene name"; 
    - let seconds = NumberOfSecondsYouWantBetweenEverySwitches;
    - portConnect = PortOfYourOBSWebsocket;
    - passwordConnect = "Password Of Your OBS Websocket"
    
- To add this on your OBS, go on "View", "Docks" and then "Custom Browser Docks...".
  You can add the addon in this menu (URL is : "http://localhost:3001/")
