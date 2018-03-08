TestCase("[Board Game] Upgrade model Test Case", {

    setUp: function () {
        this.presenter = AddonBoard_Game_create();

        this.exampleModel = {Fields: [{},{},{}]};
        this.correctModel = {
            Fields: [
                {cssClass: "1"},
                {cssClass: "2"}
            ],
            gameMode: "Game",
            isDisabled: "True"
        }
    },

    'test upgradeModel will add missing values': function () {
        var upgradedModel = this.presenter.upgradeModel(this.exampleModel);

        assertEquals({
            isDisabled: "False",
            gameMode: "Free",
            Fields: [
                {cssClass: ""},
                {cssClass: ""},
                {cssClass: ""}
            ]
        }, upgradedModel);
    },

    'test upgradeModel wont change values if that values exists': function () {
        var upgradedModel = this.presenter.upgradeModel(this.correctModel);

        assertEquals({
            isDisabled: "True",
            gameMode: "Game",
            Fields: [
                {cssClass: "1"},
                {cssClass: "2"}
            ]
        }, upgradedModel);
    }
});