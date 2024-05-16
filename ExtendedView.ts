import { BaseElements } from "./BaseElements.js";

export class ExtendedElements extends BaseElements {
   createButton = document.getElementById("createButton") as HTMLElement;
   applyButton = document.getElementById("applyButton") as HTMLElement;
}
