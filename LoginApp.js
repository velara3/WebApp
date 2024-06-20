import { BaseClass } from "./BaseClass.js";
import { LoginElements } from "./LoginElements.js";
window.addEventListener(BaseClass.PAGE_LOADED, () => { new LoginApp(); });
export var view = new LoginElements();
export class LoginApp extends BaseClass {
    constructor() {
        super();
        try {
            this.bindProperties(LoginApp);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9naW5BcHAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJMb2dpbkFwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRW5ELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLEdBQUUsRUFBRSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUV2RSxNQUFNLENBQUMsSUFBSSxJQUFJLEdBQWtCLElBQUksYUFBYSxFQUFFLENBQUM7QUFFckQsTUFBTSxPQUFPLFFBQVMsU0FBUSxTQUFTO0lBRXBDO1FBQ0csS0FBSyxFQUFFLENBQUM7UUFFUixJQUFJLENBQUM7WUFDSCxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDN0IsQ0FBQztRQUNELE9BQU0sS0FBSyxFQUFFLENBQUM7WUFDWCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEtBQWUsQ0FBQyxDQUFDO1FBQzdDLENBQUM7SUFDSixDQUFDO0lBRVEsbUJBQW1CO1FBQ3pCLElBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3BFLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQy9ELElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxLQUFVO1FBQ3pCLElBQUksS0FBSyxDQUFDLE9BQU8sSUFBRSxFQUFFLEVBQUUsQ0FBQztZQUNyQixJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakMsQ0FBQztJQUNKLENBQUM7SUFFRCxLQUFLLENBQUMsaUJBQWlCLENBQUMsS0FBVTtRQUMvQixJQUFJLENBQUM7WUFDRixJQUFJLE9BQU8sR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNoRCxJQUFJLGFBQWEsR0FBVyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUM1RCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFckMsSUFBSSxPQUFPLElBQUUsRUFBRSxFQUFFLENBQUM7Z0JBQ2YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLGtCQUFrQixDQUFDLENBQUM7Z0JBQ3JELE9BQU87WUFDVixDQUFDO1lBRUQsSUFBSSxhQUFhLElBQUUsRUFBRSxFQUFFLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO2dCQUN6RCxPQUFPO1lBQ1YsQ0FBQztZQUVELElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQztZQUNsQixJQUFJLE9BQU8sR0FBUSxFQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUMsQ0FBQztZQUN0QyxJQUFJLFFBQVEsR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO1lBQzlCLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQy9CLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQzNDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO1lBRXhCLElBQUksSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFFL0MsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ2hCLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztZQUNsQyxDQUFDO2lCQUNJLENBQUM7Z0JBQ0gsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDM0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzdDLENBQUM7UUFDSixDQUFDO1FBQ0QsT0FBTSxLQUFLLEVBQUUsQ0FBQztZQUNaLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEtBQWUsQ0FBQyxDQUFDO1lBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckIsQ0FBQztJQUNKLENBQUM7Q0FDSCJ9