import { BaseClass } from "./BaseClass.js";
export declare class ExampleApp extends BaseClass {
    examplesData: Record<string, any>;
    renderers: Record<string, any>;
    constructor();
    contentLoaded(): Promise<void>;
    setupEventListeners(): void;
    getExamplesHandler(event: Event): Promise<void>;
    getExampleData(): Promise<void>;
    parseData(container: HTMLElement, data: Record<string, any>, clear?: boolean): void;
    exampleItemClickHandler(event: any): Promise<void>;
    checkQuery(): Promise<void>;
}
export {};
