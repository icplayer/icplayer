TestCase("[Commons - Draggable Droppable Object] SetShowErrorsMode/SetWorkMode", {
    setUp: function () {
        this.value = "1";

        this.addonID = "addonID";
        this.objectID = "htmlID";

        this.configuration = {
            addonID: this.addonID,
            objectID: this.objectID,
            eventBus: function () {},
            getSelectedItem: function () {},
            value: this.value,
            onShowAnswersValue: this.correctAnswer
        };

        this.templateObject = new DraggableDroppableObject(this.configuration, {});

        this.stubs = {
            lock: sinon.stub(DraggableDroppableObject.prototype, 'lock'),
            unlock: sinon.stub(DraggableDroppableObject.prototype, 'unlock')
        };
    },

    tearDown: function () {
        DraggableDroppableObject.prototype.lock.restore();
        DraggableDroppableObject.prototype.unlock.restore();
    },

    'test onCorrect should lock gap': function () {
        this.templateObject.onCorrect();

        assertTrue(this.stubs.lock.calledOnce);
    },


    'test onUnCorrect should unlock gap': function () {
        this.templateObject.onUnCorrect();

        assertTrue(this.stubs.unlock.called);
    },
    
    'test onWrong should lock gap': function () {
        this.templateObject.onWrong();

        assertTrue(this.stubs.lock.calledOnce);
    },


    'test onUnWrong should unlock gap': function () {
        this.templateObject.onUnWrong();

        assertTrue(this.stubs.unlock.called);
    }
});

TestCase("[Commons - Draggable Droppable Object] onShowAnswers / onHideAnswers", {
    setUp: function () {
        this.value = "1";
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

        this.templateObject = new DraggableDroppableObject(this.configuration, {});

        this.stubs = {
            lock: sinon.stub(DraggableDroppableObject.prototype, 'lock'),
            unlock: sinon.stub(DraggableDroppableObject.prototype, 'unlock'),

            setViewValue: sinon.stub(this.templateObject, 'setViewValue')
        };
    },

    tearDown: function () {
        DraggableDroppableObject.prototype.lock.restore();
        DraggableDroppableObject.prototype.unlock.restore();

        this.templateObject.setViewValue.restore();
    },

    'test onShowAnswers should lock object': function () {
        this.templateObject.onShowAnswers();

        assertTrue(this.stubs.lock.calledOnce);
    },

    'test onShowAnswers should show correct answer': function () {
        this.templateObject.onShowAnswers();

        assertTrue(this.stubs.setViewValue.calledOnce);
        assertTrue(this.stubs.setViewValue.calledWith(this.correctAnswer));
    },

    'test onHideAnswers should unlock object': function () {
        this.templateObject.onHideAnswers();

        assertTrue(this.stubs.unlock.calledOnce);
    },

    'test onHideAnswers should show again user answer': function () {
        this.templateObject.onHideAnswers();

        assertTrue(this.stubs.setViewValue.calledOnce);
        assertTrue(this.stubs.setViewValue.calledWith(this.value));
    }
});