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
exports.HomeClass = void 0;
const BaseClass_js_1 = require("./BaseClass.js");
window.addEventListener("DOMContentLoaded", () => { new HomeClass(); });
class UserView {
    constructor() {
        this.userLabel = document.getElementById("userLabel");
        this.userIcon = document.getElementById("userIcon");
    }
}
var userView = new UserView();
class HomeClass extends BaseClass_js_1.BaseClass {
    constructor() {
        super();
        try {
            this.bindProperties(HomeClass);
            this.contentLoaded();
        }
        catch (error) {
            this.log(error);
        }
    }
    contentLoaded() {
        return __awaiter(this, void 0, void 0, function* () {
            this.bindProperties(HomeClass);
            this.getUser();
        });
    }
    getUser() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var data = yield this.requestURL("user");
                this.setContent(userView.userLabel, data.user);
            }
            catch (error) {
                this.log(error);
            }
        });
    }
}
exports.HomeClass = HomeClass;
