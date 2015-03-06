TestCase("[Hierarchical Lesson Report] Score calculation", {
    setUp: function () {
        this.presenter = AddonHierarchical_Lesson_Report_create();
        this.presenter.configuration  = {};
    },

    'test no pages': function () {
        this.presenter.lessonScore = {
            pageCount: 0
        };

        var scaledScore = this.presenter.calculateLessonScaledScore();

        assertEquals(0, scaledScore);
    },

    'test single page': function () {
        this.presenter.lessonScore = {
            pageCount: 1,
            scaledScore: 0.5
        };

        var scaledScore = this.presenter.calculateLessonScaledScore();

        assertEquals(0.5, scaledScore);
    },

    'test two pages': function () {
        this.presenter.lessonScore = {
            pageCount: 2,
            scaledScore: 0.5
        };

        var scaledScore = this.presenter.calculateLessonScaledScore();

        assertEquals(0.25, scaledScore);
    },

    'test multiple pages - rounding check': function () {
        this.presenter.lessonScore = {
            pageCount: 11,
            scaledScore: 4.5
        };

        var scaledScore = this.presenter.calculateLessonScaledScore();

        assertEquals(0.4, scaledScore);
    }
});