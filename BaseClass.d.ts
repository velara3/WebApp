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
    baseURI: string;
    isBaseURLRegEx: RegExp;
    localClassReference: any | undefined;
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
     * @param json returns the results as json. default is true
     * @returns
     */
    getURL(url: string, options?: any, type?: string): Promise<any>;
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
    postURL(url: string, form?: any, options?: any, type?: string): Promise<any>;
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
    requestURL(url: string, options?: any, type?: string): Promise<any>;
    /**
     * Callback when an error occurs calling requestURL() or fetch
     * Override in sub classes
     */
    requestError(error: Error | unknown, url: string): void;
    /**
     * Attach event listeners here
     * Override in sub classes
     */
    setupEventListeners(): void;
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
     * Hides an element that would be displayed at startup
     * @param element element to hide
     */
    hideElement(element: HTMLElement | Array<HTMLElement>): void;
    /**
     * Shows an element that would not be displayed at startup
     * @param element element to show
     */
    showElement(element: HTMLElement | Array<HTMLElement>): void;
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
     * Set the text content of a span element
     * @param element element that will be set
     * @param value value to set span
     * @param tooltip value to set tool tip of span (optional)
     * @param resetValue value to be set after a reset timeout (optional)
     * @param resetTimeout timeout in milliseconds to reset style to (optional)
     */
    setSpan(element: HTMLElement, value: string, tooltip?: any, resetValue?: any, resetTimeout?: number): void;
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
    bindProperties(mainClass: any): void;
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
    upload(url: string, file: File | Blob | Array<File | Blob>, formData?: FormData): Promise<any>;
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
* @returns TextRange
*/
export declare function getStartOptions(): StartOptions;
export type StartOptions = {
    startEvent?: string;
    addStyles?: boolean;
    bindProperties?: boolean;
    storeReference?: boolean;
};
