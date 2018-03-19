# About the project #
Web Web Ancillary Search (searchApis in the base project) is a tool supporting the visual definition of search engines from the UI of any Web page. This allow end users to slightly perform ancillary searchs over the Web. More info at https://sites.google.com/site/webancillarysearches/


## System Requirements ##

* Firefox 57 or Chrome 64.0.3282.140 onwards
* NPM 5.6.0 

## Building the extension ##

Clone this repo:
git clone https://gabybosetti@bitbucket.org/gabybosetti/web-ancillary-search.git

Download the dependencies:
cd ./web-ancillary-search
npm install

## Installing the extension in Chrome ##

1. Open "chrome://extensions/" in Chrome
2. Click "Load not packaged extension" 
3. Select any file in your add-on's root directory (web-ancillary-search)


## Debugging the extension in Chrome ##

You can debug and see logs from the Webconsole and the Browser's console. It depends on which kind of script you need to log/debug (content/backgroun scripts). The browser's console can be accessed 

If you are trying to debug a "popup script", you should prevent the popups to be closed. To do so, click the "4 sqaures icon" in the right-top area of the browser's toolbox. 


## Loading and debugging the extension in Chromium/Chrome ##

Open "chrome://extensions/" in Chromium, chech the "developer mode" at the top-right of the document. Click "Load non-packaged extension" and select any file in your add-on's directory. 