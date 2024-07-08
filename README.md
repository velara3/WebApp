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
```
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
```
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
```
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

Example with view items inline:  
```
import { BaseClass } from "base-class-ts/BaseClass"

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
Example with external view:    
```
import { BaseClass } from "base-class-ts/BaseClass"
// your views will always be local to your project
import * as view from "./ExampleElements.js";

export class MyClass extends BaseClass {

    constructor() {
        super();
        console.log("Hello world");
        this.bindProperties(this);
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

The ExampleApp.ts shows a more advanced example of how to use it in your web projects.

Examples:
- LoginApp.ts - example of a login app
- ExampleApp.ts - example adding listeners and loading remote data and displaying it
- InlineViewApp.ts - example of declaring a view in the same file as the class
-  

It is a work in progress and still has some issues importing. You may need to import the js file. 

Until the npm part is figured out, you can copy and paste BaseClass.ts into your project. 

