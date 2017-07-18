TestCase('[Show_Answers] Handling clicks', {
    setUp: function () {
        this.presenter = AddonShow_Answers_create();

        this.stubs = {
            addClassStub: sinon.stub(),
            removeClassStub: sinon.stub(),
            textStub: sinon.stub(),
            sendEventStub: sinon.stub(this.presenter, 'sendEvent'),
            incrementCheckCounterStub: sinon.stub(),
            incrementMistakeCounterStub: sinon.stub(),
            getCommandsStubs: sinon.stub().returns(this.commands)
        };

        this.commands = {
            incrementCheckCounter:  this.stubs.incrementCheckCounterStub,
            increaseMistakeCounter:  this.stubs.incrementMistakeCounterStub
        };

        this.presenter.playerController = {
            getCommands: this.stubs.getCommandsStubs
        }

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

        this.button = document.createElement('div');
        this.button.className = 'show-answers-button';

        this.presenter.$button = $(".show-answers-button");
    },
    
    tearDown: function () {
        document.body.removeChild(this.presenter.button);
    },

    'test should call sendEvent once': function () {
        this.$button.trigger('click');

        assertTrue(this.stubs.sendEventStub.calledOnce);
    }
});