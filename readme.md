# About the project #
Web Web AncillarY Search (WAYS in the base project) is a tool supporting the visual definition of search engines from the UI of any Web page. This allow end users to slightly perform ancillary searchs over the Web. 

**Status: DO NOT INSTALL.** Just skeleton + basic functionality. See commits for more details.

![ways.png](https://bitbucket.org/repo/5p9o5z/images/2632509778-ways.png)

## Getting started: {**END USERS**} ##
You can download and install the XPI at the root directory of this repo. To do so, you can drag and drop the extension into the browser, but before you should enable the not-signed extensions to be installed:

Write **about:config** in your navigation bar and turn the following entry value to false:

```
#!javascript

xpinstall.signatures.required  
```

## Getting started {**DEVELOPERS**} ##

## This repo contains ##
* Files in src/lib/ is high privileged code. 
* Files in src/data/ is low level code. 

This is how extensions built with the FFX SDK use to be organized. E.g. Low privileged code is the one that is loaded in the sidebar, or in the DOM of the current Web page. High privileged code is the one in the lib folder, and can use the SDK API (you can r/w files, retrieve external content, etc.). The main file is SOURCE/lib/main.js

## Requirements ##
For running the project, you should have installed:

* NPM [https://www.npmjs.com/](Link URL) It could be necessary to install also: nodejs-legacy
* JPM [https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/SDK/Tools/jpm](Link URL) 
* Firefox addon autoinstaller [https://addons.mozilla.org/es/firefox/addon/autoinstaller/](Link URL)

## Debugging ##
For **debugging** the extension, you can use the Firefox Browser Toolbox: https://developer.mozilla.org/en-US/docs/Tools/Browser_Toolbox

You can **access the database** at the extension's dedicated folder, placed in the 'jetpack' folder inside the Firefox user profile one. E.g. /home/your_username/.mozilla/firefox/1xflzexk.default/jetpack/ways@lifia.info.unlp.edu.ar

## Loading the extension ##
First, enable not-signed extensions to be installed. Write *about:config* in your navigation bar and turn the following entry value to false:

```
#!javascript

xpinstall.signatures.required  
```

If that option does not work for you, try loading unsigned addons temporarily through about:debugging: https://developer.mozilla.org/en-US/docs/Tools/about:debugging

For installing the extension from terminal. Open it in the src/ directory and execute watchpost:

```
#!javascript

jpm watchpost --post-url http://localhost:8888/
```

Or force changes to be zipped again and post just once (this is better):

```
#!javascript

jpm xpi; jpm post --post-url http://localhost:8888/
```

## Progressive docs ##

Class diagram:
[https://drive.google.com/file/d/0B4L48Y0gCU7lcGZSYXlSWjZ2Qnc/view?usp=sharing](https://drive.google.com/file/d/0B4L48Y0gCU7lcGZSYXlSWjZ2Qnc/view?usp=sharing)

TODO at Trello:
[https://trello.com/b/VbQKtr21/web-ancillary-search](https://trello.com/b/VbQKtr21/web-ancillary-search)