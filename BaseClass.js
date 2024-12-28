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
                this.bindProperties(this.localClassReference, options?.bindExclusions);
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
     * Validate all the elements in the view or views are not null
     */
    validateViews(...views) {
        if (views.length) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZUNsYXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQmFzZUNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sT0FBTyxTQUFTO0lBQ25CLFNBQVMsR0FBVyxTQUFTLENBQUM7SUFDOUIsU0FBUyxHQUFXLFdBQVcsQ0FBQztJQUNoQyxXQUFXLEdBQVcsUUFBUSxDQUFDO0lBQy9CLG1CQUFtQixHQUFXLGNBQWMsQ0FBQztJQUM3QyxjQUFjLEdBQVcsU0FBUyxDQUFDO0lBQ25DLG1CQUFtQixHQUFXLGNBQWMsQ0FBQztJQUM3QyxxQkFBcUIsR0FBVyxnQkFBZ0IsQ0FBQztJQUNqRCx5QkFBeUIsR0FBVyxvQkFBb0IsQ0FBQztJQUN6RCxvQkFBb0IsR0FBVyxlQUFlLENBQUM7SUFDL0MsZUFBZSxHQUF5QyxJQUFJLE9BQU8sRUFBRSxDQUFDO0lBQ3RFLFdBQVcsR0FBaUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUN0RCxXQUFXLEdBQWdCLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFnQixDQUFDO0lBQzNGLE1BQU0sR0FBc0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFzQixDQUFDO0lBQzdGLFlBQVksR0FBZ0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQWdCLENBQUM7SUFDN0Ysa0JBQWtCLEdBQVcsQ0FBQyxDQUFDO0lBQy9COzs7Ozs7Ozs7Ozs7T0FZRztJQUNILE9BQU8sR0FBZSxFQUFFLENBQUM7SUFDekIsdURBQXVEO0lBQ3ZELGNBQWMsR0FBVyxRQUFRLENBQUM7SUFDbEMsbUJBQW1CLENBQWtCO0lBQ3JDLEtBQUssR0FBeUIsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUN4QyxVQUFVLEdBQXNDLElBQUksR0FBRyxFQUFFLENBQUM7SUFFMUQsTUFBTSxDQUFDLFdBQVcsR0FBYSxFQUFFLENBQUM7SUFDbEMsTUFBTSxDQUFDLFFBQVEs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