import { BaseClass } from "./BaseClass";
/**
 * This is example documentation. This class extends BaseClass
 * Add links to relevant pages in your own project.
 * Page [open](./page.html)
 * CSS [open](./styles/styles.css)
 */
export declare class BasicExample extends BaseClass {
    message: string;
    constructor();
    /**
     * Override the start() function and put your code here
     * The page has loaded and is ready
     * The following events are calling in order:
     * bindViewElements()
     * setupEventListeners()
     * start()
     */
    start(): Promise<void>;
    setupEventListeners(): void;
    showMessage(): void;
}
