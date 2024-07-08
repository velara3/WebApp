# WebApp
This is a base class for web applications using object oriented programming (OOP), Typescript and modules client side. It is not a framework and it is not functional programming or scripting. It is meant to be a vanilla approach to web site using imports and modules. It merely gives you a scalfold to setup and start your project. It separates the view out so that as it changes (and it will), those changes do not affect the functionality of the web project.

Setup is easy. You add and reference a Javascript or Typescript module in your web page (let's say index.ts / index.js). In that document you extend the BaseClass.ts in this project. Then you add your code in the constructor of your class or better yet in the contentLoaded() function. At the end of your class after it is closed add a call to `BaseClass.startWhenReady(MyClass)` (or if you want, create an instance and then call `instance.bindProperties(instance)`). Your class is then created when the page loads. 

If you have multiple views, you write your view class that gets the web elements and then import that view class into the module so your class can work with it. The views are project dependent. You define them. 

It supports: 
- working with separate views - keep your views separate and import them
- async and cancelable get and post methods
- upload methods
- download methods
- displaying dialog methods
- base css styles
- hiding and showing elements
- unhiding and rehiding elements
- checking the url query
- checking the url fragments
- updating the url query history
- updating the url fragment history

It adds a basic object oriented framework to start from. 

- You extend the class adding any imports you need
- You import any view classes
- Your class starts running code in the contentLoaded() function 
- Your class adds event listeners in the setupEventListeners() function
- You add a call to BaseClass.startWhenReady(MyClass) to start the class / application

The main class to extend is BaseClass.ts.   
The view classes you define and you can use the BaseElements.ts class as a template to learn from.

HTML page:  
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World</title>
</head>

<body>
    <h1 id="header">Hello World</h1>
    <script type="module" src="index.js">
    </script>
</body>

</html>
```

Basic Example: 
```javascript
import { BaseClass } from "base-class-ts/BaseClass"

export class MyClass extends BaseClass {

    constructor() {
        super();
        console.log("Hello world");
    }
}

BaseClass.startWhenReady(MyClass); // starts on window DOMContentLoaded
```

Basic Example with view class: 
```javascript
import { BaseClass } from "base-class-ts/BaseClass"

// you define the view elements that your project needs
class UserView {
   userLabel = document.getElementById("userLabel") as HTMLElement;
   userIcon = document.getElementById("userIcon") as HTMLElement;
}

var userView = new UserView();

export class MyClass extends BaseClass {

    constructor() {
        super();
        console.log("Hello world");
    }
}

BaseClass.startWhenReady(MyClass); // starts on window DOMContentLoaded
```

Example with view elements declared inline:  
```javascript
import { BaseClass } from "base-class-ts"

export class MyClass extends BaseClass {
    userLabel = document.getElementById("userLabel") as HTMLElement;
    userIcon = document.getElementById("userIcon") as HTMLElement;

    constructor() {
        super();
        console.log("Hello world");
    }
}

BaseClass.startWhenReady(MyClass); // starts on window DOMContentLoaded
```

Example importing an external view class:    
```javascript
import { BaseClass } from "base-class-ts"
// your views will always be local to your project
import * as view from "./ExampleElements.js";

export class MyClass extends BaseClass {

    constructor() {
        super();
        console.log("Hello world");
        this.setupEventListeners();
    }

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
Example of view elements declared directly in an external file. 

ExampleElements.ts:  
```javascript
// import * as view from "./Elements.js";
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

The `ExampleApp.ts` file shows a more advanced example of how to use this class in your web projects.

Examples:
- LoginApp.ts - example of a login app
- ExampleApp.ts - example adding listeners and loading remote data and displaying it
- InlineViewApp.ts - example of declaring a view in the same file as the class
- ExtendedView.ts - example of declaring a view that extends another view

---
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
// your html pages should reference the javascript file 

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

This is a work in progress and still has some issues. Please post issues on the github issues page. https://github.com/velara3/WebApp/issues 

If you can't get it figured out you can simply copy and paste BaseClass.ts into your project and import it using ES module syntax. 

---
VSCode can run commands on build (command + shift + b). The following task will run `bun bun.build.js` when you build your project. 

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

Errors  

Property 'contentLoaded' in type 'AddItemClass' is not assignable to the same property in base type 'BaseClass'.
  Type '() => void' is not assignable to type '() => Promise<void>'.
    Type 'void' is not assignable to type 'Promise<void>'.

Make sure the methods you override match the signiture of the method you are overriding. In the error above instead of using: 

```
content(): void {

}
// use
override async contentLoaded() {

}
```