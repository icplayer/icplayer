function createViewForTests(presenter) {
    // view of model value:
    // _1[2]2
    // _-98
    // ====
    // __[2][4]
    presenter.$view = $('' +
        '<div id="writing-calculations-wrapper" style="width: 200px;">\n' +
        '  <div class="wrapper-row row-1">\n' +
        '    <div class="wrapper-empty-space cell-1">\n' +
        '      <div class="container-emptySpace"/>\n' +
        '    </div>\n' +
        '    <div class="wrapper-cell cell-2">\n' +
        '      <div class="container-number">1</div>\n' +
        '    </div>\n' +
        '    <div class="wrapper-cell cell-3">\n' +
        '      <div class="container-emptyBox">\n' +
        '        <input type="text" class="writing-calculations-input" maxlength="1" row="1" cell="1"/>\n' +
        '      </div>\n' +
        '    </div>\n' +
        '    <div class="wrapper-cell cell-4">\n' +
        '      <div class="container-number">2</div>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '  <div class="wrapper-row row-2">\n' +
        '    <div class="wrapper-empty-space cell-1">\n' +
        '      <div class="container-emptySpace"/>\n' +
        '    </div>\n' +
        '    <div class="wrapper-cell cell-2">\n' +
        '      <div class="container-symbol">\n' +
        '        \\MathJax \n' +
        '      </div>\n' +
        '    </div>\n' +
        '    <div class="wrapper-cell cell-3">\n' +
        '      <div class="container-number">9</div>\n' +
        '    </div>\n' +
        '    <div class="wrapper-cell cell-4">\n' +
        '      <div class="container-number">8</div>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '  <div class="wrapper-row row-3">\n' +
        '    <div class="wrapper-line">\n' +
        '      <div class="container-line"/>\n' +
        '    </div>\n' +
        '    <div class="wrapper-line">\n' +
        '      <div class="container-line"/>\n' +
        '    </div>\n' +
        '    <div class="wrapper-line">\n' +
        '      <div class="container-line"/>\n' +
        '    </div>\n' +
        '    <div class="wrapper-line">\n' +
        '      <div class="container-line"/>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '  <div class="wrapper-row row-4">\n' +
        '    <div class="wrapper-empty-space cell-1">\n' +
        '      <div class="container-emptySpace"/>\n' +
        '    </div>\n' +
        '    <div class="wrapper-empty-space cell-2">\n' +
        '      <div class="container-emptySpace"/>\n' +
        '    </div>\n' +
        '    <div class="wrapper-cell cell-3">\n' +
        '      <div class="container-emptyBox">\n' +
        '        <input type="text" class="writing-calculations-input" maxlength="1" row="4" cell="1"/>\n' +
        '      </div>\n' +
        '    </div>\n' +
        '    <div class="wrapper-cell cell-4">\n' +
        '      <div class="container-emptyBox">\n' +
        '        <input type="text" class="writing-calculations-input" maxlength="1" row="4" cell="2"/>\n' +
        '      </div>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '</div>');

    var tableElements = [];
    var view = presenter.$view[0];
    for (var rowIndex = 0; rowIndex < view.children.length; rowIndex++) {
        var row = view.children[rowIndex];
        var rowElements = [];
        for (var colIndex = 0; colIndex < row.children.length; colIndex++) {
            var $cell =  $(row.children[colIndex]);
            rowElements.push($cell);
        }
        tableElements.push(rowElements);
    }
    presenter.tableElements = tableElements;

    var gapElements = [
        {
            "x": 2,
            "y": 0,
            "el": null
        },
        {
            "x": 2,
            "y": 3,
            "el": null
        },
        {
            "x": 3,
            "y": 3,
            "el": null
        }
    ];
    gapElements[0].el = tableElements[gapElements[0].y][gapElements[0].x];
    gapElements[0].gapInRowIndex = 0;
    gapElements[1].el = tableElements[gapElements[1].y][gapElements[1].x];
    gapElements[1].gapInRowIndex = 0;
    gapElements[2].el = tableElements[gapElements[2].y][gapElements[2].x];
    gapElements[2].gapInRowIndex = 1;
    presenter.gapElements = gapElements;
}

function createEvent(keycode) {
    return {
        "keyCode": keycode,
        preventDefault: sinon.stub(),
        stopPropagation: sinon.stub()
    };
}

TestCase("[Writing Calculations] Alternative keyboard navigation with TTS tests", {
    setUp : function() {
        this.presenter = AddonWritingCalculations_create();
        createViewForTests(this.presenter);
        this.presenter.useAlternativeTTSNavigation = true;
        this.presenter.isWCAGOn = true;
        this.presenter.rowsStatusesOfNavigabilityInAltTTSNavigation = [
            {rowIndex: -1, isNavigable: true},
            {rowIndex: 0, isNavigable: true},
            {rowIndex: 1, isNavigable: true},
            {rowIndex: 2, isNavigable: false},
            {rowIndex: 3, isNavigable: true}
        ];
        this.presenter.rowsAltTexts = [
            "First row", "Second row", "Third row"
        ];
        this.presenter.descriptionOfOperation = "Description of operation";
        this.presenter.readSelectedElement = sinon.stub();
    },

    setKeyboardNavigationOnDescriptionOfOperationRow : function () {
        this.presenter.keyboardState.x = 0;
        this.presenter.keyboardState.y = -1;
        this.presenter.keyboardState.gapIndex = -1;
        this.presenter.isGapFocused = false;
    },

    setKeyboardNavigationOnRow : function (rowIndex) {
        this.presenter.tableElements[rowIndex][0].parent().addClass(this.presenter.KEYBOARD_SELECTED_CLASS);
        this.presenter.keyboardState.x = -1;
        this.presenter.keyboardState.y = rowIndex;
        this.presenter.keyboardState.gapIndex = -1;
        this.presenter.isGapFocused = false;
    },

    setKeyboardNavigationOnGap : function (gapIndex) {
        var gapElement = this.presenter.gapElements[gapIndex];
        gapElement.el.find('input.writing-calculations-input').addClass(this.presenter.KEYBOARD_SELECTED_CLASS);
        this.presenter.keyboardState.x = gapElement.x;
        this.presenter.keyboardState.y = gapElement.y;
        this.presenter.keyboardState.gapIndex = gapIndex;
        this.presenter.isGapFocused = true;
    },

    validateHowManyActiveElements : function (amount) {
        assertEquals(`Validation: Is number of active keyboard navigation elements equal to ${amount}.`, amount, this.presenter.$view.find("." + this.presenter.KEYBOARD_SELECTED_CLASS).length);
    },

    validateIsNavigationOnRow : function (rowIndex) {
        assertTrue(`Validation: Is navigation set on row with index equal to ${rowIndex}.`, this.presenter.tableElements[rowIndex][0].parent().hasClass(this.presenter.KEYBOARD_SELECTED_CLASS));
    },

    validateIsNavigationOnGap : function (gapIndex) {
        assertTrue("Validation: Is gap class correct for focused gap.", this.presenter.gapElements[gapIndex].el.find('input.writing-calculations-input').hasClass(this.presenter.KEYBOARD_SELECTED_CLASS));
        assertTrue("Validation: Is gap focused.", this.presenter.isGapFocused);
    },

    validateKeyboardStateIsOnDescriptionOfOperationRow : function () {
        this.validateKeyboardStateIsOnElement(0, -1, -1);
    },

    validateKeyboardStateIsOnGap : function (gapIndex) {
        this.validateKeyboardStateIsOnElement(this.presenter.gapElements[gapIndex].x, this.presenter.gapElements[gapIndex].y, gapIndex);
    },

    validateKeyboardStateIsOnElement : function (x, y, gapIndex) {
        assertEquals("Validation: keyboardState.gapIndex .", gapIndex, this.presenter.keyboardState.gapIndex);
        assertEquals("Validation: keyboardState.x .", x, this.presenter.keyboardState.x);
        assertEquals("Validation: keyboardState.y .", y, this.presenter.keyboardState.y);
    },

    'test given view when entered into addon by keyboard navigation then do not navigate to any of cells': function() {
        var keycode = KeyboardControllerKeys.ENTER;
        var isShift = false;
        var event = createEvent(keycode);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(0);
    },

    'test given set navigation on row without gaps when pressed right arrow then stay on row': function() {
        var keycode = KeyboardControllerKeys.ARROW_RIGHT;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnRow(1);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnRow(1);
    },

    'test given set navigation on row with gaps when pressed right arrow then move to first gap in this row': function() {
        var keycode = KeyboardControllerKeys.ARROW_RIGHT;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnRow(3);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(1);
    },

    'test given set navigation on gap with another gap on the right when pressed right arrow then move to next gap in this row': function() {
        var keycode = KeyboardControllerKeys.ARROW_RIGHT;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(2);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(2);
    },

    'test given set navigation on gap without gaps on the right when pressed right arrow then stay on current gap': function() {
        var keycode = KeyboardControllerKeys.ARROW_RIGHT;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(2);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(2);
    },

    'test given set navigation on row with gaps when pressed left arrow then stay on row': function() {
        var keycode = KeyboardControllerKeys.ARROW_LEFT;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnRow(3);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnRow(3);
    },

    'test given set navigation on first gap in row when pressed left arrow then move navigation on row': function() {
        var keycode = KeyboardControllerKeys.ARROW_LEFT;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(1);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnRow(3);
    },

    'test given set navigation on gap with another gap on the left when pressed left arrow then move to previous gap in this row': function() {
        var keycode = KeyboardControllerKeys.ARROW_LEFT;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(2);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(1);
    },

    'test given navigation on description of operation row with navigable row below when pressed down arrow then navigate to next navigable row': function() {
        var keycode = KeyboardControllerKeys.ARROW_DOWN;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnDescriptionOfOperationRow();

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnRow(0);
    },

    'test given navigation on row with navigable row below when pressed down arrow then navigate to next navigable row': function() {
        var keycode = KeyboardControllerKeys.ARROW_DOWN;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnRow(0);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnRow(1);
    },

    'test given navigation on gap with navigable row below when pressed down arrow then navigate to next navigable row': function() {
        var keycode = KeyboardControllerKeys.ARROW_DOWN;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(0);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnRow(1);
    },

    'test given navigation on row with one not navigable row and one navigable row below when pressed down arrow then navigate to next navigable row': function() {
        var keycode = KeyboardControllerKeys.ARROW_DOWN;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnRow(1);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnRow(3);
    },

    'test given navigation on row without navigable rows below when pressed down arrow then stay on current row': function() {
        var keycode = KeyboardControllerKeys.ARROW_DOWN;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnRow(3);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnRow(3);
    },

    'test given navigation on gap without navigable rows below and gap on the right when pressed down arrow then stay on current gap': function() {
        var keycode = KeyboardControllerKeys.ARROW_DOWN;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(2);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(2);
    },

    'test given navigation on row with navigable row above when pressed up arrow then navigate on row above': function() {
        var keycode = KeyboardControllerKeys.ARROW_UP;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnRow(1);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnRow(0);
    },

    'test given navigation on gap with navigable row above when pressed up arrow then navigate on row above': function() {
        var keycode = KeyboardControllerKeys.ARROW_UP;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(2);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnRow(1);
    },

    'test given navigation on row with index 0 when pressed up arrow then navigate on row with description of operation': function() {
        var keycode = KeyboardControllerKeys.ARROW_UP;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnRow(0);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(0);
        this.validateKeyboardStateIsOnDescriptionOfOperationRow();
    },

    'test given navigation on gap on row with index 0 when pressed up arrow then navigate on row with description of operation': function() {
        var keycode = KeyboardControllerKeys.ARROW_UP;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(0);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(0);
        this.validateKeyboardStateIsOnDescriptionOfOperationRow();
    },

    'test given navigation on description of operation row when pressed up arrow then stay on current row': function() {
        var keycode = KeyboardControllerKeys.ARROW_UP;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnDescriptionOfOperationRow();

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(0);
        this.validateKeyboardStateIsOnDescriptionOfOperationRow();
    },

    'test given navigation on description of operation row when pressed Tab then navigate on navigable row below': function() {
        var keycode = KeyboardControllerKeys.TAB;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnDescriptionOfOperationRow();

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnRow(0);
    },

    'test given navigation on row without gaps when pressed Tab then navigate on navigable row below': function() {
        var keycode = KeyboardControllerKeys.TAB;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnRow(1);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnRow(3);
    },

    'test given navigation on row with gaps when pressed Tab then navigate on first gap on right side': function() {
        var keycode = KeyboardControllerKeys.TAB;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnRow(0);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(0);
    },

    'test given navigation on gap with gap on the right when pressed Tab then navigate on gap on right': function() {
        var keycode = KeyboardControllerKeys.TAB;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(1);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(2);
    },

    'test given navigation on gap without gap on the right and without navigable rows below when pressed Tab then stay on current gap': function() {
        var keycode = KeyboardControllerKeys.TAB;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(2);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(2);
    },

    'test given navigation on gap without gap on the right and with navigable rows below when pressed Tab then navigate to next navigable row below': function() {
        var keycode = KeyboardControllerKeys.TAB;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(0);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnRow(1);
    },

    'test given navigation on row with index 0 when pressed Shift + Tab then navigate on description of operation row': function() {
        var keycode = KeyboardControllerKeys.TAB;
        var isShift = true;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnRow(0);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(0);
        this.validateKeyboardStateIsOnDescriptionOfOperationRow();
    },

    'test given navigation on row with navigable row above with gaps when pressed Shift + Tab then navigate on last navigable gap above': function() {
        var keycode = KeyboardControllerKeys.TAB;
        var isShift = true;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnRow(1);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(0);
    },

    'test given navigation on row with navigable row above without gaps when pressed Shift + Tab then navigate on above navigable row': function() {
        var keycode = KeyboardControllerKeys.TAB;
        var isShift = true;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnRow(3);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnRow(1);
    },

    'test given navigation on gap with gap on the left when pressed Shift + Tab then navigate on gap on left side': function() {
        var keycode = KeyboardControllerKeys.TAB;
        var isShift = true;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(2);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(1);
    },

    'test given navigation on gap without gap on the left when pressed Shift + Tab then navigate on row': function() {
        var keycode = KeyboardControllerKeys.TAB;
        var isShift = true;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(1);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnRow(3);
    },

    'test given navigation on gap when pressed escape then escape from addon': function() {
        var keycode = KeyboardControllerKeys.ESCAPE;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(1);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(0);
        assertEquals("Validation: keyboardState.gapIndex .", -1, this.presenter.keyboardState.gapIndex);
        assertEquals("Validation: keyboardState.x .", 0, this.presenter.keyboardState.x);
        assertEquals("Validation: keyboardState.y .", -1, this.presenter.keyboardState.y);
    },

    'test given navigation on row when pressed escape then escape from addon': function() {
        var keycode = KeyboardControllerKeys.ESCAPE;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnRow(1);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(0);
        assertEquals("Validation: keyboardState.gapIndex .", -1, this.presenter.keyboardState.gapIndex);
        assertEquals("Validation: keyboardState.x .", 0, this.presenter.keyboardState.x);
        assertEquals("Validation: keyboardState.y .", -1, this.presenter.keyboardState.y);
    }
});
