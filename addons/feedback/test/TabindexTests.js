TestCase("[feedback] Tabindex tests", {
    setUp: function () {
        this.presenter = Addonfeedback_create();

        this.view = $('<div></div>');

        this.model = {
            'Responses': [],
            'Default response': '',
            'Is Tabindex Enabled': 'True'
        };
    },

    'test should set tabindex to 0 for view when Is Tabindex Enabled is true': function () {
        this.presenter.initialize(this.view, this.model, true);

        assertEquals(0, $(this.view).attr('tabindex'));
    },

    'test should not set tabindex for view if Is Tabindex Enabled equals false': function () {
        this.model['Is Tabindex Enabled'] = 'False';

        this.presenter.initialize(this.view, this.model, true);

        assertEquals(undefined, $(this.view).attr('tabindex'));

    }
});