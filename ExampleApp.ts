import * as view from "./ExampleElements.js";
import { BaseClass } from "./BaseClass.js";

/**
 * Page [page](./example.html)  
 * CSS [css](./styles/example.css)   
 */
export class ExampleApp extends BaseClass {
   examplesData: Record<string, any> = {};
   renderers: Record<string, any> = {};

   constructor() {
      super();
   }

   override async start() {

      try {
         this.showRequestIcon(false);
         this.setupEventListeners();
         await this.getExampleData();
      }
      catch(error) {
         this.log(error);
      }
   }

   override setupEventListeners(): void {
      try {
         view.examplesButton.addEventListener("click", this.getExamplesHandler);
         window.addEventListener("message", this.postMessageHandler);
      }
      catch(error) {
         this.log(error);
      }
   }

   async getExamplesHandler(event:Event) {
      await this.getExampleData();
   }

   async getExampleData() {
      try {
         var results = await this.requestURL("examples");
         this.log(results);

         if (results.success==false) {
            if (results.notLoggedIn==true) {
               this.showDialog("Login", "Login required", ()=> {
                  window.location.href = "/login";
               });
               return;
            }
            else {
               this.showDialog("Error", results.message);
            }
         }

         this.parseData(view.exampleGrid, results.data);
      }
      catch(error) {
         this.log(error);
      }
   }
   
   parseData(container: HTMLElement, data: Record<string, any>, clear = false) {
      try {
         var items = data;
         var numberOfItems = items ? items.length : 0;
         if (clear) {
            container.innerHTML = ""
         }

         for(var i=0; i<numberOfItems; i++) {
            var item = items[i];
            var itemName = item.name;
            var id = item.id;
            var itemThumbnailURL = item.thumbnail;

            var exampleItemRenderer = view.exampleItemRenderer.cloneNode(true) as HTMLDivElement;
            var exampleImage = exampleItemRenderer.querySelectorAll(".exampleImage")[0] as HTMLImageElement;
            var exampleNameLabel = exampleItemRenderer.querySelectorAll(".exampleName")[0] as HTMLSpanElement;

            this.setContent(exampleNameLabel, itemName);
            exampleImage.src = itemThumbnailURL;
            exampleImage.dataset.id = id;
            exampleItemRenderer.dataset.id = id;
            
            exampleItemRenderer.addEventListener("click", this.exampleItemClickHandler);
            
            this.addElement(container, exampleItemRenderer);

            this.examplesData[id] = item;
            this.renderers[id] = exampleItemRenderer;
         }
      }
      catch(error) {
         this.log(error);
         this.showDialog("Error", error as string);
      }
   }

   async exampleItemClickHandler(event: any) {
      try {
         var itemRenderer = event.currentTarget;
         var id = itemRenderer.dataset.id;
         var item = this.examplesData[id];
      }
      catch (error) {
         this.log(error);
      }
   }

   override async checkQuery() {
      try {
         var url = new URL(window.location.href);
         var parameters = url.searchParams;
         var id = parameters.get("id");
         if (id) {

         }
      }
      catch (error) {
         this.log(error);
      }
   }
}

BaseClass.startWhenReady(ExampleApp);