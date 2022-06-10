TestCase("[Paragraph Keyboard] handle events related to showing model answer", {
    setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();

        this.presenter.configuration = {
            isValid: true
        };

        this.model = {
            'Bottom': '',
            'Custom CSS': '',
            'Is Visible': 'True',
            'ID': 'Paragraph_Keyboard1',
            'Show Answers': '',
            'printable': "Don't randomize"
        };

        this.presenter.$view = $('<div>');
        this.presenter.$view.append(`
            <div class="addon_Paragraph_Keyboard" id="Paragraph_Keyboard1">
                <div class="paragraph-keyboard-wrapper"></div>
            </div>`);

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

        const result = this.stubs.addEventListenerStub

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
        this.presenter.configuration.ID = 'Paragraph_Keyboard1'
        this.presenter.onEventReceived('GradualShowAnswers', {'moduleID': 'Paragraph_Keyboard1'});

        assertTrue(this.spies.showAnswers.called);
    },

    'test given different module ID the instance ID when GradualShowAnswers was occurred should not show answers': function () {
        this.presenter.configuration.ID = 'Paragraph_Keyboard1'
        this.presenter.onEventReceived('GradualShowAnswers', {'moduleID': 'Paragraph_Keyboard2'});

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
        const paragraph = this.presenter.$view.find(".paragraph-keyboard-wrapper");

        this.presenter.showAnswers();

        assertTrue(paragraph['0'].classList.contains('disabled'));
    },

    'test enable the addon view on hide answers': function () {
        const paragraph = this.presenter.$view.find(".paragraph-keyboard-wrapper");
        paragraph['0'].classList.add('disabled');
        this.presenter.isShowAnswersActive = true;

        this.presenter.hideAnswers();

        assertFalse(paragraph['0'].classList.contains('disabled'));
    },

    'test given view when disableEdit then add disabled class': function () {
        const paragraph = this.presenter.$view.find(".paragraph-keyboard-wrapper");

        this.presenter.disableEdit();

        assertTrue(paragraph.hasClass('disabled'));
    },

    'test given view when enableEdit then remove disabled class': function () {
        const paragraph = this.presenter.$view.find(".paragraph-keyboard-wrapper");
        paragraph['0'].classList.add('disabled');

        this.presenter.enableEdit();

        assertFalse(paragraph.hasClass('disabled'));
    }
});
