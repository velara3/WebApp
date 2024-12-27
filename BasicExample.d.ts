import { BaseClass } from "./BaseClass";
/**
 * This is example documentation. This class extends BaseClass
 * Add links to relevant pages in your own project.
 * Page [open](./page.html)
 * CSS [open](./styles/styles.css)
 */
export declare class ExampleApp extends BaseClass {
    message: string;
    constructor();
    start(): Promise<void>;
    setupEventListeners(): void;
    showAlert(value: string): void;
}
export {};
