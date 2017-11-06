TestCase('[Show_answers] Tabindex tests', {
    setUp: function () {
        this.presenter = AddonShow_Answers_create();

        this.view = $('<div class="show-answers-wrapper"></div>');
        this.button = $('<div class="show-answers-button"></div>');
        this.view.append(this.button);

        this.model = {
            Text: 'text',
            'Is Tabindex Enabled': "True"
        };
    },

    'test should set tabindex of button to 0 when isTabindexEnabled is true': function () {
        this.presenter.presenterLogic(this.view, this.model, true);

        assertEquals(0, this.button.attr('tabindex'));
    },

    'test should not set tabindex when isTabindexEnabled is false': function () {
        this.model['Is Tabindex Enabled'] = 'False';
        this.presenter.presenterLogic(this.view, this.model, true);

        assertEquals(undefined, this.button.attr('tabindex'));
    }
});