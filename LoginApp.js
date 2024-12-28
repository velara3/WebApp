import { BaseClass } from "./BaseClass.js";
import { LoginElements } from "./LoginElements.js";
window.addEventListener(BaseClass.PAGE_LOADED, () => { new LoginApp(); });
export var view = new LoginElements();
/**
 * Page [open](./login.html)
 * CSS [open](./styles/login.css)
 */
export class LoginApp extends BaseClass {
    constructor() {
        super();
        try {
            this.showRequestIcon(false);
            this.setupEventListeners();
        }
        catch (error) {
            this.log(error);
            this.showDialog("Error", error);
        }
    }
    setupEventListeners() {
        view.submitButton.addEventListener("click", this.submitFormHandler);
        view.idInput.addEventListener("keyup", this.inputKeyupHandler);
        view.passwordInput.addEventListener("keyup", this.inputKeyupHandler);
    }
    inputKeyupHandler(event) {
        if (event.keyCode == 13) {
            this.submitFormHandler(event);
        }
    }
    async submitFormHandler(event) {
        try {
            var idValue = view.idInput.value.trim();
            var passwordValue = view.passwordInput.value.trim();
            this.setContent(view.errorLabel, "");
            if (idValue == "") {
                this.setContent(view.errorLabel, "User is required");
                return;
            }
            if (passwordValue == "") {
                this.setContent(view.errorLabel, "Password is required");
                return;
            }
            var url = "login";
            var options = { "method": "post" };
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
        catch (error) {
            this.showDialog("Error", error);
            console.log(error);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9naW5BcHAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJMb2dpbkFwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRW5ELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLEdBQUUsRUFBRSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUV2RSxNQUFNLENBQUMsSUFBSSxJQUFJLEdBQWtCLElBQUksYUFBYSxFQUFFLENBQUM7QUFFckQ7OztHQUdHO0FBQ0gsTUFBTSxPQUFPLFFBQVMsU0FBUSxTQUFTO0lBRXBDO1FBQ0csS0FBSyxFQUFFLENBQUM7UUFFUixJQUFJLENBQUM7WUFDSCxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQzdCLENBQUM7UUFDRCxPQUFNLEtBQUssRUFBRSxDQUFDO1lBQ1gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoQixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxLQUFlLENBQUMsQ0FBQztRQUM3QyxDQUFDO0lBQ0osQ0FBQztJQUVRLG1CQUFtQjtRQUN6QixJQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUNwRSxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUMvRCxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBRUQsaUJBQWlCLENBQUMsS0FBVTtRQUN6QixJQUFJLEtBQUssQ0FBQyxPQUFPLElBQUUsRUFBRSxFQUFFLENBQUM7WUFDckIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pDLENBQUM7SUFDSixDQUFDO0lBRUQsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEtBQVU7UUFDL0IsSUFBSSxDQUFDO1lBQ0YsSUFBSSxPQUFPLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDaEQsSUFBSSxhQUFhLEdBQVcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDNUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRXJDLElBQUksT0FBTyxJQUFFLEVBQUUsRUFBRSxDQUFDO2dCQUNmLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO2dCQUNyRCxPQUFPO1lBQ1YsQ0FBQztZQUVELElBQUksYUFBYSxJQUFFLEVBQUUsRUFBRSxDQUFDO2dCQUNyQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztnQkFDekQsT0FBTztZQUNWLENBQUM7WUFFRCxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUM7WUFDbEIsSUFBSSxPQUFPLEdBQVEsRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFDLENBQUM7WUFDdEMsSUFBSSxRQUFRLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztZQUM5QixRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMvQixRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUMsQ0FBQztZQUMzQyxPQUFPLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztZQUV4QixJQUFJLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBRS9DLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNoQixNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7WUFDbEMsQ0FBQztpQkFDSSxDQUFDO2dCQUNILElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUM3QyxDQUFDO1FBQ0osQ0FBQztRQUNELE9BQU0sS0FBSyxFQUFFLENBQUM7WUFDWixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxLQUFlLENBQUMsQ0FBQztZQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JCLENBQUM7SUFDSixDQUFDO0NBQ0gifQ==