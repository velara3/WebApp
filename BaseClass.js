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
    versionLabel = document.querySelector(this.versionLabelSelector);
    requestsInProgress = 0;
    requestIconsDelay = 10;
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
    logBaseURI = false;
    // determines if a string is a relative or absolute URL
    isBaseURLRegEx = /^http/i;
    localClassReference;
    views = new Map();
    viewGroups = new Map();
    /**
     * Add UI elements to this array to make sure that the element is not null
     * Add elements by calling addViewElement()
     */
    elements = new Map();
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
                this.bindProperties(this.localClassReference, options?.bindExclusions);
            }
            this.bindViewElements();
            this.validateElements();
            this.validateViews(this.views);
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
            await this.sleep(this.requestIconsDelay);
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
            if (this.logBaseURI) {
                this.log("URL: " + fetchURL);
            }
            response = await fetch(fetchURL, options);
            if (this.controllers.has(requestId)) {
                this.controllers.delete(requestId);
            }
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
            this.controllers.has(requestId) && this.controllers.delete(requestId);
            this.requestsInProgress--;
            if (this.controllers.size == 0) {
                this.showRequestIcon(false);
            }
            // AbortError: signal is aborted without reason
            // don't know the cause of this yet
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
     * Validate all the elements in the class
     * Throws an error if view elements are not found
     * Called after bindViewElements()
     */
    validateElements(...elements) {
        if (elements && elements.length) {
            for (var element of elements) {
                if (element == null) {
                    this.log(this.addStrings(" ", "a view element in this class was not found"));
                    throw new Error("A required view element was not found");
                }
            }
        }
    }
    /**
     * Validate all the elements in the view and that the views are not null
     * Throws an error if view elements are not found
     * Called after bindViewElements()
     */
    validateViews(...views) {
        if (views && views.length) {
            for (var view of views) {
                for (var name in view) {
                    let element = view[name];
                    if (element == null) {
                        this.log(this.addStrings(" ", name, "in a view was not found"));
                        throw new Error("A required view element was not found (" + element + ")");
                    }
                }
            }
        }
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
     * Cancel any requests.
     * This clears the lists of controllers and hide the request icon.
     */
    cancelRequests() {
        if (this.controllers) {
            this.controllers.forEach((value, key, map) => {
                value.signal.aborted || value.abort();
            });
            this.requestsInProgress = 0;
            this.controllers.clear();
        }
        this.showRequestIcon(false);
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
        object.addEventListener(event, listener, options);
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
     * Add an element to the elements map for validation
     * @param id string
     * @returns HTMLElement
     */
    addViewElementById(id) {
        var element = document.getElementById(id);
        if (element == null) {
            throw new Error("A required view element with id, " + id + " was not found");
        }
        this.elements.set(element, id || element.id);
        return element;
    }
    /**
     * Add an element to the elements map using it's selector for validation
     * @param id string
     * @returns HTMLElement
     */
    addViewElementBySelector(selector) {
        var element = document.querySelector(selector);
        if (element == null) {
            throw new Error("A required view element with selector, " + selector + " was not found");
        }
        this.elements.set(element, selector || element.id);
        return element;
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
                this.showElements(view);
            }
            else if (this.isSiblingNode(view, element)) {
                if (viewGroup == group) {
                    this.hideElements(view);
                }
            }
        });
    }
    /**
     * Hide a view.
     * @param view Element to hide
     */
    hideView(view) {
        this.hideElements(view);
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
     * Opens a browse for file(s) dialog. Returns a [FileList](https://developer.mozilla.org/docs/Web/API/FileList) array of File objects or null if canceled.
     * The user must call this method from the click event bubble.
     * Call this method within an async method
     *
    ```js
    // from within a subclass:
    myButton.addEventListener("click", this.openUploadDialog);
     
    async openUploadDialog(event) {
          try {
             var files = await this.browseForFile(".doc,.docx");
             console.log(files);
          }
          catch(error) {
             console.log(error)
          }
    }
     * ```
     * @param acceptedTypes string of comma separated list of accepted file types. Example, ".doc,.docx"
     * @param allowMultipleFiles boolean that indicates if multiple files can be selected. default is a single file
     * @returns A FileList array or null if user cancels
     */
    browseForFile(acceptedTypes, allowMultipleFiles) {
        var element = document.createElement("input");
        element.type = "file";
        if (acceptedTypes) {
            element.accept = acceptedTypes;
        }
        if (allowMultipleFiles) {
            element.multiple = allowMultipleFiles;
        }
        var filePromise = new Promise((resolve, reject) => {
            var resolveCallback = (event) => {
                var input = event.currentTarget;
                resolve(input.files);
            };
            var cancelCallback = (event) => {
                resolve(null);
            };
            element.addEventListener("change", resolveCallback);
            element.addEventListener("cancel", cancelCallback);
        });
        element.dispatchEvent(new MouseEvent("click"));
        return filePromise;
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
     * Hides an element or elements that would be displayed at startup.
     * The function adds the hideClass to the element class list.
     * This class defines the style, `display:none`
     * @param element element to hide
     */
    hideElements(...elements) {
        for (const element of elements) {
            if (element && "classList" in element) {
                this.addClass(element, this.hideClass);
            }
        }
    }
    hideElement(element) {
        this.hideElements(element);
    }
    /**
     * Shows an element that would not be displayed at startup
     * The function removes the `hideClass` from the element class list.
     * For this to work the element must have the class `hideClass`.
     * Use `hideElements()` to add the class to the element or add it the class in the HTML
     * @param element element to show
     */
    showElements(...elements) {
        for (const element of elements) {
            if (element && "classList" in element) {
                this.removeClass(element, this.hideClass);
            }
        }
    }
    showElement(element) {
        this.showElements(element);
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
     * Set the HTML content of an element
     * @param element element that will be set
     * @param value value to set
     * @param tooltip value to set tool tip (optional)
     * @param resetValue value to be set after a reset timeout (optional)
     * @param resetTimeout timeout in milliseconds to reset style to (optional)
     */
    setHTML(element, value, tooltip = null, resetValue = null, resetTimeout = 5000) {
        element.innerHTML = value;
        if (typeof tooltip == "string") {
            element.title = tooltip;
        }
        else if (tooltip) {
            element.title = value;
        }
        if (resetValue !== null) {
            setTimeout(this.setHTML, resetTimeout, element, resetValue);
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
     * Set attribute on element
     * @param element
     * @param property
     * @param value
     */
    setAttribute(element, property, value) {
        element.setAttribute(property, value);
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
    bindProperties(mainClass, exclusions) {
        var properties = Object.getOwnPropertyNames(mainClass.prototype);
        var that = this;
        for (var key in properties) {
            var property = properties[key];
            if (property !== "constructor") {
                if (exclusions && exclusions.length) {
                    if (exclusions.indexOf(property) == -1) {
                        that[property] = that[property].bind(this);
                    }
                }
                else {
                    that[property] = that[property].bind(this);
                }
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
        // @ts-ignore gives error in vscode but in tsplayground no error
        var binaryBuffer = new Blob([binary.buffer]);
        return binaryBuffer;
    }
    async getFileBinaryAtURL(url) {
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
    async getArrayBufferAtURL(url) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.onload = () => {
                if (request.status === 200) {
                    try {
                        resolve(request.response);
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
    async upload(url, file, formData, options, returnType) {
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
                var response = await this.postURL(url, formData, options, returnType);
                return response;
            }
            catch (error) {
                throw error;
            }
        }
        catch (error) {
            throw error;
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
     * Select a list item by option
     * ```js
     * // example finding existing object
     * var option = {name: "apple"}
     * mylist.appendChild(option);
     * selectListItemByOption(myList, option);
     * ```
     * @param {HTMLSelectElement} list
     **/
    selectListItemByOption(list, option) {
        if (option && option.value != null) {
            list.value = option.value;
        }
        else {
            var options = list.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i] == option) {
                    list.selectedIndex = i;
                    break;
                }
            }
        }
    }
    /**
     * Select a list item by value
     * ```js
     * // Example to select option when option is a string and value is "apple"
     * selectListOptionByValue(myList, "apple");
     *
     * // Example to select option when option is an object and value contains "apple"
     * selectListOptionByValue(myList, "apple", "value");
     *
     * // Example 2 to select option when option is an object value contains a string
     * selectListOptionByValue(myList, findValue, "option_value", "object_property_name");
     *
     * // example finding object with name as apple
     * mylist.value = {name: "apple"}
     * selectListOptionByValue(myList, "apple", "value", "name");
     * ```
     * @param {HTMLSelectElement} list
     **/
    selectListOptionByValue(list, searchValue = null, property = null, property2 = null) {
        if (property2) {
            var option = this.getListOption(list.options, searchValue, property, property2);
            if (option) {
                list.value = option.value;
            }
        }
        else if (property) {
            option = this.getListOption(list.options, searchValue, property);
            if (option) {
                list.value = option.value;
            }
        }
        else if (option) {
            list.value = option.value;
        }
        else {
            list.value = searchValue;
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
                // if separater is already at end of first string just add value
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
* @returns StartOptions
*/
export function getStartOptions() {
    return {
        addStyles: true,
        bindProperties: true,
        bindExclusions: [],
        storeReference: true,
        startEvent: BaseClass.DOM_CONTENT_LOADED
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZUNsYXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQmFzZUNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sT0FBTyxTQUFTO0lBQ25CLFNBQVMsR0FBVyxTQUFTLENBQUM7SUFDOUIsU0FBUyxHQUFXLFdBQVcsQ0FBQztJQUNoQyxXQUFXLEdBQVcsUUFBUSxDQUFDO0lBQy9CLG1CQUFtQixHQUFXLGNBQWMsQ0FBQztJQUM3QyxjQUFjLEdBQVcsU0FBUyxDQUFDO0lBQ25DLG1CQUFtQixHQUFXLGNBQWMsQ0FBQztJQUM3QyxxQkFBcUIsR0FBVyxnQkFBZ0IsQ0FBQztJQUNqRCx5QkFBeUIsR0FBVyxvQkFBb0IsQ0FBQztJQUN6RCxvQkFBb0IsR0FBVyxlQUFlLENBQUM7SUFDL0MsZUFBZSxHQUF5QyxJQUFJLE9BQU8sRUFBRSxDQUFDO0lBQ3RFLFdBQVcsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUN0RCxXQUFXLEdBQWdCLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFnQixDQUFDO0lBQzNGLE1BQU0sR0FBc0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFzQixDQUFDO0lBQzdGLFlBQVksR0FBZ0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQWdCLENBQUM7SUFDN0Ysa0JBQWtCLEdBQVcsQ0FBQyxDQUFDO0lBQy9CLGlCQUFpQixHQUFXLEVBQUUsQ0FBQztJQUMvQjs7Ozs7Ozs7Ozs7O09BWUc7SUFDSCxPQUFPLEdBQWUsRUFBRSxDQUFDO0lBQ3pCLFVBQVUsR0FBWSxLQUFLLENBQUM7SUFDNUIsdURBQXVEO0lBQ3ZELGNBQWMsR0FBVyxRQUFRLENBQUM7SUFDbEMsbUJBQW1CLENBQWtCO0lBQ3JDLEtBQUssR0FBeUIsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUN4QyxVQUFVLEdBQXNDLElBQUksR0FBRyxFQUFFLENBQUM7SUFD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