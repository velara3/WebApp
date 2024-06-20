import * as view from "./ExampleElements.js";
import { BaseClass } from "./BaseClass.js";
window.addEventListener(BaseClass.PAGE_LOADED, () => { new ExampleApp().contentLoaded(); });
export class ExampleApp extends BaseClass {
    examplesData = {};
    renderers = {};
    constructor() {
        super();
    }
    async contentLoaded() {
        try {
            this.bindProperties(ExampleApp);
            this.showRequestIcon(false);
            this.setupEventListeners();
            await this.getExampleData();
        }
        catch (error) {
            this.log(error);
        }
    }
    setupEventListeners() {
        try {
            view.examplesButton.addEventListener("click", this.getExamplesHandler);
            window.addEventListener("message", this.postMessageHandler);
        }
        catch (error) {
            this.log(error);
        }
    }
    async getExamplesHandler(event) {
        await this.getExampleData();
    }
    async getExampleData() {
        try {
            var results = await this.requestURL("examples");
            this.log(results);
            if (results.success == false) {
                if (results.notLoggedIn == true) {
                    this.showDialog("Login", "Login required", () => {
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
        catch (error) {
            this.log(error);
        }
    }
    parseData(container, data, clear = false) {
        try {
            var items = data;
            var numberOfItems = items ? items.length : 0;
            if (clear) {
                container.innerHTML = "";
            }
            for (var i = 0; i < numberOfItems; i++) {
                var item = items[i];
                var itemName = item.name;
                var id = item.id;
                var itemThumbnailURL = item.thumbnail;
                var exampleItemRenderer = view.exampleItemRenderer.cloneNode(true);
                var exampleImage = exampleItemRenderer.querySelectorAll(".exampleImage")[0];
                var exampleNameLabel = exampleItemRenderer.querySelectorAll(".exampleName")[0];
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
        catch (error) {
            this.log(error);
            this.showDialog("Error", error);
        }
    }
    async exampleItemClickHandler(event) {
        try {
            var itemRenderer = event.currentTarget;
            var id = itemRenderer.dataset.id;
            var item = this.examplesData[id];
        }
        catch (error) {
            this.log(error);
        }
    }
    async checkQuery() {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXhhbXBsZUFwcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkV4YW1wbGVBcHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLElBQUksTUFBTSxzQkFBc0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFM0MsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsR0FBRSxFQUFFLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBRXpGLE1BQU0sT0FBTyxVQUFXLFNBQVEsU0FBUztJQUN0QyxZQUFZLEdBQXdCLEVBQUUsQ0FBQztJQUN2QyxTQUFTLEdBQXdCLEVBQUUsQ0FBQztJQUVwQztRQUNHLEtBQUssRUFBRSxDQUFDO0lBQ1gsQ0FBQztJQUVRLEtBQUssQ0FBQyxhQUFhO1FBRXpCLElBQUksQ0FBQztZQUNGLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM1QixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUMzQixNQUFNLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUMvQixDQUFDO1FBQ0QsT0FBTSxLQUFLLEVBQUUsQ0FBQztZQUNYLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkIsQ0FBQztJQUNKLENBQUM7SUFFUSxtQkFBbUI7UUFDekIsSUFBSSxDQUFDO1lBQ0YsSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDdkUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUMvRCxDQUFDO1FBQ0QsT0FBTSxLQUFLLEVB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