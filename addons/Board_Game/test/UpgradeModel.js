TestCase("[Board Game] Upgrade model Test Case", {

    setUp: function () {
        this.presenter = AddonBoard_Game_create();

        this.exampleModel = {Fields: [{},{},{}]};

    },

    'test upgradeModel will add missing values': function () {
        var upgradedModel = this.presenter.upgradeModel(this.exampleModel);

        assertEquals({
            isDisabled: false,
            gameMode: "Free",
            Fields: [
                {cssClass: ""},
                {cssClass: ""},
                {cssClass: ""}
            ]
        }, upgradedModel);
    }


});