# About the project

Web Web Ancillary Search (searchApis in the base project) is a tool supporting the visual definition of search engines from the UI of any Web page. This allow end users to slightly perform ancillary searchs over the Web. More info at <https://sites.google.com/site/webancillarysearches/>

## System Requirements

-   Firefox 57 or Chrome 64.0.3282.140 onwards
-   NPM 5.6.0 (maybe other versions work)

## Building the extension

Clone this repo:

```sh
$ git clone https://gabybosetti@bitbucket.org/gabybosetti/web-ancillary-search.git
```

Download the dependencies:

```sh
$ cd web-ancillary-search
$ npm install
$ npm run web-ext-prepare
```

## Installing the extension in Chrome

After performing the steps described above,

1.  Open "chrome://extensions/" in Chrome
2.  Click "Load not packaged extension"
3.  Select any file in your add-on's root directory (web-ancillary-search/src)

or run the following scripts,

```sh
$ npm run start:chrome # npm run start:chromium, for chromium
```

## Debugging the extension in Chrome

You can debug and see logs from the Webconsole and the Browser's console. It depends on which kind of script you need to log/debug (content/backgroun scripts). The browser's console can be accessed

If you are trying to debug a "popup script", you should prevent the popups to be closed. To do so, click the "4 sqaures icon" in the right-top area of the browser's toolbox.

## Using the tool

To define a new service, go to the results page of a search engine (execute a search). E.g. [at the NYPL site](https://browse.nypl.org/iii/encore/search/C__Srayuela__Orightresult__U?searched_from=header_search×tamp=1525352919240&lang=eng)

Then, click on the extension's toolbar button to define a new service. To do so, follow the steps presenten in the sidebar.

To use an existing service, highlight some text in any Web page and right-click. Choose "Search with" and select some of the available services.

You can watch demo videos at [this YouTube playlist](https://www.youtube.com/watch?v=fqhG5uwMuNA&list=PLHuNJBFXxaLA1FfFMtzvOXojI0yg4WWxj)
