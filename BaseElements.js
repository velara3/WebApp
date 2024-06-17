"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseElements = void 0;
class BaseElements {
    constructor() {
        this.requestIcon = document.getElementById("requestIcon");
        this.dialog = document.getElementById("dialog");
        this.dialogTitle = document.getElementById("dialogTitle");
        this.dialogMessage = document.getElementById("dialogMessage");
        this.versionLabel = document.getElementById("versionLabel");
    }
}
exports.BaseElements = BaseElements;
