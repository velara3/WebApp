"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedElements = void 0;
const BaseElements_js_1 = require("./BaseElements.js");
class ExtendedElements extends BaseElements_js_1.BaseElements {
    constructor() {
        super(...arguments);
        this.createButton = document.getElementById("createButton");
        this.applyButton = document.getElementById("applyButton");
    }
}
exports.ExtendedElements = ExtendedElements;
