TestCase("[Show_Answers] Upgrade increment mistake counter test", {
    setUp: function () {
        this.presenter = new AddonShow_Answers_create();

        this.model = {
            Text : 'Sample text',
            'Text selected' : 'Sample text 2',
            'Is Visible' : 'True',
            ID : 'Show_Answers1',
            'Increment check counter': 'True'
        };
    },

    'test should return mistake counter as false': function() {
        var result = this.presenter.upgradeIncrementMistakeCounter(this.model);

        assertEquals('false', result['Increment mistake counter']);
    },

    'test should not change model counter value from True': function() {
        this.model["Increment mistake counter"] = 'True';

        var result = this.presenter.upgradeIncrementMistakeCounter(this.model);

        assertEquals('True', result['Increment mistake counter']);


    },

    'test should not change model counter value from 0': function () {
        var result = this.presenter.upgradeIncrementMistakeCounter({
            "Increment mistake counter": 0
        });

        assertEquals(0, result["Increment mistake counter"]);
    }
});

TestCase("[Show_Answers] Upgrading model test", {
    setUp: function () {
        this.presenter = new AddonShow_Answers_create();

        this.model = {
            Text : 'Sample text',
            'Text selected' : 'Sample text 2',
            'Is Visible' : 'True',
            ID : 'Show_Answers1',
            'Increment check counter': 'True'
        };

        this.stubs = {
            incrementMistakeCounterStub: sinon.stub()
        };

        this.presenter.upgradeIncrementMistakeCounter = this.stubs.incrementMistakeCounterStub;
    },

    'test should call upgradeIncrementMistakeCounter': function() {
        this.presenter.upgradeModel(this.model);

        assertTrue(this.stubs.incrementMistakeCounterStub.calledOnce);
    },

    'test should not call upgradeIncrementMistakeCounter': function() {
        this.model["Increment mistake counter"] = "True";
        this.presenter.upgradeModel(this.model);

        assertFalse(this.stubs.incrementMistakeCounterStub.called);
    }
});

TestCase("[Show_Answers] Presenter logic test", {
    setUp: function () {
        this.presenter = new AddonShow_Answers_create();

        this.configuration = {
            isVisible: true
        };

        this.html = {
            view: document.createElement("div")
        };

        this.stubs = {
            upgradeModelStub: sinon.stub(),
            validateModelStub: sinon.stub().returns(this.configuration)
        };

        this.presenter.upgradeModel = this.stubs.upgradeModelStub;
        this.presenter.validateModel = this.stubs.validateModelStub;

        this.presenter.eventBus = {
            addEventListener : function () {}
        };

        this.presenter.setVisibility = function () {};
    },

    'test should call upgrade model before validation': function() {
        this.presenter.presenterLogic(this.html.view, {}, true);

        assertTrue(this.stubs.upgradeModelStub.calledBefore(this.stubs.validateModelStub));
    },

    'test should pass upgraded model to validation': function(){
        var data = -1;

        this.stubs.upgradeModelStub.returns(data);

        this.presenter.presenterLogic(this.html.view, {}, true);

        assertTrue(this.stubs.validateModelStub.calledWith(data));
        assertTrue(this.stubs.validateModelStub.calledOnce);
        assertTrue(this.stubs.upgradeModelStub.calledOnce);
    }
});