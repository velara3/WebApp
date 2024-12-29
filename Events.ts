/**
 * Constants for events and constants
 * Note: note all events are listed
 */

/**
 * Window events 
 */
export class PageEvents {
    static DOM_CONTENT_LOADED: string = "DOMContentLoaded";
    static PAGE_LOADED: string = "load";
}

export class MouseEvents {
    static CLICK: string = "click";
    static DOUBLE_CLICK: string = "dblclick";
    static MOUSE_DOWN: string = "mousedown";
    static MOUSE_UP: string = "mouseup";
    static MOUSE_MOVE: string = "mousemove";
}

export class KeyboardEvents {
    static KEY_PRESS: string = "keypress";
    static KEY_DOWN: string = "keydown";
    static KEY_UP: string = "keyup";
}

export class UIEvents {
    static FOCUS: string = "focus";
    static BLUR: string = "blur";
    static FOCUS_IN: string = "focusin";
    static FOCUS_OUT: string = "focusout";
}

/**
 * Todo
CompositionEvent
FocusEvent
InputEvent
MouseEvent
MouseScrollEventNon-standardDeprecated
MutationEventNon-standardDeprecated
TextEventDeprecated
UIEvent
WheelEvent
 */