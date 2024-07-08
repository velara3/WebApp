import { BaseClass } from "./BaseClass";
export declare class ExampleApp extends BaseClass {
    message: string;
    constructor();
    contentLoaded(): Promise<void>;
    setupEventListeners(): void;
    showAlert(value: string): void;
}
export {};
