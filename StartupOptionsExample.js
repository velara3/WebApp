import { BaseClass, getStartOptions } from "./BaseClass";
/**
 * This example shows setting up startup options.
 * Add links to relevant pages in your own project.
 * Page [open](./page.html)
 * CSS [open](./styles/styles.css)
 */
export class StartupOptions extends BaseClass {
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
    test() {
        // because of our startup options,
        // this method is excluded from class binding in bindProperties()
    }
}
/**
 * By default this function adds a listener for the page DOMContentLoaded event.
 * When that event is dispatched the class instance is created
 * and the following methods are called in order:
 * - bindProperties()
 * - bindViewElements()
 * - setupEventListeners()
 * - start()
 *
 * You will normally always override
 * - bindViewElements()
 * - setupEventListeners()
 * - start()
 *
 * You can pass in startup options to adjust starting preferences
 */
var startOptions = getStartOptions();
startOptions.bindExclusions = ["test"];
BaseClass.startWhenReady(StartupOptions);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhcnR1cE9wdGlvbnNFeGFtcGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiU3RhcnR1cE9wdGlvbnNFeGFtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFnQixNQUFNLGFBQWEsQ0FBQztBQUV2RTs7Ozs7R0FLRztBQUNILE1BQU0sT0FBTyxjQUFlLFNBQVEsU0FBUztJQUMxQyxPQUFPLEdBQVcsYUFBYSxDQUFBO0lBRS9CO1FBQ0csS0FBSyxFQUFFLENBQUM7SUFDWCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNNLEtBQUssQ0FBQyxLQUFLO1FBRWpCLElBQUksQ0FBQztZQUNGLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzFCLENBQUM7UUFDRCxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ1osSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQixDQUFDO0lBQ0osQ0FBQztJQUVELElBQUk7UUFDRCxrQ0FBa0M7UUFDbEMsaUVBQWlFO0lBQ3BFLENBQUM7Q0FDSDtBQUVEOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUVILElBQUksWUFBWSxHQUFpQixlQUFlLEVBQUUsQ0FBQztBQUNuRCxZQUFZLENBQUMsY0FBYyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDdkMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQyJ9