TestCase("[Table] Set Gap Answer", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {};

        this.stubs = {
            setMathShowAnswersValueByGapIndex: sinon.stub(this.presenter.GapsContainerObject.prototype, 'setMathShowAnswersValueByGapIndex'),
            showAnswersGapsContainer: sinon.stub(this.presenter.GapsContainerObject.prototype, 'showAnswersMath'),
            setMathShowAnswersCounter: sinon.stub(this.presenter, 'setMathShowAnswersCounter'),
            tickMathCounter: sinon.stub(this.presenter, 'tickMathCounter'),
            shouldTriggerMathShowAnswers: sinon.stub(this.presenter, 'shouldTriggerMathShowAnswers')
        };

        this.presenter.gapsContainer = new this.presenter.GapsContainerObject();
        this.stubs.shouldTriggerMathShowAnswers.returns(false);
    },

    tearDown: function () {
        this.presenter.GapsContainerObject.prototype.setMathShowAnswersValueByGapIndex.restore();
        this.presenter.GapsContainerObject.prototype.showAnswersMath.restore();
        this.presenter.setMathShowAnswersCounter.restore();
        this.presenter.tickMathCounter.restore();
        this.presenter.shouldTriggerMathShowAnswers.restore();
    },

    'test should set counter when it is undefined in configuration with provided counterValue': function () {
        this.presenter.setGapAnswer("", "", 4);

        assertTrue(this.stubs.setMathShowAnswersCounter.calledOnce);
        assertTrue(this.stubs.setMathShowAnswersCounter.calledWith(4));
    },

    'test shouldnt set counter when it is defined in configuration': function () {
        this.presenter.configuration.mathShowAnswersCounter = 5;
        this.presenter.setGapAnswer("", "", "");

        assertFalse(this.stubs.setMathShowAnswersCounter.called);
    },

    'test should at every call tick math counter': function () {
        this.presenter.setGapAnswer();
        this.presenter.setGapAnswer();
        this.presenter.setGapAnswer();
        this.presenter.setGapAnswer();

        assertEquals(4, this.stubs.tickMathCounter.callCount);
    },

    'test should setMathShowAnswersValueByGapIndex': function () {
        this.presenter.setGapAnswer("", "", "");

        assertTrue(this.stubs.setMathShowAnswersValueByGapIndex.calledOnce);
    },

    'test should change index from 1-based to 0-based and pass it to setMathShowAnswersValueByGapIndex': function () {
        this.presenter.setGapAnswer(5, "", "");

        assertTrue(this.stubs.setMathShowAnswersValueByGapIndex.calledWith(4, ""));
    },

    'test should pass all necessary data to setMathShowAnswersValueByGapIndex': function () {
        this.presenter.setGapAnswer(5, 2, 3);

        assertTrue(this.stubs.setMathShowAnswersValueByGapIndex.calledWith(4, 2));
    },

    'test should trigger show answers when should': function () {
        this.stubs.shouldTriggerMathShowAnswers.returns(true);

        this.presenter.setGapAnswer("", "", "");

        assertTrue(this.stubs.showAnswersGapsContainer.calledOnce);
    },

    'test should after triggering setMathShowAnswersCounter to provided value': function () {
        this.presenter.configuration.mathShowAnswersCounter = 0;

        this.stubs.shouldTriggerMathShowAnswers.returns(true);

        this.presenter.setGapAnswer("", "", 4);

        assertTrue(this.stubs.showAnswersGapsContainer.calledBefore(this.stubs.setMathShowAnswersCounter));
        assertTrue(this.stubs.setMathShowAnswersCounter.calledOnce);
        assertTrue(this.stubs.setMathShowAnswersCounter.calledWith(4));
    }
});

TestCase("[Table] SetMathShowAnswersCounter", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {};
    },

    'test should set mathShowAnswersCounter in configuration to value provided': function () {
        this.presenter.setMathShowAnswersCounter(3);

        assertNotUndefined(this.presenter.configuration.mathShowAnswersCounter);
        assertEquals(3, this.presenter.configuration.mathShowAnswersCounter);
    }
});

TestCase("[Table] shouldTriggerMathShowAnswers", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {};
    },

    'test should not trigger when counter is higher than 0': function () {
        this.presenter.setMathShowAnswersCounter(3);

        assertFalse(this.presenter.shouldTriggerMathShowAnswers());
    },

    'test should trigger when counter is equal to 0': function () {
        this.presenter.setMathShowAnswersCounter(0);

        assertTrue(this.presenter.shouldTriggerMathShowAnswers());
    }
});

TestCase("[Table] tickMathCounter", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {};
    },

    'test should lower counter by one': function () {
        this.presenter.setMathShowAnswersCounter(3);
        this.presenter.tickMathCounter();

        assertEquals(2, this.presenter.configuration.mathShowAnswersCounter);

        this.presenter.tickMathCounter();
        assertEquals(1, this.presenter.configuration.mathShowAnswersCounter);

        this.presenter.tickMathCounter();
        assertEquals(0, this.presenter.configuration.mathShowAnswersCounter);
    }
});