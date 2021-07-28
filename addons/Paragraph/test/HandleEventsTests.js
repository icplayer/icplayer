TestCase("[Paragraph] handle events related to showing model answer", {
    setUp: function () {
        this.presenter = AddonParagraph_create();

        this.presenter.configuration = {
            isValid: true
        };

        this.model = {
            'Bottom': '',
            'Custom CSS': '',
            'Is Visible': 'True',
            'ID': 'Paragraph1',
            'Show Answers': '',
            'printable': "Don't randomize"
        };

        this.presenter.$view = $('<div>');
        this.presenter.$view.append("<div class=\"addon_Paragraph\" id=\"Paragraph1\">" +
            "<div id=\"Paragraph1-wrapper\" class=\"paragraph-wrapper\"><form><textarea class=\"paragraph_field\"></textarea></form>" +
            "</div>");

        this.spies = {
            showAnswers: sinon.spy(this.presenter, 'showAnswers'),
            hideAnswers: sinon.spy(this.presenter, 'hideAnswers'),
        };

        this.stubs = {
            addEventListenerStub: sinon.stub()
        };

        this.presenter.eventBus = {
            addEventListener: this.stubs.addEventListenerStub
        };
    },

    'test add events listener': function () {
        this.presenter.setEventBus(this.presenter.eventBus);

        var result = this.stubs.addEventListenerStub

        assertEquals(result.getCall(0).args[0], 'ShowAnswers');
        assertEquals(result.getCall(1).args[0], 'HideAnswers');
        assertEquals(result.getCall(2).args[0], 'GradualShowAnswers');
        assertEquals(result.getCall(3).args[0], 'GradualHideAnswers');
    },

    'test invoke showAnswers method on ShowAnswers event': function () {
        this.presenter.onEventReceived('ShowAnswers', '');

        assertTrue(this.spies.showAnswers.called);
    },

    'test invoke showAnswers method on GradualShowAnswers event': function () {
        this.presenter.onEventReceived('GradualShowAnswers', '');

        assertTrue(this.spies.showAnswers.called);
    },

    'test invoke hideAnswers method on HideAnswers event': function () {
        this.presenter.onEventReceived('HideAnswers', '');

        assertTrue(this.spies.hideAnswers.called);
    },

    'test invoke hideAnswers method on GradualHideAnswers event': function () {
        this.presenter.onEventReceived('GradualHideAnswers', '');

        assertTrue(this.spies.hideAnswers.called);
    },

    'test disable view': function () {
        var paragraph = this.presenter.$view.find(".paragraph-wrapper");

        this.presenter.showAnswers();

        assertTrue(paragraph['0'].classList.contains('disabled'));
    },
});