TestCase("[Gamememo] getActivitiesCount function", {
    setUp: function () {
        this.presenter = Addongamememo_create();
        this.presenter.configuration = {};

        this.view = document.createElement('div');
        this.presenter.viewContainer = $(this.view);
        this.presenter.viewContainer.find = sinon.stub().withArgs('.cell').returns(
            $(['card_1', 'card_2', 'card_3', 'card_4', 'card_5', 'card_6'])
        );
   },

    'test should return 1 when showAllAnswersInGradualShowAnswersMode is active': function () {
        this.presenter.configuration.showAllAnswersInGradualShowAnswersMode = true;

        assertTrue(this.presenter.getActivitiesCount() === 1);
    },

    'test should return answers count when showAllAnswersInGradualShowAnswersMode is inactive': function () {
        this.presenter.configuration.showAllAnswersInGradualShowAnswersMode = false;

        assertTrue(this.presenter.getActivitiesCount() === 3);
    }
});
