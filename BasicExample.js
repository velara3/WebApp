import { BaseClass } from "./BaseClass";
/**
 * This is example documentation. This class extends BaseClass
 * Add links to relevant pages in your own project.
 * Page [open](./page.html)
 * CSS [open](./styles/styles.css)
 */
export class ExampleApp extends BaseClass {
    message = "hello world";
    constructor() {
        super();
    }
    async start() {
        try {
            this.log(this.message);
        }
        catch (error) {
            this.log(error);
        }
    }
    setupEventListeners() {
        try {
            window.addEventListener("click", () => {
                this.showAlert(this.message);
            });
        }
        catch (error) {
            this.log(error);
        }
    }
    showAlert(value) {
        alert(value);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzaWNFeGFtcGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQmFzaWNFeGFtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFeEM7Ozs7O0dBS0c7QUFDSCxNQUFNLE9BQU8sVUFBVyxTQUFRLFNBQVM7SUFDdEMsT0FBTyxHQUFXLGFBQWEsQ0FBQTtJQUUvQjtRQUNHLEtBQUssRUFBRSxDQUFDO0lBQ1gsQ0FBQztJQUVRLEtBQUssQ0FBQyxLQUFLO1FBRWpCLElBQUksQ0FBQztZQUNGLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzFCLENBQUM7UUFDRCxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ1osSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQixDQUFDO0lBQ0osQ0FBQztJQUVRLG1CQUFtQjtRQUN6QixJQUFJLENBQUM7WUFDRixNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtnQkFDbkMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDL0IsQ0FBQyxDQUFDLENBQUM7UUFDTixDQUFDO1FBQ0QsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNaLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkIsQ0FBQztJQUNKLENBQUM7SUFFRCxTQUFTLENBQUMsS0FBYTtRQUNwQixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEIsQ0FBQztDQUNIIn0=