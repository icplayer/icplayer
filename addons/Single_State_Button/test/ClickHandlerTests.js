TestCase("[Single State Button] Click handler", {
    setUp: function () {
        this.presenter = AddonSingle_State_Button_create();

        this.presenter.configuration = {
            isDisabled: false,
            isErrorMode: false,
            isShowAnswersMode: false
        };

        this.presenter.state = {
            isErrorMode: false
        };
        
        this.event = {
            stopPropagation: function() {}
        };

        sinon.stub(this.presenter, 'executeUserEventCode');
        sinon.stub(this.presenter, 'triggerButtonClickedEvent');
    },

    tearDown: function () {
        this.presenter.executeUserEventCode.restore();
        this.presenter.triggerButtonClickedEvent();
    },

    'test button click is disabled': function () {
        this.presenter.configuration.isDisabled = true;

        this.presenter.clickHandler(this.event);

        assertFalse(this.presenter.executeUserEventCode.called);
        assertFalse(this.presenter.triggerButtonClickedEvent.called);
    },

    'test addon in error checking mode': function () {
        this.presenter.setShowErrorsMode();

        this.presenter.clickHandler(this.event);

        assertFalse(this.presenter.executeUserEventCode.called);
        assertFalse(this.presenter.triggerButtonClickedEvent.called);
    },

    'test given addon in error checking mode and button enabled in error mode when calling click handler then calls code': function () {
        this.presenter.setShowErrorsMode();
        this.presenter.configuration.enableInErrorMode = true;

        this.presenter.clickHandler(this.event);

        assertTrue(this.presenter.executeUserEventCode.called);
        assertTrue(this.presenter.triggerButtonClickedEvent.called);
    },

    'test given addon in show answers mode and button enabled in show answers mode when calling click handler then calls code': function () {
        this.presenter.setShowAnswersMode();
        this.presenter.configuration.enableInShowAnswersMode = true;

        this.presenter.clickHandler(this.event);

        assertTrue(this.presenter.executeUserEventCode.called);
        assertTrue(this.presenter.triggerButtonClickedEvent.called);
    },

    'test button click is enabled and addon in working mode': function () {
        this.presenter.clickHandler(this.event);

        assertTrue(this.presenter.executeUserEventCode.calledOnce);
        assertTrue(this.presenter.triggerButtonClickedEvent.calledOnce);
    }
});