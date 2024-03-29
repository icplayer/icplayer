TestCase("[Text_Coloring] getActivitiesCount function", {
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

        assertEquals(1, this.presenter.getActivitiesCount());
    },

    'test should return answers count when showAllAnswersInGradualShowAnswersMode is inactive': function () {
        this.presenter.configuration.showAllAnswersInGradualShowAnswersMode = false;

        assertEquals(2, this.presenter.getActivitiesCount());
    },

    'test given 2 selectable and 2 intruder tokens when calling getActivitiesCount, then should return only selectable count': function () {
        this.presenter.configuration.showAllAnswersInGradualShowAnswersMode = false;

        this.presenter.configuration.filteredTokens.push(
            {index: 5, isSelected: true, type: this.presenter.TOKENS_TYPES.INTRUDER}
        );
        this.presenter.configuration.filteredTokens.push(
            {index: 6, isSelected: false, type: this.presenter.TOKENS_TYPES.INTRUDER}
        );

        assertEquals(2, this.presenter.getActivitiesCount());
    },

    'test given 2 selectable and 2 intruder tokens when calling getActivitiesCount and showAllAnswersInGradualShowAnswersMode set to True, then should return 1': function () {
        this.presenter.configuration.showAllAnswersInGradualShowAnswersMode = true;

        this.presenter.configuration.filteredTokens.push(
            {index: 5, isSelected: true, type: this.presenter.TOKENS_TYPES.INTRUDER}
        );
        this.presenter.configuration.filteredTokens.push(
            {index: 6, isSelected: false, type: this.presenter.TOKENS_TYPES.INTRUDER}
        );

        assertEquals(1, this.presenter.getActivitiesCount());
    }
});
