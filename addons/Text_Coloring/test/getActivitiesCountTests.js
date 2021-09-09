TestCase("[TextColoring] getActivitiesCount function", {
    setUp: function () {
        this.presenter = AddonText_Coloring_create();

        this.presenter.configuration.filteredTokens = [
            {index: 1, isSelected: false, type: this.presenter.TOKENS_TYPES.SELECTABLE, color: 'red'},
            {index: 2, isSelected: false, type: this.presenter.TOKENS_TYPES.WORD},
            {index: 3, isSelected: false, type: this.presenter.TOKENS_TYPES.SELECTABLE, color: 'green'},
            {index: 4, isSelected: false, type: this.presenter.TOKENS_TYPES.SPACE}
        ];
        this.presenter.configuration.colors = [
            {id: 'red', color: '#f34444'},
            {id: 'green', color: '#63e33c'}
        ];
    },

    'test should return 1 when showAllAnswersInGradualShowAnswersMode is active': function () {
        this.presenter.configuration.showAllAnswersInGradualShowAnswersMode = true;

        assertTrue(this.presenter.getActivitiesCount() === 1);
    },

    'test should return answers count when showAllAnswersInGradualShowAnswersMode is inactive': function () {
        this.presenter.configuration.showAllAnswersInGradualShowAnswersMode = false;

        assertTrue(this.presenter.getActivitiesCount() === 2);
    }
});
