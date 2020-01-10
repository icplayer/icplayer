(function () {
    function setUpPresenter() {
        this.presenter = AddonLimited_Submit_create();

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
            getModuleStub: sinon.stub().returns(this.tts),
            executeCheckForAllModulesStub: sinon.stub(this.presenter, 'executeCheckForAllModules'),
            executeUnCheckForAllModulesStub: sinon.stub(this.presenter, 'executeUnCheckForAllModules'),
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
        };

        this.button = document.createElement("div");
        this.button.className = 'submit-button';

        this.presenter.$button = jQuery(this.button);
    }

    TestCase('[Limited_Submit] Basic code flow', {
        setUp: setUpPresenter,

        'test given unselected button and attempted modules when button is clicked then will send selected event and will check modules': function () {
            this.presenter.allModulesAttempted = function () {
                return true;
            };

            this.presenter.state.isSelected = false;

            this.presenter.connectClickAction();
            this.presenter.$button.trigger('click');

            assertTrue(this.stubs.sendEventStub.calledOnce);
            assertTrue(this.stubs.sendEventStub.calledWith(this.presenter.EVENTS_NAMES.SELECTED));
            assertTrue(this.stubs.executeCheckForAllModulesStub.calledOnce)
        },

        'test given unselected button but with module which is unselected when button in clicked then will send TRIED_SELECT event': function () {
            this.presenter.state.isSelected = false;
            this.presenter.allModulesAttempted = function () {
                return false;
            };

            this.presenter.connectClickAction();
            this.presenter.$button.trigger('click');

            assertTrue(this.stubs.sendEventStub.calledOnce);
            assertTrue(this.stubs.sendEventStub.calledWith(this.presenter.EVENTS_NAMES.TRIED_SELECT));
        },

        'test given selected button when button is clicked then will send event and will call uncheck addons': function () {
            this.presenter.state.isSelected = true;

            this.presenter.connectClickAction();
            this.presenter.$button.trigger('click');

            assertTrue(this.stubs.sendEventStub.calledOnce);
            assertTrue(this.stubs.sendEventStub.calledWith(this.presenter.EVENTS_NAMES.DESELECTED));
            assertTrue(this.stubs.executeUnCheckForAllModulesStub.calledOnce)
        }
    });

    TestCase('[Limited_Submit] Select/Deselect code flow', {
        setUp: setUpPresenter,

        'test given deselected addon when select is called then at first will be send event with selection and at next modules will be selected': function () {
            this.presenter.state.isSelected = false;
            this.presenter.allModulesAttempted = function () {
                return true;
            };

            this.presenter.connectClickAction();
            this.presenter.$button.trigger('click');

            assertTrue(this.stubs.sendEventStub.calledBefore(this.stubs.executeCheckForAllModulesStub));
        },

        'test given selected addon when deselect is called then will be send event with deselection and at next modules will be deselected': function () {
            this.presenter.state.isSelected = true;

            this.presenter.connectClickAction();
            this.presenter.$button.trigger('click');

            assertTrue(this.stubs.sendEventStub.calledBefore(this.stubs.executeUnCheckForAllModulesStub));
        }
    });

    TestCase('[Limited_Submit] WCAG navigation test', {
        setUp: setUpPresenter,

        'test given enabled WCAG, deselected button and attempted modules when enter is clicked then will call speak with blocked addon text': function () {
            this.presenter.allModulesAttempted = sinon.stub().returns(true);
            this.presenter.setWCAGStatus(true);
            this.presenter.configuration.speechTexts = {
                blockEdit: {textToSpeechText: 'Page edition is blocked'},
                noBlockEdit: {textToSpeechText: 'Page edition is not blocked'}
            };
            this.presenter.connectClickAction();

            this.presenter.keyboardController(13);
            var args = this.tts.speak.args[0][0];
            assertTrue(this.tts.speak.calledOnce);
            assertTrue(0 === args[0].text.localeCompare('Page edition is blocked'));
        },

        'test given enabled WCAG and selected button when enter is clicked then will call speak with not blocked addon text': function () {
            this.presenter.setWCAGStatus(true);
            this.presenter.configuration.speechTexts = {
                blockEdit: {textToSpeechText: 'Page edition is blocked'},
                noBlockEdit: {textToSpeechText: 'Page edition is not blocked'}
            };
            this.presenter.connectClickAction();
            this.presenter.state.isSelected = true;

            this.presenter.keyboardController(13);
            var args = this.tts.speak.args[0][0];
            assertTrue(this.tts.speak.calledOnce);
            assertTrue(0 === args[0].text.localeCompare('Page edition is not blocked'));
        },

        'test given disabled WCAG when enter is clicked then speak wont be called': function () {
            this.presenter.allModulesAttempted = sinon.stub().returns(true);
            this.presenter.setWCAGStatus(false);
            this.presenter.speechTexts = {
                blockEdit: {textToSpeechText: 'Page edition is blocked'},
                noBlockEdit: {textToSpeechText: 'Page edition is not blocked'}
            };
            this.presenter.connectClickAction();

            this.presenter.keyboardController(13);
            assertTrue(0 === this.tts.speak.callCount);
        }

    });

})();