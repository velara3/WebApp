import { BaseClass } from "./BaseClass.js";
import { LoginElements } from "./LoginElements.js";
export declare var view: LoginElements;
/**
 * Page [open](./login.html)
 * CSS [open](./styles/login.css)
 */
export declare class LoginApp extends BaseClass {
    constructor();
    start(): Promise<void>;
    setupEventListeners(): void;
    inputKeyupHandler(event: any): void;
    submitFormHandler(event: any): Promise<void>;
}
