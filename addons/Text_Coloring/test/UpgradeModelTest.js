TestCase("[Text_Coloring] Upgrade Text Coloring model", {
    setUp: function () {
        this.presenter = AddonText_Coloring_create();

        this.model = {
            Bottom: '',
            ID: 'Text_Coloring1'
        };
    },

    'test should add properties to model when the upgradeModel was called': function () {
        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertTrue(upgradedModel.hasOwnProperty('Mode'));
        assertTrue(upgradedModel.hasOwnProperty('countErrors'));
        assertTrue(upgradedModel.hasOwnProperty('showAllAnswersInGradualShowAnswersMode'));
        assertTrue(upgradedModel.hasOwnProperty('Legend title'));
        assertTrue(upgradedModel.hasOwnProperty('isNotActivity'));
    }
});
