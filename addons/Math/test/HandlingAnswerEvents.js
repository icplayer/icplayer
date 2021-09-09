TestCase("[Math] Handling answer events", {
    setUp: function () {
        this.presenter = AddonMath_create();

        this.stubs = {
            addEventListenerStub: sinon.stub(),
            toggleAnswersStub: sinon.stub(),
            playerControllerStub: sinon.stub(),

        }

        this.presenter.eventBus = {
            sendEvent: function () {}
        };
        this.presenter.eventBus.addEventListener = this.stubs.addEventListenerStub;
        this.presenter.toggleAnswers = this.stubs.toggleAnswersStub;
        this.view = document.createElement('div');
        this.model = {
            Variables: "" +
                "gap1 = Text1.Gap1\n" +
                "gap2 = Text1.Gap2\n" +
                "gap3 = Text2.Gap1",
            Expressions: "gap1 > gap2 & gap3 = '2a'"
        };

        this.spies = {
            showAnswersSpy: sinon.spy(this.presenter, 'showAnswers'),
            hideAnswersSpy: sinon.spy(this.presenter, 'hideAnswers')
        };

        this.presenter.configuration = {
            expressions: {},
            answers: [{name: "g1", value: "cat1", users: ""}],
            variables: [{name: "g1", value: "Text1.1"}]
        };
    },

    'test should add events listener when run method was called': function () {
        this.presenter.run(this.view, this.model);

        var result = this.stubs.addEventListenerStub;

        assertEquals(result.getCall(0).args[0], 'ShowAnswers');
        assertEquals(result.getCall(1).args[0], 'HideAnswers');
        assertEquals(result.getCall(4).args[0], 'GradualShowAnswers');
        assertEquals(result.getCall(5).args[0], 'GradualHideAnswers');
    },

    'test should run showAnswers method when ShowAnswers event occurs': function () {
        this.presenter.isShowAnswers = false;

        this.presenter.onEventReceived('ShowAnswers', {});

        assertTrue(this.spies.showAnswersSpy.called);
    },

    'test should run hideAnswers method when HideAnswers event occurs': function () {
        this.presenter.isShowAnswers = true;

        this.presenter.onEventReceived('HideAnswers', {});

        assertTrue(this.spies.hideAnswersSpy.called);
    },

    'test should run gradualHideAnswers method when gradualHideAnswers event occurs': function () {
        this.presenter.currentGapIndex = 1;
        this.presenter.onEventReceived('GradualHideAnswers', {});

        assertTrue(this.spies.hideAnswersSpy.called);
        assertEquals(this.presenter.currentGapIndex, 0)
    },

    'test should return activities count when getActivitiesCount was called': function () {
        this.presenter.configuration.answers = [
            'First answer.',
            'Second answer.'
        ]

        var result = this.presenter.getActivitiesCount();

        assertEquals(result, 2);
    },

    'test should not show next answer when received model had different ID': function () {
        this.presenter.currentGapIndex = 0;
        this.presenter.configuration.addonID = 'Math1'
        var data = {
            'moduleID': 'Math2'
        }

        this.presenter.gradualShowAnswers(data);

        assertEquals(this.presenter.currentGapIndex, 0);
    }
});
