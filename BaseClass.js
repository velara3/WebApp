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
    views = new Map();
    viewGroups = new Map();
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
     * @param returnType type of object to return. json, text, blob or response. default is a response object
     * @returns
     */
    async getURL(url, options = null, returnType = "response") {
        if (options == null) {
            options = {};
        }
        ;
        options.method = "get";
        return await this.requestURL(url, options, returnType);
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
     * @param returnType type of object to return. json, text, blob or response. default is a response object
     * @returns text, parsed json object or a TypeError if network is unavailable.
     */
    async postURL(url, form, options = null, returnType = "response") {
        if (options == null) {
            options = {};
        }
        if (form && options.body == null) {
            options.body = form;
        }
        options.method = "post";
        return await this.requestURL(url, options, returnType);
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
     * @param returnType returns the results as json by default. options ara text or response for response
     * @returns text, parsed json object or a TypeError if network is unavailable.
     */
    async requestURL(url, options = null, returnType = "json") {
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
            if (this.baseURI instanceof URL) {
                fetchURL = this.addStrings("/", this.baseURI.toString(), url);
            }
            else if (this.baseURI && url.match(this.isBaseURLRegEx) == null) {
                fetchURL = window.location.protocol + "//" + this.addStrings("/", this.baseURI, url);
            }
            response = await fetch(fetchURL, options);
            this.controllers.delete(requestId);
            this.requestsInProgress--;
            if (this.controllers.size == 0) {
                this.showRequestIcon(false);
            }
            if (returnType == "json") {
                var clone = await response.clone();
                var text = await response.text();
                try {
                    var data = JSON.parse(text);
                    return data;
                }
                catch (error) {
                    var alternativeResult = this.requestError(error, fetchURL, options, url);
                    if (alternativeResult !== undefined) {
                        return alternativeResult;
                    }
                    throw error;
                }
            }
            else if (returnType == "blob") {
                var blob = await response.blob();
                return blob;
            }
            else if (returnType == "text") {
                var text = await response.text();
                return text;
            }
            else if (returnType == "arrayBuffer") {
                var arrayBuffer = await response.arrayBuffer();
                return arrayBuffer;
            }
            else if (returnType == "bytes") {
                var bytes = await response.bytes();
                return bytes;
            }
            else if (returnType == "response") {
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
            var alternativeResult = this.requestError(error, fetchURL, options, url);
            if (alternativeResult !== undefined) {
                return alternativeResult;
            }
            throw error;
        }
    }
    /**
     * Callback when an error occurs calling getURL(), postURL() or requestURL()
     * Override in sub classes
     * Return an alternative value
     */
    requestError(error, fetchUrl, options, url) {
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
                if (this.requestsInProgress > 0) {
                    this.requestsInProgress--;
                }
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
     * Returns the first element found matching the selector or null if there is no match
     * @param selectors
     * @returns {Element}
     */
    querySelector(selectors) {
        return document.querySelector(selectors);
    }
    /**
     * Add an event listener to an object
     */
    addEventListener(object, event, listener, options) {
        if (object) {
            object.addEventListener(event, listener, options);
        }
    }
    /**
     * Add a view to the views
     * @param view Element
     * @param group string
     */
    addView(view, id, group) {
        if (group == null)
            group = "main";
        this.views.set(view, id || view.id);
        this.viewGroups.set(group, this.views);
    }
    /**
     * Remove a view from the views
     * @param view Element
     */
    removeView(view) {
        this.views.delete(view);
    }
    /**
     * Show a view. Sibling elements are hidden if part of the same group
     * @param view Element to show
     */
    showView(view) {
        var viewGroup = this.views.get(view);
        // hide other views in the same parent
        this.views.forEach((group, element) => {
            if (view == element) {
                this.showElement(view);
            }
            else if (this.isSiblingNode(view, element)) {
                if (viewGroup == group) {
                    this.hideElement(view);
                }
            }
        });
    }
    /**
     * Hide a view.
     * @param view Element to hide
     */
    hideView(view) {
        this.hideElement(view);
    }
    /**
     * Returns true if elements are siblings
     * @param {Element} elementA
     * @param {Element} elementB
     * @return {Boolean}
     **/
    isSiblingNode(elementA, elementB) {
        return elementA.parentNode == elementB.parentNode;
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
     * Get the selected list item. If class name is passed in gets the item with the class name.
     * @param {HTMLSelectElement} list
     * @param {string} classname name of class that represents selected item
     **/
    getSelectedListItem(list, classname = "") {
        if (classname) {
            var options = list.options || list.children;
            for (var i = 0; i < options.length; i++) {
                let option = options[i];
                var containsClass = option.classList.contains(classname);
                if (containsClass) {
                    return option.value;
                }
            }
        }
        return list.value;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZUNsYXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQmFzZUNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sT0FBTyxTQUFTO0lBQ25CLFNBQVMsR0FBVyxTQUFTLENBQUM7SUFDOUIsU0FBUyxHQUFXLFdBQVcsQ0FBQztJQUNoQyxXQUFXLEdBQVcsUUFBUSxDQUFDO0lBQy9CLG1CQUFtQixHQUFXLGNBQWMsQ0FBQztJQUM3QyxjQUFjLEdBQVcsU0FBUyxDQUFDO0lBQ25DLG1CQUFtQixHQUFXLGNBQWMsQ0FBQztJQUM3QyxxQkFBcUIsR0FBVyxnQkFBZ0IsQ0FBQztJQUNqRCx5QkFBeUIsR0FBVyxvQkFBb0IsQ0FBQztJQUN6RCxvQkFBb0IsR0FBVyxlQUFlLENBQUM7SUFDL0MsZUFBZSxHQUF5QyxJQUFJLE9BQU8sRUFBRSxDQUFDO0lBQ3RFLFdBQVcsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUN0RCxXQUFXLEdBQWdCLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFnQixDQUFDO0lBQzNGLE1BQU0sR0FBc0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFzQixDQUFDO0lBQzdGLFlBQVksR0FBZ0IsSUFBSSxDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFnQixDQUFDO0lBQ2pHLGtCQUFrQixHQUFXLENBQUMsQ0FBQztJQUMvQjs7Ozs7Ozs7Ozs7O09BWUc7SUFDSCxPQUFPLEdBQWUsRUFBRSxDQUFDO0lBQ3pCLHVEQUF1RDtJQUN2RCxjQUFjLEdBQVcsUUFBUSxDQUFDO0lBQ2xDLG1CQUFtQixDQUFrQjtJQUNyQyxLQUFLLEdBQXlCLElBQUksR0FBRyxFQUFFLENBQUM7SUFDeEMsVUFBVSxHQUFzQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBRTFELE1BQU0sQ0FBQyxXQUFXLEdBQWEsRUFBRSxDQUFDO0lBQ2xDLE1BQU0s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