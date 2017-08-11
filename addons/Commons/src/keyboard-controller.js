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
        this.mapping = mapping;
    }

    KeyboardController.prototype.handle = function (keycode) {
        $(document).on('keydown', function (e) {
            e.preventDefault();
            $(this).off('keydown');
        });
        try {
            this.mapping[keycode].call(this);
        } catch (er) {
        }
    };

    KeyboardController.prototype.getTarget = function (element) {
        return element;
    };

    KeyboardController.prototype.mark = function (element) {
        this.getTarget(element).addClass('keyboard_navigation_active_element');
    };

    KeyboardController.prototype.unmark = function (element) {
        this.getTarget(element).removeClass('keyboard_navigation_active_element');
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
        this.keyboardNavigationActive = false;
        this.unmark(this.keyboardNavigationCurrentElement);
        this.keyboardNavigationCurrentElement = null;
    };

    KeyboardController.prototype.select = function () {
        if (!this.isSelectEnabled) {
            return;
        }
        this.selectAction();
    };

    KeyboardController.prototype.selectAction = function () {
        this.keyboardNavigationCurrentElement.click();
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

    window.KeyboardController = KeyboardController;

})(window);