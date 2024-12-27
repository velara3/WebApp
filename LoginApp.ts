import { BaseClass } from "./BaseClass.js";
import { LoginElements } from "./LoginElements.js";

window.addEventListener(BaseClass.PAGE_LOADED, ()=> { new LoginApp() })

export var view: LoginElements = new LoginElements();

/**
 * Page [open](./login.html)  
 * CSS [open](./styles/login.css)   
 */
export class LoginApp extends BaseClass {

   constructor() {
      super();

      try {
        this.bindProperties(LoginApp);
        this.showRequestIcon(false);
        this.setupEventListeners();
      }
      catch(error) {
         this.log(error);
         this.showDialog("Error", error as string);
      }
   }

   override setupEventListeners(): void {
      view.submitButton.addEventListener("click", this.submitFormHandler);
      view.idInput.addEventListener("keyup", this.inputKeyupHandler);
      view.passwordInput.addEventListener("keyup", this.inputKeyupHandler);
   }
   
   inputKeyupHandler(event: any) {
      if (event.keyCode==13) {
         this.submitFormHandler(event);
      }
   }

   async submitFormHandler(event: any) {
      try {
         var idValue: string = view.idInput.value.trim();
         var passwordValue: string = view.passwordInput.value.trim();
         this.setContent(view.errorLabel, "");

         if (idValue=="") {
            this.setContent(view.errorLabel, "User is required");
            return;
         }

         if (passwordValue=="") {
            this.setContent(view.errorLabel, "Password is required");
            return;
         }

         var url = "login";
         var options: any = {"method": "post"};
         var formData = new FormData();
         formData.append("id", idValue);
         formData.append("password", passwordValue);
         options.body = formData;
         
         var data = await this.requestURL(url, options);

         if (data.success) {
            window.location.href = "/page";
         }
         else {
            var message = data.message;
            this.setContent(view.errorLabel, message);
         }
      }
      catch(error) {
        this.showDialog("Error", error as string);
        console.log(error);
      }
   }
}