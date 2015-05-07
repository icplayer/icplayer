TestCase("[Hangman] Upgrade model validation", {
    setUp: function () {
        this.presenter = AddonHangman_create();
        this.upgradeupgradeKeyboardLettersOrderStub = sinon.stub(this.presenter, 'upgradeKeyboardLettersOrder');
    },

    tearDown: function () {
        this.presenter.upgradeKeyboardLettersOrder.restore();
    },

    'test upgrade model': function () {

        this.presenter.upgradeModel({});

        assertTrue(this.upgradeupgradeKeyboardLettersOrderStub.called);
    }
});

TestCase("[Hangman] Upgrade keyboard sequence", {
    setUp: function () {
        this.presenter = AddonHangman_create();
    },

    'test model should not be upgraded': function () {
        var expectedValue = "myTestValue";

        var testModel = {
            "Keyboard Letters Order": expectedValue
        };

        var validationResult = this.presenter.upgradeModel(testModel);

        assertEquals(expectedValue, validationResult["Keyboard Letters Order"]);
    },

    'test model should have added default value': function () {
        var expectedDefaultValue = "";

        var validationResult = this.presenter.upgradeModel({});

        assertEquals(expectedDefaultValue, validationResult["Keyboard Letters Order"]);
    }
});