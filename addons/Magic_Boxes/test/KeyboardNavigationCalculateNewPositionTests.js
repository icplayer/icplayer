TestCase("[Magic Boxes] Calculate new position in given axis tests", {

    setUp: function () {
        this.presenter = new AddonMagic_Boxes_create();

        this.presenter.configuration = createMagicBoxesConfigurationForTests();
        this.presenter.$view = $(createMagicBoxesViewForTests(this.presenter.configuration));
        this.presenter.buildKeyboardController();
        this.keyboardControllerObject = this.presenter.keyboardControllerObject;
        this.stubs = {
            markCurrentElementStub: sinon.stub(this.keyboardControllerObject, "markCurrentElement")
        };
    },

    tearDown: function () {
        this.keyboardControllerObject.markCurrentElement.restore();
    },

    activateKeyboardNavigation: function() {
        this.keyboardControllerObject.keyboardNavigationActive = true;
    },

    calculateMoveInHorizontalDirection: function (move) {
        return this.keyboardControllerObject.calculateNewPositionIndexForMoveInOneAxis(move, true);
    },

    calculateMoveInVerticalDirection: function (move) {
        return this.keyboardControllerObject.calculateNewPositionIndexForMoveInOneAxis(move, false);
    },

    'test given move equals to 0 then return undefined' : function () {
        this.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 15;
        const move = 0;

        const newPositionIndex = this.calculateMoveInHorizontalDirection(move);

        assertUndefined(newPositionIndex);
    },

    'test given horizontal positive move in range of the same row then return new position' : function () {
        this.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 15;
        const move = 2;
        const expectedIndex = this.keyboardControllerObject.keyboardNavigationCurrentElementIndex + move;

        const newPositionIndex = this.calculateMoveInHorizontalDirection(move);

        assertEquals(expectedIndex, newPositionIndex);
    },

    'test given horizontal negative move in range of the same row then return new position' : function () {
        this.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 15;
        const move = -3;
        const expectedIndex = this.keyboardControllerObject.keyboardNavigationCurrentElementIndex + move;

        const newPositionIndex = this.calculateMoveInHorizontalDirection(move);

        assertEquals(expectedIndex, newPositionIndex);
    },

    'test given horizontal positive move out of range of the same row then return undefined' : function () {
        this.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 15;
        const move = 3;

        const newPositionIndex = this.calculateMoveInHorizontalDirection(move);

        assertUndefined(newPositionIndex);
    },

    'test given horizontal negative move out of range of the same row then return undefined' : function () {
        this.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 15;
        const move = -4;

        const newPositionIndex = this.calculateMoveInHorizontalDirection(move);

        assertUndefined(newPositionIndex);
    },

    'test given horizontal positive move out of range of the navigation elements then return undefined' : function () {
        this.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 29;
        const move = 1;

        const newPositionIndex = this.calculateMoveInHorizontalDirection(move);

        assertUndefined(newPositionIndex);
    },

    'test given horizontal negative move out of range of the navigation elements then return undefined' : function () {
        this.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 0;
        const move = -1;

        const newPositionIndex = this.calculateMoveInHorizontalDirection(move);

        assertUndefined(newPositionIndex);
    },

    'test given vertical positive move in range of the same column then return new position' : function () {
        this.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 15;
        const move = this.keyboardControllerObject.columnsCount;
        const expectedIndex = this.keyboardControllerObject.keyboardNavigationCurrentElementIndex + move;

        const newPositionIndex = this.calculateMoveInVerticalDirection(move);

        assertEquals(expectedIndex, newPositionIndex);
    },

    'test given vertical negative move in range of the same column then return new position' : function () {
        this.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 15;
        const move = -this.keyboardControllerObject.columnsCount;
        const expectedIndex = this.keyboardControllerObject.keyboardNavigationCurrentElementIndex + move;

        const newPositionIndex = this.calculateMoveInVerticalDirection(move);

        assertEquals(expectedIndex, newPositionIndex);
    },

    'test given vertical positive move out of range of the same column then return undefined' : function () {
        this.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 15;
        const move = this.keyboardControllerObject.columnsCount + 1;

        const newPositionIndex = this.calculateMoveInVerticalDirection(move);

        assertUndefined(newPositionIndex);
    },

    'test given vertical negative move out of range of the same column then return undefined' : function () {
        this.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 15;
        const move = -this.keyboardControllerObject.columnsCount + 1;

        const newPositionIndex = this.calculateMoveInVerticalDirection(move);

        assertUndefined(newPositionIndex);
    },

    'test given vertical positive move out of range of the navigation elements then return undefined' : function () {
        this.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 26;
        const move = this.keyboardControllerObject.columnsCount;

        const newPositionIndex = this.calculateMoveInVerticalDirection(move);

        assertUndefined(newPositionIndex);
    },

    'test given vertical negative move out of range of the navigation elements then return undefined' : function () {
        this.keyboardControllerObject.keyboardNavigationCurrentElementIndex = 4;
        const move = -this.keyboardControllerObject.columnsCount;

        const newPositionIndex = this.calculateMoveInVerticalDirection(move);

        assertUndefined(newPositionIndex);
    },
});

function activateLeftArrowEvent(presenter) {
    activateKeyboardEvent(presenter, 37);
}

function activateUpArrowEvent(presenter) {
    activateKeyboardEvent(presenter, 38);
}

function activateRightArrowEvent(presenter) {
    activateKeyboardEvent(presenter, 39);
}

function activateDownArrowEvent(presenter) {
    activateKeyboardEvent(presenter, 40);
}

function activateKeyboardEvent(presenter, keycode, isShiftDown = false) {
    const event = {
        'keyCode': keycode,
        preventDefault: () => {},
        stopPropagation: () => {},
    };
    presenter.keyboardController(keycode, isShiftDown, event);
}
