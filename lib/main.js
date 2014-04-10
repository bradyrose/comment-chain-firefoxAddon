        //  the command I run in my ubuntu install to compile the addon:
        //  comment-chain$ python2.6 /addon-SDK/bin/cfx run -b /usr/bin/firefox-trunk
        

        // helps us watch the console to see when the addon started
        console.log('.............');
        console.log('addon started');


        // here we load respectively needed library/sdk stuff 
        // and place them into variables we will be using 

        var { ToggleButton } = require('sdk/ui/button/toggle');
        var panels = require("sdk/panel");
        var self = require("sdk/self");
        // needed to log tabs
        var tabs =require("sdk/tabs");    
        var prefs = require("sdk/simple-prefs").prefs;
        console.log('sdk parts and libraries loaded');



        /*****   BEGIN ADDON'S FUNCTIONS *****/


        // this function grabs the address of the current tab and stores
        // it in current_address, so later when we leave a comment we know 
        // what page we are commenting on. 

        /**  a note on this function,  you'll notice above that 
        require("sdk/tabs").on("ready", logURL);   runs, this function every 
        time a new tab is opened and is ready, which im not sure is exactly
        what I want, though it seems to work for my purposes none the less,
        ultimately I just want to run this as needed to determine the url
        of the tab that is currently in focus when the handleClick function
        runs
         */

        function currentAddress(){
          current_address = tabs.activeTab.url;
          console.log(current_address);

          return current_address;
        }
          




        // load up a toggle button in the browser with icons 
        // when it is clicked it runs the handleClick function
        // basically, it opens a panel when you click on a button 
        // on the top of the browser. 
        var button = ToggleButton({
          id: "comment-chain",
          label: "comment-chain",
          icon: {
            "16": "./images/comment-chain_icon_16.jpg",
            "32": "./images/comment-chain_icon_32.jpg",
            "64": "./images/comment-chain_icon_64.jpg"
          },  
          onClick: mainPanel
        });

        // so here is the actual panel that the toggle button opens
        // the jsonrpc.js file isn't actually used
        console.log('lets load the panel parts');
        var panel = panels.Panel({
          contentURL: self.data.url('index.html'),
          //contentScriptFile: self.data.url('js/jsonrpc.js'),
          contentScriptFile: self.data.url('js/paneljs.js'),
        });


        /*  the mainPanel function displays and interacts with its 
            subsiquent files that make up the panel such as the 
            index.html, and paneljs.js  

            paneljs.js dynamically modifies and reads from index.html
            and then communicates data back and forth to mainPanel 
            using port.emit / port.on , port.once
        */
        function mainPanel(state) {

        // here we get the address of the active tab
        current_address = currentAddress();


        //  here we recieve a communication from paneljs.js, the 
        // data from a comment 

         panel.port.once("comment", function(comment) {
          // Handle the message
          

            if(current_address == 'about:blank'){
              
              // we should emit back to paneljs.js that you can't do that
              // and display an alert that you can't do that, so the user
              // knows that they can't do that.
              console.log('You can not leave a comment on a page your not on.');
            
              }else{
              //  so if we made it past the else, the user is on a page, and has 
              // opened the panel, and left a comment, and we have that data
              // so we throw that info onto the console
              console.log('recieved via port.on');
              console.log(comment);
              console.log('the current address:');
              console.log(current_address);
              console.log('user:');
              console.log(prefs.identity);


              // we of course will actually want to do something with this data
              // namely communicate it via JSON-RPC to an application running on 
              // the users computer that will in turn communicate the data 
              // to an application that will store the comments

              } // end else
          
          }); // end panel.port.once

        // here we are just resizing the panel in accordance to the size of the
        // browser and then showing the panel, and also logging those widths to the console

        var Width = require('sdk/window/utils').getMostRecentBrowserWindow().innerWidth;
        Width = Width * .9;
        var Height = require('sdk/window/utils').getMostRecentBrowserWindow().innerHeight;
        Height = Height * .8;
          panel.resize(Width, Height);
          panel.show({
            position: button
            });

        console.log(Width);
        console.log(Height);

        }// end mainPanel function


