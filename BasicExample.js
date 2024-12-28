import { BaseClass } from "./BaseClass";
/**
 * This is example documentation. This class extends BaseClass
 * Add links to relevant pages in your own project.
 * Page [open](./page.html)
 * CSS [open](./styles/styles.css)
 */
export class BasicExample extends BaseClass {
    message = "hello world";
    constructor() {
        super();
    }
    /**
     * Override the start() function and put your code here
     * The page has loaded and is ready
     * The following events are calling in order:
     * bindViewElements()
     * setupEventListeners()
     * start()
     */
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
            window.addEventListener("click", this.showMessage);
        }
        catch (error) {
            this.log(error);
        }
    }
    showMessage() {
        alert(this.message);
    }
}
/**
 * By default this function adds a listener for the page DOMContentLoaded event.
 * When that event is dispatched the class instance is created
 * and the following methods are called in order:
 * - bindViewElements()
 * - setupEventListeners()
 * - start()
 *
 * You can pass in startup options to adjust starting preferences
 */
BaseClass.startWhenReady(BasicExample);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzaWNFeGFtcGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQmFzaWNFeGFtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFeEM7Ozs7O0dBS0c7QUFDSCxNQUFNLE9BQU8sWUFBYSxTQUFRLFNBQVM7SUFDeEMsT0FBTyxHQUFXLGFBQWEsQ0FBQTtJQUUvQjtRQUNHLEtBQUssRUFBRSxDQUFDO0lBQ1gsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDTSxLQUFLLENBQUMsS0FBSztRQUVqQixJQUFJLENBQUM7WUFDRixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMxQixDQUFDO1FBQ0QsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNaLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkIsQ0FBQztJQUNKLENBQUM7SUFFUSxtQkFBbUI7UUFDekIsSUFBSSxDQUFDO1lBQ0YsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDdEQsQ0FBQztRQUNELE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDWixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25CLENBQUM7SUFDSixDQUFDO0lBRUQsV0FBVztRQUNSLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkIsQ0FBQztDQUNIO0FBRUQ7Ozs7Ozs7OztHQVNHO0FBQ0gsU0FBUyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQyJ9