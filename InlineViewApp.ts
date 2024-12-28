import { BaseClass } from "./BaseClass.js";

class UserView {
   userLabel = document.getElementById("userLabel") as HTMLElement;
   userIcon = document.getElementById("userIcon") as HTMLElement;
}

var userView = new UserView();

export class HomeClass extends BaseClass {

   constructor() {
      super();
   }

   override async start() {
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

BaseClass.startWhenReady(HomeClass);