TestCase("[Commons - Draggable Droppable Object] SetShowErrorsMode/SetWorkMode", {
    setUp: function () {
        this.value = "1";
        this.correctCSSClass = "correctClass";
        this.wrongCSSClass = "wrongClass";
        this.showAnswersCSSClass = "showAnswersClass";
        this.correctAnswer = "5";

        this.addonID = "addonID";
        this.objectID = "htmlID";

        this.configuration = {
            addonID: this.addonID,
            objectID: this.objectID,
            eventBus: function () {},
            getSelectedItem: function () {},
            value: this.value,
            showAnswersValue: this.correctAnswer
        };

        this.cssConfiguration = {
            correct: this.correctCSSClass,
            wrong: this.wrongCSSClass,
            showAnswer: this.showAnswersCSSClass
        };

        this.templateObject = new DraggableDroppableObject(this.configuration, this.cssConfiguration);

        this.stubs = {
            lock: sinon.stub(DraggableDroppableObject.prototype, 'lock'),
            unlock: sinon.stub(DraggableDroppableObject.prototype, 'unlock'),
            addWrongCSSClass: sinon.stub(DraggableDroppableObject.prototype, 'addWrongCSSClass'),
            removeWrongCSSClass: sinon.stub(DraggableDroppableObject.prototype, 'removeWrongCSSClass'),

            addCorrectCSSClass: sinon.stub(DraggableDroppableObject.prototype, 'addCorrectCSSClass'),
            removeCorrectCSSClass: sinon.stub(DraggableDroppableObject.prototype, 'removeCorrectCSSClass')
        };

    },

    tearDown: function () {
        DraggableDroppableObject.prototype.lock.restore();
        DraggableDroppableObject.prototype.unlock.restore();

        DraggableDroppableObject.prototype.addWrongCSSClass.restore();
        DraggableDroppableObject.prototype.removeWrongCSSClass.restore();

        DraggableDroppableObject.prototype.addCorrectCSSClass.restore();
        DraggableDroppableObject.prototype.removeCorrectCSSClass.restore();
    },

    'test set show errors mode should lock gap': function () {
        this.templateObject.setShowErrorsMode();

        assertTrue(this.stubs.lock.calledOnce);
    },

    'test set show errors mode should apply wrong class when answer is not correct': function () {
        this.templateObject.setShowErrorsMode();

        assertTrue(this.stubs.addWrongCSSClass.calledOnce);
        assertFalse(this.stubs.addCorrectCSSClass.called);
    },

    'test set show errors mode should apply correct class when answer is correct': function () {
        this.templateObject.value = "5";
        this.templateObject.setShowErrorsMode();

        assertTrue(this.stubs.addCorrectCSSClass.calledOnce);
        assertFalse(this.stubs.addWrongCSSClass.called);
    },

    'test set work mode should unlock gap': function () {
        this.templateObject.setWorkMode();

        assertTrue(this.stubs.unlock.called);
    },

    'test set work mode should remove wrong class when answer is not correct': function () {
        this.templateObject.setWorkMode();

        assertTrue(this.stubs.removeWrongCSSClass.calledOnce);
        assertFalse(this.stubs.addWrongCSSClass.called);
    },

    'test set work mode should remove correct class when answer is correct': function () {
        this.templateObject.value = "5";

        this.templateObject.setWorkMode();

        assertTrue(this.stubs.removeCorrectCSSClass.calledOnce);
    }
});

TestCase("[Commons - Draggable Droppable Object] ShowAnswers/HideAnswers", {
    setUp: function () {
        this.value = "1";
        this.correctCSSClass = "correctClass";
        this.wrongCSSClass = "wrongClass";
        this.showAnswersCSSClass = "showAnswersClass";
        this.correctAnswer = "5";

        this.addonID = "addonID";
        this.objectID = "htmlID";

        this.configuration = {
            addonID: this.addonID,
            objectID: this.objectID,
            eventBus: function () {},
            getSelectedItem: function () {},
            value: this.value,
            showAnswersValue: this.correctAnswer
        };

        this.cssConfiguration = {
            correct: this.correctCSSClass,
            wrong: this.wrongCSSClass,
            showAnswer: this.showAnswersCSSClass
        };

        this.templateObject = new DraggableDroppableObject(this.configuration, this.cssConfiguration);

        this.stubs = {
            lock: sinon.stub(DraggableDroppableObject.prototype, 'lock'),
            unlock: sinon.stub(DraggableDroppableObject.prototype, 'unlock'),

            addShowAnswersCSSClass: sinon.stub(DraggableDroppableObject.prototype, 'addShowAnswersCSSClass'),
            removeShowAnswersCSSClass: sinon.stub(DraggableDroppableObject.prototype, 'removeShowAnswersCSSClass'),

            setViewValue: sinon.stub(this.templateObject, 'setViewValue')
        };
    },

    tearDown: function () {
        DraggableDroppableObject.prototype.lock.restore();
        DraggableDroppableObject.prototype.unlock.restore();

        DraggableDroppableObject.prototype.addShowAnswersCSSClass.restore();
        DraggableDroppableObject.prototype.removeShowAnswersCSSClass.restore();

        this.templateObject.setViewValue.restore();
    },

    'test show answer should lock object': function () {
        this.templateObject.showAnswer();

        assertTrue(this.stubs.lock.calledOnce);
    },

    'test show answer should add show answers css class': function () {
        this.templateObject.showAnswer();

        assertTrue(this.stubs.addShowAnswersCSSClass.calledOnce);
    },

    'test show answer should show correct answer': function () {
        this.templateObject.showAnswer();

        assertTrue(this.stubs.setViewValue.calledOnce);
        assertTrue(this.stubs.setViewValue.calledWith(this.correctAnswer));
    },

    'test hide answer should unlock object': function () {
        this.templateObject.hideAnswer();

        assertTrue(this.stubs.unlock.calledOnce);
    },

    'test hide answer should remove show answers css class': function () {
        this.templateObject.hideAnswer();

        assertTrue(this.stubs.removeShowAnswersCSSClass.calledOnce);
    },

    'test hide answer should show again user answer': function () {
        this.templateObject.hideAnswer();

        assertTrue(this.stubs.setViewValue.calledOnce);
        assertTrue(this.stubs.setViewValue.calledWith(this.value));
    }
});