/**
 * @module commons
 */
(function (window) {

    function KeyboardController(elements, columnsCount) {
        this.isSelectEnabled = true;
        this.keyboardNavigationActive = false;
        this.keyboardNavigationElements = elements;
        this.columnsCount = columnsCount;
        this.keyboardNavigationElementsLen = elements.length;
        var keys = {
            ENTER: 13,
            ESCAPE: 27,
            SPACE: 32,
            ARROW_LEFT: 37,
            ARROW_UP: 38,
            ARROW_RIGHT: 39,
            ARROW_DOWN: 40
        };
        var mapping = {};
        mapping[keys.ENTER] = this.enter;
        mapping[keys.ESCAPE] = this.escape;
        mapping[keys.SPACE] = this.select;
        mapping[keys.ARROW_LEFT] = this.previousElement;
        mapping[keys.ARROW_UP] = this.previousRow;
        mapping[keys.ARROW_RIGHT] = this.nextElement;
        mapping[keys.ARROW_DOWN] = this.nextRow;

        var shiftKeysMapping = {};
        shiftKeysMapping[keys.ENTER] = this.exitWCAGMode;

        this.mapping = mapping;
        this.shiftKeysMapping = shiftKeysMapping;
    }

    KeyboardController.prototype.handle = function (keycode, isShiftKeyDown) {
        $(document).on('keydown', function (e) {
            e.preventDefault();
            $(this).off('keydown');
        });
        try {
            if (isShiftKeyDown) {
                this.shiftKeysMapping[keycode].call(this);
            } else {
                this.mapping[keycode].call(this);
            }
        } catch (er) {
            console.log(er);
        }
    };

    KeyboardController.prototype.setElements = function (elements) {
        this.keyboardNavigationElements = elements;
        this.keyboardNavigationElementsLen = elements.length;
        this.keyboardNavigationCurrentElementIndex = 0;

        if (!this.keyboardNavigationActive) {
            return;
        }

        for (var i = 0; i < this.keyboardNavigationElementsLen; i++) {
            this.unmark(this.keyboardNavigationElements[i]);
        }

        this.keyboardNavigationCurrentElement = this.keyboardNavigationElements[0];
        this.mark(this.keyboardNavigationCurrentElement)
    };

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
            this.unmark(this.keyboardNavigationCurrentElement)
        }
        this.keyboardNavigationCurrentElementIndex = new_position_index;
        this.keyboardNavigationCurrentElement = this.keyboardNavigationElements[new_position_index];
        this.mark(this.keyboardNavigationCurrentElement)
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

    KeyboardController.prototype.nextElement = function () {
        this.switchElement(1);
    };

    KeyboardController.prototype.previousElement = function () {
        this.switchElement(-1);
    };

    KeyboardController.prototype.nextRow = function () {
        this.switchElement(this.columnsCount);
    };

    KeyboardController.prototype.previousRow = function () {
        this.switchElement(-this.columnsCount);
    };

    KeyboardController.prototype.enter = function () {
        if (this.keyboardNavigationActive) {
            return;
        }
        this.keyboardNavigationActive = true;
        this.markCurrentElement(0);
    };

    KeyboardController.prototype.escape = function () {
        if (!this.keyboardNavigationActive) {
            return;
        }
        this.exitWCAGMode();
    };

    KeyboardController.prototype.select = function () {
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

    /*

    */
    KeyboardController.prototype.exitWCAGMode = function () {
        if (!this.keyboardNavigationActive) {
            return;
        }

        this.keyboardNavigationActive = false;
        this.unmark(this.keyboardNavigationCurrentElement);
        this.keyboardNavigationCurrentElement = null;
    };

    window.KeyboardController = KeyboardController;

})(window);