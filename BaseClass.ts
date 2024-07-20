export class BaseClass {
   showClass: string = "display";
   hideClass: string = "noDisplay";
   requestIconSelector: string = "#requestIcon";
   dialogSelector: string = "#dialog";
   dialogTitleSelector: string = "#dialogTitle";
   dialogMessageSelector: string = "#dialogMessage";
   versionLabelSelector: string = "#versionLabel";
   controllers: Map<number, AbortController> = new Map();
   requestIcon: HTMLElement = document.querySelector(this.requestIconSelector) as HTMLElement;
   dialog: HTMLDialogElement = document.querySelector(this.dialogSelector) as HTMLDialogElement;
   dialogTitle: HTMLElement = document.querySelector(this.dialogTitleSelector) as HTMLElement;
   dialogMessage: HTMLElement = document.querySelector(this.dialogMessageSelector) as HTMLElement;
   versionLabel: HTMLElement = document.querySelector(this.versionLabelSelector) as HTMLElement;
   dialogCallback?: Function;
   requestsInProgress: number = 0;
   localClassReference: any | undefined;
   static PAGE_LOADED: string = "DOMContentLoaded";

   constructor() {

   }

   static startWhenReady(ClassReference: any, options?: StartOptions) {
      window.addEventListener(BaseClass.PAGE_LOADED, (event) => {
         try {
            BaseClass.start(ClassReference, options);
         }
         catch (error) {
            console.error(error);
         }
      })
   }

   /**
    * Static method that creates an instance of your class and then calls the instance start() method
    * @param ClassReference Reference to your class that extends BaseClass
    * @param options StartOptions
    * @returns instance of your class
    */
   static start(ClassReference: any, options?: StartOptions) {
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

   static instances: Array<BaseClass> = [];
   static instancesMap: Map<string, BaseClass> = new Map();

   /**
    * Override and call this method for startup
    */
   async start() {

   }

   /**
    * Set some start up options
    * @param options 
    */
   applyOptions(options?: StartOptions) {

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
   async getURL(url: string, options: any = null, type: string = "json") {
      if (options == null) { options = {} };
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
   async postURL(url: string, form: any, options: any = null, type: string = "json") {
      if (options == null) { options = {} }
      if (form && options.body == null) { options.body = form }
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
   async requestURL(url: string, options: any = null, type: string = "json") {
      var response: any = null;

      try {
         this.showRequestIcon();
         await this.sleep(10);

         const controller = new AbortController();
         const signal = controller.signal;
         if (options == null) { options = {} }
         if (options.signal == null) { options.signal = signal };

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
   postMessageHandler(event: any) {
      if (event.origin !== "https://") return;
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
         this.controllers.forEach((value: AbortController, key: number, map: Map<number, AbortController>) => {
            value.abort();
         })
      }
   }

   /**
    * Wait a specific amount of time in milliseconds before proceeding to the next line of code
    * Must use await in front of this call
    * @param ms 
    * @returns 
    */
   sleep(milliseconds: number) {
      return new Promise(resolve => setTimeout(resolve, milliseconds))
   }

   /**
    * Show a dialog. 
    * Dialog must be an element defined to the dialog property
    * By default the dialog has an id of dialog and is an HTMLDialogElement on the page
    * @param title Title in dialog
    * @param value text to show in dialog
    * @param callback Callback after user clicks ok or exits from dialog
    */
   showDialog(title: string, value: string, callback: any = null, dialog?: HTMLDialogElement) {
      
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
      this.log("Not implemented")
   }

   /**
    * Closs dialog if dialog is open. Calls dialog callback if defined
    */
   closeDialog(dialog?: HTMLDialogElement) {
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
   addClass(element: Element | Array<Element>, name: string) {
      var elements: any[] = element as any[];

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
   removeClass(element: HTMLElement | Array<HTMLElement>, name: string) {
      var elements: any[] = element as any[];

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
   revealElement(element: HTMLElement, display = true) {

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
   hideElement(element: Element) {
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
         var data: any = await this.requestURL("version");
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
   setStyle(element: HTMLElement, property: string, value: string | null, priority?: string, resetValue: any = null, resetTimeout: number = 5000) {
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
   setParent(element: any, parent: Node) {
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
   setContent(element: HTMLElement, value: string, tooltip: any = null, resetValue: any = null, resetTimeout: number = 5000) {
      element.textContent = value;

      if (typeof tooltip == "string") {
         element.title = tooltip;
      }
      else if (tooltip) {
         element.title = value;
      }

      if (resetValue !== null) {
         setTimeout(this.setContent, resetTimeout, element, resetValue)
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
   setSpan(element: HTMLElement, value: string, tooltip: any = null, resetValue: any = null, resetTimeout: number = 5000) {
      element.textContent = value;

      if (typeof tooltip == "string") {
         element.title = tooltip;
      }
      else if (tooltip) {
         element.title = value;
      }

      if (resetValue !== null) {
         setTimeout(this.setSpan, resetTimeout, element, resetValue)
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
   addElement(container: Node, element: Element | any, properties = null, ...children: any[]) {
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
   createElement(tagName: string, properties: any = null, ...children: any[]) {
      try {
         var element: any = document.createElement(tagName);

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
   updateQuery(parameter: string, value: string) {
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
   bindProperties(mainClass: any) {
      var properties: any = Object.getOwnPropertyNames(mainClass.prototype);
      var that: any = this;
      for (var key in properties) {
         var property: string = properties[key];
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
   scrollElementIntoView(element: Element, behavior = "smooth", block = "start", inline = "nearest") {
      element.scrollIntoView(({ behavior, block, inline }) as ScrollIntoViewOptions);
   }

   /**
    * Scroll to bottom of element
    * @param element element to scroll to bottom
    */
   scrollToBottom(element: Element) {
      if (element instanceof HTMLTextAreaElement) {
         element.scrollTop = element.scrollHeight;
      }
      else {
         element.scrollTop = element.scrollHeight;
      }
   }

   async getDownloadData(url: string): Promise<Blob> {
      var binary = await this.getFileBinaryAtURL(url);
      var binaryBuffer = new Blob([binary.buffer]);
      return binaryBuffer;
   }

   getFileBinaryAtURL(url: string): Promise<Uint8Array> {
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
         }

         request.onerror = reject;
         request.onabort = reject;
         request.open('GET', url, true);
         request.responseType = "arraybuffer";
         request.send();
      });
   }

   async upload(url: string, file: File | Blob | Array<File | Blob>, formData?: FormData) {

      try {

         if (formData == null) {
            formData = new FormData()
         }

         if (file instanceof Blob || file instanceof File) {
            formData.append('file', file);
         }
         else {
            var files = file as Array<Blob | File>;
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

   copyToClipboard(value: string) {
      navigator.clipboard.writeText(value);
   }

   openInWindow(url: string, target: string) {
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

   createOption(label: string, value: string, useListItem = false, icon = null, classes = [], callback?: any) {
      var optionName = useListItem ? "li" : "option";
      var option = document.createElement(optionName) as HTMLOptionElement;
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
   log(...values: any[]) {
      console.log(...values);
   }

   displayErrors() {
      var output = "";
   }
   
   addDefaultStyles(overwrite:boolean = false) {
      var defaultStylesheetId = this.localClassReference?.name + "DefaultStylesheet";
      var stylesheetExists = document.getElementById(defaultStylesheetId);
      
      // check to prevent adding multiple times
      if (overwrite || stylesheetExists==null) {
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
   defaultCSS = 
   `.display {
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
export function getStartOptions(): StartOptions {

  return {
   addStyles: true, 
   bindProperties: true,
   storeReference: true
  }
}
export type StartOptions =  {
   startWith?: string, 
   addStyles: boolean, 
   bindProperties: boolean,
   storeReference: boolean
}