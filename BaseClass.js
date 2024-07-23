export class BaseClass {
    showClass = "display";
    hideClass = "noDisplay";
    requestIconSelector = "#requestIcon";
    dialogSelector = "#dialog";
    dialogTitleSelector = "#dialogTitle";
    dialogMessageSelector = "#dialogMessage";
    versionLabelSelector = "#versionLabel";
    controllers = new Map();
    requestIcon = document.querySelector(this.requestIconSelector);
    dialog = document.querySelector(this.dialogSelector);
    dialogTitle = document.querySelector(this.dialogTitleSelector);
    dialogMessage = document.querySelector(this.dialogMessageSelector);
    versionLabel = document.querySelector(this.versionLabelSelector);
    dialogCallback;
    requestsInProgress = 0;
    localClassReference;
    static PAGE_LOADED = "DOMContentLoaded";
    constructor() {
    }
    static startWhenReady(ClassReference, options) {
        window.addEventListener(BaseClass.PAGE_LOADED, (event) => {
            try {
                BaseClass.start(ClassReference, options);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    /**
     * Static method that creates an instance of your class and then calls the instance start() method
     * @param ClassReference Reference to your class that extends BaseClass
     * @param options StartOptions
     * @returns instance of your class
     */
    static start(ClassReference, options) {
        var instance = new ClassReference();
        instance.localClassReference = ClassReference;
        // save reference to our instance
        if (options?.storeReference) {
            this.instances.push(instance);
            this.instancesMap.set(instance.constructor, instance);
        }
        var defaultOptions = getStartOptions();
        if (options) {
            Object.assign(defaultOptions, options);
        }
        instance.applyOptions(defaultOptions);
        instance.start();
        return instance;
    }
    static instances = [];
    static instancesMap = new Map();
    /**
     * Override and call this method for startup
     */
    async start() {
    }
    /**
     * Set some start up options
     * @param options
     */
    applyOptions(options) {
        if (options?.bindProperties) {
            this.bindProperties(this.localClassReference);
        }
        if (options?.addStyles) {
            this.addDefaultStyles();
        }
        if (options?.startWith) {
            var value = options.startWith;
            // @ts-ignore
            this[value]();
        }
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
     * var jsonResults = await this.getURL(url + "?" + parameters.toString() );
     *
     * // getting a response object
     * var response = await this.getURL("url?" + parameters.toString(), null, null);
     *
     * // getting text
     * var text = await this.getURL("url?" + parameters.toString(), null, "text");
     * ```
     * @param url url
     * @param options options fetch options object. example, {method: "post", body: formData }
     * @param json returns the results as json. default is true
     * @returns
     */
    async getURL(url, options = null, type = "json") {
        if (options == null) {
            options = {};
        }
        ;
        options.method = "get";
        return await this.requestURL(url, options, type);
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
     * @param type type of object to return. default is json object. if null then response object
     * @returns text, parsed json object or a TypeError if network is unavailable.
     */
    async postURL(url, form, options = null, type = "json") {
        if (options == null) {
            options = {};
        }
        if (form && options.body == null) {
            options.body = form;
        }
        options.method = "post";
        return await this.requestURL(url, options, type);
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
     *
     * // getting a response object
     * var response = await this.requestURL("url?" + parameters.toString(), null, null);
     *
     * // getting text
     * var text = await this.requestURL("url?" + parameters.toString(), null, "text");
     * ```
     * @param url url
     * @param options options fetch options object. example, {method: "post", body: formData }
     * @param type returns the results as json or the response object if false. default is true
     * @returns text, parsed json object or a TypeError if network is unavailable.
     */
    async requestURL(url, options = null, type = "json") {
        var response = null;
        try {
            this.showRequestIcon();
            await this.sleep(10);
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
            response = await fetch(url, options);
            this.controllers.delete(requestId);
            this.requestsInProgress--;
            if (this.controllers.size == 0) {
                this.showRequestIcon(false);
            }
            if (type == "json") {
                var text = await response.text();
                try {
                    var data = JSON.parse(text);
                }
                catch (error) {
                    this.log(error);
                    return text;
                }
                return data;
            }
            else if (type == "text") {
                var text = await response.text();
                return text;
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
    showDialog(title, value, callback = null, dialog) {
        var specifiedDialog = dialog || this.dialog;
        if (specifiedDialog) {
            this.setContent(this.dialogTitle, title);
            this.setContent(this.dialogMessage, value);
            this.addClass(specifiedDialog, "display");
            this.addClass(specifiedDialog, "center");
            specifiedDialog.showModal();
            this.dialogCallback = callback;
        }
    }
    closeAllDialogs() {
        this.log("Not implemented");
    }
    /**
     * Closs dialog if dialog is open. Calls dialog callback if defined
     */
    closeDialog(dialog) {
        var specifiedDialog = dialog || this.dialog;
        if (specifiedDialog) {
            this.removeClass(specifiedDialog, "display");
            specifiedDialog.close();
        }
        if (this.dialogCallback) {
            this.dialogCallback(specifiedDialog);
        }
    }
    /**
     * Add a class to an element or an array of elements
     * @param element element or elements to add a class to
     * @param name name of class
     */
    addClass(element, name) {
        var elements = element;
        if (element instanceof HTMLElement) {
            elements = [element];
        }
        if ("classList" in element) {
            elements = [element];
        }
        if (elements instanceof Array) {
            for (let i = 0; i < elements.length; i++) {
                const el = elements[i];
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
        var elements = element;
        if (element instanceof HTMLElement) {
            elements = [element];
        }
        if ("classList" in element) {
            elements = [element];
        }
        if (elements instanceof Array) {
            for (let i = 0; i < elements.length; i++) {
                const el = elements[i];
                el.classList.remove(name);
            }
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
    async getVersion(text = "Version ") {
        try {
            var data = await this.requestURL("version");
            var version = data.version;
            var label = this.versionLabel;
            if (label) {
                this.setContent(label, version);
            }
        }
        catch (error) {
            console.log(error);
        }
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
     * Set the text content of a span element
     * @param element element that will be set
     * @param value value to set span
     * @param tooltip value to set tool tip of span (optional)
     * @param resetValue value to be set after a reset timeout (optional)
     * @param resetTimeout timeout in milliseconds to reset style to (optional)
     */
    setSpan(element, value, tooltip = null, resetValue = null, resetTimeout = 5000) {
        element.textContent = value;
        if (typeof tooltip == "string") {
            element.title = tooltip;
        }
        else if (tooltip) {
            element.title = value;
        }
        if (resetValue !== null) {
            setTimeout(this.setSpan, resetTimeout, element, resetValue);
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
    async getDownloadData(url) {
        var binary = await this.getFileBinaryAtURL(url);
        var binaryBuffer = new Blob([binary.buffer]);
        return binaryBuffer;
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
    async upload(url, file, formData) {
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
                var results = await this.postURL(url, formData);
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
    }
    copyToClipboard(value) {
        navigator.clipboard.writeText(value);
    }
    openInWindow(url, target) {
        window.open(url, target);
    }
    async checkFragment() {
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
    displayErrors() {
        var output = "";
    }
    addDefaultStyles(overwrite = false) {
        var defaultStylesheetId = this.localClassReference?.name + "DefaultStylesheet";
        var stylesheetExists = document.getElementById(defaultStylesheetId);
        // check to prevent adding multiple times
        if (overwrite || stylesheetExists == null) {
            var defaultStyles = document.createElement("style");
            defaultStyles.setAttribute("id", defaultStylesheetId);
            defaultStyles.innerHTML = this.defaultCSS;
            document.head.insertAdjacentElement('beforeend', defaultStyles);
        }
    }
    /**
     * Default CSS added to the page necessary for some functionality.
     * You can add to this string in your sub class
     */
    defaultCSS = `.display {
       display: block !important;
   }
   .noDisplay {
       display: none !important;
   }
   .center { 
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
   }
   dialog:focus {
       outline: none;
   }
   dialog::backdrop {
      background: rgba(0,0,0,.25);
   }`;
}
/**
* Returns a new instance of a start options
* @returns TextRange
*/
export function getStartOptions() {
    return {
        addStyles: true,
        bindProperties: true,
        storeReference: true
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZUNsYXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQmFzZUNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sT0FBTyxTQUFTO0lBQ25CLFNBQVMsR0FBVyxTQUFTLENBQUM7SUFDOUIsU0FBUyxHQUFXLFdBQVcsQ0FBQztJQUNoQyxtQkFBbUIsR0FBVyxjQUFjLENBQUM7SUFDN0MsY0FBYyxHQUFXLFNBQVMsQ0FBQztJQUNuQyxtQkFBbUIsR0FBVyxjQUFjLENBQUM7SUFDN0MscUJBQXFCLEdBQVcsZ0JBQWdCLENBQUM7SUFDakQsb0JBQW9CLEdBQVcsZUFBZSxDQUFDO0lBQy9DLFdBQVcsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUN0RCxXQUFXLEdBQWdCLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFnQixDQUFDO0lBQzNGLE1BQU0sR0FBc0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFzQixDQUFDO0lBQzdGLFdBQVcsR0FBZ0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQWdCLENBQUM7SUFDM0YsYUFBYSxHQUFnQixRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBZ0IsQ0FBQztJQUMvRixZQUFZLEdBQWdCLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFnQixDQUFDO0lBQzdGLGNBQWMsQ0FBWTtJQUMxQixrQkFBa0IsR0FBVyxDQUFDLENBQUM7SUFDL0IsbUJBQW1CLENBQWtCO0lBQ3JDLE1BQU0sQ0FBQyxXQUFXLEdBQVcsa0JBQWtCLENBQUM7SUFFaEQ7SUFFQSxDQUFDO0lBRUQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxjQUFtQixFQUFFLE9BQXNCO1FBQzlELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7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