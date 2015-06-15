TestCase("[Commons - Draggable Droppable Object] Css Classes", {
    setUp: function () {
        this.addonID = "addonID";
        this.objectID = "htmlID";
        this.correctAnswerCSSClass = "correctAnswer";
        this.wrongAnswerCSSClass = "wrongAnswer";
        this.showAnswersCSSClass = "showAnswersCSSClass";

        this.testCssClass = "as;kldjk;htap837u34a;klfds";

        this.configuration = {
            addonID: this.addonID,
            objectID: this.objectID,
            eventBus: function () {},
            getSelectedItem: function () {}
        };

        this.cssConfiguration = {
            correct: this.correctAnswerCSSClass,
            wrong: this.wrongAnswerCSSClass,
            showAnswer: this.showAnswersCSSClass
        };

        this.templateObject = new DraggableDroppableObject(this.configuration, this.cssConfiguration);

        this.stubs = {
            $addClass: sinon.stub(this.templateObject.$view, 'addClass'),
            $removeClass: sinon.stub(this.templateObject.$view, 'removeClass')
        };

        this.spies = {
            addCSSClass: sinon.spy(this.templateObject, 'addCSSClass'),
            removeCSSClass: sinon.spy(this.templateObject, 'removeCSSClass')
        };
    },

    tearDown: function () {
        this.templateObject.$view.addClass.restore();
        this.templateObject.$view.removeClass.restore();
        this.templateObject.addCSSClass.restore();
        this.templateObject.removeCSSClass.restore();
    },

    'test add class function should add provided value to css classes': function () {
        this.templateObject.addCSSClass(this.testCssClass);

        assertTrue(this.stubs.$addClass.calledOnce);
        assertTrue(this.stubs.$addClass.calledWith(this.testCssClass));
    },

    'test remove class should remove from classes provided value': function () {
        this.templateObject.removeCSSClass(this.testCssClass);

        assertTrue(this.stubs.$removeClass.calledOnce);
        assertTrue(this.stubs.$removeClass.calledWith(this.testCssClass));
    },

    'test add correct css class should use add class': function () {
        this.templateObject.addCorrectCSSClass();

        assertTrue(this.spies.addCSSClass.calledOnce);
        assertTrue(this.spies.addCSSClass.calledBefore(this.stubs.$addClass));

        assertFalse(this.stubs.$removeClass.called);
        assertFalse(this.spies.removeCSSClass.called);
    },

    'test add correct css class should use provided correct css class': function () {
        this.templateObject.addCorrectCSSClass();

        assertTrue(this.spies.addCSSClass.calledWith(this.correctAnswerCSSClass));

    },

    'test remove correct css class should use remove css class function': function () {
        this.templateObject.removeCorrectCSSClass();

        assertTrue(this.spies.removeCSSClass.calledOnce);
        assertTrue(this.spies.removeCSSClass.calledBefore(this.stubs.$removeClass));

        assertFalse(this.spies.addCSSClass.called);
        assertFalse(this.stubs.$addClass.called);
    },

    'test remove correct answer class should remove provided css correct answer class name': function () {
        this.templateObject.removeCorrectCSSClass();

        assertTrue(this.spies.removeCSSClass.calledWith(this.correctAnswerCSSClass))
    },

    'test add wrong css class should use add class': function () {
        this.templateObject.addWrongCSSClass();

        assertTrue(this.spies.addCSSClass.calledOnce);
        assertTrue(this.spies.addCSSClass.calledBefore(this.stubs.$addClass));

        assertFalse(this.stubs.$removeClass.called);
        assertFalse(this.spies.removeCSSClass.called);
    },

    'test add wrong css class should use provided wrong css class': function () {
        this.templateObject.addWrongCSSClass();

        assertTrue(this.spies.addCSSClass.calledWith(this.wrongAnswerCSSClass));
    },

    'test remove wrong css class should use remove css class function': function () {
        this.templateObject.removeWrongCSSClass();

        assertTrue(this.spies.removeCSSClass.calledOnce);
        assertTrue(this.spies.removeCSSClass.calledBefore(this.stubs.$removeClass));

        assertFalse(this.spies.addCSSClass.called);
        assertFalse(this.stubs.$addClass.called);
    },

    'test remove wrong answer class should remove provided css wrong answer class name': function () {
        this.templateObject.removeWrongCSSClass();

        assertTrue(this.spies.removeCSSClass.calledWith(this.wrongAnswerCSSClass))
    },

    'test add show answers css class should use add class': function () {
        this.templateObject.addShowAnswersCSSClass();

        assertTrue(this.spies.addCSSClass.calledOnce);
        assertTrue(this.spies.addCSSClass.calledBefore(this.stubs.$addClass));

        assertFalse(this.stubs.$removeClass.called);
        assertFalse(this.spies.removeCSSClass.called);
    },

    'test add show answers css class should use provided show answers css class': function () {
        this.templateObject.addShowAnswersCSSClass();

        assertTrue(this.spies.addCSSClass.calledWith(this.showAnswersCSSClass));
    },

    'test remove show answers css class should use remove css class function': function () {
        this.templateObject.removeShowAnswersCSSClass();

        assertTrue(this.spies.removeCSSClass.calledOnce);
        assertTrue(this.spies.removeCSSClass.calledBefore(this.stubs.$removeClass));

        assertFalse(this.spies.addCSSClass.called);
        assertFalse(this.stubs.$addClass.called);
    },

    'test remove show answers class should remove provided css show answers class name': function () {
        this.templateObject.removeShowAnswersCSSClass();

        assertTrue(this.spies.removeCSSClass.calledWith(this.showAnswersCSSClass))
    }
});