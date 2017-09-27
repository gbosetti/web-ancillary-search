# About the project #
Web Web Ancillary Search (searchApis in the base project) is a tool supporting the visual definition of search engines from the UI of any Web page. This allow end users to slightly perform ancillary searchs over the Web. 

For demo videos you can access this playlist:
https://www.youtube.com/playlist?list=PLHuNJBFXxaLA1FfFMtzvOXojI0yg4WWxj

## This repo contains: ##
The source code of the system, implemented as a Web Extension. To understand better its anatomy, please consider reading:
https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Anatomy_of_a_WebExtension

Please, read carefully such article, since rules are not always the same. E.g. DOM elements can not be fully manipulated from any script, for instance, the event listeners can not be added from popups but the popup can call a contentscript to do so.

The starting point is background/main.js

## System Requirements ##

*Firefox 55 onwards, in your desktop environment*. sudo apt-get install firefox. Starting from Firefox 57, WebExtensions will be the only supported extension type.
Please, make you sure you are using at least version 55.0a1

*Bower. We have a bower file for downloading the dependencies that the project needs for the sidebar. This way, we are not distributing the code of the dependencies. We need those files to be part of the extension because some need to be injected from the extension itself and not through a CDN. https://bower.io/
sudo apt-get install npm, nodejs
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
sudo npm install -g bower


## Loading and debugging the extension in Firefox ##

Download dependencies. Open a console on the project's "background" folder and execute:
bower install

Repeat the command on the project's "content_scripts" folder.

Open "about:debugging" in Firefox, click "Load Temporary Add-on" and select any file in your add-on's directory. It will be installed until you restart Firefox. 

After installing the extension, you can see a «debug» button next to the extension, as well as an «update». You ca use it but sometimes it is not logging things. The best way is still using the browser's toolbox (CTRL+SHIFT+ALT+i).

If you are trying to debug a "popup script", you should prevent the popups to be closed. To do so, click the "4 sqaures icon" in the right-top area of the browser's toolbox. 

If the button for debugging is not enabled, please activate the "Browser Toolbox"
https://developer.mozilla.org/en-US/docs/Tools/Browser_Toolbox



## Loading and debugging the extension in Chromium/Chrome ##

Open "chrome://extensions/" in Chromium, chech the "developer mode" at the top-right of the document. Click "Load non-packaged extension" and select any file in your add-on's directory. The extension will be installed.

After installing the extension, you can see an «update». Update not always work as expected, sometimes you need to restart the browser to see the changes.

Debugging...



## Publishing the extension ##

https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Publishing_your_WebExtension
