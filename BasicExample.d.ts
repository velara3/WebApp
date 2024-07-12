import { BaseClass } from "./BaseClass";
export declare class ExampleApp extends BaseClass {
    message: string;
    constructor();
    start(): Promise<void>;
    setupEventListeners(): void;
    showAlert(value: string): void;
}
export {};
