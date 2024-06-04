TestCase("[Paragraph] Get max score method tests", {
    setUp: function () {
        this.presenter = AddonParagraph_create();
        this.presenter.configuration = {
            isValid: true,
            manualGrading: true,
            weight: 2
        };
    },

    'test given configuration with weight equal to 2 when getMaxScore executed then return 2': function () {
        const maxScore = this.presenter.getMaxScore();

        assertEquals(2, maxScore);
    },

    'test given configuration with valid weight when getMaxScore executed then return this value': function () {
        this.presenter.configuration.weight = "11";

        const maxScore = this.presenter.getMaxScore();

        assertEquals("11", maxScore);
    },

    'test given configuration with turned off manual grading when getMaxScore executed then return 0': function () {
        this.presenter.configuration.manualGrading = false;

        const maxScore = this.presenter.getMaxScore();

        assertEquals(0, maxScore);
    },

    'test given not valid configuration when getMaxScore executed then return 0': function () {
        this.presenter.configuration.isValid = false;

        const maxScore = this.presenter.getMaxScore();

        assertEquals(0, maxScore);
    }
});
