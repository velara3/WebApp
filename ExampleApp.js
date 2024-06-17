"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.ExampleApp = void 0;
const view = __importStar(require("./ExampleElements.js"));
const BaseClass_js_1 = require("./BaseClass.js");
window.addEventListener(BaseClass_js_1.BaseClass.PAGE_LOADED, () => { new ExampleApp().contentLoaded(); });
class ExampleApp extends BaseClass_js_1.BaseClass {
    constructor() {
        super();
        this.examplesData = {};
        this.renderers = {};
    }
    contentLoaded() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.bindProperties(ExampleApp);
                this.showRequestIcon(false);
                this.setupEventListeners();
                yield this.getExampleData();
            }
            catch (error) {
                this.log(error);
            }
        });
    }
    setupEventListeners() {
        try {
            view.examplesButton.addEventListener("click", this.getExamplesHandler);
            window.addEventListener("message", this.postMessageHandler);
        }
        catch (error) {
            this.log(error);
        }
    }
    getExamplesHandler(event) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getExampleData();
        });
    }
    getExampleData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var results = yield this.requestURL("examples");
                this.log(results);
                if (results.success == false) {
                    if (results.notLoggedIn == true) {
                        this.showDialog("Login", "Login required", () => {
                            window.location.href = "/login";
                        });
                        return;
                    }
                    else {
                        this.showDialog("Error", results.message);
                    }
                }
                this.parseData(view.exampleGrid, results.data);
            }
            catch (error) {
                this.log(error);
            }
        });
    }
    parseData(container, data, clear = false) {
        try {
            var items = data;
            var numberOfItems = items ? items.length : 0;
            if (clear) {
                container.innerHTML = "";
            }
            for (var i = 0; i < numberOfItems; i++) {
                var item = items[i];
                var itemName = item.name;
                var id = item.id;
                var itemThumbnailURL = item.thumbnail;
                var exampleItemRenderer = view.exampleItemRenderer.cloneNode(true);
                var exampleImage = exampleItemRenderer.querySelectorAll(".exampleImage")[0];
                var exampleNameLabel = exampleItemRenderer.querySelectorAll(".exampleName")[0];
                this.setContent(exampleNameLabel, itemName);
                exampleImage.src = itemThumbnailURL;
                exampleImage.dataset.id = id;
                exampleItemRenderer.dataset.id = id;
                exampleItemRenderer.addEventListener("click", this.exampleItemClickHandler);
                this.addElement(container, exampleItemRenderer);
                this.examplesData[id] = item;
                this.renderers[id] = exampleItemRenderer;
            }
        }
        catch (error) {
            this.log(error);
            this.showDialog("Error", error);
        }
    }
    exampleItemClickHandler(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var itemRenderer = event.currentTarget;
                var id = itemRenderer.dataset.id;
                var item = this.examplesData[id];
            }
            catch (error) {
                this.log(error);
            }
        });
    }
    checkQuery() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var url = new URL(window.location.href);
                var parameters = url.searchParams;
                var id = parameters.get("id");
                if (id) {
                }
            }
            catch (error) {
                this.log(error);
            }
        });
    }
}
exports.ExampleApp = ExampleApp;
