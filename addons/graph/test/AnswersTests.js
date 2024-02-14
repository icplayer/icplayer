TestCase("[Graph] Answers tests", {
    setUp: function () {
        this.presenter = Addongraph_create();

        this.presenter.configuration = {
            isNotActivity: false,
            ID: 'FC01',
            answers: [0, 1, 2],
            exampleAnswers: [false, false, false]
        };
        this.presenter.eventBus = {
            sendEvent: function () {}
        };
        this.presenter.$view = this.getMockedView();
        this.presenter.errorMode = false;

        this.stubs = {
            setCurrentStateStub: sinon.stub(),
            addAnswerToGraphStub: sinon.stub(),
            removeAnswerFromGraphStub: sinon.stub()
        }
        sinon.stub(this.presenter.eventBus, 'sendEvent');
    },

    tearDown: function () {
        this.presenter.eventBus.sendEvent.restore();
    },

    'test given active addon when showAnswers was called then show answers': function () {
        this.presenter.isShowAnswersActive = false;
        this.presenter.setCurrentState = this.stubs.setCurrentStateStub;
        this.presenter.addAnswerToGraph = this.stubs.addAnswerToGraphStub;

        this.presenter.showAnswers();

        assertTrue(this.stubs.setCurrentStateStub.calledOnce);
        assertTrue(this.presenter.isShowAnswersActive);
        assertEquals(3, this.presenter.addAnswerToGraph.callCount);
    },

    'test given example answers when showAnswers was called then show answers': function () {
        this.presenter.isShowAnswersActive = false;
        this.presenter.setCurrentState = this.stubs.setCurrentStateStub;
        this.presenter.addAnswerToGraph = this.stubs.addAnswerToGraphStub;
        this.presenter.configuration.exampleAnswers = [true, false, false];

        this.presenter.showAnswers();

        assertTrue(this.stubs.setCurrentStateStub.calledOnce);
        assertTrue(this.presenter.isShowAnswersActive);
        assertEquals(2, this.presenter.addAnswerToGraph.callCount);
    },

    'test given active addon and shown answers when hideAnswers was called then hide answers': function () {
        this.presenter.isShowAnswersActive = true;
        this.presenter.removeAnswerFromGraph = this.stubs.removeAnswerFromGraphStub;

        this.presenter.hideAnswers();

        assertFalse(this.presenter.isShowAnswersActive);
        assertEquals(3, this.presenter.removeAnswerFromGraph.callCount);
    },

    'test given moduleID and answer index when gradualShowAnswers was called then show the answer': function () {
        const eventData = {
            moduleID: 'FC01',
            item: '1'
        };
        this.presenter.isGradualShowAnswersActive = false;
        this.presenter.setCurrentState = this.stubs.setCurrentStateStub;
        this.presenter.addAnswerToGraph = this.stubs.addAnswerToGraphStub;

        this.presenter.gradualShowAnswers(eventData);

        assertTrue(this.stubs.setCurrentStateStub.calledOnce);
        assertTrue(this.presenter.isGradualShowAnswersActive);
        assertEquals(1, this.stubs.addAnswerToGraphStub.getCall(0).args[0]);
    },

    'test given shown answers when gradualHideAnswers was called then hide answers': function () {
        this.presenter.isGradualShowAnswersActive = true;
        this.presenter.removeAnswerFromGraph = this.stubs.removeAnswerFromGraphStub;
        this.presenter.GSAcounter = 3;

        this.presenter.gradualHideAnswers();

        assertFalse(this.presenter.isGradualShowAnswersActive);
        assertEquals(3, this.presenter.removeAnswerFromGraph.callCount);
        assertEquals(0, this.presenter.GSAcounter);
    },

    'test given view with user answers when setCurrentState was called then the answers should be stored': function () {
        this.presenter.currentData = [];

        this.presenter.setCurrentState();

        assertEquals(3, this.presenter.currentData.length);
        assertEquals(10, this.presenter.currentData[1]);
    },

    'test given displayed answers when shouldStopAction was called then True value should be return': function () {
        this.presenter.errorMode = false;
        this.presenter.isShowAnswersActive = true;
        this.presenter.isGradualShowAnswersActive = false;

        const shouldStopAction = this.presenter.shouldStopAction();

        assertTrue(shouldStopAction);
    },

    'test given isGradualShowAnswersActive value on true when isDisplayingAnswers was called then True value should be return': function () {
        this.presenter.isShowAnswersActive = false;
        this.presenter.isGradualShowAnswersActive = true;

        const isDisplayingAnswers = this.presenter.isDisplayingAnswers();

        assertTrue(isDisplayingAnswers);
    },

    getMockedView: function () {
        const $view = $(document.createElement("div"));

        for(let i = 0; i < 3; i++) {
            const $graphValueContainer = $(document.createElement("div"));
            $graphValueContainer.addClass("graph_value_container");
            $graphValueContainer.attr("current-value", i * 10);
            $view.append($graphValueContainer);
        }

        return $view;
    }
})
