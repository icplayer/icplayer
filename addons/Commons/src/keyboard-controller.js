/**
 * @module commons
 */
(function (window) {
    var keys = {
        TAB: 9,
        ENTER: 13,
        ESCAPE: 27,
        SPACE: 32,
        ARROW_LEFT: 37,
        ARROW_UP: 38,
        ARROW_RIGHT: 39,
        ARROW_DOWN: 40
    };
    var tts = null;

    /**
    KeyboardController util for managing WCAG in addons.
    @class KeyboardController
    @constructor
     For examples see: multigap addon.
    @return {null}
    */
    function KeyboardController(elements, columnsCount) {
        this.isSelectEnabled = true;
        this.keyboardNavigationActive = false;
        this.keyboardNavigationElements = elements;
        this.columnsCount = columnsCount;
        this.keyboardNavigationElementsLen = elements.length;

        var mapping = {};
        mapping[keys.TAB] = this.nextElement;
        mapping[keys.ENTER] = this.enter;
        mapping[keys.ESCAPE] = this.escape;
        mapping[keys.SPACE] = this.select;
        mapping[keys.ARROW_LEFT] = this.previousElement;
        mapping[keys.ARROW_UP] = this.previousRow;
        mapping[keys.ARROW_RIGHT] = this.nextElement;
        mapping[keys.ARROW_DOWN] = this.nextRow;

        var shiftKeysMapping = {};
        shiftKeysMapping[keys.TAB] = this.previousElement;
        shiftKeysMapping[keys.ENTER] = this.exitWCAGMode;

        this.mapping = mapping;
        this.shiftKeysMapping = shiftKeysMapping;
    }

    /**
     Handling key down event by keyboard controller. In addon code you should add that handling when you receive keycode from player.
     @method handle
     @param {Number} keycode - key code of pressed key
     @param {boolean} isShiftKeyDown - if shift is pressed
    */
    KeyboardController.prototype.handle = function (keycode, isShiftKeyDown, event) {
        if (isShiftKeyDown) {
            this.shiftKeysMapping[keycode] && this.shiftKeysMapping[keycode].call(this, event);
        } else {
            this.mapping[keycode] && this.mapping[keycode].call(this, event);
        }
    };


    /**
     Set elements for dynamic addon. If elements count will be changed while using addon, then call setElements. Always first element will be selected after calling this method.
     @method exitWCAGMode
     @param {Array} elements - elements to select
    */
    KeyboardController.prototype.setElements = function (elements) {
        for (var i = 0; i < this.keyboardNavigationElementsLen; i++) {
            this.unmark(this.keyboardNavigationElements[i]);
        }

        this.keyboardNavigationElements = elements;
        this.keyboardNavigationElementsLen = elements.length;
        this.keyboardNavigationCurrentElementIndex = 0;

        if (!this.keyboardNavigationActive) {
            return;
        }

        this.keyboardNavigationCurrentElement = this.keyboardNavigationElements[0];
        this.mark(this.keyboardNavigationCurrentElement)
    };

    /**
     Method to override. If element will be clicked/selected then at first this method will be called and element returned by this method will be clicked/selected (somethig like middleware. If different element will be selected/clicked than passed in contructor or setElements then you should override that method.

     @method getTarget
     @param {element} element - element from constructor/setElements
     @param {boolean} willBeClicked - element will be clicked
     @return {element} - element which will be clicked/selected
    */
    KeyboardController.prototype.getTarget = function (element, willBeClicked) {
        return element;
    };

    KeyboardController.prototype.mark = function (element) {
        this.getTarget(element, false).addClass('keyboard_navigation_active_element');
    };

    KeyboardController.prototype.unmark = function (element) {
        this.getTarget(element, false).removeClass('keyboard_navigation_active_element');
    };

    KeyboardController.prototype.markCurrentElement = function (new_position_index) {
        if (this.keyboardNavigationCurrentElement) {
            this.unmark(this.keyboardNavigationCurrentElement);
        }
        this.keyboardNavigationCurrentElementIndex = new_position_index;
        this.keyboardNavigationCurrentElement = this.keyboardNavigationElements[new_position_index];
        this.mark(this.keyboardNavigationCurrentElement);
    };

    KeyboardController.prototype.switchElement = function (move) {
        var new_position_index = this.keyboardNavigationCurrentElementIndex + move;
        if (new_position_index >= this.keyboardNavigationElementsLen) {
            new_position_index = new_position_index - this.keyboardNavigationElementsLen;
        } else if (new_position_index < 0) {
            new_position_index = this.keyboardNavigationElementsLen + new_position_index;
        }
        this.markCurrentElement(new_position_index);
    };

    /**
     Action when was called right arrow or tab
     @method nextElement
    */
    KeyboardController.prototype.nextElement = function (event) {
        if (event) {
            event.preventDefault();
        }
        this.switchElement(1);
    };

    /**
     Action when was called left arrow or combination shift + tab
     @method previousElement
    */
    KeyboardController.prototype.previousElement = function (event) {
        if (event) {
            event.preventDefault();
        }
        this.switchElement(-1);
    };

    /**
     Action when was called up arrow
     @method nextRow
    */
    KeyboardController.prototype.nextRow = function (event) {
        if (event) {
            event.preventDefault();
        }
        this.switchElement(this.columnsCount);
    };

    /**
     Action when was called down arrow
     @method previousRow
    */
    KeyboardController.prototype.previousRow = function (event) {
        if (event) {
            event.preventDefault();
        }
        this.switchElement(-this.columnsCount);
    };

    /**
     Action which will be called when enter was pressed
     @method enter
    */
    KeyboardController.prototype.enter = function (event) {
        if (event) {
            event.preventDefault();
        }
        if (this.keyboardNavigationActive) {
            return;
        }
        this.keyboardNavigationActive = true;
        this.markCurrentElement(0);
    };

    /**
     If escape was pressed then this action will be called. This callback will call exitWCAGMode
     @method exitWCAGMode
    */
    KeyboardController.prototype.escape = function (event) {
        if (event) {
            event.preventDefault();
        }
        if (!this.keyboardNavigationActive) {
            return;
        }
        this.exitWCAGMode();
    };

    KeyboardController.prototype.select = function (event) {
        if (event) {
            event.preventDefault();
        }
        if (!this.isSelectEnabled) {
            return;
        }
        this.selectAction();
    };

    KeyboardController.prototype.selectAction = function () {
        this.getTarget(this.keyboardNavigationCurrentElement, true).click();
    };

    KeyboardController.prototype.reload = function (elements, columnsCount) {
        this.isSelectEnabled = true;
        this.keyboardNavigationElements = elements;
        this.columnsCount = columnsCount;
        this.keyboardNavigationElementsLen = elements.length;
        if (this.keyboardNavigationActive) {
            this.enter();
        }
    };

    KeyboardController.prototype.selectEnabled = function (isSelectEnabled) {
        this.isSelectEnabled = isSelectEnabled;
    };

    /**
     If addon exits from WCAG mode, then exitWCAGMode callback will be called.
     If you want to override that method, be sure to call this method too.
     @method exitWCAGMode
    */
    KeyboardController.prototype.exitWCAGMode = function () {
        if (!this.keyboardNavigationActive) {
            return;
        }

        this.keyboardNavigationActive = false;
        this.unmark(this.keyboardNavigationCurrentElement);
        this.keyboardNavigationCurrentElement = null;
    };

    KeyboardController.prototype.getTextToSpeechOrNull = function (playerController) {
        tts = null;

        if (tts) {
            return tts;
        }

        if (playerController) {
            tts = playerController.getModule('Text_To_Speech1');
        }

        return tts;
    };

    window.KeyboardController = KeyboardController;
    window.KeyboardControllerKeys = keys;

})(window);