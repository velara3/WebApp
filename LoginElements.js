"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginElements = void 0;
class LoginElements {
    constructor() {
        this.form = document.getElementById("form");
        this.idInput = document.getElementById("idInput");
        this.passwordInput = document.getElementById("passwordInput");
        this.submitButton = document.getElementById("submitButton");
        this.errorLabel = document.getElementById("errorLabel");
        this.requestIcon = document.getElementById("requestIcon");
    }
}
exports.LoginElements = LoginElements;
