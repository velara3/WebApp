import { BaseClass, getStartOptions, StartOptions } from "./BaseClass";

/**
 * This example shows setting up startup options.
 * Add links to relevant pages in your own project.  
 * Page [open](./page.html)  
 * CSS [open](./styles/styles.css)   
 */
export class StartupOptions extends BaseClass {
   message: string = "hello world"

   constructor() {
      super();
   }

   /**
    * Override the start() function and put your code here
    * The page has loaded and is ready 
    * The following events are calling in order: 
    * bindViewElements()
    * setupEventListeners()
    * start()
    */
   override async start() {

      try {
         this.log(this.message);
      }
      catch (error) {
         this.log(error);
      }
   }

   test() {
      // because of our startup options,
      // this method is excluded from class binding in bindProperties()
   }
}

/**
 * By default this function adds a listener for the page DOMContentLoaded event.
 * When that event is dispatched the class instance is created
 * and the following methods are called in order:  
 * - bindProperties()
 * - bindViewElements()
 * - setupEventListeners()
 * - start()
 * 
 * You will normally always override 
 * - bindViewElements()
 * - setupEventListeners()
 * - start() 
 *  
 * You can pass in startup options to adjust starting preferences 
 */

var startOptions: StartOptions = getStartOptions();
startOptions.bindExclusions = ["test"];
BaseClass.startWhenReady(StartupOptions);