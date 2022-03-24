TestCase("[Cross Lesson] buildKeyboardController", {

    setUp: function () {
        this.presenter = new AddonCross_Lesson_create();

        this.elements = [sinon.spy(), sinon.spy(), sinon.spy()];
        this.presenter.getElementsForKeyboardNavigation = sinon.stub();
        this.presenter.getElementsForKeyboardNavigation.returns(this.elements);
    },

    'test given keyboard controller when buildKeyboardController was called should have all navigation elements' : function () {
        assertTrue(this.presenter.keyboardControllerObject === null);

        this.presenter.buildKeyboardController();

        assertTrue(this.presenter.keyboardControllerObject !== null);
        assertTrue(this.presenter.getElementsForKeyboardNavigation.calledOnce);
        assertEquals(this.presenter.keyboardControllerObject.keyboardNavigationElements, this.elements);
    },
});