TestCase("[Hierarchical Lesson Report] Score calculation", {
    setUp: function () {
        this.presenter = AddonHierarchical_Lesson_Report_create();
        this.presenter.configuration = {};
        this.presenter.printableConfiguration = {};
    },

    'test no pages': function () {
        this.presenter.lessonScore = {
            weightedScaledScoreDenominator: 0
        };

        var result = this.presenter.calculateLessonScore();

        assertEquals(0, result);
    },

    'test single page': function () {
        this.presenter.lessonScore = {
            weightedScaledScoreDenominator: 1,
            weightedScaledScoreNumerator: 0.5
        };

        var result = this.presenter.calculateLessonScore();

        assertEquals(0.5, result);
    },

    'test two pages': function () {
        this.presenter.lessonScore = {
            weightedScaledScoreDenominator: 2,
            weightedScaledScoreNumerator: 0.5
        };

        var result = this.presenter.calculateLessonScore();

        assertEquals(0.25, result);
    },

    'test multiple pages - rounding check': function () {
        this.presenter.lessonScore = {
            weightedScaledScoreDenominator: 4,
            weightedScaledScoreNumerator: 3.75
        };

        var result = this.presenter.calculateLessonScore();

        assertEquals(0.94, result);
    },

    'test no pages when addon in printable state': function () {
        setPrintableShowResultsStateMode(this.presenter);
        this.presenter.printableLessonScore = {
            weightedScaledScoreDenominator: 0
        };

        var result = this.presenter.calculateLessonScore();

        assertEquals(0, result);
    },

    'test single page when addon in printable state': function () {
        setPrintableShowResultsStateMode(this.presenter);
        this.presenter.printableLessonScore = {
            weightedScaledScoreDenominator: 1,
            weightedScaledScoreNumerator: 0.5
        };

        var result = this.presenter.calculateLessonScore();

        assertEquals(0.5, result);
    },

    'test two pages when addon in printable state': function () {
        setPrintableShowResultsStateMode(this.presenter);
        this.presenter.printableLessonScore = {
            weightedScaledScoreDenominator: 2,
            weightedScaledScoreNumerator: 0.5
        };

        var result = this.presenter.calculateLessonScore();

        assertEquals(0.25, result);
    },

    'test multiple pages - rounding check when addon in printable state': function () {
        setPrintableShowResultsStateMode(this.presenter);
        this.presenter.printableLessonScore = {
            weightedScaledScoreDenominator: 11,
            weightedScaledScoreNumerator: 4.5
        };

        var result = this.presenter.calculateLessonScore();

        assertEquals(0.41, result);
    }
});

TestCase("[Hierarchical Lesson Report] Checking conditions to calculate Page Scaled Score", {
    setUp: function () {
        this.presenter = AddonHierarchical_Lesson_Report_create();
        this.presenter.isPreview = false;

        sinon.stub(this.presenter, 'isPageVisited');
        this.printableController = {
            isPreview: sinon.stub()
        };

        this.printableController.isPreview.returns(false);
        this.presenter.setPrintableController(this.printableController);
    },

    tearDown: function () {
        this.presenter.isPageVisited.restore();
    },

    'test page has maxScore but score is 0': function () {
        var scaledScore = this.presenter.getPageScaledScore(3, 0, false, "4Ryz4z");

        assertEquals(0, scaledScore);
        assertFalse(this.presenter.isPageVisited.called);
        assertFalse(this.printableController.isPreview.called);
    },

    'test page has 100% result but max score is 4': function () {
        var scaledScore = this.presenter.getPageScaledScore(4, 1, false, "mO681X");

        assertEquals(0.25, scaledScore);
        assertFalse(this.presenter.isPageVisited.called);
        assertFalse(this.printableController.isPreview.called);
    },

    'test calculating chapter score': function () {
        var scaledScore = this.presenter.getPageScaledScore(0, 6, true, "Chapter");

        assertEquals(0, scaledScore);
        assertFalse(this.presenter.isPageVisited.called);
        assertFalse(this.printableController.isPreview.called);
    },

    'test addon when is in preview mode': function () {
        this.presenter.isPreview = true;

        var scaledScore = this.presenter.getPageScaledScore(6, 3, false, "mO681X");

        assertEquals(0.5, scaledScore);
        assertFalse(this.presenter.isPageVisited.called);
        assertFalse(this.printableController.isPreview.called);
    },

    'test not visited page with no activity but reportable': function () {
        this.presenter.isPageVisited.returns(false);

        var scaledScore = this.presenter.getPageScaledScore(0, 0, false, "mO681X");

        assertEquals(0, scaledScore);
        assertTrue(this.presenter.isPageVisited.calledOnce);
        assertFalse(this.printableController.isPreview.called);
    },

    'test visited page with no activity but reportable': function () {
        this.presenter.isPageVisited.returns(true);

        var scaledScore = this.presenter.getPageScaledScore(0, 0, false, "mO681X");

        assertEquals(1, scaledScore);
        assertTrue(this.presenter.isPageVisited.calledOnce);
        assertFalse(this.printableController.isPreview.called);
    },

    'test page has maxScore but score is 0 when addon in printable empty state': function () {
        setPrintableEmptyStateMode(this.presenter);

        var scaledScore = this.presenter.getPageScaledScore(3, 0, false, "4Ryz4z");

        assertEquals(0, scaledScore);
        assertFalse(this.presenter.isPageVisited.called);
        assertFalse(this.printableController.isPreview.called);
    },

    'test page has 100% result but max score is 4 when addon in printable empty state': function () {
        setPrintableEmptyStateMode(this.presenter);

        var scaledScore = this.presenter.getPageScaledScore(4, 1, false, "mO681X");

        assertEquals(0, scaledScore);
        assertFalse(this.presenter.isPageVisited.called);
        assertFalse(this.printableController.isPreview.called);
    },

    'test calculating chapter score when addon in printable empty state': function () {
        setPrintableEmptyStateMode(this.presenter);

        var scaledScore = this.presenter.getPageScaledScore(0, 6, true, "Chapter");

        assertEquals(0, scaledScore);
        assertFalse(this.presenter.isPageVisited.called);
        assertFalse(this.printableController.isPreview.called);
    },

    'test addon is in preview mode when addon in printable empty state': function () {
        setPrintableEmptyStateMode(this.presenter);
        this.printableController.isPreview.returns(true);

        var scaledScore = this.presenter.getPageScaledScore(6, 3, false, "mO681X");

        assertEquals(0, scaledScore);
        assertFalse(this.presenter.isPageVisited.called);
        assertFalse(this.printableController.isPreview.called);
    },

    'test not visited page with no activity but reportable when addon in printable empty state': function () {
        setPrintableEmptyStateMode(this.presenter);

        var scaledScore = this.presenter.getPageScaledScore(0, 0, false, "mO681X");

        assertEquals(0, scaledScore);
        assertFalse(this.presenter.isPageVisited.called);
        assertFalse(this.printableController.isPreview.called);
    },

    'test visited page with no activity but reportable when addon in printable empty state': function () {
        setPrintableEmptyStateMode(this.presenter);
        this.presenter.isPageVisited.returns(true);

        var scaledScore = this.presenter.getPageScaledScore(0, 0, false, "mO681X");

        assertEquals(0, scaledScore);
        assertFalse(this.presenter.isPageVisited.called);
        assertFalse(this.printableController.isPreview.called);
    },

    'test page has maxScore but score is 0 when addon in printable show results state': function () {
        setPrintableShowResultsStateMode(this.presenter);

        var scaledScore = this.presenter.getPageScaledScore(3, 0, false, "4Ryz4z");

        assertEquals(0, scaledScore);
        assertFalse(this.presenter.isPageVisited.called);
        assertFalse(this.printableController.isPreview.called);
    },

    'test page has 100% result but max score is 4 when addon in printable show results state': function () {
        setPrintableShowResultsStateMode(this.presenter);

        var scaledScore = this.presenter.getPageScaledScore(4, 1, false, "mO681X");

        assertEquals(0.25, scaledScore);
        assertFalse(this.presenter.isPageVisited.called);
        assertFalse(this.printableController.isPreview.called);
    },

    'test calculating chapter score when addon in printable show results state': function () {
        setPrintableShowResultsStateMode(this.presenter);

        var scaledScore = this.presenter.getPageScaledScore(0, 6, true, "Chapter");

        assertEquals(0, scaledScore);
        assertFalse(this.presenter.isPageVisited.called);
        assertTrue(this.printableController.isPreview.calledOnce);
    },

    'test addon is in preview mode when addon in printable show results state': function () {
        setPrintableShowResultsStateMode(this.presenter);
        this.printableController.isPreview.returns(true);

        var scaledScore = this.presenter.getPageScaledScore(6, 3, false, "mO681X");

        assertEquals(0.5, scaledScore);
        assertFalse(this.presenter.isPageVisited.called);
        assertFalse(this.printableController.isPreview.called);
    },

    'test not visited page with no activity but reportable when addon in printable show results state': function () {
        setPrintableShowResultsStateMode(this.presenter);

        var scaledScore = this.presenter.getPageScaledScore(0, 0, false, "mO681X");

        assertEquals(0, scaledScore);
        assertTrue(this.presenter.isPageVisited.calledOnce);
        assertTrue(this.printableController.isPreview.calledOnce);
    },

    'test visited page with no activity but reportable when addon in printable show results state': function () {
        setPrintableShowResultsStateMode(this.presenter);
        this.presenter.isPageVisited.returns(true);

        var scaledScore = this.presenter.getPageScaledScore(0, 0, false, "mO681X");

        assertEquals(1, scaledScore);
        assertTrue(this.presenter.isPageVisited.calledOnce);
        assertTrue(this.printableController.isPreview.calledOnce);
    },

    'test given empty chapter score when calling createInnerHTMLForScoreCell return unvisited page score label': function () {
        this.presenter.setPlayerController({
            getPresentation: () => {
                return {
                    getPageById: () => {
                    }
                }
            }
        });
        this.presenter.configuration = {
            excludeUnvisitedPages: false,
            labels: {unvisitedPageScore: "-"}
        };

        var result = this.presenter.createInnerHTMLForScoreCell({maxScore: 0, score: 0, scaledScore: 0}, "chapter");

        assertEquals("-", result);
    }


});

function setPrintableShowResultsStateMode(presenter) {
    presenter.printableStateMode = presenter.PRINTABLE_STATE_MODE.SHOW_RESULTS;
}

function setPrintableEmptyStateMode(presenter) {
    presenter.printableStateMode = presenter.PRINTABLE_STATE_MODE.EMPTY;
}