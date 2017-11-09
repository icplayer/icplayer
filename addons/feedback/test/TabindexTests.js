TestCase("[feedback] Tabindex tests", {
    setUp: function () {
        this.presenter = Addonfeedback_create();

        this.presenter.feedbackContainer = $('<div></div>');
        this.defaultResponse = $('<div class="response default_response neutral_response"></div>');
        this.firstResponse = $('<div class="response response_1 neutral_response"></div>');
        this.secondResponse = $('<div class="response response_2 neutral_response"></div>')

        this.presenter.feedbackContainer.append(this.defaultResponse);
        this.presenter.feedbackContainer.append(this.firstResponse);
        this.presenter.feedbackContainer.append(this.secondResponse);

        this.presenter.preview = false;
        this.presenter.configuration = {
            fadeTransitions: false,
            isTabindexEnabled: true
        };
    },

    'test should set tabindex to 0 for firstResponse when Is Tabindex Enabled is true': function () {
        this.presenter.setResponse(1);

        assertEquals(0, $(this.firstResponse).attr('tabindex'));
    },

    'test should not set tabindex for firstResponse when Is Tabindex Enabled is false': function () {
        this.presenter.configuration.isTabindexEnabled = false;

        this.presenter.setResponse(1);

        assertEquals(undefined, $(this.firstResponse).attr('tabindex'));
    },

    'test should set tabindex to 0 for secondResponse and to -1 for other responses when Is Tabindex Enabled is true': function () {
        this.presenter.configuration.isTabindexEnabled = true;
        this.presenter.setResponse(1);
        this.presenter.setResponse(2);

        assertEquals(-1, $(this.defaultResponse).attr('tabindex'));
        assertEquals(-1, $(this.firstResponse).attr('tabindex'));
        assertEquals(0, $(this.secondResponse).attr('tabindex'));
    },

    'test should not set tabindex for all responses when Is Tabindex Enabled is false': function () {
        this.presenter.configuration.isTabindexEnabled = false;
        this.presenter.setResponse(1);
        this.presenter.setResponse(2);

        assertEquals(undefined, $(this.defaultResponse).attr('tabindex'));
        assertEquals(undefined, $(this.firstResponse).attr('tabindex'));
        assertEquals(undefined, $(this.secondResponse).attr('tabindex'));
    },

    'test should set tabindex to -1 of defaultResponse when tabindex is true': function () {
        this.presenter.setDefaultResponse();

        assertEquals(0, $(this.defaultResponse).attr('tabindex'));
        assertEquals(-1, $(this.firstResponse).attr('tabindex'));
        assertEquals(-1, $(this.secondResponse).attr('tabindex'));
    }
});