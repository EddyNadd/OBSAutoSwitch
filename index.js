//////////////////////////////////////////////////////////////////////////////////////
/*        

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

*/
//////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////
                                //IMPORTS//
/////////////////////////////////////////////////////////////////////////////////////

const express = require('express')

const path = require('path');

const app = express()

const OBSWebSocket = require('obs-websocket-js');

/////////////////////////////////////////////////////////////////////////////////////
                                //CONFIGURATION//
/////////////////////////////////////////////////////////////////////////////////////

let scenes = ["Gameplay ImDiDi", "Gameplay Spny", "Gameplay Sirrist"];

let waitingscreen = "Waiting Screen";

let static = "Grand angle";

let seconds = 10;

let portConnect = 4444;

let passwordConnect = "test"

/////////////////////////////////////////////////////////////////////////////////////
                                //VARIABLES//
/////////////////////////////////////////////////////////////////////////////////////

let autoswitch = false;

let checkScene = false;

let sceneToShow = "";

let scenesRandWhenDisable = [];

let scenesPassed = [];

let isAlreadyPassed = [];

/////////////////////////////////////////////////////////////////////////////////////
                                //CONNECTION//
/////////////////////////////////////////////////////////////////////////////////////

const obs = new OBSWebSocket();

obs.connect({

        address: 'localhost:' + portConnect,

        password: passwordConnect

    })

    .then(() => {

        console.log(`Success! We're connected & authenticated.`);

        obs.send('SetCurrentScene', {

            'scene-name': waitingscreen

        });

    })

/////////////////////////////////////////////////////////////////////////////////////
                                    //GET//
/////////////////////////////////////////////////////////////////////////////////////

app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname+'/html/index.html'));

    if (autoswitch == true) {

        console.log("Autoswitch : OFF");

    }

    autoswitch = false;

    obs.send('SetCurrentScene', {

        'scene-name': waitingscreen

    }); 
    
    console.log("Scene : " + waitingscreen);

})

app.get('/autoswitch', (req, res) => {

    res.sendFile(path.join(__dirname+'/html/autoswitch.html'));

    autoswitch = true;

    console.log("Autoswitch : ON");

    randScene();

})

app.get('/stopautoswitch', (req, res) => {

    res.sendFile(path.join(__dirname+'/html/index.html'));

    autoswitch = false;

    console.log("Autoswitch : OFF");

})

app.get('/static', (req, res) => {

    res.sendFile(path.join(__dirname+'/html/static.html'));

    if (autoswitch == true) {

        console.log("Autoswitch : OFF");

    }

    autoswitch = false;

    obs.send('SetCurrentScene', {

        'scene-name': static

    });

    console.log("Scene : " + static);

})

app.get('/waiting', (req, res) => {

    res.sendFile(path.join(__dirname+'/html/waiting.html'));

    if (autoswitch == true) {

        console.log("Autoswitch : OFF");

    }

    autoswitch = false;

    obs.send('SetCurrentScene', {

        'scene-name': waitingscreen

    }); 

    console.log("Scene : " + waitingscreen);

})

/////////////////////////////////////////////////////////////////////////////////////
                                    //AUTOSWITCH//
/////////////////////////////////////////////////////////////////////////////////////

obs.on('error', err => {

    console.error('socket error:', err);

});

setInterval(randScene, seconds*1000);

function randSceneWithFour() {

    rand = Math.floor(Math.random() * (scenes.length));

    console.log("Scene : " + scenes[rand]);

    obs.send('SetCurrentScene', {

        'scene-name': scenes[rand]

    });    

    scenesPassed.push(rand);
}

function randScene() {

    if (autoswitch == true) {

        if (scenesPassed.length == 4) {

            for (let i = 0; i < scenes.length; i++) {

                isAlreadyPassed.splice(0, isAlreadyPassed.length)

                for (let a = 0; a < scenesPassed.length; a++) {

                    if (scenesPassed[a] == i) {

                        isAlreadyPassed.push(a);

                    }

                }

                if (isAlreadyPassed.length == 0) {

                    sceneToShow = i;

                    console.log("Scene to show absolutely : " + scenes[sceneToShow]);
                    
                    checkScene = true;
                }

            }

            scenesPassed.shift();

            if (checkScene == true) {

                obs.send('SetCurrentScene', {

                    'scene-name': scenes[sceneToShow]

                }); 

                console.log("Scene : " + scenes[sceneToShow]);

                checkScene = false;

                scenesPassed.push(sceneToShow);

            } else if (scenesPassed[scenesPassed.length - 1] == scenesPassed[scenesPassed.length - 2]) {

                scenesRandWhenDisable = [...scenes];

                scenesRandWhenDisable.splice(rand, 1);

                console.log("Same scene, scene to show : " + scenesRandWhenDisable);

                rand = Math.floor(Math.random() * (scenesRandWhenDisable.length));
                
                obs.send('SetCurrentScene', {

                    'scene-name': scenesRandWhenDisable[rand]

                }); 

                console.log("Scene : " + scenesRandWhenDisable[rand]);

                scenesPassed.push(rand);
                
            } else {

                randSceneWithFour();
            }

        } else {

            randSceneWithFour()         
        }

        
        
    }
}

/////////////////////////////////////////////////////////////////////////////////////
                                    //LISTEN//
/////////////////////////////////////////////////////////////////////////////////////

app.listen(3001, () => {

    console.log('running on port 3001');

})