import { BaseClass } from "./BaseClass";

/**
 * This is example documentation. This class extends BaseClass
 * Add links to relevant pages in your own project.  
 * Page [open](./page.html)  
 * CSS [open](./styles/styles.css)   
 */
export class ExampleApp extends BaseClass {
   message: string = "hello world"

   constructor() {
      super();
   }

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
         window.addEventListener("click", () => {
            this.showAlert(this.message)
         });
      }
      catch (error) {
         this.log(error);
      }
   }

   showAlert(value: string) {
      alert(value);
   }
}

export { };