# About the project #
WAYS is a tool supporting the visual definition of search engines from the UI of any Web page. This allow end users to slightly perform ancillary searchs over the Web. 

## This repo contains: ##
* Files in src/lib/ is high privileged code. 
* Files in src/data/ is low level code. 

This is how extensions built with the FFX SDK use to be organized. E.g. Low privileged code is the one that is loaded in the sidebar, or in the DOM of the current Web page. High privileged code is the one in the lib folder, and can use the SDK API (you can r/w files, retrieve external content, etc.). The main file is SOURCE/lib/main.js

## Getting started ##
For running the project, you should have installed:

* NPM [https://www.npmjs.com/](Link URL) It could be necessary to install also: nodejs-legacy
* JPM [https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/SDK/Tools/jpm](Link URL) 
* Firefox addon autoinstaller [https://addons.mozilla.org/es/firefox/addon/autoinstaller/](Link URL)

If you are not using Firefox Developer Edition, you should enter     about:config and turn the following entry value to false:

```
#!javascript

xpinstall.signatures.required  
```

Then, from the src/ dir, open a terminal and watchpost:

```
#!javascript

jpm watchpost --post-url http://localhost:8888/
```

Or force changes to be zipped again and post just once (this is better):

```
#!javascript

jpm xpi; jpm post --post-url http://localhost:8888/
```

For **debugging** the extension, you can use the Firefox Browser Toolbox: https://developer.mozilla.org/en-US/docs/Tools/Browser_Toolbox

You can **access the database** at the extension's dedicated folder, placed in the 'jetpack' folder inside the Firefox user profile one. E.g. /home/your_username/.mozilla/firefox/1xflzexk.default/jetpack/ways@lifia.info.unlp.edu.ar
