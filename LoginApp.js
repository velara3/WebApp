"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginApp = exports.view = void 0;
const BaseClass_js_1 = require("./BaseClass.js");
const LoginElements_js_1 = require("./LoginElements.js");
window.addEventListener(BaseClass_js_1.BaseClass.PAGE_LOADED, () => { new LoginApp(); });
exports.view = new LoginElements_js_1.LoginElements();
class LoginApp extends BaseClass_js_1.BaseClass {
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
        exports.view.submitButton.addEventListener("click", this.submitFormHandler);
        exports.view.idInput.addEventListener("keyup", this.inputKeyupHandler);
        exports.view.passwordInput.addEventListener("keyup", this.inputKeyupHandler);
    }
    inputKeyupHandler(event) {
        if (event.keyCode == 13) {
            this.submitFormHandler(event);
        }
    }
    submitFormHandler(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var idValue = exports.view.idInput.value.trim();
                var passwordValue = exports.view.passwordInput.value.trim();
                this.setContent(exports.view.errorLabel, "");
                if (idValue == "") {
                    this.setContent(exports.view.errorLabel, "User is required");
                    return;
                }
                if (passwordValue == "") {
                    this.setContent(exports.view.errorLabel, "Password is required");
                    return;
                }
                var url = "login";
                var options = { "method": "post" };
                var formData = new FormData();
                formData.append("id", idValue);
                formData.append("password", passwordValue);
                options.body = formData;
                var data = yield this.requestURL(url, options);
                if (data.success) {
                    window.location.href = "/page";
                }
                else {
                    var message = data.message;
                    this.setContent(exports.view.errorLabel, message);
                }
            }
            catch (error) {
                this.showDialog("Error", error);
                console.log(error);
            }
        });
    }
}
exports.LoginApp = LoginApp;
