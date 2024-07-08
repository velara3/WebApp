export class BaseClass {
   showClass: string = "display";
   hideClass: string = "noDisplay";
   requestsInProgress: number = 0;
   controllers: Map<number, AbortController> = new Map();
   requestIcon: HTMLElement = document.getElementById("requestIcon") as HTMLElement;
   dialog: HTMLDialogElement = document.getElementById("dialog") as HTMLDialogElement;
   dialogTitle: HTMLElement = document.getElementById("dialogTitle") as HTMLElement;
   dialogMessage: HTMLElement = document.getElementById("dialogMessage") as HTMLElement;
   versionLabel: HTMLElement = document.getElementById("versionLabel") as HTMLElement;
   dialogCallback?: Function;
   static PAGE_LOADED: string = "DOMContentLoaded";

   constructor() {

   }

   static startWhenReady(ClassReference: any, startWith?: string) {
      window.addEventListener(BaseClass.PAGE_LOADED, (event) => {
         try {
            var instance = new ClassReference();
            instance.bindProperties(instance);
            if (startWith) {
               instance[startWith]();
            }
         }
         catch (error) {
            console.error(error);
         }
      })
   }

   /**
    * Override and call this method for async 
    */
   async contentLoaded() {
      this.bindProperties(BaseClass);
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
   async getURL(url: string, options: any = null, json: Boolean = true) {
      if (options == null) { options = {} };
      options.method = "get";
      return await this.requestURL(url, options, json);
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
   async postURL(url: string, form: any, options: any = null, json: Boolean = true) {
      if (options == null) { options = {} }
      if (form && options.body == null) { options.body = form }
      options.method = "post";
      return await this.requestURL(url, options, json);
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
   async requestURL(url: string, options: any = null, json: Boolean = true) {
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
         var text = await response.text();

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
   showDialog(title: string, value: string, callback: any = null) {

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
   addClass(element: Element | Array<Element>, name: string) {
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
   removeClass(element: HTMLElement | Array<HTMLElement>, name: string) {
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
}