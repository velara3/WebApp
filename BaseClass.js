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
exports.BaseClass = void 0;
class BaseClass {
    constructor() {
        this.showClass = "display";
        this.hideClass = "noDisplay";
        this.requestsInProgress = 0;
        this.controllers = new Map();
        this.requestIcon = document.getElementById("requestIcon");
        this.dialog = document.getElementById("dialog");
        this.dialogTitle = document.getElementById("dialogTitle");
        this.dialogMessage = document.getElementById("dialogMessage");
        this.versionLabel = document.getElementById("versionLabel");
    }
    static startWhenReady(ClassReference, startWith) {
        window.addEventListener(BaseClass.PAGE_LOADED, (event) => {
            try {
                var instance = new ClassReference();
                if (startWith) {
                    instance[startWith]();
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    /**
     * Override and call this method for async
     */
    contentLoaded() {
        return __awaiter(this, void 0, void 0, function* () {
            this.bindProperties(BaseClass);
        });
    }
    /**
     * Check the query
     */
    checkQuery() {
        var url = new URL(window.location.href);
        var parameters = url.searchParams;
    }
    /**
     * Performs an asynchronous get call.
     * Returns the url as text or json.
     * Default is JSON.
     * Call using await. Cancel using cancelRequests()
     *
     * If adding a query string add it to the url like so
     * ```
     * var parameters = new URLSearchParams();
     * var url = "url";
     * parameters.set("id", id);
     * var results = await this.requestURL(url + "?" + parameters.toString() );
     * ```
     * @param url url
     * @param options options fetch options object. example, {method: "post", body: formData }
     * @param json returns the results as json. default is true
     * @returns
     */
    getURL(url_1) {
        return __awaiter(this, arguments, void 0, function* (url, options = null, json = true) {
            if (options == null) {
                options = {};
            }
            ;
            options.method = "get";
            return yield this.requestURL(url, options, json);
        });
    }
    /**
     * Performs an asynchronous post call.
     * Returns the url as text or json. Default is JSON.
     * Call using `await`.
     * Pass the form data as a form data object:
     * ```
     * var formData = new FormData();
     * formData.set("id", id);
     * var results = await this.postURL("url", formData);
     * ```
     * Cancel using cancelRequests()
     * @param url url
     * @param options options fetch options object. example, {method: "post", body: formData }
     * @param json returns the results as parsed object from json string
     * @returns text, parsed json object or a TypeError if network is unavailable.
     */
    postURL(url_1, form_1) {
        return __awaiter(this, arguments, void 0, function* (url, form, options = null, json = true) {
            if (options == null) {
                options = {};
            }
            if (form && options.body == null) {
                options.body = form;
            }
            options.method = "post";
            return yield this.requestURL(url, options, json);
        });
    }
    /**
     * Makes a request to a url.
     * Returns the url as text or json.
     * Default is JSON.
     * Call using await. Cancel using cancelRequests()
     *
     * If creating a post pass the form data as the body of the options
     * ```
     * var formData = new FormData();
     * formData.set("id", id);
     * var data = await this.requestURL("url", {method: "post", body: formData});
     * ```
     * If creating a get pass the form data as the body of the options
     * ```
     * var parameters = new URLSearchParams();
     * parameters.set("id", id);
     * var results = await this.requestURL("url?" + parameters.toString() );
     * ```
     * @param url url
     * @param options options fetch options object. example, {method: "post", body: formData }
     * @param json returns the results as json. default is true
     * @returns text, parsed json object or a TypeError if network is unavailable.
     */
    requestURL(url_1) {
        return __awaiter(this, arguments, void 0, function* (url, options = null, json = true) {
            var response = null;
            try {
                this.showRequestIcon();
                yield this.sleep(10);
                const controller = new AbortController();
                const signal = controller.signal;
                if (options == null) {
                    options = {};
                }
                if (options.signal == null) {
                    options.signal = signal;
                }
                ;
                var requestId = this.requestsInProgress++;
                this.controllers.set(requestId, controller);
                response = yield fetch(url, options);
                var text = yield response.text();
                this.controllers.delete(requestId);
                this.requestsInProgress--;
                if (this.controllers.size == 0) {
                    this.showRequestIcon(false);
                }
                if (json) {
                    try {
                        var data = JSON.parse(text);
                    }
                    catch (error) {
                        this.log(error);
                        return text;
                    }
                    return data;
                }
                return response;
            }
            catch (error) {
                this.requestsInProgress--;
                if (response && this.controllers && this.controllers.has(this.requestsInProgress + 1)) {
                    this.controllers.delete(this.requestsInProgress + 1);
                }
                return error;
            }
        });
    }
    /**
     * Attach event listeners here
     * Override in sub classes
     */
    setupEventListeners() {
    }
    /**
     * Handler for receiving a message from an embedded iframe
     * Override in your sub class
     * @param event
     * @returns
     */
    postMessageHandler(event) {
        if (event.origin !== "https://")
            return;
        var data = event.data;
        if (data == "postMessage") {
            console.log("postMessage");
        }
    }
    /**
     * Cancel any requests
     */
    cancelRequests() {
        if (this.controllers) {
            this.controllers.forEach((value, key, map) => {
                value.abort();
            });
        }
    }
    /**
     * Wait a specific amount of time in milliseconds before proceeding to the next line of code
     * Must use await in front of this call
     * @param ms
     * @returns
     */
    sleep(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }
    /**
     * Show a dialog.
     * Dialog must be an element defined to the dialog property
     * By default the dialog has an id of dialog and is an HTMLDialogElement on the page
     * @param title Title in dialog
     * @param value text to show in dialog
     * @param callback Callback after user clicks ok or exits from dialog
     */
    showDialog(title, value, callback = null) {
        if (this.dialog) {
            this.setContent(this.dialogTitle, title);
            this.setContent(this.dialogMessage, value);
            this.addClass(this.dialog, "display");
            this.addClass(this.dialog, "center");
            this.dialog.showModal();
            this.dialogCallback = callback;
        }
    }
    /**
     * Close dialog event handler
     */
    closeDialogClickHandler() {
        this.closeDialog();
    }
    /**
     * Closs dialog if dialog is open. Calls dialog callback if defined
     */
    closeDialog() {
        if (this.dialog) {
            this.removeClass(this.dialog, "display");
            this.dialog.close();
        }
        if (this.dialogCallback) {
            this.dialogCallback();
        }
    }
    /**
     * Add a class to an element or an array of elements
     * @param element element or elements to add a class to
     * @param name name of class
     */
    addClass(element, name) {
        if (element instanceof HTMLElement) {
            element = [element];
        }
        if (element instanceof Array) {
            for (let i = 0; i < element.length; i++) {
                const el = element[i];
                el.classList.add(name);
            }
        }
    }
    /**
     * Remove a class from an element or an array of elements
     * @param element element or array of elements to remove a class from
     * @param name name of class to remove
     */
    removeClass(element, name) {
        if (element instanceof HTMLElement) {
            element = [element];
        }
        for (let i = 0; i < element.length; i++) {
            const el = element[i];
            el.classList.remove(name);
        }
    }
    /**
     * Shows or hides an icon assigned to the networkIcon property
     * @param display if true the icon is displayed
     */
    showRequestIcon(display = true) {
        if (this.requestIcon) {
            if (display) {
                this.revealElement(this.requestIcon, true);
            }
            else {
                this.revealElement(this.requestIcon, false);
            }
        }
    }
    /**
     * Reveals an element that is hidden at startup
     * @param element element to reveal
     * @param display if true displays the element or hides if false. default true
     */
    revealElement(element, display = true) {
        if (element && "classList" in element) {
            if (display) {
                this.removeClass(element, this.hideClass);
            }
            else {
                this.addClass(element, this.hideClass);
            }
        }
    }
    /**
     * Hides an element that is displayed at startup
     * @param element element to hide
     */
    hideElement(element) {
        if (element && "classList" in element) {
            this.addClass(element, this.hideClass);
        }
    }
    /**
     * Gets the version defined at a version endpoint
     * @param text Pretext for version info
     */
    getVersion() {
        return __awaiter(this, arguments, void 0, function* (text = "Version ") {
            try {
                var data = yield this.requestURL("version");
                var version = data.version;
                var label = this.versionLabel;
                if (label) {
                    this.setContent(label, version);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    /**
     * Cancels a request
     */
    cancelRequest() {
        try {
            this.cancelRequests();
        }
        catch (error) {
            this.log(error);
        }
    }
    /**
     * Set the style of an element
     * @param element element that has style
     * @param property name of style or style property
     * @param value value of style
     * @param priority priority of style
     * @param resetValue value of style to set after a reset timeout (optional)
     * @param resetTimeout timeout in milliseconds to reset style to (optional)
     */
    setStyle(element, property, value, priority, resetValue = null, resetTimeout = 5000) {
        element.style.setProperty(property, value, priority);
        if (resetValue !== null) {
            setTimeout(this.setStyle, resetTimeout, element, resetValue);
        }
    }
    /**
     * Set the parent of an element
     * @param element element that will be parented
     * @param parent parent element
     */
    setParent(element, parent) {
        parent.appendChild(element);
    }
    /**
     * Set the text content of a span element
     * @param element element that will be set
     * @param value value to set span
     * @param tooltip value to set tool tip of span (optional)
     * @param resetValue value to be set after a reset timeout (optional)
     * @param resetTimeout timeout in milliseconds to reset style to (optional)
     */
    setContent(element, value, tooltip = null, resetValue = null, resetTimeout = 5000) {
        element.textContent = value;
        if (typeof tooltip == "string") {
            element.title = tooltip;
        }
        else if (tooltip) {
            element.title = value;
        }
        if (resetValue !== null) {
            setTimeout(this.setContent, resetTimeout, element, resetValue);
        }
    }
    /**
     * Add element to the container.
     * Element can be string or element. If string then the element is created
     * Properties and styles can be set on the element and child elements can be added
     * @param container container for element
     * @param element element
     * @param properties properties or styles to set on element
     * @param children additional child elements
     */
    addElement(container, element, properties = null, ...children) {
        try {
            if (typeof element == "string") {
                element = this.createElement(element, properties, ...children);
            }
            if (typeof element === "object") {
                container.appendChild(element);
            }
        }
        catch (error) {
            this.log(error);
        }
    }
    /**
     * Creates an element and optionally child elements
     * @param tagName name of element to create
     * @param properties properties to apply to element
     * @param children child elements to create
     * @returns element
     */
    createElement(tagName, properties = null, ...children) {
        try {
            var element = document.createElement(tagName);
            if (properties) {
                if (properties.nodeType || typeof properties !== "object") {
                    children.unshift(properties);
                }
                else {
                    for (var property in properties) {
                        var value = properties[property];
                        if (property == "style") {
                            Object.assign(element.style, value);
                        }
                        else {
                            element.setAttribute(property, value);
                            if (property in element) {
                                element[property] = value;
                            }
                        }
                    }
                }
            }
            for (var child of children) {
                element.appendChild(typeof child === "object" ? child : document.createTextNode(child));
            }
            return element;
        }
        catch (error) {
            this.log(error);
        }
        return;
    }
    /**
     * Set the url query of the current page
     * @param parameter name of parameter
     * @param value value to set parameter to
     */
    updateQuery(parameter, value) {
        var url = new URL(window.location.href);
        var searchParameters = url.searchParams;
        searchParameters.set(parameter, value);
        var pathQuery = window.location.pathname + "?" + searchParameters.toString();
        history.pushState(null, "", pathQuery);
    }
    /**
     * Bind the members on this class to refer to this class
     * @param mainClass Class to add bindings to
     */
    bindProperties(mainClass) {
        var properties = Object.getOwnPropertyNames(mainClass.prototype);
        var that = this;
        for (var key in properties) {
            var property = properties[key];
            if (property !== "constructor") {
                that[property] = that[property].bind(this);
            }
        }
    }
    /**
     * Scroll element into view
     * @param element element to scroll into view
     * @param behavior scroll behavior. default is smooth
     * @param block position to scroll to. default is start
     * @param inline
     */
    scrollElementIntoView(element, behavior = "smooth", block = "start", inline = "nearest") {
        element.scrollIntoView(({ behavior, block, inline }));
    }
    /**
     * Scroll to bottom of element
     * @param element element to scroll to bottom
     */
    scrollToBottom(element) {
        if (element instanceof HTMLTextAreaElement) {
            element.scrollTop = element.scrollHeight;
        }
        else {
            element.scrollTop = element.scrollHeight;
        }
    }
    getDownloadData(url) {
        return __awaiter(this, void 0, void 0, function* () {
            var binary = yield this.getFileBinaryAtURL(url);
            var binaryBuffer = new Blob([binary.buffer]);
            return binaryBuffer;
        });
    }
    getFileBinaryAtURL(url) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.onload = () => {
                if (request.status === 200) {
                    try {
                        const array = new Uint8Array(request.response);
                        resolve(array);
                    }
                    catch (error) {
                        reject(error);
                    }
                }
                else {
                    reject(request.status);
                }
            };
            request.onerror = reject;
            request.onabort = reject;
            request.open('GET', url, true);
            request.responseType = "arraybuffer";
            request.send();
        });
    }
    upload(url, file, formData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (formData == null) {
                    formData = new FormData();
                }
                if (file instanceof Blob || file instanceof File) {
                    formData.append('file', file);
                }
                else {
                    var files = file;
                    for (const file of files) {
                        formData.append('files', file);
                    }
                }
                try {
                    var results = yield this.postURL(url, formData);
                    return results;
                }
                catch (error) {
                    this.log(error);
                    return error;
                }
            }
            catch (error) {
                this.log(error);
                return error;
            }
        });
    }
    copyToClipboard(value) {
        navigator.clipboard.writeText(value);
    }
    openInWindow(url, target) {
        window.open(url, target);
    }
    checkFragment() {
        return __awaiter(this, void 0, void 0, function* () {
            var hash = window.location.hash.replace("#", "").toLowerCase();
            switch (hash) {
                case "case1":
                    break;
                case "case2":
                    break;
                case "":
                    break;
                default:
            }
        });
    }
    createOption(label, value, useListItem = false, icon = null, classes = [], callback) {
        var optionName = useListItem ? "li" : "option";
        var option = document.createElement(optionName);
        option.innerText = label;
        if (icon) {
            var iconElement = document.createElement("img");
            iconElement.src = icon;
            option.innerHTML = iconElement.outerHTML + label;
            for (var className in classes) {
                option.classList.add(classes[className]);
            }
        }
        else {
            option.innerHTML = label;
        }
        option.label = label;
        option.value = value;
        if (callback) {
            callback(option, label, value);
        }
        return option;
    }
    /**
    * Log values to the console
    * @param values values to log
    */
    log(...values) {
        console.log(...values);
    }
}
exports.BaseClass = BaseClass;
BaseClass.PAGE_LOADED = "DOMContentLoaded";