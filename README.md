# WebApp
This is a base class for web applications using Typescript and modules client side. It is meant to be a vanilla approach to web site using imports and modules. It separates the view out so that as it changes and it will, those changes do not affect the functionality of the web project.

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

The ExampleApp.ts shows how you import and use it in your web projects.

It is a work in progress and still has some bugs importing. Until the npm part is figured out, you can copy and paste BaseClass.ts into your project. 