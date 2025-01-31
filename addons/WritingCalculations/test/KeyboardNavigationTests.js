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

TestCase("[Writing Calculations] Keyboard navigation tests", {
    setUp : function() {
        this.presenter = AddonWritingCalculations_create();
        createViewForTests(this.presenter);
        this.presenter.useAlternativeTTSNavigation = false;
        this.presenter.isWCAGOn = false;
    },

    setKeyboardNavigationOnGap : function (gapIndex) {
        var gapElement = this.presenter.gapElements[gapIndex];
        gapElement.el.children().first().addClass(this.presenter.KEYBOARD_SELECTED_CLASS);
        this.presenter.keyboardState.x = gapElement.x;
        this.presenter.keyboardState.y = gapElement.y;
        this.presenter.keyboardState.gapIndex = gapIndex;
        this.presenter.isGapFocused = false;
    },

    setKeyboardNavigationIntoGap : function (gapIndex) {
        this.setKeyboardNavigationOnGap(gapIndex);
        var gapElement = this.presenter.gapElements[gapIndex];
        gapElement.el.find('input.writing-calculations-input').addClass(this.presenter.KEYBOARD_SELECTED_CLASS);
        this.presenter.isGapFocused = true;
    },

    validateKeyboardStateIsOnGap : function (gapIndex) {
        assertEquals("Validation: keyboardState.gapIndex .", gapIndex, this.presenter.keyboardState.gapIndex);
        assertEquals("Validation: keyboardState.x .", this.presenter.gapElements[gapIndex].x, this.presenter.keyboardState.x);
        assertEquals("Validation: keyboardState.y .", this.presenter.gapElements[gapIndex].y, this.presenter.keyboardState.y);
    },

    validateIsNavigationOnGap : function (gapIndex) {
        assertTrue("Validation: Gap has class correct for selected gap.", this.presenter.gapElements[gapIndex].el.children().first().hasClass(this.presenter.KEYBOARD_SELECTED_CLASS));
    },

    validateIsNavigationInsideGap : function (gapIndex) {
        this.validateIsNavigationOnGap(gapIndex);
        assertTrue("Validation: Gap has class correct for focused gap.", this.presenter.gapElements[gapIndex].el.find('input.writing-calculations-input').hasClass(this.presenter.KEYBOARD_SELECTED_CLASS));
        assertTrue("Validation: Is gap focused.", this.presenter.isGapFocused);
    },

    validateHowManyActiveElements : function (amount) {
        assertEquals("Validation: Number of active keyboard navigation elements.", amount, this.presenter.$view.find("." + this.presenter.KEYBOARD_SELECTED_CLASS).length);
    },

    'test given view when entered into addon by keyboard navigation then do not navigate to any of cells': function() {
        var keycode = KeyboardControllerKeys.ENTER;
        var isShift = false;
        var event = createEvent(keycode);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(0);
    },

    'test given navigable view when pressed right arrow then do not navigate to any of cells': function() {
        var keycode = KeyboardControllerKeys.ARROW_RIGHT;
        var isShift = false;
        var event = createEvent(keycode);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(0);
    },

    'test given navigable view when pressed left arrow then do not navigate to any of cells': function() {
        var keycode = KeyboardControllerKeys.ARROW_LEFT;
        var isShift = false;
        var event = createEvent(keycode);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(0);
    },

    'test given navigable view when pressed down arrow then do not navigate to any of cells': function() {
        var keycode = KeyboardControllerKeys.ARROW_DOWN;
        var isShift = false;
        var event = createEvent(keycode);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(0);
    },

    'test given navigable view when pressed up arrow then do not navigate to any of cells': function() {
        var keycode = KeyboardControllerKeys.ARROW_UP;
        var isShift = false;
        var event = createEvent(keycode);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(0);
    },

    'test given navigable view when pressed Tab then navigate to first gap': function() {
        var keycode = KeyboardControllerKeys.TAB;
        var isShift = false;
        var event = createEvent(keycode);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(0);
    },

    'test given navigable view when pressed Shift + Tab then navigate to first gap': function() {
        var keycode = KeyboardControllerKeys.TAB;
        var isShift = true;
        var event = createEvent(keycode);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(0);
    },

    'test given navigable view with selected first gap when pressed Tab then navigate to next gap': function() {
        var keycode = KeyboardControllerKeys.TAB;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(0);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(1);
        this.validateKeyboardStateIsOnGap(1);
    },

    'test given navigable view with selected first gap when pressed Shit + Tab then stay on first gap': function() {
        var keycode = KeyboardControllerKeys.TAB;
        var isShift = true;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(0);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(0);
        this.validateKeyboardStateIsOnGap(0);
    },

    'test given navigable view with selected last gap when pressed Tab then stay on this same gap': function() {
        var keycode = KeyboardControllerKeys.TAB;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(2);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(2);
        this.validateKeyboardStateIsOnGap(2);
    },

    'test given navigable view with selected last gap when pressed Shit + Tab then navigate to previous gap': function() {
        var keycode = KeyboardControllerKeys.TAB;
        var isShift = true;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(2);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(1);
        this.validateKeyboardStateIsOnGap(1);
    },

    'test given navigable view with selected gap when pressed Space then do nothing': function() {
        var keycode = KeyboardControllerKeys.SPACE;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(1);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(1);
        this.validateKeyboardStateIsOnGap(1);
    },

    'test given navigable view with selected gap when pressed left arrow then do nothing': function() {
        var keycode = KeyboardControllerKeys.ARROW_LEFT;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(1);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(1);
        this.validateKeyboardStateIsOnGap(1);
    },

    'test given navigable view with selected gap when pressed right arrow then do nothing': function() {
        var keycode = KeyboardControllerKeys.ARROW_RIGHT;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(1);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(1);
        this.validateKeyboardStateIsOnGap(1);
    },

    'test given navigable view with selected gap when pressed up arrow then do nothing': function() {
        var keycode = KeyboardControllerKeys.ARROW_UP;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(1);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(1);
        this.validateKeyboardStateIsOnGap(1);
    },

    'test given navigable view with selected gap when pressed down arrow then do nothing': function() {
        var keycode = KeyboardControllerKeys.ARROW_DOWN;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(1);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(1);
        this.validateKeyboardStateIsOnGap(1);
    },

    'test given navigable view with selected gap when pressed escape then escape from addon': function() {
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

    'test given navigable view with selected gap when pressed enter then enter into gap': function() {
        var keycode = KeyboardControllerKeys.ENTER;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(1);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(2);
        this.validateIsNavigationInsideGap(1);
        this.validateKeyboardStateIsOnGap(1);
    },

    'test given navigable view with selected gap when pressed escape then escape from entered gap': function() {
        var keycode = KeyboardControllerKeys.ESCAPE;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationIntoGap(1);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(1);
        this.validateKeyboardStateIsOnGap(1);
        setTimeout(()=>{
            assertFalse(this.presenter.isGapFocused);
        }, 0);
    }
});

TestCase("[Writing Calculations] Keyboard navigation tests with selected 'Use alternative TTS navigation'", {
    setUp : function() {
        this.presenter = AddonWritingCalculations_create();
        createViewForTests(this.presenter);
        this.presenter.useAlternativeTTSNavigation = true;
        this.presenter.isWCAGOn = false;
    },

    setKeyboardNavigationOnGap : function (gapIndex) {
        var gapElement = this.presenter.gapElements[gapIndex];
        gapElement.el.children().first().addClass(this.presenter.KEYBOARD_SELECTED_CLASS);
        this.presenter.keyboardState.x = gapElement.x;
        this.presenter.keyboardState.y = gapElement.y;
        this.presenter.keyboardState.gapIndex = gapIndex;
        this.presenter.isGapFocused = false;
    },

    setKeyboardNavigationIntoGap : function (gapIndex) {
        this.setKeyboardNavigationOnGap(gapIndex);
        var gapElement = this.presenter.gapElements[gapIndex];
        gapElement.el.find('input.writing-calculations-input').addClass(this.presenter.KEYBOARD_SELECTED_CLASS);
        this.presenter.isGapFocused = true;
    },

    validateKeyboardStateIsOnGap : function (gapIndex) {
        assertEquals("Validation: keyboardState.gapIndex .", gapIndex, this.presenter.keyboardState.gapIndex);
        assertEquals("Validation: keyboardState.x .", this.presenter.gapElements[gapIndex].x, this.presenter.keyboardState.x);
        assertEquals("Validation: keyboardState.y .", this.presenter.gapElements[gapIndex].y, this.presenter.keyboardState.y);
    },

    validateIsNavigationOnGap : function (gapIndex) {
        assertTrue("Validation: Gap has class correct for selected gap.", this.presenter.gapElements[gapIndex].el.children().first().hasClass(this.presenter.KEYBOARD_SELECTED_CLASS));
    },

    validateIsNavigationInsideGap : function (gapIndex) {
        this.validateIsNavigationOnGap(gapIndex);
        assertTrue("Validation: Gap has class correct for focused gap.", this.presenter.gapElements[gapIndex].el.find('input.writing-calculations-input').hasClass(this.presenter.KEYBOARD_SELECTED_CLASS));
        assertTrue("Validation: Is gap focused.", this.presenter.isGapFocused);
    },

    validateHowManyActiveElements : function (amount) {
        assertEquals("Validation: Number of active keyboard navigation elements.", amount, this.presenter.$view.find("." + this.presenter.KEYBOARD_SELECTED_CLASS).length);
    },

    'test given view when entered into addon by keyboard navigation then do not navigate to any of cells': function() {
        var keycode = KeyboardControllerKeys.ENTER;
        var isShift = false;
        var event = createEvent(keycode);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(0);
    },

    'test given navigable view when pressed right arrow then do not navigate to any of cells': function() {
        var keycode = KeyboardControllerKeys.ARROW_RIGHT;
        var isShift = false;
        var event = createEvent(keycode);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(0);
    },

    'test given navigable view when pressed left arrow then do not navigate to any of cells': function() {
        var keycode = KeyboardControllerKeys.ARROW_LEFT;
        var isShift = false;
        var event = createEvent(keycode);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(0);
    },

    'test given navigable view when pressed down arrow then do not navigate to any of cells': function() {
        var keycode = KeyboardControllerKeys.ARROW_DOWN;
        var isShift = false;
        var event = createEvent(keycode);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(0);
    },

    'test given navigable view when pressed up arrow then do not navigate to any of cells': function() {
        var keycode = KeyboardControllerKeys.ARROW_UP;
        var isShift = false;
        var event = createEvent(keycode);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(0);
    },

    'test given navigable view when pressed Tab then navigate to first gap': function() {
        var keycode = KeyboardControllerKeys.TAB;
        var isShift = false;
        var event = createEvent(keycode);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(0);
    },

    'test given navigable view when pressed Shift + Tab then navigate to first gap': function() {
        var keycode = KeyboardControllerKeys.TAB;
        var isShift = true;
        var event = createEvent(keycode);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(0);
    },

    'test given navigable view with selected first gap when pressed Tab then navigate to next gap': function() {
        var keycode = KeyboardControllerKeys.TAB;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(0);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(1);
        this.validateKeyboardStateIsOnGap(1);
    },

    'test given navigable view with selected first gap when pressed Shit + Tab then stay on first gap': function() {
        var keycode = KeyboardControllerKeys.TAB;
        var isShift = true;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(0);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(0);
        this.validateKeyboardStateIsOnGap(0);
    },

    'test given navigable view with selected last gap when pressed Tab then stay on this same gap': function() {
        var keycode = KeyboardControllerKeys.TAB;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(2);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(2);
        this.validateKeyboardStateIsOnGap(2);
    },

    'test given navigable view with selected last gap when pressed Shit + Tab then navigate to previous gap': function() {
        var keycode = KeyboardControllerKeys.TAB;
        var isShift = true;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(2);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(1);
        this.validateKeyboardStateIsOnGap(1);
    },

    'test given navigable view with selected gap when pressed Space then do nothing': function() {
        var keycode = KeyboardControllerKeys.SPACE;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(1);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(1);
        this.validateKeyboardStateIsOnGap(1);
    },

    'test given navigable view with selected gap when pressed left arrow then do nothing': function() {
        var keycode = KeyboardControllerKeys.ARROW_LEFT;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(1);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(1);
        this.validateKeyboardStateIsOnGap(1);
    },

    'test given navigable view with selected gap when pressed right arrow then do nothing': function() {
        var keycode = KeyboardControllerKeys.ARROW_RIGHT;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(1);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(1);
        this.validateKeyboardStateIsOnGap(1);
    },

    'test given navigable view with selected gap when pressed up arrow then do nothing': function() {
        var keycode = KeyboardControllerKeys.ARROW_UP;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(1);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(1);
        this.validateKeyboardStateIsOnGap(1);
    },

    'test given navigable view with selected gap when pressed down arrow then do nothing': function() {
        var keycode = KeyboardControllerKeys.ARROW_DOWN;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(1);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(1);
        this.validateKeyboardStateIsOnGap(1);
    },

    'test given navigable view with selected gap when pressed escape then escape from addon': function() {
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

    'test given navigable view with selected gap when pressed enter then enter into gap': function() {
        var keycode = KeyboardControllerKeys.ENTER;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationOnGap(1);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(2);
        this.validateIsNavigationInsideGap(1);
        this.validateKeyboardStateIsOnGap(1);
    },

    'test given navigable view with selected gap when pressed escape then escape from entered gap': function() {
        var keycode = KeyboardControllerKeys.ESCAPE;
        var isShift = false;
        var event = createEvent(keycode);
        this.setKeyboardNavigationIntoGap(1);

        this.presenter.keyboardController(keycode, isShift, event);

        this.validateHowManyActiveElements(1);
        this.validateIsNavigationOnGap(1);
        this.validateKeyboardStateIsOnGap(1);
        setTimeout(()=>{
            assertFalse(this.presenter.isGapFocused);
        }, 0);
    }
});
