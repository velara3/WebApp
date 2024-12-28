import { BaseClass } from "./BaseClass";

/**
 * This is example documentation. This class extends BaseClass
 * Add links to relevant pages in your own project.  
 * Page [open](./page.html)  
 * CSS [open](./styles/styles.css)   
 */
export class BasicExample extends BaseClass {
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

   override setupEventListeners(): void {
      try {
         window.addEventListener("click", this.showMessage);
      }
      catch (error) {
         this.log(error);
      }
   }

   showMessage() {
      alert(this.message);
   }
}

/**
 * By default this function adds a listener for the page DOMContentLoaded event.
 * When that event is dispatched the class instance is created
 * and the following methods are called in order:  
 * - bindViewElements()
 * - setupEventListeners()
 * - start()
 * 
 * You can pass in startup options to adjust starting preferences 
 */
BaseClass.startWhenReady(BasicExample);