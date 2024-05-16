import { BaseClass } from "./BaseClass.js";

window.addEventListener("DOMContentLoaded", ()=> { new HomeClass() })

class UserView {
   userLabel = document.getElementById("userLabel") as HTMLElement;
   userIcon = document.getElementById("userIcon") as HTMLElement;
}

var userView = new UserView();

export class HomeClass extends BaseClass {

   constructor() {
      super();

      try {
         this.bindProperties(HomeClass);
         this.contentLoaded();
      }
      catch(error) {
         this.log(error);
      }
   }

   async contentLoaded() {
      this.bindProperties(HomeClass);
      this.getUser();
   }

   async getUser() {
      try {
         var data = await this.requestURL("user");
         this.setContent(userView.userLabel, data.user);
      }
      catch(error) {
         this.log(error);
      }
   }
}