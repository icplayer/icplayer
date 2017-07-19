TestCase("[Show_Answers] Upgrading increment mistake counter model test", {
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

    'test should not change model counter value': function() {
        this.model["Increment mistake counter"] = 'True';

        var result = this.presenter.upgradeIncrementMistakeCounter(this.model);

        assertEquals('True', result['Increment mistake counter']);

        result = this.presenter.upgradeIncrementMistakeCounter({
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