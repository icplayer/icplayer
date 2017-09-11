TestCase("[Multiple Gap] WCAG - buildKeyboardController", {

    setUp: function () {
        this.presenter = new Addonmultiplegap_create();
    },

    'test build keyboard controller will create keyboard controller' : function () {
        this.presenter.getElementsForKeyboardNavigation = sinon.stub();
        var elements = [sinon.spy(), sinon.spy(), sinon.spy()];
        this.presenter.getElementsForKeyboardNavigation.returns(elements);

        this.presenter.buildKeyboardController();

        assertTrue(this.presenter.keyboardControllerObject !== null);
        assertEquals(this.presenter.keyboardControllerObject.keyboardNavigationElements, elements);
    }

});

TestCase("[Multiple Gap] WCAG - Keyboard Controller getTarget", {

    setUp: function () {
        this.presenter = new Addonmultiplegap_create();

        this.presenter.getElementsForKeyboardNavigation = sinon.stub();
        this.elements = [
            $("<div></div>"),
            $("<div></div>")
        ];

        this.child = $("<div></div>");
        this.child.addClass('handler');
        this.elements[1].append(this.child);

        this.child1 = $("<div></div>");
        this.child2 = $("<div></div>");
        this.child2.addClass('handler');
        this.child1.append(this.child2);
        this.elements[0].append(this.child1);


        this.presenter.getElementsForKeyboardNavigation.returns(this.elements);

        this.presenter.buildKeyboardController();

        this.keyboardControllerObj = this.presenter.keyboardControllerObject;
    },

    'test if target wont be clicked then will return main element' : function () {
        var test1 = this.keyboardControllerObj.getTarget(this.elements[0].get(0), false);
        var test2 = this.keyboardControllerObj.getTarget(this.elements[1].get(0), false);

        assertEquals($(this.elements[1].get(0)), test2);
        assertEquals($(this.elements[0].get(0)), test1);
    },

    'test if target will be clicked, then will return .handler children if exist': function () {
        var test1 = this.keyboardControllerObj.getTarget(this.elements[0].get(0), true);
        var test2 = this.keyboardControllerObj.getTarget(this.elements[1].get(0), true);

        assertNotEquals(this.elements[0].children(".handler"), test2);
        assertEquals($(this.elements[0].get(0)), test1);
    }

});

