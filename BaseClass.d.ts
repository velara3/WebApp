export declare class BaseClass {
    showClass: string;
    hideClass: string;
    centerClass: string;
    requestIconSelector: string;
    dialogSelector: string;
    dialogTitleSelector: string;
    dialogMessageSelector: string;
    dialogCloseButtonSelector: string;
    versionLabelSelector: string;
    dialogCallbacks: WeakMap<HTMLDialogElement, Function>;
    controllers: Map<number, AbortController>;
    requestIcon: HTMLElement;
    dialog: HTMLDialogElement;
    versionLabel: HTMLElement;
    requestsInProgress: number;
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
    baseURI: string | URL;
    isBaseURLRegEx: RegExp;
    localClassReference: any | undefined;
    views: Map<Element, string>;
    viewGroups: Map<string, Map<Element, string>>;
    /**
     * Add UI elements to this array to make sure that the element is not null
     */
    elements: Array<string>;
    static logMessages: string[];
    static ShowLogs: boolean;
    static DOM_CONTENT_LOADED: string;
    static PAGE_LOADED: string;
    static JSON: string;
    static TEXT: string;
    static BLOB: string;
    static RESPONSE: string;
    defaultPostResultType: string;
    defaultGetResultType: string;
    constructor();
    /**
     * Call this method after you declare your class and it will create the class instance on the page content is loaded
     * Pass in StartupOptions to modify the start up options
     * Alternatively, call the static start method to create the class immediately
     * @param ClassReference reference to the sub class that extends this class
     * @param options optional object with properties of StatupOptions
     */
    static startWhenReady(ClassReference: any, options?: StartOptions): void;
    /**
     * Static method that creates an instance of your class and then calls the instance start() method
     * @param ClassReference Reference to your class that extends BaseClass
     * @param options StartOptions
     * @returns instance of your class
     */
    static start(ClassReference: any, options?: StartOptions): any;
    static instances: Array<BaseClass>;
    static instancesMap: Map<string, BaseClass>;
    /**
     * Override and call this method for startup
     */
    start(): Promise<void>;
    /**
     * Set some start up options
     * @param options
     */
    applyOptions(options?: StartOptions): void;
    /**
     * Check the query
     */
    checkQuery(): void;
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
    getURL(url: string, options?: any, returnType?: string): Promise<any>;
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
    postURL(url: string, form?: any, options?: any, returnType?: string): Promise<any>;
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
    requestURL(url: string, options?: any, returnType?: string): Promise<any>;
    /**
     * Callback when an error occurs calling getURL(), postURL() or requestURL()
     * Override in sub classes
     * Return an alternative value
     */
    requestError(error: Error | unknown, fetchUrl: string, options?: any, url?: string): void;
    /**
     * Attach event listeners here
     * Override in sub classes
     */
    setupEventListeners(): void;
    /**
     * Validate all the elements in the class
     * Throws an error if view elements are not found
     * Called after bindViewElements()
     */
    validateElements(...elements: any[]): void;
    /**
     * Validate all the elements in the view and that the views are not null
     * Throws an error if view elements are not found
     * Called after bindViewElements()
     */
    validateViews(...views: any[]): void;
    /**
     * Get references to view elements here.
     * You do not need to do this if you use classes or views
     * Override in sub classes
     */
    bindViewElements(): void;
    /**
     * Handler for receiving a message from an embedded iframe
     * Override in your sub class
     * @param event
     * @returns
     */
    postMessageHandler(event: any): void;
    /**
     * Cancel any requests
     */
    cancelRequests(): void;
    /**
     * Wait a specific amount of time in milliseconds before proceeding to the next line of code
     * Must use await in front of this call
     * @param ms
     * @returns
     */
    sleep(milliseconds: number): Promise<unknown>;
    /**
     * Returns the first element found matching the selector or null if there is no match
     * @param selectors
     * @returns {Element}
     */
    querySelector(selectors: string): Element | null;
    /**
     * Add an event listener to an object
     */
    addEventListener(object: EventTarget | any, event: any, listener: any, options?: any): void;
    /**
     * Add a view to the views
     * @param view Element
     * @param group string
     */
    addView(view: Element, id: string, group: string): void;
    /**
     * Remove a view from the views
     * @param view Element
     */
    removeView(view: Element): void;
    /**
     * Show a view. Sibling elements are hidden if part of the same group
     * @param view Element to show
     */
    showView(view: Element): void;
    /**
     * Hide a view.
     * @param view Element to hide
     */
    hideView(view: Element): void;
    /**
     * Returns true if elements are siblings
     * @param {Element} elementA
     * @param {Element} elementB
     * @return {Boolean}
     **/
    isSiblingNode(elementA: Element, elementB: Element): boolean;
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
    browseForFile(acceptedTypes?: string, allowMultipleFiles?: boolean): Promise<unknown>;
    /**
     * Show a dialog.
     * Dialog must be an element defined to the dialog property
     * By default the dialog has an id of dialog and is an HTMLDialogElement on the page
     * @param title Title in dialog
     * @param value text to show in dialog
     * @param callback Callback after user clicks ok or exits from dialog
     */
    showDialog(title: string, value: string, callback?: any, dialog?: HTMLDialogElement): void;
    /**
     * Closs dialog if dialog is open. Calls dialog callback if defined
     */
    closeDialog(dialog?: HTMLDialogElement): void;
    closeAllDialogs(): void;
    /**
     * Add a class to an element or an array of elements
     * @param element element or elements to add a class to
     * @param name name of class
     */
    addClass(element: Element | Array<Element>, name: string): void;
    /**
     * Remove a class from an element or an array of elements
     * @param element element or array of elements to remove a class from
     * @param name name of class to remove
     */
    removeClass(element: HTMLElement | Array<HTMLElement>, name: string): void;
    /**
     * Shows or hides an icon assigned to the networkIcon property
     * @param display if true the icon is displayed
     */
    showRequestIcon(display?: boolean): void;
    /**
     * Reveals an element that is hidden at startup
     * @param element element to reveal
     * @param display if true displays the element or hides if false. default true
     */
    revealElement(element: HTMLElement, display?: boolean): void;
    /**
     * Hides an element or elements that would be displayed at startup.
     * The function adds the hideClass to the element class list.
     * This class defines the style, `display:none`
     * @param element element to hide
     */
    hideElements(...elements: Array<HTMLElement>): void;
    hideElement(element: HTMLElement): void;
    /**
     * Shows an element that would not be displayed at startup
     * The function removes the `hideClass` from the element class list.
     * For this to work the element must have the class `hideClass`.
     * Use `hideElements()` to add the class to the element or add it the class in the HTML
     * @param element element to show
     */
    showElements(...elements: Array<HTMLElement>): void;
    showElement(element: HTMLElement): void;
    /**
     * Gets the version defined at a version endpoint
     * @param text Pretext for version info
     */
    getVersion(text?: string): Promise<void>;
    /**
     * Cancels a request
     */
    cancelRequest(): void;
    /**
     * Set the style of an element
     * @param element element that has style
     * @param property name of style or style property
     * @param value value of style
     * @param priority priority of style
     * @param resetValue value of style to set after a reset timeout (optional)
     * @param resetTimeout timeout in milliseconds to reset style to (optional)
     */
    setStyle(element: HTMLElement, property: string, value: string | null, priority?: string, resetValue?: any, resetTimeout?: number): void;
    /**
     * Set the parent of an element
     * @param element element that will be parented
     * @param parent parent element
     */
    setParent(element: any, parent: Node): void;
    /**
     * Set the text content of a span element
     * @param element element that will be set
     * @param value value to set span
     * @param tooltip value to set tool tip of span (optional)
     * @param resetValue value to be set after a reset timeout (optional)
     * @param resetTimeout timeout in milliseconds to reset style to (optional)
     */
    setContent(element: HTMLElement, value: string, tooltip?: any, resetValue?: any, resetTimeout?: number): void;
    /**
     * Set the HTML content of an element
     * @param element element that will be set
     * @param value value to set
     * @param tooltip value to set tool tip (optional)
     * @param resetValue value to be set after a reset timeout (optional)
     * @param resetTimeout timeout in milliseconds to reset style to (optional)
     */
    setHTML(element: HTMLElement, value: string, tooltip?: any, resetValue?: any, resetTimeout?: number): void;
    /**
     * Set the text content of a span element
     * @param element element that will be set
     * @param value value to set span
     * @param tooltip value to set tool tip of span (optional)
     * @param resetValue value to be set after a reset timeout (optional)
     * @param resetTimeout timeout in milliseconds to reset style to (optional)
     */
    setSpan(element: HTMLElement, value: string, tooltip?: any, resetValue?: any, resetTimeout?: number): void;
    /**
     * Set attribute on element
     * @param element
     * @param property
     * @param value
     */
    setAttribute(element: Element, property: any, value: any): void;
    /**
     * Add element to the container.
     * Element can be string or element. If string then the element is created
     * Properties and styles can be set on the element and child elements can be added
     * @param container container for element
     * @param element element
     * @param properties properties or styles to set on element
     * @param children additional child elements
     */
    addElement(container: Node, element: Element | any, properties?: null, ...children: any[]): void;
    /**
     * Creates an element and optionally child elements
     * @param tagName name of element to create
     * @param properties properties to apply to element
     * @param children child elements to create
     * @returns element
     */
    createElement(tagName: string, properties?: any, ...children: any[]): any;
    /**
     * Updates a parameter value in the url query of the current page
     * @param parameter name of parameter
     * @param value value to set parameter to
     */
    updateQuery(parameter: string, value: string): void;
    /**
     * Bind the members on this class to refer to this class
     * @param mainClass Class to add bindings to
     */
    bindProperties(mainClass: any, exclusions?: string[]): void;
    /**
     * Scroll element into view
     * @param element element to scroll into view
     * @param behavior scroll behavior. default is smooth
     * @param block position to scroll to. default is start
     * @param inline
     */
    scrollElementIntoView(element: Element, behavior?: string, block?: string, inline?: string): void;
    /**
     * Scroll to bottom of element
     * @param element element to scroll to bottom
     */
    scrollToBottom(element: Element): void;
    getDownloadData(url: string): Promise<Blob>;
    getFileBinaryAtURL(url: string): Promise<Uint8Array>;
    getArrayBufferAtURL(url: string): Promise<ArrayBuffer>;
    upload(url: string, file: File | Blob | Array<File | Blob>, formData?: FormData, options?: object, returnType?: string): Promise<any>;
    copyToClipboard(value: string): void;
    openInWindow(url: string, target: string): void;
    checkFragment(): Promise<void>;
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
    createOption(label: string, value: string, useListItem?: boolean, icon?: null, classes?: never[], callback?: any): HTMLOptionElement;
    /**
     * Adds a list item or option element to a List or Select
     * @param list List item LI or Select element
     * @param item item to add to the list
     */
    addListItem(list: HTMLElement, item: HTMLElement): void;
    /**
     * Clear the list of all options
     * @param {HTMLSelectElement|HTMLElement} list
     **/
    clearListOptions(list: HTMLSelectElement | HTMLElement): void;
    /**
     * Find an existing option in a list of options.
     * Pass in an value to find and a property and an additional property if it's an object
     * @param {Array} options
     * @param {*} value
     * @param {String} property property on the existing option - looks like this may always be "value"?
     * @param {String} property2 additional property on the existing option
     **/
    getListOption(options: any[], value: any, property?: string | any, property2?: string | any): any;
    /**
     * Get the selected list item. If class name is passed in gets the item with the class name.
     * @param {HTMLSelectElement} list
     * @param {string} classname name of class that represents selected item
     **/
    getSelectedListItem(list: HTMLElement | any, classname?: string): any;
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
    selectListOption(list: HTMLElement | any, option: any, value?: any, property?: string | any, property2?: string | any): void;
    /**
    * Log values to the console
    * @param values values to log
    */
    log(...values: any[]): void;
    displayErrors(): void;
    /**
     * Adds strings onto the end of other strings.
     * Separator is space by default but can be any character
     * @param {String} separator
     * @param {Array} strings
     **/
    addStrings(separator?: string, ...strings: any[]): string;
    addDefaultStyles(overwrite?: boolean): void;
    /**
     * Default CSS added to the page necessary for some functionality.
     * You can add to this string in your sub class
     */
    defaultCSS: string;
}
/**
* Returns a new instance of a start options
* @returns StartOptions
*/
export declare function getStartOptions(): StartOptions;
export type StartOptions = {
    startEvent?: string;
    addStyles?: boolean;
    bindProperties?: boolean;
    bindExclusions?: string[];
    storeReference?: boolean;
};
