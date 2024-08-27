export class BaseClass {
    showClass = "display";
    hideClass = "noDisplay";
    centerClass = "center";
    requestIconSelector = "#requestIcon";
    dialogSelector = "#dialog";
    dialogTitleSelector = "#dialogTitle";
    dialogMessageSelector = "#dialogMessage";
    dialogCloseButtonSelector = "#dialogCloseButton";
    versionLabelSelector = "#versionLabel";
    dialogCallbacks = new WeakMap();
    controllers = new Map();
    requestIcon = document.querySelector(this.requestIconSelector);
    dialog = document.querySelector(this.dialogSelector);
    versionLabel = this.dialog?.querySelector(this.versionLabelSelector);
    requestsInProgress = 0;
    /**
     * If this is set then it is the base URL for relative URLs used in fetch calls
     *
     * Example:
     * ```js
       this.baseURI = "api.example.com";
       if (window.location.hostname=="localhost") {
          this.baseURI = "localhost:3001";
       }
       this.postURL("test"); // results in htto://localhost:3001/test
       ```
     *
     */
    baseURI = "";
    // determines if a string is a relative or absolute URL
    isBaseURLRegEx = /^http/i;
    localClassReference;
    static logMessages = [];
    static ShowLogs = true;
    static DOM_CONTENT_LOADED = "DOMContentLoaded";
    static PAGE_LOADED = "load";
    static JSON = "json";
    static TEXT = "text";
    static BLOB = "blob";
    static RESPONSE = "response";
    defaultPostResultType = BaseClass.RESPONSE;
    defaultGetResultType = BaseClass.RESPONSE;
    constructor() {
    }
    /**
     * Call this method after you declare your class and it will create the class instance on the page content is loaded
     * Pass in StartupOptions to modify the start up options
     * Alternatively, call the static start method to create the class immediately
     * @param ClassReference reference to the sub class that extends this class
     * @param options optional object with properties of StatupOptions
     */
    static startWhenReady(ClassReference, options) {
        var startEvent = options?.startEvent ?? BaseClass.DOM_CONTENT_LOADED;
        window.addEventListener(startEvent, (event) => {
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
        try {
            var instance = new ClassReference();
            instance.localClassReference = ClassReference;
            var defaultOptions = getStartOptions();
            if (options) {
                Object.assign(defaultOptions, options);
            }
            // save reference to our instance
            if (options?.storeReference) {
                this.instances.push(instance);
                this.instancesMap.set(instance.constructor, instance);
            }
            instance.applyOptions(defaultOptions);
            instance.start();
            return instance;
        }
        catch (error) {
            console.log(error);
        }
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
        try {
            if (options?.bindProperties) {
                this.bindProperties(this.localClassReference);
            }
            this.bindViewElements();
            this.setupEventListeners();
            if (options?.addStyles) {
                this.addDefaultStyles();
            }
        }
        catch (error) {
            console.log(error);
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
    async getURL(url, options = null, type = "response") {
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
     * @param options options fetch options object. example, {body: formData }
     * @param type type of object to return. json, text, blob or response. default is a response object
     * @returns text, parsed json object or a TypeError if network is unavailable.
     */
    async postURL(url, form, options = null, type = "response") {
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
     * @param type returns the results as json by default. options ara text or response for response
     * @returns text, parsed json object or a TypeError if network is unavailable.
     */
    async requestURL(url, options = null, type = "json") {
        var response = null;
        var fetchURL = url;
        var requestId = this.requestsInProgress++;
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
            this.controllers.set(requestId, controller);
            if (this.baseURI && url.match(this.isBaseURLRegEx) == null) {
                fetchURL = window.location.protocol + "//" + this.addStrings("/", this.baseURI, url);
            }
            response = await fetch(fetchURL, options);
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
            else if (type == "blob") {
                try {
                    var blob = await response.blob();
                }
                catch (error) {
                    this.log(error);
                    return error;
                }
                return blob;
            }
            else if (type == "text") {
                var text = await response.text();
                return text;
            }
            else if (type == "response") {
                return response;
            }
            return response;
        }
        catch (error) {
            this.controllers.delete(requestId);
            this.requestsInProgress--;
            if (this.controllers.size == 0) {
                this.showRequestIcon(false);
            }
            // "Failed to fetch" - means the url is not found or server off line
            this.requestError(error, fetchURL);
            return error;
        }
    }
    /**
     * Callback when an error occurs calling requestURL() or fetch
     * Override in sub classes
     */
    requestError(error, url) {
        return;
    }
    /**
     * Attach event listeners here
     * Override in sub classes
     */
    setupEventListeners() {
    }
    /**
     * Get references to view elements here.
     * You do not need to do this if you use classes or views
     * Override in sub classes
     */
    bindViewElements() {
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
            var dialogTitle = specifiedDialog.querySelector(this.dialogTitleSelector);
            var dialogMessage = specifiedDialog.querySelector(this.dialogMessageSelector);
            var closeButton = specifiedDialog.querySelector(this.dialogCloseButtonSelector);
            dialogTitle && this.setContent(dialogTitle, title);
            dialogMessage && this.setContent(dialogMessage, value);
            this.removeClass(specifiedDialog, this.hideClass);
            this.addClass(specifiedDialog, this.showClass);
            this.addClass(specifiedDialog, this.centerClass);
            specifiedDialog.showModal();
            this.dialogCallbacks.set(specifiedDialog, callback);
            closeButton && closeButton.addEventListener("click", (event) => {
                this.closeDialog(specifiedDialog);
            });
            specifiedDialog.addEventListener("close", (event) => {
                this.closeDialog(specifiedDialog);
            });
        }
    }
    /**
     * Closs dialog if dialog is open. Calls dialog callback if defined
     */
    closeDialog(dialog) {
        var specifiedDialog = dialog || this.dialog;
        if (specifiedDialog) {
            this.removeClass(specifiedDialog, "display");
            specifiedDialog.close();
            var callback = this.dialogCallbacks.get(specifiedDialog);
            if (callback) {
                callback(specifiedDialog);
            }
            this.dialogCallbacks.delete(specifiedDialog);
        }
    }
    closeAllDialogs() {
        this.log("Not implemented");
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
     * Hides an element that would be displayed at startup
     * @param element element to hide
     */
    hideElement(element) {
        if (element && "classList" in element) {
            this.addClass(element, this.hideClass);
        }
    }
    /**
     * Shows an element that would not be displayed at startup
     * @param element element to show
     */
    showElement(element) {
        if (element && "classList" in element) {
            this.removeClass(element, this.hideClass);
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
     * Updates a parameter value in the url query of the current page
     * @param parameter name of parameter
     * @param value value to set parameter to
     */
    updateQuery(parameter, value) {
        var url = new URL(window.location.href);
        var searchParameters = url.searchParams;
        searchParameters.set(parameter, value);
        var pathQuery = window.location.pathname + "?" + searchParameters.toString();
        var hashFragments = url.hash;
        if (hashFragments != "#") {
            pathQuery += hashFragments;
        }
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
    /**
     * Creates a select option or list item and returns it
     * @param label Label of option
     * @param value Value of option
     * @param useListItem use list item LI type or OPTION type
     * @param icon path to icon
     * @param classes class to add to the option
     * @param callback call back to run before returning the option
     * @returns returns a list item LI or an Option element
     */
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
     * Adds a list item or option element to a List or Select
     * @param list List item LI or Select element
     * @param item item to add to the list
     */
    addListItem(list, item) {
        list.appendChild(item);
    }
    /**
     * Clear the list of all options
     * @param {HTMLSelectElement|HTMLElement} list
     **/
    clearListOptions(list) {
        list.innerHTML = "";
        "value" in list ? list.value = "" : 0;
    }
    /**
     * Find an existing option in a list of options.
     * Pass in an value to find and a property and an additional property if it's an object
     * @param {Array} options
     * @param {*} value
     * @param {String} property property on the existing option - looks like this may always be "value"?
     * @param {String} property2 additional property on the existing option
     **/
    getListOption(options, value, property = null, property2 = null) {
        for (var i = 0; i < options.length; i++) {
            let option = options[i];
            if (property2) {
                if (option[property][property2] == value) {
                    return option;
                }
            }
            else if (property) {
                if (option[property] == value) {
                    return option;
                }
            }
            else if (option == value) {
                return option;
            }
        }
        return null;
    }
    /**
     * Select a list item
     * ```js
     * // Example if option value is an object
     * selectListOption(myList, null, findValue, "option_value", "object_property_name");
     * // example finding object with name as apple
     * mylist.value = {name: "apple"}
     * selectListOption(myList, null, "apple", "value", "name");
     * // example finding existing object
     * var option = {name: "apple"}
     * mylist.appendChild(option);
     * selectListOption(myList, option);
     * ```
     * @param {HTMLSelectElement} list
     **/
    selectListOption(list, option, value = null, property = null, property2 = null) {
        if (property2) {
            option = this.getListOption(list.options, value, property, property2);
            if (option) {
                list.value = option.value;
            }
        }
        else if (property) {
            option = this.getListOption(list.options, value, property);
            if (option) {
                list.value = option.value;
            }
        }
        else if (option) {
            list.value = option.value;
        }
        else {
            list.value = value;
        }
    }
    /**
    * Log values to the console
    * @param values values to log
    */
    log(...values) {
        if (BaseClass.ShowLogs) {
            var stack = new Error().stack?.split("\n");
            if (stack) {
                console.groupCollapsed.apply(console, values);
                for (var i = 2; i < stack.length; i++) {
                    console.log('%c' + stack[i].trim().substring(3), 'padding-left: 10px; color: #777');
                }
                console.groupEnd();
            }
            else {
                console.log(...values);
            }
        }
        else {
            BaseClass.logMessages.push(...values);
        }
    }
    displayErrors() {
        var output = "";
    }
    /**
     * Adds strings onto the end of other strings.
     * Separator is space by default but can be any character
     * @param {String} separator
     * @param {Array} strings
     **/
    addStrings(separator = " ", ...strings) {
        var character = "";
        var value = "";
        if (separator == null)
            separator = " ";
        var numberOfStrings = strings ? strings.length : 0;
        for (let i = 0; i < numberOfStrings; i++) {
            var nextString = strings[i];
            if (nextString != null) {
                character = value.charAt(value.length - 1);
                // if separater is alrdady at end of first string just add value
                if (character == separator) {
                    value += nextString;
                }
                else if (value == "") {
                    value += nextString;
                }
                else {
                    value += separator + nextString;
                }
            }
        }
        return value;
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
        storeReference: true,
        startEvent: BaseClass.DOM_CONTENT_LOADED
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZUNsYXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQmFzZUNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sT0FBTyxTQUFTO0lBQ25CLFNBQVMsR0FBVyxTQUFTLENBQUM7SUFDOUIsU0FBUyxHQUFXLFdBQVcsQ0FBQztJQUNoQyxXQUFXLEdBQVcsUUFBUSxDQUFDO0lBQy9CLG1CQUFtQixHQUFXLGNBQWMsQ0FBQztJQUM3QyxjQUFjLEdBQVcsU0FBUyxDQUFDO0lBQ25DLG1CQUFtQixHQUFXLGNBQWMsQ0FBQztJQUM3QyxxQkFBcUIsR0FBVyxnQkFBZ0IsQ0FBQztJQUNqRCx5QkFBeUIsR0FBVyxvQkFBb0IsQ0FBQztJQUN6RCxvQkFBb0IsR0FBVyxlQUFlLENBQUM7SUFDL0MsZUFBZSxHQUF5QyxJQUFJLE9BQU8sRUFBRSxDQUFDO0lBQ3RFLFdBQVcsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUN0RCxXQUFXLEdBQWdCLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFnQixDQUFDO0lBQzNGLE1BQU0sR0FBc0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFzQixDQUFDO0lBQzdGLFlBQVksR0FBZ0IsSUFBSSxDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFnQixDQUFDO0lBQ2pHLGtCQUFrQixHQUFXLENBQUMsQ0FBQztJQUMvQjs7Ozs7Ozs7Ozs7O09BWUc7SUFDSCxPQUFPLEdBQVcsRUFBRSxDQUFDO0lBQ3JCLHVEQUF1RDtJQUN2RCxjQUFjLEdBQVcsUUFBUSxDQUFDO0lBQ2xDLG1CQUFtQixDQUFrQjtJQUVyQyxNQUFNLENBQUMsV0FBVyxHQUFhLEVBQUUsQ0FBQztJQUNsQyxNQUFNLENBQUMsUUFBUSxHQUFZLElBQUksQ0FBQztJQUNoQyxNQUFNLENBQUMsa0JBQWtCLEdBQVcsa0JBQWtCLENBQUM7SUFDdkQsTUFB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