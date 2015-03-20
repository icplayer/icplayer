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

TestCase("[Hierarchical Lesson Report] Checking conditions to calculate Page Scaled Score", {
    setUp: function () {
        this.presenter = AddonHierarchical_Lesson_Report_create();
        this.presenter.isPreview = false;

        sinon.stub(this.presenter, 'isPageVisited');
    },

    tearDown: function () {
        this.presenter.isPageVisited.restore();
    },

    'test page has maxScore but score is 0': function () {
        var scaledScore = this.presenter.getPageScaledScore(3, 0, false, "4Ryz4z");

        assertEquals(0, scaledScore);
        assertFalse(this.presenter.isPageVisited.called);
    },

    'test page has 100% result': function () {
        this.presenter.isPreview = false;

        var scaledScore = this.presenter.getPageScaledScore(4, 1, false, "mO681X");

        assertEquals(0.25, scaledScore);
        assertFalse(this.presenter.isPageVisited.called);
    },

    'test calculating chapter score': function () {
        var scaledScore = this.presenter.getPageScaledScore(0, 6, true, "Chapter");

        assertEquals(0, scaledScore);
        assertFalse(this.presenter.isPageVisited.called);
    },

    'test addon is in preview mode': function () {
        this.presenter.isPreview = true;

        var scaledScore = this.presenter.getPageScaledScore(6, 3, false, "mO681X");

        assertEquals(0.5, scaledScore);
        assertFalse(this.presenter.isPageVisited.called);
    },

    'test not visited page with no activity but reportable': function () {
        this.presenter.isPageVisited.returns(false);

        var scaledScore = this.presenter.getPageScaledScore(0, 0, false, "mO681X");

        assertEquals(0, scaledScore);
    },

    'test visited page with no activity but reportable': function () {
        this.presenter.isPageVisited.returns(true);

        var scaledScore = this.presenter.getPageScaledScore(0, 0, false, "mO681X");

        assertEquals(1, scaledScore);
    }
});