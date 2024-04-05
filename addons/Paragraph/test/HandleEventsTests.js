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

        this.presenter.configuration = {};
        this.presenter.configuration.modelAnswer = [
            {Text: "first model answer"},
            {Text: "second model answer"}
        ];

        this.presenter.$view = $('<div>');
        this.presenter.$view.append("<div class=\"addon_Paragraph\" id=\"Paragraph1\">" +
            "<div id=\"Paragraph1-wrapper\" class=\"paragraph-wrapper\"><form><textarea class=\"paragraph_field\"></textarea></form>" +
            "</div>");

        this.spies = {
            showAnswers: sinon.spy(this.presenter, 'showAnswers'),
            hideAnswers: sinon.spy(this.presenter, 'hideAnswers'),
            initializeShowAnswers: sinon.spy(this.presenter, 'initializeShowAnswers'),
            gradualShowAnswers: sinon.spy(this.presenter, 'gradualShowAnswers')
        };

        this.stubs = {
            addEventListenerStub: sinon.stub(),
            getParagraphs: sinon.stub(),
            setMode: sinon.stub(),
            getContent: sinon.stub(),
            setContent: sinon.stub(),
            setStyles: sinon.stub()
        };

        this.presenter.eventBus = {
            addEventListener: this.stubs.addEventListenerStub
        };

        this.stubs.getParagraphs.returns([document.createElement("p")]);
        this.presenter.getParagraphs = this.stubs.getParagraphs;
        this.presenter.editor = {
            setMode: this.stubs.setMode,
            getContent: this.stubs.getContent,
            setContent: this.stubs.setContent
        };
        this.presenter.setStyles = this.stubs.setStyles;
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

        setTimeout(function () {
            assertTrue(this.spies.showAnswers.called);
            assertTrue(this.spies.initializeShowAnswers.called);
        }, 100);
    },

    'test invoke gradualShowAnswers method on GradualShowAnswers event': function () {
        this.presenter.configuration.ID = 'Paragraph1';
        this.presenter.onEventReceived('GradualShowAnswers', {'moduleID': 'Paragraph1'});

        setTimeout(function () {
            assertTrue(this.spies.gradualShowAnswers.called);
            assertTrue(this.spies.initializeShowAnswers.called);
        }, 100);
    },

    'test given different module ID the instance ID when GradualShowAnswers was occurred should not show answers': function () {
        this.presenter.configuration.ID = 'Paragraph1';
        this.presenter.onEventReceived('GradualShowAnswers', {'moduleID': 'Paragraph2'});

        assertTrue(this.spies.gradualShowAnswers.called);
        assertFalse(this.spies.initializeShowAnswers.called);
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
        this.presenter.showAnswers();

        setTimeout(function () {
            var result = this.stubs.setMode;
            assertEquals(result.getCall(0).args[0], 'readonly');
            assertTrue(this.presenter.isEditorReadOnly);
        }, 100);
    },

    'test enable the addon view on hide answers': function () {
        this.presenter.isShowAnswersActive = true;
        this.presenter.isEditorReadOnly = true;

        this.presenter.hideAnswers();

        var result = this.stubs.setMode;
        assertEquals(result.getCall(0).args[0], 'design');
        assertFalse(this.presenter.isEditorReadOnly);
    }
});