TestCase('[Assessments_Navigation_Bar] Keyboard navigation', {
    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();

        this.buttons = createButtons(3);

        this.stubs = {
            getElementsForNavigationStub: sinon.stub().returns(this.buttons)
        };

        this.presenter.getElementsForKeyboardNavigation = this.stubs.getElementsForNavigationStub;
    },

    'test buildKeyboardController will create keyboard object': function () {
        this.presenter.buildKeyboardController();

        assertTrue(this.presenter.keyboardControllerObject !== null);
        assertEquals(this.buttons, this.presenter.keyboardControllerObject.keyboardNavigationElements);
    },

    'test getTarget should return jquery object': function () {
        this.presenter.buildKeyboardController();

        var target = this.presenter.keyboardControllerObject.getTarget(this.buttons[0].$view);

        assertEquals($(this.buttons[0].$view), target);
    }
});


createButtons = function (count) {
    var array = [];
    for (var i = 0; i < count; i++) {
        var view = document.createElement('div');
        $(view).addClass("button");
        var button = {
            $view: view
        };
        array.push(button)
    }
    return array;
};