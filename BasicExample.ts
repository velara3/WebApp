import { BaseClass } from "./BaseClass";

export class ExampleApp extends BaseClass {
   message: string = "hello world"

   constructor() {
      super();
   }

   override async contentLoaded() {

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