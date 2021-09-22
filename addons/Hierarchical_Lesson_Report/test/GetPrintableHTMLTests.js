TestCase("[Hierarchical Lesson Report] GetPrintableHTML - empty state", {
    setUp: function () {
        this.presenter = AddonHierarchical_Lesson_Report_create();
        this.model = generateModel();
        this.printableController = {
            isPreview: sinon.stub(),
            getContentInformation: sinon.stub(),
            getScore: sinon.stub()
        };

        this.printableController.isPreview.returns(false);
        this.printableController.getContentInformation.returns([]);
        this.printableController.getScore.returns({});
        this.presenter.setPrintableController(this.printableController);
    },

    'test getPrintableHTML use all columns': function () {
        const expectedHTML = generateExpectedHTMLForTestsSwitchingColumns();

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML use only results column': function () {
        updateModelToUseOnlyResultsColumn(this.model);

        const expectedHTML = generateExpectedHTMLForTestsSwitchingColumns(
          [], true, false, false,
          false, false, false);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML use only checks column': function () {
        updateModelToUseOnlyChecksColumn(this.model);

        const expectedHTML = generateExpectedHTMLForTestsSwitchingColumns(
          [], false, true, false,
          false, false, false);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML use only errors column': function () {
        updateModelToUseOnlyErrorsColumn(this.model);

        const expectedHTML = generateExpectedHTMLForTestsSwitchingColumns(
          [], false, false, false,
          true,false, false);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML use only mistakes column': function () {
        updateModelToUseOnlyMistakesColumn(this.model);

        const expectedHTML = generateExpectedHTMLForTestsSwitchingColumns(
          [], false, false, true,
          false,false, false);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML use only page score column': function () {
        updateModelToUseOnlyPageScoreColumn(this.model);

        const expectedHTML = generateExpectedHTMLForTestsSwitchingColumns(
          [], false, false, false,
          false,true, false);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML use only max page score column': function () {
        updateModelToUseOnlyMaxPageScoreColumn(this.model);

        const expectedHTML = generateExpectedHTMLForTestsSwitchingColumns(
          [], false, false, false,
          false,false, true);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML when not nested lessons': function () {
        updateGCIStubForTestWhenNotNestedLessons(this.printableController);

        const rows = [
          generateExpectedPageRowForEmptyState(0, null, "Page 1", false, 0),
          generateExpectedPageRowForEmptyState(1, null, "Page 2", true, 0),
          generateExpectedPageRowForEmptyState(2, null, "Page 3", false, 0)
        ]
        const expectedHTML = generateExpectedHTML(rows);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML when not nested chapters': function () {
        updateGCIStubForTestWhenNotNestedChapters(this.printableController);

        const rows = [
          generateExpectedChapterWithoutChildrenRow(0, null, "Chapter 1", 0),
          generateExpectedChapterWithoutChildrenRow(1, null, "Chapter 2", 0),
          generateExpectedChapterWithoutChildrenRow(2, null, "Chapter 3", 0)
        ]
        const expectedHTML = generateExpectedHTML(rows);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML when only nested chapters': function () {
        updateGCIStubForTestWhenOnlyNestedChapters(this.printableController);

        const rows = [
          generateExpectedChapterWithoutChildrenRow(0, null, "Chapter 1", 0),
          generateExpectedChapterWithoutChildrenRow(1, 0, "Chapter 2", 1),
          generateExpectedChapterWithoutChildrenRow(2, 1, "Chapter 3", 2)
        ]
        const expectedHTML = generateExpectedHTML(rows);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML when not nested lessons and chapters': function () {
        updateGCIStubForTestWhenNotNestedLessonsAndChapters(this.printableController);

        const rows = [
          generateExpectedPageRowForEmptyState(0, null, "Page 1", false, 0),
          generateExpectedChapterWithoutChildrenRow(1, null, "Chapter 1", 0),
          generateExpectedChapterWithoutChildrenRow(2, null, "Chapter 2", 0),
          generateExpectedPageRowForEmptyState(3, null, "Page 2", true, 0)
        ]
        const expectedHTML = generateExpectedHTML(rows);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML when lessons in chapter': function () {
        updateGCIStubForTestWithLessonsInChapter(this.printableController);

        const rows = [
          generateExpectedPageRowForEmptyState(0, null, "Page 1", false, 0),
          generateExpectedChapterRowForEmptyState(1, null, "Chapter 1", 0),
          generateExpectedPageRowForEmptyState(2, 1, "Page 1.1", false, 1),
          generateExpectedPageRowForEmptyState(3, 1, "Page 1.2", true, 1)
        ]
        const expectedHTML = generateExpectedHTML(rows);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML when lessons in chapters': function () {
        updateGCIStubForTestWithLessonsInChapters(this.printableController);

        const rows = [
          generateExpectedChapterRowForEmptyState(0, null, "Chapter 1", 0),
          generateExpectedPageRowForEmptyState(1, 0, "Page 1.1", true, 1),
          generateExpectedChapterRowForEmptyState(2, null, "Chapter 2", 0),
          generateExpectedPageRowForEmptyState(3, 2, "Page 2.1", true, 1)
        ]
        const expectedHTML = generateExpectedHTML(rows);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML when nested chapters': function () {
        updateGCIStubForTestWithNestedChapters(this.printableController);

        const rows = [
          generateExpectedPageRowForEmptyState(0, null, "Page 1", false, 0),
          generateExpectedChapterRowForEmptyState(1, null, "Chapter 1", 0),
          generateExpectedPageRowForEmptyState(2, 1, "Page 1.1", false, 1),
          generateExpectedChapterRowForEmptyState(3, 1, "Chapter 2", 1),
          generateExpectedPageRowForEmptyState(4, 3, "Page 2.1", false, 2),
          generateExpectedPageRowForEmptyState(5, 1, "Page 1.2", true, 1)
        ]
        const expectedHTML = generateExpectedHTML(rows);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML when not reportable and not nested lesson': function () {
        updateGCIStubForTestWithNotReportableAndNotNestedLesson(this.printableController);

        const rows = [
          generateExpectedChapterWithoutChildrenRow(0, null, "Chapter 1", 0),
          generateExpectedChapterWithoutChildrenRow(2, null, "Chapter 2", 0),
          generateExpectedPageRowForEmptyState(3, null, "Page 2", true, 0),
        ]
        const expectedHTML = generateExpectedHTML(rows);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML when not reportable and nested lesson': function () {
        updateGCIStubForTestWithNotReportableAndNestedLesson(this.printableController);

        const rows = [
          generateExpectedChapterRowForEmptyState(0, null, "Chapter 1", 0),
          generateExpectedPageRowForEmptyState(2, 0, "Page 1.2", false, 1),
          generateExpectedChapterWithoutChildrenRow(3, null, "Chapter 2", 0),
          generateExpectedPageRowForEmptyState(4, null, "Page 2", false, 0)
        ]
        const expectedHTML = generateExpectedHTML(rows);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML when not scored and not nested chapter': function () {
        updateGCIStubForTestWithNotScoredAndNotNestedChapter(this.printableController);
        this.model["scoredisabled"] = "1";

        const rows = [
          generateExpectedDisabledChapterRow(0, null, "Chapter 1", 0),
          generateExpectedPageRowForEmptyState(1,  0, "Page 1.1", true, 1),
          generateExpectedPageRowForEmptyState(2, 0, "Page 1.2", false, 1)
        ]
        const expectedHTML = generateExpectedHTML(rows);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML when not scored and not nested lesson': function () {
        updateGCIStubForTestWithNotScoredAndNotNestedLesson(this.printableController);
        this.model["scoredisabled"] = "4"

        const rows = [
          generateExpectedChapterRowForEmptyState(0, null, "Chapter 1", 0),
          generateExpectedPageRowForEmptyState(1,  0, "Page 1.1", true, 1),
          generateExpectedPageRowForEmptyState(2, null, "Page 2", false, 0),
          generateExpectedDisabledPageRow(3,  null, "Page 3", true, 0)
        ]
        const expectedHTML = generateExpectedHTML(rows);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },
});

TestCase("[Hierarchical Lesson Report] GetPrintableHTML - show results state", {
    setUp: function () {
        this.presenter = AddonHierarchical_Lesson_Report_create();
        this.model = generateModel();
        this.printableController = {
            isPreview: sinon.stub(),
            getContentInformation: sinon.stub(),
            getScore: sinon.stub()
        };

        this.printableController.isPreview.returns(false);
        this.printableController.getContentInformation.returns([]);
        this.printableController.getScore.returns(generatePrintableControllerScore());
        this.presenter.setPrintableController(this.printableController);
        this.presenter.printableState = generatePrintableState();
    },

    'test getPrintableHTML use all columns': function () {
        const expectedHTML = generateExpectedHTMLForTestsSwitchingColumns();

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML use only results column': function () {
        updateModelToUseOnlyResultsColumn(this.model);

        const expectedHTML = generateExpectedHTMLForTestsSwitchingColumns(
          [], true, false, false,
          false, false, false);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML use only checks column': function () {
        updateModelToUseOnlyChecksColumn(this.model);

        const expectedHTML = generateExpectedHTMLForTestsSwitchingColumns(
          [], false, true, false,
          false, false, false);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML use only errors column': function () {
        updateModelToUseOnlyErrorsColumn(this.model);

        const expectedHTML = generateExpectedHTMLForTestsSwitchingColumns(
          [], false, false, false,
          true,false, false);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML use only mistakes column': function () {
        updateModelToUseOnlyMistakesColumn(this.model);

        const expectedHTML = generateExpectedHTMLForTestsSwitchingColumns(
          [], false, false, true,
          false,false, false);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML use only page score column': function () {
        updateModelToUseOnlyPageScoreColumn(this.model);

        const expectedHTML = generateExpectedHTMLForTestsSwitchingColumns(
          [], false, false, false,
          false,true, false);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML use only max page score column': function () {
        updateModelToUseOnlyMaxPageScoreColumn(this.model);

        const expectedHTML = generateExpectedHTMLForTestsSwitchingColumns(
          [], false, false, false,
          false,false, true);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML when not nested lessons': function () {
        updateGCIStubForTestWhenNotNestedLessons(this.printableController);

        const rows = [
          generateExpectedPageRow(0, null, "Page 1", false, 0, "33%", 1, 1, 2, 1, 3),
          generateExpectedPageRow(1, null, "Page 2", true, 0, "40%", 0, 2, 3, 2, 5),
          generateExpectedPageRow(2, null, "Page 3", false, 0, "0%", 2, 3, 2, 0, 2)
        ]
        const expectedHTML = generateExpectedHTML(rows, "24%", 3, 6, 7, 3, 10);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML when not nested chapters': function () {
        updateGCIStubForTestWhenNotNestedChapters(this.printableController);

        const rows = [
          generateExpectedChapterWithoutChildrenRow(0, null, "Chapter 1", 0),
          generateExpectedChapterWithoutChildrenRow(1, null, "Chapter 2", 0),
          generateExpectedChapterWithoutChildrenRow(2, null, "Chapter 3", 0)
        ]
        const expectedHTML = generateExpectedHTML(rows);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML when only nested chapters': function () {
        updateGCIStubForTestWhenOnlyNestedChapters(this.printableController);

        const rows = [
          generateExpectedChapterWithoutChildrenRow(0, null, "Chapter 1", 0),
          generateExpectedChapterWithoutChildrenRow(1, 0, "Chapter 2", 1),
          generateExpectedChapterWithoutChildrenRow(2, 1, "Chapter 3", 2)
        ]
        const expectedHTML = generateExpectedHTML(rows);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML when not nested lessons and chapters': function () {
        updateGCIStubForTestWhenNotNestedLessonsAndChapters(this.printableController);

        const rows = [
          generateExpectedPageRow(0, null, "Page 1", false, 0, "33%", 1, 1, 2, 1, 3),
          generateExpectedChapterWithoutChildrenRow(1, null, "Chapter 1", 0),
          generateExpectedChapterWithoutChildrenRow(2, null, "Chapter 2", 0),
          generateExpectedPageRow(3, null, "Page 2", true, 0, "50%", 0, 4, 1, 1, 2)
        ]
        const expectedHTML = generateExpectedHTML(rows, "41%", 1, 5, 3, 2, 5);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML when lessons in chapter': function () {
        updateGCIStubForTestWithLessonsInChapter(this.printableController);

        const rows = [
          generateExpectedPageRow(0, null, "Page 1", false, 0, "33%", 1, 1, 2, 1, 3),
          generateExpectedChapterRow(1, null, "Chapter 1", 0, "25%", 2, 7, 3, 1, 4),
          generateExpectedPageRow(2, 1, "Page 1.1", false, 1, "0%", 2, 3, 2, 0, 2),
          generateExpectedPageRow(3, 1, "Page 1.2", true, 1, "50%", 0, 4, 1, 1, 2)
        ]
        const expectedHTML = generateExpectedHTML(rows, "27%", 3, 8, 5, 2, 7);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML when lessons in chapters': function () {
        updateGCIStubForTestWithLessonsInChapters(this.printableController);

        const rows = [
          generateExpectedChapterRow(0, null, "Chapter 1", 0, "40%", 0, 2, 3, 2, 5),
          generateExpectedPageRow(1, 0, "Page 1.1", true, 1, "40%", 0, 2, 3, 2, 5),
          generateExpectedChapterRow(2, null, "Chapter 2", 0, "50%", 0, 4, 1, 1, 2),
          generateExpectedPageRow(3, 2, "Page 2.1", true, 1, "50%", 0, 4, 1, 1, 2)
        ]
        const expectedHTML = generateExpectedHTML(rows, "45%", 0, 6, 4, 3, 7);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML when nested chapters': function () {
        updateGCIStubForTestWithNestedChapters(this.printableController);

        const rows = [
          generateExpectedPageRow(0, null, "Page 1", false, 0, "33%", 1, 1, 2, 1, 3),
          generateExpectedChapterRow(1, null, "Chapter 1", 0, "25%", 5, 14, 6, 3, 9),
          generateExpectedPageRow(2, 1, "Page 1.1", false, 1, "0%", 2, 3, 2, 0, 2),
          generateExpectedChapterRow(3, 1, "Chapter 2", 1, "0%", 3, 5, 3, 0, 3),
          generateExpectedPageRow(4, 3, "Page 2.1", false, 2, "0%", 3, 5, 3, 0, 3),
          generateExpectedPageRow(5, 1, "Page 1.2", true, 1, "75%", 0, 6, 1, 3, 4)
        ]
        const expectedHTML = generateExpectedHTML(rows, "27%", 6, 15, 8, 4, 12);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML when not reportable and not nested lesson': function () {
        updateGCIStubForTestWithNotReportableAndNotNestedLesson(this.printableController);

        const rows = [
          generateExpectedChapterWithoutChildrenRow(0, null, "Chapter 1", 0),
          generateExpectedChapterWithoutChildrenRow(2, null, "Chapter 2", 0),
          generateExpectedPageRow(3, null, "Page 2", true, 0, "50%", 0, 4, 1, 1, 2),
        ]
        const expectedHTML = generateExpectedHTML(rows, "50%", 0, 4, 1, 1, 2);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML when not reportable and nested lesson': function () {
        updateGCIStubForTestWithNotReportableAndNestedLesson(this.printableController);

        const rows = [
          generateExpectedChapterRow(0, null, "Chapter 1", 0, "0%", 2, 3, 2, 0, 2),
          generateExpectedPageRow(2, 0, "Page 1.2", false, 1, "0%", 2, 3, 2, 0, 2),
          generateExpectedChapterWithoutChildrenRow(3, null, "Chapter 2", 0),
          generateExpectedPageRow(4, null, "Page 2", false, 0, "0%", 3, 5, 3, 0, 3)
        ]
        const expectedHTML = generateExpectedHTML(rows, "0%", 5, 8, 5, 0, 5);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML when not scored and not nested chapter': function () {
        updateGCIStubForTestWithNotScoredAndNotNestedChapter(this.printableController);
        this.model["scoredisabled"] = "1";

        const rows = [
          generateExpectedDisabledChapterRow(0, null, "Chapter 1", 0),
          generateExpectedPageRow(1,  0, "Page 1.1", true, 1, "40%", 0, 2, 3, 2, 5),
          generateExpectedPageRow(2, 0, "Page 1.2", false, 1, "0%", 2, 3, 2, 0, 2)
        ]
        const expectedHTML = generateExpectedHTML(rows, "20%", 2, 5, 5, 2, 7);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },

    'test getPrintableHTML when not scored and not nested lesson': function () {
        updateGCIStubForTestWithNotScoredAndNotNestedLesson(this.printableController);
        this.model["scoredisabled"] = "4";

        const rows = [
          generateExpectedChapterRow(0, null, "Chapter 1", 0, "40%", 0, 2, 3, 2, 5),
          generateExpectedPageRow(1,  0, "Page 1.1", true, 1, "40%", 0, 2, 3, 2, 5),
          generateExpectedPageRow(2,  null, "Page 2", false, 0, "0%", 2, 3, 2, 0, 2),
          generateExpectedDisabledPageRow(3, null, "Page 3", true, 0)
        ]
        const expectedHTML = generateExpectedHTML(rows, "20%", 2, 5, 5, 2, 7);

        this.printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertEquals(expectedHTML, this.printableHTML);
        assertTrue(isResetPrintableStateMode(this.presenter));
    },
});

function generateModel() {
    return {
        "ID": "Hierarchical_Lesson_Report1",
        "Is Visible": "True",
        "Is Tabindex Enabled": "False",
        "titleLabel": "Custom lesson report label",
        "results": "True",
        "resultsLabel": "Custom results label",
        "checks": "True",
        "checksLabel": "Custom checks label",
        "errors": "True",
        "errorsLabel": "Custom errors label",
        "mistakes": "True",
        "mistakesLabel": "Custom mistakes label",
        "total": "True",
        "totalLabel": "Custom total label",
        "expandDepth": "2",
        "classes": "",
        "showpagescore": "True",
        "pageScoresLabel": "Custom score label",
        "showmaxscorefield": "True",
        "maxScoreAwardLabel": "Custom max score award label",
        "unvisitedPageScoresLabel": "-",
        "scoredisabled": "",
        "enablePages": "",
        "alternativePageTitles": [{
                "alternativePageIsChapter": "False",
                "alternativePageName": "",
                "alternativePageNumber": "1",
            },
        ],
    }
}

function generatePrintableState() {
    // treeState - is chapter/page extended
    return {
        "treeState": [
            false,
            false,
            false,
            false,
            false,
            false,
        ],
        "isVisible": true
    }
}

function isResetPrintableStateMode(presenter) {
    return presenter.printableStateMode === null;
}

function updateModelToUseOnlyResultsColumn(model) {
    updateModelLabelAttribute(model, "results", true);
    updateModelLabelAttribute(model, "checks", false);
    updateModelLabelAttribute(model, "errors", false);
    updateModelLabelAttribute(model, "mistakes", false);
    updateModelLabelAttribute(model, "showpagescore", false);
    updateModelLabelAttribute(model, "showmaxscorefield", false);
}

function updateModelToUseOnlyChecksColumn(model) {
    updateModelLabelAttribute(model, "results", false);
    updateModelLabelAttribute(model, "checks", true);
    updateModelLabelAttribute(model, "errors", false);
    updateModelLabelAttribute(model, "mistakes", false);
    updateModelLabelAttribute(model, "showpagescore", false);
    updateModelLabelAttribute(model, "showmaxscorefield", false);
}

function updateModelToUseOnlyErrorsColumn(model) {
    updateModelLabelAttribute(model, "results", false);
    updateModelLabelAttribute(model, "checks", false);
    updateModelLabelAttribute(model, "errors", true);
    updateModelLabelAttribute(model, "mistakes", false);
    updateModelLabelAttribute(model, "showpagescore", false);
    updateModelLabelAttribute(model, "showmaxscorefield", false);
}

function updateModelToUseOnlyMistakesColumn(model) {
    updateModelLabelAttribute(model, "results", false);
    updateModelLabelAttribute(model, "checks", false);
    updateModelLabelAttribute(model, "errors", false);
    updateModelLabelAttribute(model, "mistakes", true);
    updateModelLabelAttribute(model, "showpagescore", false);
    updateModelLabelAttribute(model, "showmaxscorefield", false);
}

function updateModelToUseOnlyPageScoreColumn(model) {
    updateModelLabelAttribute(model, "results", false);
    updateModelLabelAttribute(model, "checks", false);
    updateModelLabelAttribute(model, "errors", false);
    updateModelLabelAttribute(model, "mistakes", false);
    updateModelLabelAttribute(model, "showpagescore", true);
    updateModelLabelAttribute(model, "showmaxscorefield", false);
}

function updateModelToUseOnlyMaxPageScoreColumn(model) {
    updateModelLabelAttribute(model, "results", false);
    updateModelLabelAttribute(model, "checks", false);
    updateModelLabelAttribute(model, "errors", false);
    updateModelLabelAttribute(model, "mistakes", false);
    updateModelLabelAttribute(model, "showpagescore", false);
    updateModelLabelAttribute(model, "showmaxscorefield", true);
}

function updateModelLabelAttribute(model, labelAttribute, isOn) {
    model[labelAttribute] = isOn ? "True" : "False";
}

function updateGCIStubForTestWhenNotNestedLessons(printableController) {
    printableController.getContentInformation.returns([
        generatePageForContentInformation("0", null, "Page 1"),
        generatePageForContentInformation("1", null, "Page 2"),
        generatePageForContentInformation("2", null, "Page 3"),
    ]);
}

function updateGCIStubForTestWhenNotNestedChapters(printableController) {
    printableController.getContentInformation.returns([
        generateChapterForContentInformation("0", null, "Chapter 1"),
        generateChapterForContentInformation("1", null, "Chapter 2"),
        generateChapterForContentInformation("2", null, "Chapter 3"),
    ]);
}

function updateGCIStubForTestWhenOnlyNestedChapters(printableController) {
    printableController.getContentInformation.returns([
        generateChapterForContentInformation("0", null, "Chapter 1"),
        generateChapterForContentInformation("1", "0", "Chapter 2"),
        generateChapterForContentInformation("2", "1", "Chapter 3"),
    ]);
}

function updateGCIStubForTestWhenNotNestedLessonsAndChapters(printableController) {
    printableController.getContentInformation.returns([
        generatePageForContentInformation("0", null, "Page 1"),
        generateChapterForContentInformation("1", null, "Chapter 1"),
        generateChapterForContentInformation("2", null, "Chapter 2"),
        generatePageForContentInformation("3", null, "Page 2"),
    ]);
}

function updateGCIStubForTestWithLessonsInChapter(printableController) {
    printableController.getContentInformation.returns([
        generatePageForContentInformation("0", null, "Page 1"),
        generateChapterForContentInformation("1", null, "Chapter 1"),
        generatePageForContentInformation("2", "1", "Page 1.1"),
        generatePageForContentInformation("3", "1", "Page 1.2"),
    ]);
}

function updateGCIStubForTestWithLessonsInChapters(printableController) {
    printableController.getContentInformation.returns([
        generateChapterForContentInformation("0", null, "Chapter 1"),
        generatePageForContentInformation("1", "0", "Page 1.1"),
        generateChapterForContentInformation("2", null, "Chapter 2"),
        generatePageForContentInformation("3", "2", "Page 2.1"),
    ]);
}

function updateGCIStubForTestWithNestedChapters(printableController) {
    printableController.getContentInformation.returns([
        generatePageForContentInformation("0", null, "Page 1"),
        generateChapterForContentInformation("1", null, "Chapter 1"),
        generatePageForContentInformation("2", "1", "Page 1.1"),
        generateChapterForContentInformation("3", "1", "Chapter 2"),
        generatePageForContentInformation("4", "3", "Page 2.1"),
        generatePageForContentInformation("5", "1", "Page 1.2"),
    ]);
}

function updateGCIStubForTestWithNotReportableAndNotNestedLesson(printableController) {
    printableController.getContentInformation.returns([
        generateChapterForContentInformation("0", null, "Chapter 1"),
        generatePageForContentInformation("1", null, "Page 1", false),
        generateChapterForContentInformation("2", null, "Chapter 2"),
        generatePageForContentInformation("3", null, "Page 2"),
    ]);
}

function updateGCIStubForTestWithNotReportableAndNestedLesson(printableController) {
    printableController.getContentInformation.returns([
        generateChapterForContentInformation("0", null, "Chapter 1"),
        generatePageForContentInformation("1", "0", "Page 1.1", false),
        generatePageForContentInformation("2", "0", "Page 1.2"),
        generateChapterForContentInformation("3", null, "Chapter 2"),
        generatePageForContentInformation("4", null, "Page 2"),
    ]);
}

function updateGCIStubForTestWithNotScoredAndNotNestedChapter(printableController) {
    printableController.getContentInformation.returns([
        generateChapterForContentInformation("0", null, "Chapter 1"),
        generatePageForContentInformation("1", "0", "Page 1.1"),
        generatePageForContentInformation("2", "0", "Page 1.2"),
    ]);
}

function updateGCIStubForTestWithNotScoredAndNotNestedLesson(printableController) {
    printableController.getContentInformation.returns([
        generateChapterForContentInformation("0", null, "Chapter 1"),
        generatePageForContentInformation("1", "0", "Page 1.1"),
        generatePageForContentInformation("2", null, "Page 2"),
        generatePageForContentInformation("3", null, "Page 3"),
    ]);
}


function generateChapterForContentInformation(id, parentId, name) {
    return generateObjectForContentInformation(id, parentId, name, "chapter");
}

function generatePageForContentInformation(id, parentId, name, isReportable = true, isVisited = true) {
    return generateObjectForContentInformation(id, parentId, name, "page", isReportable, isVisited);
}

function generateObjectForContentInformation(id, parentId, name, type, isReportable = true, isVisited = true) {
    return {
        "id": id,
        "parentId": parentId,
        "name": name,
        "isReportable": isReportable ? "true" :  "false",
        "isVisited": isVisited ? "true" :  "false",
        "type": type
    }
}

function generateExpectedHTMLForTestsSwitchingColumns(
        rows = [],
        hasResultsColumn = true, hasChecksColumn = true,
        hasMistakesColumn = true, hasErrorsColumn = true,
        hasPageScoreColumn = true, hasPageMaxScoreColumn = true) {
    return generateExpectedHTML(
      rows, "0%", "0", "0",
      "0", "0", "0",
      hasResultsColumn, hasChecksColumn, hasMistakesColumn,
      hasErrorsColumn, hasPageScoreColumn, hasPageMaxScoreColumn
    )
}

function generateExpectedHTML(
        rows = [],
        resultFooterCellValue = "0%", checksFooterCellValue = "0",
        mistakesCellFooterValue = "0", errorsFooterCellValue = "0",
        pageScoreCellFooterValue = "0", maxPageScoreFooterCellValue = "0",
        hasResultsColumn = true, hasChecksColumn = true,
        hasMistakesColumn = true, hasErrorsColumn = true,
        hasPageScoreColumn = true, hasPageMaxScoreColumn = true) {

    let $mainDiv = $(`<div></div>`);
    $mainDiv.attr("id", "Hierarchical_Lesson_Report1");
    $mainDiv.addClass("printable_addon_Hierarchical_Lesson_Report");

    let $printableReport = $(`<div></div>`);
    $printableReport.addClass("printable_hier_report");
    $printableReport.appendTo($mainDiv);

    let $table = $(`<table></table>`);
    $table.addClass("printable_hier_report-table");
    $table.appendTo($printableReport);

    let $tbody = $(`<tbody></tbody>`);
    $tbody.appendTo($table);

    let $header = generateExpectedTableHeader(
      hasResultsColumn, hasChecksColumn, hasMistakesColumn,
      hasErrorsColumn, hasPageScoreColumn, hasPageMaxScoreColumn);
    $header.appendTo($tbody);

    for (const $row of rows) {
        $row.appendTo($tbody);
    }

    let $footer = generateExpectedTableFooter(
      resultFooterCellValue, checksFooterCellValue, mistakesCellFooterValue,
      errorsFooterCellValue, pageScoreCellFooterValue, maxPageScoreFooterCellValue,
      hasResultsColumn, hasChecksColumn, hasMistakesColumn,
      hasErrorsColumn, hasPageScoreColumn, hasPageMaxScoreColumn);
    $footer.appendTo($tbody);

    return $mainDiv[0].outerHTML;
}

function generateExpectedTableHeader(
        hasResultsColumn = true, hasChecksColumn = true,
        hasMistakesColumn = true, hasErrorsColumn = true,
        hasPageScoreColumn = true, hasPageMaxScoreColumn = true) {
    let $header = generateHeaderRow();

    addHeaderTitleCell($header);
    if (hasResultsColumn) addHeaderProgressCell($header);
    if (hasChecksColumn) addChecksCell($header, "Custom checks label");
    if (hasMistakesColumn) addMistakesCell($header, "Custom mistakes label");
    if (hasErrorsColumn) addErrorsCell($header, "Custom errors label");
    if (hasPageScoreColumn) addHeaderPageScoreCell($header);
    if (hasPageMaxScoreColumn) addHeaderPageMaxScoreCell($header);

    return $header;
}

function generateExpectedTableFooter(
        resultCellValue = "0%", checksCellValue = "0",
        mistakesCellValue = "0", errorsCellValue = "0",
        pageScoreCellValue = "0", maxPageScoreCellValue = "0",
        hasResultsColumn = true, hasChecksColumn = true,
        hasMistakesColumn = true, hasErrorsColumn = true,
        hasPageScoreColumn = true, hasPageMaxScoreColumn = true) {
    let $footer = generateFooterRow();

    addFooterTitleCell($footer);
    if (hasResultsColumn) addProgressCell($footer, resultCellValue);
    if (hasChecksColumn) addChecksCell($footer, checksCellValue);
    if (hasMistakesColumn) addMistakesCell($footer, mistakesCellValue);
    if (hasErrorsColumn) addErrorsCell($footer, errorsCellValue);
    if (hasPageScoreColumn) addPageScoreCell($footer, pageScoreCellValue, maxPageScoreCellValue);
    if (hasPageMaxScoreColumn) addPageMaxScoreCell($footer);

    return $footer;
}

function generateExpectedDisabledChapterRow(
        index, parentIndex, title, isOdd, indentsAmount) {
    return generateExpectedDisabledTableRow(
      index, parentIndex, true, isOdd, title, indentsAmount)
}

function generateExpectedDisabledPageRow(
        index, parentIndex, title, isOdd, indentsAmount) {
    return generateExpectedDisabledTableRow(
      index, parentIndex, false, isOdd, title, indentsAmount)
}

function generateExpectedDisabledTableRow(
        index, parentIndex, isChapter, isOdd, titleCellValue, indentsAmount) {
    let $row = generateTableRow(index, parentIndex, isChapter, isOdd);

    addTitleCell($row, titleCellValue, indentsAmount);
    addDisabledCells($row)

    return $row;
}

function generateExpectedChapterWithoutChildrenRow(
        index, parentIndex, title, indentsAmount) {
    return generateExpectedChapterRow(
      index, parentIndex, title, indentsAmount,
      "-", "-", "-",
      "-", "-", undefined);
}

function generateExpectedChapterRowForEmptyState(
        index, parentIndex, title, indentsAmount) {
    return generateExpectedChapterRow(
      index, parentIndex, title, indentsAmount,
      "0%", "0", "0",
      "0", "-", undefined);
}

function generateExpectedChapterRow(
        index, parentIndex, title, indentsAmount,
        progressCellValue, checksCellValue, mistakesCellValue,
        errorsCellValue, pageScoreCellValue, pageMaxScoreCellValue) {
    return generateExpectedTableRow(
      index, parentIndex, true, false, title, indentsAmount,
      progressCellValue, checksCellValue, mistakesCellValue,
      errorsCellValue, pageScoreCellValue, pageMaxScoreCellValue);
}

function generateExpectedPageRowForEmptyState(
        index, parentIndex, title, isOdd, indentsAmount) {
    return generateExpectedPageRow(
      index, parentIndex, title, isOdd, indentsAmount,
      "0%", "0", "0",
      "0", "-", undefined);
}

function generateExpectedPageRow(
        index, parentIndex, title, isOdd, indentsAmount,
        progressCellValue, checksCellValue, mistakesCellValue,
        errorsCellValue, pageScoreCellValue, pageMaxScoreCellValue) {
    return generateExpectedTableRow(
      index, parentIndex, false, isOdd, title, indentsAmount,
      progressCellValue, checksCellValue, mistakesCellValue,
      errorsCellValue, pageScoreCellValue, pageMaxScoreCellValue);
}

function generateExpectedTableRow(
        index, parentIndex, isChapter, isOdd, titleCellValue, indentsAmount,
        progressCellValue, checksCellValue, mistakesCellValue,
        errorsCellValue, pageScoreCellValue, pageMaxScoreCellValue) {
    let $row = generateTableRow(index, parentIndex, isChapter, isOdd);

    addTitleCell($row, titleCellValue, indentsAmount);
    addProgressCell($row, progressCellValue);
    addChecksCell($row, checksCellValue);
    addMistakesCell($row, mistakesCellValue);
    addErrorsCell($row, errorsCellValue);
    addPageScoreCell($row, pageScoreCellValue, pageMaxScoreCellValue);
    addPageNonMaxScoreCell($row);

    return $row;
}

function generateTableRow(index, parentIndex, isChapter, isOdd) {
    let $row = $("<tr></tr>");
    $row.addClass("printable_hier_report-node-" + index);
    if (parentIndex !== undefined && parentIndex !== null)
        $row.addClass("printable_hier_report-parent-" + parentIndex);
    if (isChapter)
        $row.addClass("printable_hier_report-chapter");
    else {
        isOdd
          ? $row.addClass("printable_hier_report-odd")
          : $row.addClass("printable_hier_report-even");
    }
    return $row;
}

function addTitleCell($row, value, indentsAmount = 0) {
    let $cell = $("<td></td>");
    $cell.appendTo($row);

    addIndentsToCell($cell, indentsAmount);

    let $textWrapper = $("<div></div>");
    $textWrapper.addClass("text-wrapper");
    $textWrapper.html(value);
    $textWrapper.appendTo($cell);
}

function addIndentsToCell($cell, amount) {
    for (let i = 0; i < amount; i++) {
        let $indent = $("<span></span>");
        $indent.addClass("printable_hier_report-indent");
        $indent.appendTo($cell);
    }
}

function generateHeaderRow() {
    let $row = $(`<tr></tr>`);
    $row.addClass("printable_hier_report-header");
    return $row;
}

function generateFooterRow() {
    let $row = $(`<tr></tr>`);
    $row.addClass("printable_hier_report-footer");
    return $row;
}

function addHeaderTitleCell($row) {
    addCell($row, "printable_hier_report-header-title", "Custom lesson report label");
}

function addFooterTitleCell($row) {
    addCell($row, "printable_hier_report-footer-title", "Custom total label");
}

function addHeaderProgressCell($row) {
    addCell($row, "printable_hier_report-header-progress", "Custom results label");
}

function addProgressCell($row, value) {
    addCell($row, "printable_hier_report-progress", value);
}

function addChecksCell($row, value) {
    addCell($row, "printable_hier_report-checks", value);
}

function addMistakesCell($row, value) {
    addCell($row, "printable_hier_report-mistakes", value);
}

function addErrorsCell($row, value) {
    addCell($row, "printable_hier_report-errors", value);
}

function addHeaderPageScoreCell($row) {
    addPageScoreCellWrapper($row, "Custom score label");
}

function addHeaderPageMaxScoreCell($row) {
    addCell($row, "printable_hier_report-page-max-score", "Custom max score award label");
}

function addPageScoreCell($row, score, maxScore) {

    if (score !== undefined && maxScore !== undefined) {
        let $separator = $(`<span></span>`);
        $separator.addClass("printable_hier_report-separator");
        $separator.html("/");

        addPageScoreCellWrapper($row, score + $separator[0].outerHTML + maxScore);
    } else {
        addPageScoreCellWrapper($row, "-");
    }
}

function addPageScoreCellWrapper($row, value) {
    addCell($row, "printable_hier_report-page-score", value);
}

function addPageMaxScoreCell($row) {
    let $cell = $(`<td></td>`);
    $cell.appendTo($row);
}

function addPageNonMaxScoreCell($row) {
    addCell($row, "printable_hier_report-page-non-max-score", '');
}

function addCell($row, className, value) {
    let $cell = $("<td></td>");
    $cell.addClass(className);
    $cell.html(value);
    $cell.appendTo($row);
}

function addDisabledCells($row) {
    let $cell = $("<td></td>");
    $cell.attr("colspan", 6);
    $cell.addClass("printable_hier_report-score-disabled-row");
    $cell.appendTo($row);
}

function generatePrintableControllerScore() {
    return {
        "0": generatePageScore(1, 3, 1, 2, 1),
        "1": generatePageScore(2, 5, 0, 3, 2),
        "2": generatePageScore(0, 2, 2, 2, 3),
        "3": generatePageScore(1, 2, 0, 1, 4),
        "4": generatePageScore(0, 3, 3, 3, 5),
        "5": generatePageScore(3, 4, 0, 1, 6),
    }
}

function generatePageScore(score, maxScore, checkCount, errorCount, mistakeCount) {
    return {
        "score": score,
        "maxScore": maxScore,
        "checkCount": checkCount,
        "errorCount": errorCount,
        "mistakeCount": mistakeCount
    }
}
