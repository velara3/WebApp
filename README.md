# WebApp
This is a base class for web applications using object oriented programming (OOP), Typescript and modules client side. It is not a framework and it is not functional programming or scripting. It is meant to be a vanilla approach to assembling a web page or a single page application using imports and modules. It merely gives you a scalfold to setup and start your web page project. It gives you a way to organize your code in the world of imports, external packages and modules. It separates the views so that as it changes (and it will), those changes do not affect the functionality of the project. It is also organized and written in this manner so that development tools can provide code completion, code assistance, import and export and more. It also provides some reusable functionality. 

Setup is easy. You create your main class file in your project. This is a Typescript or Javascript file (.ts or .js). You add a reference to that Javascript or Typescript file in your web page (let's say index.ts or index.js). In your main class you extend the BaseClass.ts in this project (add from npm). Then you add your code in the start method of your class. At the end of your class after it is closed add a call to `BaseClass.startWhenReady(MyClass)` (or if you want, call the static start method, `var instance = BaseClass.start(MyClass)`). Your class is then created when the page loads if using `startWhenReady` or created instantly when calling, `BaseClass.start()`.  

For the view, you create a view class or declare one inline in the main class. You add references to any UI elements in that class. Then you import that class into your main class.  

Your view class gets the web elements. The view class and the UI elements are project dependent. You define them. 

Why use this? Why was this built?  
It defines a structure to web page code. It is easy to maintain and modify. It speeds up development. It prevents scope issues. It helps displaying dialogs and messages. It works well with remote data. It works well with creating and repeating elements (like posts on a social media site - item renderers). It works well with importing npm packages client side. You can create and switch to multiple views on the same page. It works well with tools that export web pages from design tools. It provides some common reusable code that has been shown to be common across projects. Additionally, VSCode would not provide any of it's code editor benefits unless it was written in this way (which fortunately, still happens to be a very OOP approach). 

If you have attempted to create a web page project with JavaScript or Typescript and maintain it you will know why this project has been built. If you have come from the desktop development world where you can easily add libraries to your project you will know why this project has been built. If you wonder why there are scope issues in class functions you will know why this project has been built. This project was created after a year of making web pages and single page applications using vanilla Javascript and after much more experience in the web development ecosystem. 


It supports: 
- working with separate views - keep your views separate and import them
- async and cancelable get and post methods
- upload methods
- download methods
- displaying custom dialog methods
- base css styles
- hiding and showing elements
- unhiding and rehiding elements
- checking the url query
- checking the url fragments
- updating the url query history
- updating the url fragment history
- showing an network icon when requests are made
- uses one line fetch calls
- waiting in async calls
- traditional scope in class members (`this` refers to the class)

It adds a basic object oriented framework to start from. 

#Overview

- Create your Typescript class (or Javascript class)
- Add this npm module to your project
- Add an import statment at the top of your class
- You extend the base class adding any methods and imports you need
- You import any view classes
- You add and import any external packages or modules
- Override and add code to the start() method in your class, `override async start() {}`
- Your class adds event listeners in the `setupEventListeners()` function
- Add a call to create the class using `BaseClass.start()` or `BaseClass.startWhenReady()`
- Your class starts and code in the `start()` method is run 

It all starts when you run `BaseClass.startWhenReady(MyClass)` or `BaseClass.start(MyClass)` to start the class / application

The main class to extend is `BaseClass.ts`.   

You yourself define the view classes or view elements you need for your project. You can use the `BaseElements.ts` class as a template to learn from.

You extend the class and then include a reference to the JavaScript in your HTML page.  
 
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World</title>
    <script src="my-app.js" type="module"></script>
</head>

<body>
    <h1 id="header">Hello World</h1>
</body>

</html>
```
Make sure to set the type to `module`. 

Also, you may have to include the view class if you aren't using a bundler. 
```html

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World</title>
    <script src="view-elements.js" type="module"></script>
    <script src="my-app.js" type="module"></script>
</head>
```

You can avoid using a bundler if your classes are all local and if you extend BaseClass.js and include it in your project output. But it is much better to use a bundler. 

If there are any issues with referencing HTML elements in your view you may need to add `defer` to the script tag. Or move the script tag after the body or into the head section. 

```html

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World</title>
    <script src="view-elements.js" type="module"></script>
    <script src="my-app.js" type="module"></script>
</head>
```
If your HTML page does not have the elements mentioned in your view you will get errors on the page. Open web developer tools and look for errors. 

---

The constructor is optional. 

Basic Example: 
```javascript
import { BaseClass } from "base-class-ts"

export class MyClass extends BaseClass {

    constructor() {
        super();
    }

    // place your code here
    override async start() {
        console.log("Hello world");
        console.log("Start method");
    }
}

BaseClass.startWhenReady(MyClass); // starts on window DOMContentLoaded
```

Basic Example with view class: 
```javascript
import { BaseClass } from "base-class-ts"

// you define the view elements that your project needs
class UserView {
   header = document.getElementById("header") as HTMLElement;
}

// create an instance of the view to use and reference it in your class
var userView = new UserView();

export class MyClass extends BaseClass {

    constructor() {
        super();
    }

    // place your code here
    override async start() {
        console.log("Hello world");
        console.log("Start method");
        userView.header;
    }
}

BaseClass.startWhenReady(MyClass); // starts on window DOMContentLoaded
```

Example with view elements declared inline:  
```javascript
import { BaseClass } from "base-class-ts"

export class MyClass extends BaseClass {
    header = document.getElementById("header") as HTMLElement;

    constructor() {
        super();
        console.log("Hello world");
    }

    // place your code here
    override async start() {
        console.log("Start method");
        this.userLabel;
    }
}

BaseClass.startWhenReady(MyClass); // starts on window DOMContentLoaded
```

Example importing an external view class:    
```javascript
import { BaseClass } from "base-class-ts"

// import an external view 
// your views will always be local to your project - add the ./ before the file name
import * as view from "./ExampleElements.js";

export class MyClass extends BaseClass {

    constructor() {
        super();
    }

    // place your code here
    override async start() {
        console.log("Hello world");
        console.log("Start method");
        this.setupEventListeners();
    }

    // setup event listeners in this method
    override setupEventListeners(): void {
      try {
         view.examplesButton.addEventListener("click", this.getExamplesHandler);
      }
      catch(error) {
         this.log(error);
      }
    }

    async getExamplesHandler(event:Event) {
        await this.getExampleData();
    }
}

BaseClass.startWhenReady(MyClass); // starts on window DOMContentLoaded
```
---
#View elements

View elements or UI elements can be referenced in multiple ways. In external files they can be declared directly in an external file and imported using a wildcard or they can be declared as members of a class and the class can be imported and instantiated.

It might be simpler to declare all elements in a view directly. There is no class declaration and there is no need to create an instance of the class. 

```js
// my-view.js
export var dialog: HTMLDialogElement = document.querySelector("#dialog") as HTMLDialogElement;
export var progressBarLabel: HTMLElement = document.querySelector("#progressBarLabel") as HTMLElement;

// my-main-class.js
import * as view from "./my-view.js";

console.log(view.dialog); // reference to dialog (as long as dialog exists)
```

Declaring as a class:  
```js
// my-view.js
export class MyView {
    dialog: HTMLDialogElement = document.querySelector("#dialog") as HTMLDialogElement;
    progressBarLabel: HTMLElement = document.querySelector("#progressBarLabel") as HTMLElement;
}

// my-main-class.js
import { MyView } from "./MyView.js";
var view = new MyView();

console.log(view.dialog); // reference to dialog (as long as dialog exists)
```

Either way works but the class method may be slightly better for large projects or if you need or use inherited views. But it's trivial to convert a direct reference file to a class if you need it. 

As opposed to external files UI elements can be declared directly inline in the main file.  

View class declared in the main class:  
```js
import { BaseClass } from "base-class-ts";

// view declared as a class
class View {
   userLabel = document.getElementById("userLabel") as HTMLElement;
}

// you must instantiate the class 
var view = new View();

export class HomeClass extends BaseClass {

   constructor() {
      super();
   }
}

BaseClass.startWhenReady(HomeClass);
```

View elements declared directly in the main class:  
```js
import { BaseClass } from "base-class-ts";

// view items declared directly 
var userLabel = document.getElementById("userLabel") as HTMLElement;

export class HomeClass extends BaseClass {

   constructor() {
      super();
   }
}

BaseClass.startWhenReady(HomeClass);
```

View elements declared inside the main class:  
```js
import { BaseClass } from "base-class-ts";

export class HomeClass extends BaseClass {
    // view items declared directly 
    userLabel = document.getElementById("userLabel") as HTMLElement;

    constructor() {
        super();
    }
}

BaseClass.startWhenReady(HomeClass);
```

#Example View classes:  

ExampleElements.ts:  
```javascript
// elements can be declared directly as exports and imported using a wildcard 
// your project will have it's own elements with the names you give them
export var dialog: HTMLDialogElement = document.querySelector("#dialog") as HTMLDialogElement;
export var requestIcon: HTMLElement = document.querySelector("#requestIcon") as HTMLElement;
export var versionLabel: HTMLElement = document.querySelector("#versionLabel") as HTMLElement;
export var dialogTitle: HTMLElement = document.querySelector("#dialogTitle") as HTMLElement;
export var dialogMessage: HTMLElement = document.querySelector("#dialogMessage") as HTMLElement;

export var exampleGrid = document.querySelector("#exampleGrid") as HTMLElement;
export var exampleItemRenderer: HTMLElement = document.querySelector("#exampleItemRenderer") as HTMLElement;
export var examplesButton: HTMLElement = document.querySelector("#examplesButton") as HTMLElement;
``` 

Example of declaring view elements in a separate file using a class:  
```javascript
export class BaseElements {
    requestIcon = document.getElementById("requestIcon") as HTMLElement;
    dialog = document.getElementById("dialog") as HTMLDialogElement;
    dialogTitle = document.getElementById("dialogTitle") as HTMLElement;
    dialogMessage = document.getElementById("dialogMessage") as HTMLElement;
    versionLabel = document.getElementById("versionLabel") as HTMLElement;
} 
```
Example creating a view that extends another view:  
```js
import { ViewElements } from "./view-elements.js";

export class CreateElements extends ViewElements {
   createButton = document.getElementById("createButton") as HTMLElement;
}
``` 

---
#Making Requests  

Using fetch and XMLHttpRequests can be a high learning curve. In this class you can use one line to get or post data to the server using the `requestURL()` method or one of it's wrapper methods like, `getURL` and `postURL`. 

In the past you used XML HTTP Requests like so:  
```js
this.request = new XMLHttpRequest();
this.request.addEventListener('load', this.loadHandler);
this.request.addEventListener('error', this.errorHandler);
this.request.addEventListener("abort", () => { this.log("abort") });
this.request.addEventListener("loadstart", () => { this.log("loadstart") });
this.request.addEventListener("loadend", () => { this.log("loadend") });
this.request.addEventListener("progress", () => { this.log("progress") });
this.request.addEventListener("readystatechange", () => { this.log("readystatechange") });
this.request.open('POST', '/data', true);
this.request.send(formData);
```

With fetch and this class you can make the same calls in one line or a few lines with try catch. 
```js
try {
    var data = await this.getURL("/data");
}
catch(error) {
    this.log("Error", error);
}
```
These methods include get, post, upload and download using asynchronous syntax. The methods `getUrl` and `postURL` both extend `requestURL`. These methods are cancelable and they automatically show the request icon if it is defined while calls are being made. The results is a JSON object or another type or response can be returned. 

```js
async example() {
    var url = "url";
    var data = await getURL(url);
    var data = await postURL(url);
    var data = await requestURL(url);
}
```
The method `getURL()` is equivalent to this: 
```js
// this...
var data = await this.getURL("/data");

// ...is about the same as this
var response = await fetch("/data");
var data = await response.json();
```

The method `postURL()` is equivalent to this: 
```js
// this...
var data = await this.postURL("/data", {data: "some data"});

// ...is about the same as this
var response = await fetch("/data", {method: "post", bodh: {data: "some data"}});
var data = await response.json();
```

Note: It is recommended to wrap all requests calls in a `try catch` block, or have the parent method wrapped in a `try catch` block. 

---
#Examples  

The`LoginApp.ts` and the `ExampleApp.ts` file shows a more advanced example of how to use this class in your web projects. These examples do not include the HTML pages but are designed to work with HTML pages. 

More Examples:
- BasicExample.ts - basic bare bones example
- LoginApp.ts - example of a login app
- ExampleApp.ts - example adding listeners and loading remote data and displaying it
- InlineViewApp.ts - example of declaring a view in the same file as the class
- ExtendedView.ts - example of declaring a view that extends another view

---
#Extending Functionality Easily
If there is still some functionality missing

In that case create a sub class with the missing features and then have your main class extend that. Use it in your projects. If you believe it is a good fit for adding to the base class then do a pull request at the github page. 

```javascript
// create an intermediary class that extends BaseClass with your custom methods
class BaseClass2 extends BaseClass {
    myFunction() {}
    myFunction2() {}
}

// extend the intermediary class
class MainClass extends BaseClass2 {
    override async start() {
        this.myFunction();
    }
}
```
---

This is a work in progress. Please post issues and improvements on the github issues page. https://github.com/velara3/WebApp/issues 

If you can't get it figured out you can simply copy and paste BaseClass.ts into your project and import it using ES module syntax. 

---
CSS:  
There are a few CSS classes that this workflow relies on. They are added by default. You can exclude them by setting the startup option `addStyles` to `false`. 

```CSS
.display {
    display: block !important;
}
.noDisplay {
    display: none !important;
}
.center { 
   left: 50%;
   top: 50%;
   transform: translateX(-50%) translateY(-50%);
}
dialog:focus {
    outline: none;
}
dialog::backdrop {
   background: rgba(0,0,0,.25);
}
```

The BaseClass also uses the following naming for the CSS classes, dialog and the network icon to find and reference these elements. Update them in your sub classes if you need to and ensure elements with these ids or classes are on the HTML page.  

```javascript
   showClass: string = "display";
   hideClass: string = "noDisplay";
   requestIconSelector: string = "#requestIcon";
   dialogSelector: string = "#dialog";
   dialogTitleSelector: string = "#dialogTitle";
   dialogMessageSelector: string = "#dialogMessage";
   versionLabelSelector: string = "#versionLabel";
   defaultCSS: string = ... // default css. in sub classes append your own rather than overwrite 
```
---
#Startup Options  

The startup options allows you to configure what options are enabled when creating your class. 

```javascript
export type StartOptions =  {
   startWith?: string, /* a method to call after the class is created. note: start is always called first. default null */
   addStyles: boolean, /* adds the basic styles needed for some functionality. default true */ 
   bindProperties: boolean /* binds the class members to the class for the this keyword. default true*/
}

BaseClass.startWhenReady(MyClass, {addStyles: true});
```

If you need to start manually, on an event other than on the page `DOMContentLoaded` then you can call the static method `BaseClass.start(MyClass)`. 

---
#Getting Started

- Open vscode
- create a folder for your project
- create an HTML file (use the example HTML above)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World</title>
    <script src="MyApp.js" type="module"></script>
</head>
<body>
    <h1 id="header">Hello World</h1>
</body>

</html>
```
- create a typescript file (example MyApp.ts)
- install npm
- open a console / terminal window in vscode
- enter `npm install base-class-ts@latest`
- enter `tsc init` 
- enter the following code: 
```json
{
    "compilerOptions": {
      "target": "ESNext",
      "module": "Preserve",
      "inlineSourceMap": true,
      "esModuleInterop": true, 
      "forceConsistentCasingInFileNames": true, 
  
      /* Type Checking */
      "strict": true,
      "noImplicitOverride": true,
      "allowUnreachableCode": true,
      "skipLibCheck": true
    }
}
```
- in MyApp.ts put the following code:  
```typescript
import { BaseClass } from "base-class-ts"

export class MyClass extends BaseClass {

    constructor() {
        super();
    }

    // place your code here
    override async start() {
        console.log("Hello world");
        console.log("Start method");
    }
}
```
- install bun
- create a bun.build.js file (see bun section)
- in a console / terminal enter `bun bun.build.js`
- install Live Server (or your favorite server)
- launch the server
- view the HTML page with the server
- open Web Dev tools 
- inspect the source tab and check the source and source maps work
- create tasks and launch configs (see tasks section)
- make issues on github issues page (https://github.com/velara3/WebApp) for any bugs, features or feedback  

---
#Bundling your modules / pages  

You can use Bun to bundle your typescript classes into the same file
- Install bun (https://bun.sh/docs/installation)
- open a folder or project in vscode
- open a terminal in your project
- add base-class-ts with `bun add -d base-class-ts`
- call `bun add -d bun-plugin-html` if you want to bundle typescript in html pages 
- optionally import other existing modules with `bun install` (or npm install) 
- create bun.buld.js with the contents below
- call `bun bun.build.js` to build and bundle the typescript (See contents of bun.build.js file)

Your typescript classes will be transpiled into a javascript file that bundles all of your typescript. (See https://bun.sh/) 

bun.build.js:  
```javascript
import html from 'bun-plugin-html';
import { Glob } from "bun";

// read in all the typescript files in the /public directory
// (or the directory where your typescript files are located)
// and compile them into builded javascript files in the same directory
// using the same name as the typescript file but with a js extension
// your HTML pages should reference the javascript file 

// note: you could also pass in one or all of the HTML files
// but if you do that the HTML file might be ovewrritten
// set an output directory in the options 

const sourceDirectory = "./public/";
const glob = new Glob('*.ts');
var entrypoints = [...glob.scanSync(sourceDirectory)];
entrypoints = entrypoints.map((x) => sourceDirectory + x);
console.log("Compiling " + entrypoints.length + " typescript files...");

const results = await Bun.build({
  entrypoints: entrypoints,
  publicPath: "",
  sourcemap: "inline",
  outdir: './',
  plugins: [
    html()
  ],
});

if (!results.success) {
  console.error("Build failed");
  for (const message of results.logs) {
    console.error(message);
  }
}
else {
  console.log("Compiled " + results.outputs.length + " javascript files...");
}
```
---
Setting up Build Tasks

VSCode can run commands on build (command + shift + b). The following task will run `bun bun.build.js` when you build your project. In the `.vscode` directory in the root of the project create a file named `tasks.json`. If the `.vscode` directory doesn't exist you can create it. 

Enter commands in your vscode `tasks.json`;  
```json
{
	"version": "2.0.0",
	"tasks": [
		{
			"label": "run Bun",
			"type": "shell",
			"command": "bun bun.build.js",
			"group": {
				"kind": "build",
				"isDefault": true
			}
		}
	]
}
```
---
#Setting up build on save

You can have bun bundle your Typescript on file save. Add the Trigger on Save extension here (https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.triggertaskonsave). 

In vscode add the following to your settings.json file. You can open settings file using the command pallette option `Preferences: Open User Settings (JSON)`. Add the following:  
```json
    "triggerTaskOnSave.tasks": {
        
        "build": [
        ],
        "run Bun": [
            "public/*.ts"
        ],
    }
```
Make sure you have a task called, `run Bun`. See the tasks section. In the task option you have the options for when the command is ran. Above, the task, `run Bun` is run when any files in the `public` folder with the extension `.ts` are saved. See the extensions home page for more info. 


---
#Errors  

Property 'start' in type 'MyClass' is not assignable to the same property in base type 'BaseClass'.
  Type '() => void' is not assignable to type '() => Promise<void>'.
    Type 'void' is not assignable to type 'Promise<void>'.

Make sure the methods you override match the signiture of the method you are overriding. In the error above instead of using: 

```javascript
// incorrect 
start(): void {

}

// correct
override async start() {

}
```