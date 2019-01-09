(function () {
    function setUpPresenter() {
        this.presenter = AddonLimited_Show_Answers_create();

        this.commands = {
            incrementCheckCounter: sinon.stub(),
            increaseMistakeCounter: sinon.stub()
        };

        this.tts = {
            speak: sinon.spy()
        };

        this.stubs = {
            addClassStub: sinon.stub(),
            removeClassStub: sinon.stub(),
            textStub: sinon.stub(),
            sendEventStub: sinon.stub(this.presenter, 'sendEvent'),
            getCommandsStubs: sinon.stub().returns(this.commands),
            getModuleStub: sinon.stub().returns(this.tts)
        };

        this.presenter.playerController = {
            getCommands: this.stubs.getCommandsStubs,
            getModule: this.stubs.getModuleStub

        };

        this.presenter.$wrapper = {
            addClass: this.stubs.addClassStub,
            removeClass: this.stubs.removeClassStub
        };

        this.presenter.configuration = {
            isSelected: false,
            textSelected: {},
            enableCheckCounter: false,
            enableMistakeCounter: false,
            isEnabled: true
        };

        this.button = document.createElement("div");
        this.button.className = 'show-answers-button';

        this.presenter.$button = jQuery(this.button);
    }

    TestCase('[Limited_Show_Answers] Basic code flow', {
        setUp: setUpPresenter,

        'test should calls sendEvent once': function () {
            this.presenter.connectClickAction();
            this.presenter.$button.trigger('click');

            assertTrue(this.stubs.sendEventStub.calledOnce);
        },

        'test should not calls sendEvent when addon is disabled': function () {
            this.presenter.configuration.isEnabled = false;
            this.presenter.connectClickAction();
            this.presenter.$button.trigger('click');

            assertTrue(this.stubs.sendEventStub.notCalled);
        },

        'test should sends LimitedShowAnswers event when is not selected': function () {
            this.presenter.configuration.isSelected = false;

            this.presenter.connectClickAction();
            this.presenter.$button.trigger('click');

            var result = this.stubs.sendEventStub.getCall(0).args;

            assertEquals('LimitedShowAnswers', result[0]);
        },

        'test should sends LimitedHideAnswers event when is selected': function () {
            this.presenter.configuration.isSelected = true;

            this.presenter.connectClickAction();
            this.presenter.$button.trigger('click');

            var result = this.stubs.sendEventStub.getCall(0).args;

            assertEquals('LimitedHideAnswers', result[0]);
        },

        'test should calls addClass when isSelected is false': function () {
            this.presenter.configuration.isSelected = false;

            this.presenter.connectClickAction();
            this.presenter.$button.trigger('click');

            assertTrue(this.stubs.addClassStub.calledOnce);
        },

        'test should calls removeClass when isSelected is true': function () {
            this.presenter.configuration.isSelected = true;

            this.presenter.connectClickAction();
            this.presenter.$button.trigger('click');

            assertTrue(this.stubs.removeClassStub.calledOnce);
        }
    });

    TestCase('[Limited_Show_Answers] Check counter', {
        setUp: setUpPresenter,

        'test should calls incrementCheckCounter when not selected and enableCheckCounter is checked': function () {
            this.presenter.configuration.isSelected = false;
            this.presenter.configuration.enableCheckCounter = true;

            this.presenter.connectClickAction();
            this.presenter.$button.trigger('click');

            assertTrue(this.commands.incrementCheckCounter.calledOnce);
        },

        'test should not calls incrementCheckCounter when selected and enableCheckCounter is unchecked': function () {
            this.presenter.configuration.isSelected = true;
            this.presenter.configuration.enableCheckCounter = true;

            this.presenter.connectClickAction();
            this.presenter.$button.trigger('click');

            assertFalse(this.commands.incrementCheckCounter.calledOnce);
        },

        'test should not calls incrementCheckCounter when selected and enableCheckCounter is checked': function () {
            this.presenter.configuration.isSelected = true;
            this.presenter.configuration.enableCheckCounter = true;

            this.presenter.connectClickAction();
            this.presenter.$button.trigger('click');

            assertFalse(this.commands.incrementCheckCounter.calledOnce);
        }
    });

    TestCase('[Limited_Show_Answers] Mistake counter', {
        setUp: setUpPresenter,

        'test should calls incrementMistakeCounter when not selected and enableMistakeCounter is checked': function () {
            this.presenter.configuration.isSelected = false;
            this.presenter.configuration.enableMistakeCounter = true;

            this.presenter.connectClickAction();
            this.presenter.$button.trigger('click');

            assertTrue(this.commands.increaseMistakeCounter.calledOnce);
        },

        'test should not calls incrementMistakeCounter when selected and enableMistakeCounter is unchecked': function () {
            this.presenter.configuration.isSelected = true;
            this.presenter.configuration.enableMistakeCounter = true;

            this.presenter.connectClickAction();
            this.presenter.$button.trigger('click');

            assertFalse(this.commands.increaseMistakeCounter.calledOnce);
        },

        'test should not calls incrementMistakeCounter when selected and enableMistakeCounter is checked': function () {
            this.presenter.configuration.isSelected = true;
            this.presenter.configuration.enableMistakeCounter = true;

            this.presenter.connectClickAction();
            this.presenter.$button.trigger('click');

            assertFalse(this.commands.increaseMistakeCounter.calledOnce);
        }
    });

    TestCase('[Limited_Show_Answers] WCAG navigation test', {
        setUp: setUpPresenter,

        'test press enter when Show Answers not selected': function () {
            this.presenter.setWCAGStatus(true);
            this.presenter.speechTexts = {
                editBlock: 'Page edition is blocked',
                noEditBlock: 'Page edition is not blocked'
            };
            this.presenter.connectClickAction();

            this.presenter.keyboardController(13);
            var args = this.tts.speak.args[0][0];
            assertTrue(this.tts.speak.calledOnce);
            assertTrue(0 === args[0].text.localeCompare('Page edition is blocked'));
        },

        'test press enter when Show Answers selected': function () {
            this.presenter.setWCAGStatus(true);
            this.presenter.speechTexts = {
                editBlock: 'Page edition is blocked',
                noEditBlock: 'Page edition is not blocked'
            };
            this.presenter.connectClickAction();
            this.presenter.configuration.isSelected = true;

            this.presenter.keyboardController(13);
            var args = this.tts.speak.args[0][0];
            assertTrue(this.tts.speak.calledOnce);
            assertTrue(0 === args[0].text.localeCompare('Page edition is not blocked'));
        },

        'test press enter when WCAG not active': function () {
            this.presenter.setWCAGStatus(false);
            this.presenter.speechTexts = {
                editBlock: 'Page edition is blocked',
                noEditBlock: 'Page edition is not blocked'
            };
            this.presenter.connectClickAction();

            this.presenter.keyboardController(13);
            assertTrue(0 === this.tts.speak.callCount);
        }

    });

})();