TestCase('[Clock] handle events related to showing or hiding model answer', {
    setUp: function () {
        this.presenter = AddonClock_create();

        this.stubs = {
            drawClockStub: sinon.stub(),
            setClockTimeStub: sinon.stub(),
            addEventListenerStub: sinon.stub(),
            validateStub: sinon.stub(),
            validateTimeStub: sinon.stub()
        }

        this.spies = {
            showAnswers: sinon.spy(this.presenter, 'showAnswers'),
            hideAnswers: sinon.spy(this.presenter, 'hideAnswers')
        }

        this.presenter.eventBus = {
            addEventListener: this.stubs.addEventListenerStub
        }

        this.model = {
            'ID': 'Clock',
            'Is Visible': 'True'
        }

        this.presenter.setClockTime = this.stubs.setClockTimeStub;
        this.presenter.drawClock = this.stubs.drawClockStub;
        this.stubs.validateStub.returns(true);
        this.presenter.validate = this.stubs.validateStub;
        this.presenter.validateTime = this.stubs.validateTimeStub;
        this.presenter.modelID = this.model.ID;
        this.view = document.createElement('div');
    },

    'test should add events listener when run method was called': function () {
        this.presenter.run(this.view, this.model);

        var result = this.stubs.addEventListenerStub;

        assertEquals(result.getCall(0).args[0], 'ShowAnswers');
        assertEquals(result.getCall(1).args[0], 'HideAnswers');
        assertEquals(result.getCall(2).args[0], 'GradualShowAnswers');
        assertEquals(result.getCall(3).args[0], 'GradualHideAnswers');
    },

    'test should invoke showAnswer when ShowAnswers event was showed': function () {
        this.presenter.onEventReceived('ShowAnswers');

        assertTrue(this.spies.showAnswers.called);
    },

    'test should invoke showAnswer and change isGradualShowAnswersActive when GradualShowAnswers event was showed': function () {
        this.presenter.isGradualShowAnswersActive = false;

        this.presenter.onEventReceived('GradualShowAnswers', {'moduleID': 'Clock'});

        assertTrue(this.spies.showAnswers.called);
        assertTrue(this.presenter.isGradualShowAnswersActive);
    },

    'test given different model ID then the instance ID when GradualShowAnswers events was occurred should not show answers': function () {
        this.presenter.isGradualShowAnswersActive = false;

        this.presenter.onEventReceived('GradualShowAnswers', {'moduleID': 'Clock2'});

        assertFalse(this.spies.showAnswers.called);
        assertFalse(this.presenter.isGradualShowAnswersActive);
    },

    'test should invoke hideAnswers when HideAnswers event was showed': function () {
        this.presenter.onEventReceived('HideAnswers');

        assertTrue(this.spies.hideAnswers.called);
    },

    'test should invoke hideAnswers and change isGradualShowAnswersActive when GradualHideAnswers event was showed': function () {
        this.presenter.isGradualShowAnswersActive = true;

        this.presenter.onEventReceived('GradualHideAnswers');

        assertTrue(this.spies.hideAnswers.called);
        assertFalse(this.presenter.isGradualShowAnswersActive);
    }
});
