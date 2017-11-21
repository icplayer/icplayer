TestCase("[Text Identification] Keyboard controller tests", {
    setUp : function() {
        this.presenter = Addontext_identification_create();

        this.stubs = {
            clickHandlerStub: sinon.spy(),
        };

        this.presenter.isDisabled = false;
        this.presenter.clickHandler = this.stubs.clickHandlerStub;
        this.presenter.configuration = {
            'isErrorCheckMode': false,
            'isSelected': true,
            'shouldBeSelected': false,
            'blockWrongAnswers': true
        };
        this.presenter.selectedSpeechText = "selected";
        this.presenter.deselectedSpeechText = "deselected";

        this.tts = {
            speak: sinon.spy()
        };

        this.presenter.playerController = {
            getModule: sinon.stub().returns(this.tts)
        };

        this.presenter.$view = $('<div></div>');
        this.container = $('<div class="text-identification-container"> </div>');
        this.content = $('<div class="text-identification-content">Text</div>')
        $(this.container).append(this.content);
        this.presenter.$view.append(this.container);

        this.presenter.buildKeyboardController();
    },

    'test should mark container as active' : function() {
        var enterKeycode = 13;
        this.presenter.keyboardController(enterKeycode, false);
        $(document).trigger('keydown', enterKeycode);

        assertTrue($(this.container).hasClass("keyboard_navigation_active_element"));
    },

    'test should call clickHandler when addon is active and space is pressed' : function() {
        var enterKeycode = 13;
        var spaceKeycode = 32;
        this.presenter.keyboardController(enterKeycode, false);
        $(document).trigger('keydown', enterKeycode);

        this.presenter.keyboardController(spaceKeycode, false);
        $(document).trigger('keydown', spaceKeycode);

        assertTrue(this.stubs.clickHandlerStub.called);
    },

    'test should call tts.read when entering addon' : function() {
        var enterKeycode = 13;
        this.presenter.keyboardController(enterKeycode, false);
        $(document).trigger('keydown', enterKeycode);

        var readText = this.tts.speak.getCall(0).args[0];
        var readSelected = this.tts.speak.getCall(1).args[0];

        assertEquals('Text', readText);
        assertEquals('selected', readSelected);
    },



});