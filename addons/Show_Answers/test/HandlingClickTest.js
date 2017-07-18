(function () {
    function setUpPresenter() {
        this.presenter = AddonShow_Answers_create();

        this.commands = {
            incrementCheckCounter: sinon.stub(),
            increaseMistakeCounter: sinon.stub()
        };

        this.stubs = {
            addClassStub: sinon.stub(),
            removeClassStub: sinon.stub(),
            textStub: sinon.stub(),
            sendEventStub: sinon.stub(this.presenter, 'sendEvent'),
            getCommandsStubs: sinon.stub().returns(this.commands)
        };

        this.presenter.playerController = {
            getCommands: this.stubs.getCommandsStubs
        };

        this.presenter.$wrapper = {
            addClass: this.stubs.addClassStub,
            removeClass: this.stubs.removeClassStub
        };

        this.presenter.configuration = {
            isSelected: false,
            textSelected: {},
            enableCheckCounter: false,
            enableMistakeCounter: false
        };
        this.button = document.createElement("div");
        this.button.className = 'show-answers-button';

        this.presenter.$button = jQuery(this.button);
    }

    TestCase('[Show_Answers] Basic code flow', {
        setUp: setUpPresenter,

        'test should call sendEvent once': function () {
            this.presenter.handleClickAction();
            this.presenter.$button.trigger('click');

            assertTrue(this.stubs.sendEventStub.calledOnce);
        },

        'test should call addClass when isSelected is false': function () {
            this.presenter.configuration.isSelected = false;

            this.presenter.handleClickAction();
            this.presenter.$button.trigger('click');

            assertTrue(this.stubs.addClassStub.calledOnce);
        },

        'test should send ShowAnswers event when is not Selected, isSelected is false': function () {
            this.presenter.configuration.isSelected = false;

            this.presenter.handleClickAction();
            this.presenter.$button.trigger('click');

            var result = this.stubs.sendEventStub.getCall(0).args;

            assertEquals('ShowAnswers', result[0]);
        },

        'test should have eventName equal to HideAnswers when isSelected is true': function () {
            this.presenter.configuration.isSelected = true;

            this.presenter.handleClickAction();
            this.presenter.$button.trigger('click');

            var result = this.stubs.sendEventStub.getCall(0).args;

            assertEquals('HideAnswers', result[0]);
        },

        'test should call removeClass when isSelected is true': function () {
            this.presenter.configuration.isSelected = true;

            this.presenter.handleClickAction();
            this.presenter.$button.trigger('click');

            assertTrue(this.stubs.removeClassStub.calledOnce);
        }
    });

    TestCase('[Show_Answers] Check counter', {
        setUp: setUpPresenter,

        'test should call incrementCheckCounter when isSelected is false and enableCheckCounter is true': function () {
            this.presenter.configuration.isSelected = false;
            this.presenter.configuration.enableCheckCounter = true;

            this.presenter.handleClickAction();
            this.presenter.$button.trigger('click');

            assertTrue(this.commands.incrementCheckCounter.calledOnce);
        },

        'test should not call incrementCheckCounter when isSelected is true and enableCheckCounter is false': function () {
            this.presenter.configuration.isSelected = true;
            this.presenter.configuration.enableCheckCounter = true;

            this.presenter.handleClickAction();
            this.presenter.$button.trigger('click');

            assertFalse(this.commands.incrementCheckCounter.calledOnce);
        },

        'test should not call incrementCheckCounter when isSelected is true and enableCheckCounter is true': function () {
            this.presenter.configuration.isSelected = true;
            this.presenter.configuration.enableCheckCounter = true;

            this.presenter.handleClickAction();
            this.presenter.$button.trigger('click');

            assertFalse(this.commands.incrementCheckCounter.calledOnce);
        }
    });

    TestCase('[Show_Answers] Mistake counter', {
        setUp: setUpPresenter,

        'test should call incrementMistakeCounter when isSelected is false and enableMistakeCounter is true': function () {
            this.presenter.configuration.isSelected = false;
            this.presenter.configuration.enableMistakeCounter = true;

            this.presenter.handleClickAction();
            this.presenter.$button.trigger('click');

            assertTrue(this.commands.increaseMistakeCounter.calledOnce);
        },

        'test should not call incrementMistakeCounter when isSelected is true and enableMistakeCounter is false': function () {
            this.presenter.configuration.isSelected = true;
            this.presenter.configuration.enableMistakeCounter = true;

            this.presenter.handleClickAction();
            this.presenter.$button.trigger('click');

            assertFalse(this.commands.increaseMistakeCounter.calledOnce);
        },

        'test should not call incrementMistakeCounter when isSelected is true and enableMistakeCounter is true': function () {
            this.presenter.configuration.isSelected = true;
            this.presenter.configuration.enableMistakeCounter = true;

            this.presenter.handleClickAction();
            this.presenter.$button.trigger('click');

            assertFalse(this.commands.increaseMistakeCounter.calledOnce);
        }
    });

})();