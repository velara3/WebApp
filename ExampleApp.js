import * as view from "./ExampleElements.js";
import { BaseClass } from "./BaseClass.js";
export class ExampleApp extends BaseClass {
    examplesData = {};
    renderers = {};
    constructor() {
        super();
    }
    async start() {
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
BaseClass.startWhenReady(ExampleApp);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXhhbXBsZUFwcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkV4YW1wbGVBcHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLElBQUksTUFBTSxzQkFBc0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFM0MsTUFBTSxPQUFPLFVBQVcsU0FBUSxTQUFTO0lBQ3RDLFlBQVksR0FBd0IsRUFBRSxDQUFDO0lBQ3ZDLFNBQVMsR0FBd0IsRUFBRSxDQUFDO0lBRXBDO1FBQ0csS0FBSyxFQUFFLENBQUM7SUFDWCxDQUFDO0lBRVEsS0FBSyxDQUFDLEtBQUs7UUFFakIsSUFBSSxDQUFDO1lBQ0YsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBQzNCLE1BQU0sSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQy9CLENBQUM7UUFDRCxPQUFNLEtBQUssRUFBRSxDQUFDO1lBQ1gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQixDQUFDO0lBQ0osQ0FBQztJQUVRLG1CQUFtQjtRQUN6QixJQUFJLENBQUM7WUFDRixJQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUN2RSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQy9ELENBQUM7UUFDRCxPQUFNLEtBQUssRUFBRSxDQUFDO1lBQ1gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQixDQUFDO0lBQ0osQ0FBQztJQUVELEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxLQUFXO1FBQ2pDLE1BQU0sSUFBSSxD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