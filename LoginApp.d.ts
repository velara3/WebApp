import { BaseClass } from "./BaseClass.js";
import { LoginElements } from "./LoginElements.js";
export declare var view: LoginElements;
export declare class LoginApp extends BaseClass {
    constructor();
    setupEventListeners(): void;
    inputKeyupHandler(event: any): void;
    submitFormHandler(event: any): Promise<void>;
}
