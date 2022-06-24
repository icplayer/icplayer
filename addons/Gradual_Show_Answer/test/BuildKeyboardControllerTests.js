TestCase("[Gradual Show Answer] buildKeyboardController tests", {

    setUp: function () {
        this.presenter = new AddonGradual_Show_Answer_create();
    },

    'test given presenter without built keyboard controller when buildKeyboardController is called then set keyboard controller to presenter with no elements' : function () {
        assertTrue(this.presenter.keyboardControllerObject === null);

        this.presenter.buildKeyboardController();

        assertTrue(this.presenter.keyboardControllerObject !== null);
        assertEquals(0, this.presenter.keyboardControllerObject.keyboardNavigationElements.length);
    },
});
