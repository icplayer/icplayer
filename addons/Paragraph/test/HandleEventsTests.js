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

    'test add events listener on setEventBus invoke': function () {
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
        this.presenter.configuration.ID = 'Paragraph1'
        this.presenter.onEventReceived('GradualShowAnswers', {'moduleID': 'Paragraph1'});

        assertTrue(this.spies.showAnswers.called);
    },

    'test given different module ID the instance ID when GradualShowAnswers was occurred should not show answers': function () {
        this.presenter.configuration.ID = 'Paragraph1'
        this.presenter.onEventReceived('GradualShowAnswers', {'moduleID': 'Paragraph2'});

        assertFalse(this.spies.showAnswers.called);
    },

    'test invoke hideAnswers method on HideAnswers event': function () {
        this.presenter.onEventReceived('HideAnswers', '');

        assertTrue(this.spies.hideAnswers.called);
    },

    'test invoke hideAnswers method on GradualHideAnswers event': function () {
        this.presenter.onEventReceived('GradualHideAnswers', '');

        assertTrue(this.spies.hideAnswers.called);
    },

    'test disable the addon view on show answers': function () {
        var paragraph = this.presenter.$view.find(".paragraph-wrapper");

        this.presenter.showAnswers();

        assertTrue(paragraph['0'].classList.contains('disabled'));
    },

    'test enable the addon view on hide answers': function () {
        var paragraph = this.presenter.$view.find(".paragraph-wrapper");
        paragraph['0'].classList.add('disabled');
        this.presenter.isShowAnswersActive = true;

        this.presenter.hideAnswers();

        assertFalse(paragraph['0'].classList.contains('disabled'));
    },

    'test given view when disableParagraph then add disabled class': function () {
        var paragraph = this.presenter.$view.find(".paragraph-wrapper");

        this.presenter.disableParagraph();

        assertTrue(paragraph.hasClass('disabled'));
    }
});