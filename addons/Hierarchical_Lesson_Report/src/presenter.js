function AddonHierarchical_Lesson_Report_create() {
    var presenter = function () {};
    var presentationController;
    var printableController;
    var isWCAGOn = false;

    // Indexes used during tree building
    var relativeIndex = 0;            // Current chapter index + current reportable page index
    var absoluteIndex = 0;            // Current chapter index + current page index
    var chapterIndex = 0;             // current chapter index
    var pageIndex = 0;                // current page index

    var currentRow = 1;
    var currentColumn = 0;

    presenter.printableState = null;
    presenter.printableStateMode = null;
    presenter.userVisitedPages = [];
    presenter.totalScore = 0; // only for ExcludedUnvisitedPagesInTotal
    presenter.printableTotalScore = 0; // only for ExcludedUnvisitedPagesInTotal

    var CSS_CLASSES = {
        SELECTED_CELL: "keyboard_navigation_active_element",
        TEXT_WRAPPER: "text-wrapper",
        HIER_REPORT: "hier_report",
        HIER_REPORT_HEADER: "hier_report-header",
        HIER_REPORT_FOOTER: "hier_report-footer",
        HIER_REPORT_CHAPTER: "hier_report-chapter",
        HIER_REPORT_SEPARATOR: "hier_report-separator",
        HIER_REPORT_PROGRESSBAR: "hier_report-progressbar",
        HIER_REPORT_ODD: "hier_report-odd",
        HIER_REPORT_EVEN: "hier_report-even",
        HIER_REPORT_PROGRESS: "hier_report-progress",
        HIER_REPORT_CHECKS: "hier_report-checks",
        HIER_REPORT_MISTAKES: "hier_report-mistakes",
        HIER_REPORT_ERRORS: "hier_report-errors",
        HIER_REPORT_PAGE_SCORE: "hier_report-page-score",
        HIER_REPORT_PAGE_MAX_SCORE: "hier_report-page-max-score",
        HIER_REPORT_PAGE_NON_MAX_SCORE: "hier_report-page-non-max-score",
        HIER_REPORT_SCORE_DISABLED_ROW: "hier_report-score-disabled-row",
        PRINTABLE: "printable_addon_Hierarchical_Lesson_Report",
        PRINTABLE_HIER_REPORT: "printable_hier_report",
        PRINTABLE_HIER_REPORT_TABLE: "printable_hier_report-table",
        PRINTABLE_HIER_REPORT_PARENT: "printable_hier_report-parent",
        PRINTABLE_HIER_REPORT_NODE: "printable_hier_report-node",
        PRINTABLE_HIER_REPORT_CHAPTER: "printable_hier_report-chapter",
        PRINTABLE_HIER_REPORT_SEPARATOR: "printable_hier_report-separator",
        PRINTABLE_HIER_REPORT_ODD: "printable_hier_report-odd",
        PRINTABLE_HIER_REPORT_EVEN: "printable_hier_report-even",
        PRINTABLE_HIER_REPORT_HEADER: "printable_hier_report-header",
        PRINTABLE_HIER_REPORT_PROGRESS_HEADER: "printable_hier_report-header-progress",
        PRINTABLE_HIER_REPORT_FOOTER: "printable_hier_report-footer",
        PRINTABLE_HIER_REPORT_PROGRESS: "printable_hier_report-progress",
        PRINTABLE_HIER_REPORT_CHECKS: "printable_hier_report-checks",
        PRINTABLE_HIER_REPORT_MISTAKES: "printable_hier_report-mistakes",
        PRINTABLE_HIER_REPORT_ERRORS: "printable_hier_report-errors",
        PRINTABLE_HIER_REPORT_PAGE_SCORE: "printable_hier_report-page-score",
        PRINTABLE_HIER_REPORT_PAGE_MAX_SCORE: "printable_hier_report-page-max-score",
        PRINTABLE_HIER_REPORT_PAGE_NON_MAX_SCORE: "printable_hier_report-page-non-max-score",
        PRINTABLE_HIER_REPORT_SCORE_DISABLED_ROW: "printable_hier_report-score-disabled-row",
        PRINTABLE_HIER_REPORT_INDENT: "printable_hier_report-indent",
    };

    function getTextVoiceObject (text, lang) {return {text: text, lang: lang};}

    presenter.ERROR_MESSAGES = {
        EXPAND_DEPTH_NOT_NUMERIC: "Depth of expand is not proper",

        C01: "Wrong classes name format",
        C02: "Class names has to be separated by new line",

        D01: "Values in Disable score on pages property should be numeric and non empty",
        D02: "Values in Disable score on pages property should be greater than 0",
        D03: "Values in Disable score on pages property should be unique",

        P01: "Values in Disable pages property should be numeric and non empty",
        P02: "Values in Disable pages property should be greater than 0",
        P03: "Values in Disable pages property should be unique",

        A01: "There should be at least one item in Alternative Page Names property",
        A02: "Values in Alternative Page Number property should be greater than 0"
    };

    function returnErrorObject(ec) { return { isValid: false, errorCode: ec }; }

    function returnCorrectObject(v) { return { isValid: true, value: v }; }

    presenter.showErrorMessage = function (message, substitutions) {
        var errorContainer;
        if (typeof(substitutions) == 'undefined') {
            errorContainer = '<p>' + message + '</p>';
        } else {
            var messageSubst = message;
            for (var key in substitutions) {
                if (substitutions.hasOwnProperty(key)) {
                    messageSubst = messageSubst.replace('%' + key + '%', substitutions[key]);
                }
            }
            errorContainer = '<p>' + messageSubst + '</p>';
        }
        presenter.$view.html(errorContainer);
    };

    presenter.setPlayerController = function (controller) {
        presentationController = controller;
    };

    /**
     * @param controller (PrintableController)
     */
    presenter.setPrintableController = function (controller) {
        printableController = controller;
    };

    presenter.run = function (view, model) {
        presenter.initialize(view, model, false);
    };

    presenter.createPreview = function (view, model) {
        presenter.initialize(view, model, true);
    };

    function addHeader(configuration, $view) {
        var labels = configuration.labels;
        var $row = generateHeaderRow();

        addTitleCell($row, labels.title);
        if (configuration.showResults) {
            addResultsHeaderCell($row, labels.results);
        }
        if (configuration.showChecks) {
            addChecksCell($row, labels.checks);
        }
        if (configuration.showMistakes) {
            addMistakesCell($row, labels.mistakes);
        }
        if (configuration.showErrors) {
            addErrorsCell($row, labels.errors);
        }
        if (configuration.showPageScore) {
            addPageScoreCell($row, labels.pageScores);
        }
        if (configuration.showMaxScoreField) {
            addMaxScoreAwardCell($row, labels.maxScoreAward);
        }

        $row.prependTo($view);
    }

    function addFooter(configuration, $view) {
        var lessonScore = getLessonScore();
        var $row = generateFooterRow();

        addTitleCell($row, configuration.labels.total);
        if (configuration.showResults) {
            addResultsFooterCell($row);
        }
        if (configuration.showChecks) {
            addChecksCell($row, lessonScore.checkCount);
        }
        if (configuration.showMistakes) {
            addMistakesCell($row, lessonScore.mistakeCount);
        }
        if (configuration.showErrors) {
            addErrorsCell($row, lessonScore.errorCount);
        }
        if (configuration.showPageScore) {
            addPageScoreFooterCell($row, lessonScore);
        }
        if (configuration.showMaxScoreField) {
            addMaxScoreAwardCell($row, undefined);
        }

        $row.appendTo($view);
    }

    function generateHeaderRow() {
        const className = isInPrintableStateMode()
            ? CSS_CLASSES.PRINTABLE_HIER_REPORT_HEADER
            : CSS_CLASSES.HIER_REPORT_HEADER;
        return generateRow(className);
    }

    function generateFooterRow() {
        const className = isInPrintableStateMode()
            ? CSS_CLASSES.PRINTABLE_HIER_REPORT_FOOTER
            : CSS_CLASSES.HIER_REPORT_FOOTER;
        return generateRow(className);
    }

    function generateRow(className) {
        var $row = $(document.createElement('tr'));
        $row.addClass(className);
        return $row;
    }

    function addTitleCell($row, title) {
        addCell($row, title);
    }

    function addResultsHeaderCell($row, header) {
        const className = isInPrintableStateMode()
            ? CSS_CLASSES.PRINTABLE_HIER_REPORT_PROGRESS_HEADER
            : CSS_CLASSES.HIER_REPORT_PROGRESS;
        addCell($row, header, className);
    }

    function addChecksCell($row, checks) {
        const className = isInPrintableStateMode()
            ? CSS_CLASSES.PRINTABLE_HIER_REPORT_CHECKS
            : CSS_CLASSES.HIER_REPORT_CHECKS;
        addCell($row, checks, className);
    }

    function addMistakesCell($row, mistakes) {
        const className = isInPrintableStateMode()
            ? CSS_CLASSES.PRINTABLE_HIER_REPORT_MISTAKES
            : CSS_CLASSES.HIER_REPORT_MISTAKES;
        addCell($row, mistakes, className);
    }

    function addErrorsCell($row, errors) {
        const className = isInPrintableStateMode()
            ? CSS_CLASSES.PRINTABLE_HIER_REPORT_ERRORS
            : CSS_CLASSES.HIER_REPORT_ERRORS;
        addCell($row, errors, className);
    }

    function addPageScoreCell($row, pageScore) {
        const className = isInPrintableStateMode()
            ? CSS_CLASSES.PRINTABLE_HIER_REPORT_PAGE_SCORE
            : CSS_CLASSES.HIER_REPORT_PAGE_SCORE;
        addCell($row, pageScore, className);
    }

    function addMaxScoreAwardCell($row, maxScoreAward) {
        const className = maxScoreAward
            ? (isInPrintableStateMode()
                ? CSS_CLASSES.PRINTABLE_HIER_REPORT_PAGE_MAX_SCORE
                : CSS_CLASSES.HIER_REPORT_PAGE_MAX_SCORE)
            : undefined;
        addCell($row, maxScoreAward, className);
    }

    function addNameCell($row, node) {
        let $nameCell = generateTextWrapper(node.getName(), node.isChapter(), node.getId());
        $nameCell.appendTo($row);
    }

    function generateTextWrapper(text, isChapter, pageId) {
        var $textWrapper = $(document.createElement('div'));
        $textWrapper.addClass(CSS_CLASSES.TEXT_WRAPPER);
        var innerHTML = text;
        if (!isChapter && !isInPrintableStateMode()) {
            innerHTML = generatePageLinks(text, isChapter, pageId);
        }
        $textWrapper.html(innerHTML);

        var $element = $(document.createElement('td'));
        $element.append($textWrapper);

        return $element;
    }

    function generatePageLinks(text, isChapter, pageId) {
        return $("<a></a>").html(text).attr('href', '#').attr('data-page-id', pageId);
    }

    function addCell($row, value, className) {
        var $cell = $(document.createElement('td'));
        if (className !== undefined) {
            $cell.addClass(className);
        }
        if (value !== undefined) {
            $cell.html(value);
        }
        $cell.appendTo($row);
    }

    function addResultsFooterCell($row) {
        var calculateScore = !(isPreviewConsideringPrintableState() || isInPrintableEmptyStateMode());

        createProgressCell($row, {
            score: calculateScore ? presenter.calculateLessonScore() : 0,
            count: 1
        }, undefined, undefined);
    }

    function isPreviewConsideringPrintableState() {
        return isInPrintableStateMode()
           ? printableController.isPreview()
           : presenter.isPreview;
    }

    function addPageScoreFooterCell($cell, lessonScore) {
        var $separator = generateSeparator();
        var content = lessonScore.score + $separator[0].outerHTML + lessonScore.maxScore;
        addPageScoreCell($cell, content);
    }

    function addEmptyRow($view, node, index, parentIndex) {
        var configuration = getConfiguration();
        var isInPrintableState = isInPrintableStateMode();
        var $row = $(document.createElement('tr'));
        $row.appendTo($view.find('table'));
        $row.addClass(configuration.classes[index % configuration.classes.length]);

        var nodeClassName = isInPrintableState
          ? CSS_CLASSES.PRINTABLE_HIER_REPORT_NODE + '-' + index
          : "treegrid-" + index;
        $row.addClass(nodeClassName);

        if (parentIndex != null) {
            var parentNodeClassName = isInPrintableState
              ? CSS_CLASSES.PRINTABLE_HIER_REPORT_PARENT + '-' + parentIndex
              : "treegrid-parent-" + parentIndex
            $row.addClass(parentNodeClassName);
        }

        var isOdd = index % 2 > 0;
        var typeClassName = node.isChapter()
          ? getRowChapterClassName()
          : getRowPageClassName(isOdd);
        $row.addClass(typeClassName);

        return $row;
    }

    function getRowChapterClassName() {
        return isInPrintableStateMode()
            ? CSS_CLASSES.PRINTABLE_HIER_REPORT_CHAPTER
            : CSS_CLASSES.HIER_REPORT_CHAPTER;
    }

    function  getRowPageClassName(isOdd) {
        if (isOdd) {
            return isInPrintableStateMode()
              ? CSS_CLASSES.PRINTABLE_HIER_REPORT_ODD
              : CSS_CLASSES.HIER_REPORT_ODD;
        }
        return isInPrintableStateMode()
          ? CSS_CLASSES.PRINTABLE_HIER_REPORT_EVEN
          : CSS_CLASSES.HIER_REPORT_EVEN;
    }

    function createProgressCell($row, score, index, isChapter) {
        var isInPrintableState = isInPrintableStateMode();
        var $progressCell = $(document.createElement('td'));
        $progressCell.appendTo($row);

        var progressCellClassName = isInPrintableState
            ? CSS_CLASSES.PRINTABLE_HIER_REPORT_PROGRESS
            : CSS_CLASSES.HIER_REPORT_PROGRESS;
        $progressCell.addClass(progressCellClassName);

        var percent = Math.round(score.score / score.count * 100);
        var innerHTML = percent + "%";

        if (isInPrintableState) {
            $progressCell.html(innerHTML);
        } else {
            var $progressbar = $(document.createElement('div'));
            $progressbar.attr("id", "progressbar-" + index);
            $progressbar.addClass(CSS_CLASSES.HIER_REPORT_PROGRESSBAR);
            $progressbar.appendTo($progressCell);

            var $progressInfo = $(document.createElement('div'));
            $progressInfo.attr("style", "float: right");
            $progressInfo.html(innerHTML);
            $progressInfo.appendTo($progressCell);

            if (!isChapter) {
                $progressbar.progressbar({
                    value: Math.round(score.score * 100),
                    max: 100
                });
            }
        }
    }

    presenter.isPageVisited = function (pageId) {
        if (isInPrintableStateMode()) {
            return presenter.isVisitedInPrintableMode(pageId);
        }

        if (!presenter.configuration.excludeUnvisitedPages) {
            return true;
        }

        return presentationController.getPresentation().getPageById(pageId).isVisited();
    };

    presenter.isVisited = function (pageId) {
        if (isInPrintableStateMode()) {
            return presenter.isVisitedInPrintableMode(pageId);
        }

        return presentationController.getPresentation().getPageById(pageId).isVisited();
    };

    presenter.isVisitedInPrintableMode = function (pageId) {
        if (printableController.isPreview()) {
            return false;
        }

        if (isInPrintableEmptyStateMode()) {
            return false;
        }

        return printableController.getContentInformation().find(x => x.id === pageId).isVisited === "true";
    };

    presenter.getPageScaledScore = function(maxScore, score, isChapter, pageID) {
        if (isInPrintableEmptyStateMode()) {
            return 0;
        }

        if (maxScore) {
            return score / maxScore;
        }

        const isPreview = isPreviewConsideringPrintableState();
        if (!isPreview && !isChapter) {
            return presenter.isPageVisited(pageID) ? 1 : 0;
        }
        return 0;
    };

    function addScoreCellsWhenEnabledScoring($row, node, index) {
        const configuration = getConfiguration();
        let score = getScoreByPageIdForScoreCell(node.getId());

        if (!node.isChapter()) {
            presenter.updateScaledScore(score, node.getId());
        }

        if (configuration.showResults) {
            createProgressCell($row, {score: score.scaledScore, count: 1}, index, node.isChapter());
        }
        if (configuration.showChecks) {
            addChecksCell($row, score.checkCount);
        }
        if (configuration.showMistakes) {
            addMistakesCell($row, score.mistakeCount);
        }
        if (configuration.showErrors) {
            addErrorsCell($row, score.errorCount);
        }
        if (configuration.showPageScore) {
            addPageScoreRowCell($row, score, node.getId());
        }
        if (configuration.showMaxScoreField) {
            addMaxScoreAwardRowCell($row, score, node.getId());
        }

        updateLessonScore(score, node.getId(), node.isChapter());
    }

    function addScoreCellsWhenDisabledScoring($row) {
        var c = getConfiguration();
        var columns = [c.showResults, c.showChecks, c.showMistakes, c.showErrors, c.showPageScore, c.showMaxScoreField].filter(function(a) { return a }).length;
        var $colspan = $("<td colspan='" + columns + "'></td>");
        const className = isInPrintableStateMode()
            ? CSS_CLASSES.PRINTABLE_HIER_REPORT_SCORE_DISABLED_ROW
            : CSS_CLASSES.HIER_REPORT_SCORE_DISABLED_ROW;
        $colspan.addClass(className);
        $colspan.appendTo($row);
    }

    function getScoreByPageIdForScoreCell(pageId) {
        if (isPreviewConsideringPrintableState()) {
            return createEmptyScore(pageId);
        }

        if (isInPrintableStateMode()) {
            return getPrintablePageScoreById(pageId);
        }
        return presentationController.getScore().getPageScoreById(pageId);
    }

    function getPrintablePageScoreById(pageId) {
        var score = printableController.getScore();
        if (score === null) {
            return createEmptyScore(pageId);
        }

        if (score.hasOwnProperty(pageId)) {
            return {...score[pageId]}
        }
        return createEmptyScore(pageId);
    }

    function addPageScoreRowCell($view, score, pageId) {
        var innerHTML = createInnerHTMLForScoreCell(score, pageId);
        addPageScoreCell($view, innerHTML);
    }

    function addMaxScoreAwardRowCell($view, score, pageId) {
        var isInPrintableState = isInPrintableStateMode();
        var $cell = $(document.createElement('td'));

        var isMaxScore = score.maxScore !== 0 && score.score === score.maxScore;
        const className = isMaxScore
            ? (isInPrintableState
                ? CSS_CLASSES.PRINTABLE_HIER_REPORT_PAGE_MAX_SCORE
                : CSS_CLASSES.HIER_REPORT_PAGE_MAX_SCORE)
            : (isInPrintableState
                ? CSS_CLASSES.PRINTABLE_HIER_REPORT_PAGE_NON_MAX_SCORE
                : CSS_CLASSES.HIER_REPORT_PAGE_NON_MAX_SCORE);
        $cell.addClass(className);

        if (!isInPrintableState) {
            var $element = generateMaxScoreLinks(pageId, isMaxScore);
            $($cell).append($element);
        }
        $view.append($cell);
    }

    function generateMaxScoreLinks(pageId, isMaxScore) {
        var $element = $(document.createElement('td'));
        const className = isMaxScore
            ? CSS_CLASSES.HIER_REPORT_PAGE_MAX_SCORE
            : CSS_CLASSES.HIER_REPORT_PAGE_NON_MAX_SCORE;
        $element.addClass(className);

        var $link = $("<a></a>").attr('href', '#').attr('data-page-id', pageId);
        $link.append($element);
        return $link;
    }

    function parsePrintableControllerLessonsScoresToValidForm() {
        if (isInPrintableShowResultsStateMode()) {
            var scores = printableController.getScore();
            for (const [key, value] of Object.entries(scores)) {
                parseValuesToIntInDict(value);
            }
        }
    }

    function parseValuesToIntInDict(dictionary) {
        for (const [key, value] of Object.entries(dictionary)) {
            dictionary[key] = parseInt(dictionary[key]);
        }
    }

    function generateSeparator() {
        const className = isInPrintableStateMode()
            ? CSS_CLASSES.PRINTABLE_HIER_REPORT_SEPARATOR
            : CSS_CLASSES.HIER_REPORT_SEPARATOR;
        var $separator = $('<span></span>');
        $separator.html('/');
        $separator.addClass(className);
        return $separator;
    }

    function checkIfChapterHasChildren () {
        presenter.$view.find(".hier_report-chapter").each(function () {
           if(!$(this).hasClass('treegrid-collapsed') && !$(this).hasClass('treegrid-expanded')) {
               $(this).remove();
           }
        });
    }

    function checkIfPageEnabled () {
        const configuration = getConfiguration();
        if (configuration.enablePages != '' && configuration.enablePages != undefined){
            const realIndex = parseInt(getRelativeIndex() - getChapterIndex(), 10);
            return configuration.enablePages.indexOf(realIndex) > -1;
        }
        return true;
    }

    function addRow($view, node, index, parentIndex, isPreview) {
        const $row = addEmptyRow($view, node, index, parentIndex);

        if (!isPreview) {
            updateNodeNameByAlternativeName(node);
        }
        addNameCell($row, node);

        if (isScoringInPageEnabled(getAbsoluteIndex())) {
            addScoreCellsWhenEnabledScoring($row, node, index);
        } else {
            addScoreCellsWhenDisabledScoring($row);
        }
        return $row;
    }

    function updateNodeNameByAlternativeName (node) {
        const alternativeNameIndex = node.isChapter() ? getChapterIndex() : getPageIndex();
        const alternativeName = presenter.findAlternativeName(alternativeNameIndex, node.isChapter());
        node.setName(alternativeName || node.getName());
    }

    presenter.findAlternativeName = function (index, isChapter){
        let result = undefined;
        const configuration = getConfiguration();
        const alternativeTitles = configuration.alternativePageTitles;

        alternativeTitles.forEach(alternativeTitle => {
            if ((alternativeTitle.alternativePageNumber - 1) === index && alternativeTitle.alternativePageIsChapter === isChapter){
                result = alternativeTitle.alternativePageName;
            }
        });
        return result;
    };

    function updateChapterRow($row, chapterIndex, score, pageId) {
        const hasChildren = score.pageCount > 0;
        const configuration = getConfiguration();

        if (configuration.showResults) {
            updateChapterRowResultsCell($row, chapterIndex, score, hasChildren);
        }
        if (configuration.showChecks) {
            updateChapterRowChecksCell($row, score.checkCount, hasChildren);
        }
        if (configuration.showMistakes) {
            updateChapterRowMistakesCell($row, score.mistakeCount, hasChildren);
        }
        if (configuration.showErrors) {
            updateChapterRowErrorsCell($row, score.errorCount, hasChildren);
        }
        if (configuration.showPageScore) {
            updateChapterRowScoreCell($row, score, hasChildren, pageId);
        }
    }

    function updateChapterRowResultsCell($row, pageIndex, score, hasChildren) {
        if (isInPrintableStateMode()) {
            updateChapterRowResultsPrintableCell($row, score, hasChildren);
        } else {
            updateChapterRowResultsRunCell($row, pageIndex, score, hasChildren);
        }
    }

    function updateChapterRowResultsPrintableCell($row, score, hasChildren) {
        const className = CSS_CLASSES.PRINTABLE_HIER_REPORT_PROGRESS;
        const value = hasChildren ? score.weightedScaledScoreNumerator / score.weightedScaledScoreDenominator : 0;
        const percent = (Math.round(value * 100) || 0) + '%';
        updateCell($row, percent, hasChildren, className);
    }

    function updateChapterRowResultsRunCell($row, pageIndex, score, hasChildren) {
        var percent = Math.round((score.weightedScaledScoreNumerator / score.weightedScaledScoreDenominator) * 100) || 0;
        var $progressbar = $($row.find("#progressbar-" + pageIndex));
        if (hasChildren) {
            const value = score.weightedScaledScoreNumerator / score.weightedScaledScoreDenominator;
            $progressbar.progressbar({value: Math.round(value * 100), max: 100});
            $progressbar.closest("div").next().html(percent + '%');
        } else {
            $progressbar.closest("div").next().html('-').attr('style', '');
        }
    }

    function updateChapterRowChecksCell($row, checks, hasChildren) {
        const className = isInPrintableStateMode()
            ? CSS_CLASSES.PRINTABLE_HIER_REPORT_CHECKS
            : CSS_CLASSES.HIER_REPORT_CHECKS;
        updateCell($row, checks, hasChildren, className);
    }

    function updateChapterRowMistakesCell($row, mistakes, hasChildren) {
        const className = isInPrintableStateMode()
            ? CSS_CLASSES.PRINTABLE_HIER_REPORT_MISTAKES
            : CSS_CLASSES.HIER_REPORT_MISTAKES;
        updateCell($row, mistakes, hasChildren, className);
    }

    function updateChapterRowErrorsCell($row, errors, hasChildren) {
        const className = isInPrintableStateMode()
            ? CSS_CLASSES.PRINTABLE_HIER_REPORT_ERRORS
            : CSS_CLASSES.HIER_REPORT_ERRORS;
        updateCell($row, errors, hasChildren, className);
    }

    function updateChapterRowScoreCell($row, score, hasChildren, pageId) {
        const className = isInPrintableStateMode()
            ? CSS_CLASSES.PRINTABLE_HIER_REPORT_PAGE_SCORE
            : CSS_CLASSES.HIER_REPORT_PAGE_SCORE;
        const innerHTML = createInnerHTMLForScoreCell(score, pageId);
        updateCell($row, innerHTML, hasChildren, className);
    }

    presenter.createInnerHTMLForScoreCell = function (score, pageId) {
        return createInnerHTMLForScoreCell(score, pageId);
    }

    function createInnerHTMLForScoreCell (score, pageId) {
        const $separator = generateSeparator();

        if (isNaN(score.maxScore)) {
            return getConfiguration().labels.unvisitedPageScore;
        }

        if (isInPrintableStateMode() && !getConfiguration().excludeUnvisitedPages && score.maxScore === 0) {
            return score.score + '/' + score.maxScore;
        }

        if (score.maxScore === 0 && !getConfiguration().excludeUnvisitedPages && pageId && pageId != "chapter" && presentationController) {
            const maxScore = presentationController.getPresentation().getPageById(pageId).getModulesMaxScore();
            presenter.totalScore += maxScore;

            return score.score + $separator[0].outerHTML + maxScore;
        }

        if (score.score === 0 && score.maxScore === 0 && score.scaledScore === 0) {
            return getConfiguration().labels.unvisitedPageScore;
        }

        if (pageId != "chapter") {
            presenter.totalScore += score.maxScore;
        }

        return score.score + $separator[0].outerHTML + score.maxScore;
    }

    function updateCell($row, value, hasChildren, searchClassName) {
        const innerHTML = hasChildren ? value : '-';
        $row.find(`.${searchClassName}`).html(innerHTML);
    }

    presenter.calculateLessonScore = function () {
        let lessonScore = getLessonScore();
        if (lessonScore.weightedScaledScoreDenominator === 0) {
            return 0;
        }

        return Math.round((lessonScore.weightedScaledScoreNumerator / lessonScore.weightedScaledScoreDenominator) * 100) / 100;
    };

    function updateLessonScore (pageScore, pageId, isChapter) {
        pageScore.weightedScaledScoreNumerator = 0;
        pageScore.weightedScaledScoreDenominator = 0;

        let lessonScore = getLessonScore();
        updateChapterOrLessonScore(lessonScore, pageScore, pageId, isChapter);
    }

    function updateChapterScore (chapterScore, score, pageId, isChapter) {
        updateChapterOrLessonScore(chapterScore, score, pageId, isChapter);
    }

    /**
     * Update chapter's/lesson's score by given score. Only to execute when scoring is enabled.
     *  @method updateChapterOrLessonScore
     *  @param {Object} mainScore Lesson or chapter scores to be updated
     *      @param {Number} mainScore.errorCount
     *      @param {Number} mainScore.checkCount
     *      @param {Number} mainScore.mistakeCount
     *      @param {Number} mainScore.maxScore
     *      @param {Number} mainScore.score
     *      @param {Number} mainScore.pageCount
     *      @param {Number} mainScore.weightedScaledScoreNumerator
     *      @param {Number} mainScore.weightedScaledScoreDenominator
     *  @param {Object} score Chapter (representation of scores for more than one page) or page scores to update
     *  @param {String} pageId Page unique ID
     *  @param {boolean} isChapter: If score is a chapter (representation of scores for more than one page) score
     */
    function updateChapterOrLessonScore (mainScore, score, pageId, isChapter) {
        if (isChapter && score.pageCount) {
            mainScore.pageCount += score.pageCount;
        } else {
            mainScore.pageCount += 1;
        }

        if (isInPrintableEmptyStateMode() && !getConfiguration().excludeUnvisitedPages) {
            mainScore.maxScore += score.maxScore;
        }

        if (isInPrintableEmptyStateMode() || isPreviewConsideringPrintableState()) {
            return;
        }

        mainScore.errorCount += score.errorCount;
        mainScore.checkCount += score.checkCount;
        mainScore.mistakeCount += score.mistakeCount;
        mainScore.maxScore += score.maxScore;
        mainScore.score += score.score;

        _updateWeightedScaledScoreParts(mainScore, score, pageId, isChapter);
    }

    function _updateWeightedScaledScoreParts (mainScore, score, pageId, isChapter) {
        if (isChapter) {
            mainScore.weightedScaledScoreNumerator += score.weightedScaledScoreNumerator;
            mainScore.weightedScaledScoreDenominator += score.weightedScaledScoreDenominator;
            return;
        }

        let weight = 1;
        if (presentationController && !getConfiguration().excludeUnvisitedPages && getConfiguration().isWeightedArithmeticMean) {
            weight = presentationController.getPresentation().getPageById(pageId).getPageWeight();
        } else if (getConfiguration().isWeightedArithmeticMean && score.weight !== 0) {
            weight = score.weight;
        }

        if (isInPrintableStateMode() && getConfiguration().isWeightedArithmeticMean) {
            const printablePageWeight = printableController.getContentInformation().find(x => x.id === pageId).pageWeight;
            weight = printablePageWeight ? +printablePageWeight : 1;
        }

        if (score.maxScore) {
            mainScore.weightedScaledScoreNumerator += score.score * weight / score.maxScore;
            mainScore.weightedScaledScoreDenominator += weight;
        } else if (presenter.isPageVisited(pageId) && getConfiguration().excludeUnvisitedPages) {
            mainScore.weightedScaledScoreNumerator += weight;
            mainScore.weightedScaledScoreDenominator += weight;
        } else if (presenter.isVisited(pageId) && !getConfiguration().excludeUnvisitedPages) {
            mainScore.weightedScaledScoreNumerator += weight;
            mainScore.weightedScaledScoreDenominator += weight;
        } else if (!getConfiguration().excludeUnvisitedPages) {
            mainScore.weightedScaledScoreDenominator += weight;
        }
    }

    presenter.updateScaledScore = function (score, pageId) {
        if (isInPrintableEmptyStateMode() || isPreviewConsideringPrintableState()) {
            score.scaledScore = 0
            return;
        }

        if (presentationController && !presentationController.getPresentation().getPageById(pageId).isVisited() && !getConfiguration().excludeUnvisitedPages) {
            score.scaledScore = 0;
            return;
        }

        if (score.maxScore) {
            score.scaledScore = score.score / score.maxScore;
        } else if (presenter.isPageVisited(pageId)) {
            score.scaledScore = 1;
        } else {
            score.scaledScore = 0;
        }
    }

    presenter.createPreviewTree = function() {
        let contentInformation = generatePreviewContentInformation();
        let rootRepresentation = createDeepNodeRepresentationOfContentInformation(contentInformation);

        let chapterScore = createEmptyScore();
        let $view = $("#" + presenter.treeID);
        for (let i = 0; i < rootRepresentation.size(); i++) {
            addRow($view, rootRepresentation.get(i), i, contentInformation[i].parentId, true);
        }
        return chapterScore;
    };

    presenter.createTree = function($view, parentNodeRepresentation, parentIndex) {
        let pageScore = createEmptyScore();
        let chapterScore = createEmptyScore();

        for (let i = 0; i < parentNodeRepresentation.size(); i++) {
            let nodeRepresentation = parentNodeRepresentation.get(i);

            if (!nodeRepresentation.isChapter() && !nodeRepresentation.isReportable()) {
                updateIndexesWhenNotReportablePage(nodeRepresentation);
                continue;
            }

            if (nodeRepresentation.isChapter() || checkIfPageEnabled()) {
                addRow($view, nodeRepresentation, getRelativeIndex(), parentIndex, false);
            }

            const currentNodeRelativeIndex = getRelativeIndex();
            const currentNodeAbsoluteIndex = getAbsoluteIndex();
            updateIndexesWhenChapterOrReportablePage(nodeRepresentation.isChapter());

            if (nodeRepresentation.isChapter()) {
                const childChapterScore = presenter.createTree($view, nodeRepresentation, currentNodeRelativeIndex);
                let $row = findChapterElement($view, currentNodeRelativeIndex);
                updateChapterRow($row, currentNodeRelativeIndex, childChapterScore, nodeRepresentation.getId());
                pageScore = childChapterScore;
            } else {
                pageScore = getScoreByPageIdForScoreCell(nodeRepresentation.getId());
            }

            if (isScoringInPageEnabled(currentNodeAbsoluteIndex) || nodeRepresentation.isChapter()) {
                updateChapterScore(chapterScore, pageScore, nodeRepresentation.getId(), nodeRepresentation.isChapter());
            }
        }

        return chapterScore;
    };

    function findChapterElement($view, chapterIndex) {
        return isInPrintableStateMode()
            ? $($view.find(`.${CSS_CLASSES.PRINTABLE_HIER_REPORT_NODE}-` + chapterIndex))
            : $($view.find(".treegrid-" + chapterIndex));
    }

    function isScoringInPageEnabled(index) {
        return getConfiguration().disabledScorePages.indexOf(index) === -1;
    }

    function updateIndexesWhenNotReportablePage() {
        const configuration = getConfiguration();
        increaseAbsoluteIndex();

        if (configuration.enablePages != '' && configuration.enablePages != undefined) {
            increaseRelativeIndex();
        }
        increasePageIndex();
    }

    function updateIndexesWhenChapterOrReportablePage(isChapter) {
        increaseAbsoluteIndex();
        increaseRelativeIndex();

        if (isChapter) {
            increaseChapterIndex();
        } else {
            increasePageIndex();
        }
    }

    function getAbsoluteIndex() {
        return absoluteIndex;
    }

    function getRelativeIndex() {
        return relativeIndex;
    }

    function getPageIndex() {
        return pageIndex;
    }

    function getChapterIndex() {
        return chapterIndex;
    }

    function increaseAbsoluteIndex() {
        absoluteIndex += 1;
    }

    function increaseRelativeIndex() {
        relativeIndex += 1;
    }

    function increasePageIndex() {
        pageIndex += 1;
    }

    function increaseChapterIndex() {
        chapterIndex += 1;
    }

    function handleMouseClickActions() {
        var commander = presentationController.getCommands(),
            $report = presenter.$view.find('.hier_report tr');

        $report.find('td a').each(function () {
            $(this).click(function (event) {
                event.preventDefault();
                event.stopPropagation();
                commander.gotoPageId($(this).attr('data-page-id'));
            });
        });

        $report.find('.treegrid-expander').each(function () {
            $(this).click(function (event) {
                event.preventDefault();
                event.stopPropagation();
            });
        });
    }

    function expandTree(level) {
        $('.hier_report table').find('tr').not('.hier_report-header').not('.hier_report-footer').each(function () {
            if ($(this).treegrid('getDepth') < level) {
                $(this).treegrid('expand');
            }
        });
    }

    function saveTreeState() {
        var state = [];
        $('.hier_report table').find('tr').not('.hier_report-header').not('.hier_report-footer').each(function () {
            state.push($(this).treegrid('isExpanded'));
        });
        return state;
    }

    function restoreTreeState(state) {
        $('.hier_report table').find('tr').not('.hier_report-header').not('.hier_report-footer').each(function (index) {
            $(this).treegrid(state[index] ? 'expand' : 'collapse');
        });
    }

    presenter.getState = function () {
        return JSON.stringify({
            'treeState': saveTreeState(),
            'isVisible': presenter.configuration.isVisible
        });
    };

    presenter.setState = function (stateString) {
        var state = JSON.parse(stateString);

        restoreTreeState(state.treeState);

        presenter.setVisibility(state.isVisible);
        presenter.configuration.isVisible = state.isVisible;
    };

    function parseClasses(classes_text) {
        function isValidClassName(class_name) {
            return /^[a-z_-][a-z\d_-]*$/i.test(class_name);
        }

        if (ModelValidationUtils.isStringEmpty(classes_text)) {
            return returnCorrectObject([]);
        }

        var classes = classes_text.split('\n');
        for (var i=0; i<classes.length; i++) {
            if (classes[i].indexOf(' ') !== -1) {
                return returnErrorObject("C02");
            }

            if (!isValidClassName(classes[i])) {
                return returnErrorObject("C01");
            }
        }

        return returnCorrectObject(classes);
    }

    function parseScoreDisable(pages_text, disabledType) {
        if (ModelValidationUtils.isStringEmpty(pages_text)) {
            return returnCorrectObject([]);
        }

        var i;

        var pages = pages_text.split(';');
        for (i=0; i<pages.length; i++) {
            var numberObject = ModelValidationUtils.validateInteger(pages[i]);
            if (!numberObject.isValid) {
                if(disabledType == 'score'){
                    return returnErrorObject("D01");
                } else if (disabledType == 'pages') {
                    return returnErrorObject("P01");
                }
            }

            pages[i] = numberObject.value - 1; // indexing from 0

            if (pages[i] < 0) {
                if(disabledType == 'score'){
                    return returnErrorObject("D02");
                } else if (disabledType == 'pages') {
                    return returnErrorObject("P02");
                }
            }
        }

        for (i=1; i<pages.length; i++) {
            if (pages.sort()[i] === pages.sort()[i-1]) {
                if(disabledType == 'score'){
                    return returnErrorObject("D03");
                } else if (disabledType == 'pages') {
                    return returnErrorObject("P03");
                }
            }
        }

        return returnCorrectObject(pages.sort());
    }

    presenter.validateAlternativePageTitles = function (listOfPages) {
        var validatedList = [];

        if (listOfPages.length === undefined || listOfPages.length === 0) {
            return returnErrorObject('A01');
        }

        for (var i = 0; i < listOfPages.length; i++) {
             var alternativePageName = listOfPages[i].alternativePageName;
             var isChapter = ModelValidationUtils.validateBoolean(listOfPages[i].alternativePageIsChapter);

             var alternativePageNumber = "";

             if (!ModelValidationUtils.isStringEmpty(listOfPages[i].alternativePageNumber)) {
                var alternativePageNumberObject = ModelValidationUtils.validatePositiveInteger(listOfPages[i].alternativePageNumber);
                if (!alternativePageNumberObject.isValid) {
                    return returnErrorObject('A02');
                }

                alternativePageNumber = alternativePageNumberObject.value;
             }

             validatedList[i] = {
                 alternativePageName: alternativePageName,
                 alternativePageNumber: alternativePageNumber,
                 alternativePageIsChapter: isChapter
             };
        }

        return returnCorrectObject(validatedList);
    };

    presenter.upgradeAlternativePageNamesProperty = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (model["alternativePageTitles"] === undefined) {
            upgradedModel["alternativePageTitles"] = [{
                alternativePageNumber: "",
                alternativePageName: "",
                alternativePageIsChapter: "false"
            }];
        }
        return upgradedModel;
    };

    presenter.upgradeTextToSpeechSupport = function (model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (upgradedModel['speechTexts'] === undefined) {
            upgradedModel['speechTexts'] = {
                Expanded: {Expanded: "Expanded"},
                Collapsed: {Collapsed: "Collapsed"},
                Results: {Results: "Results"},
                Checks: {Checks: "Checks"},
                Mistakes: {Mistakes: "Mistakes"},
                Errors: {Errors: "Errors"},
                Score: {Score: "Score"},
                OutOf: {OutOf: "Out of"},
                Total: {Total: "Total"}
            };
        }

        if (upgradedModel['langAttribute'] === undefined) {
            upgradedModel['langAttribute'] = "";
        }
        return upgradedModel;
    };

    presenter.upgradeIsWeightedArithmeticMean = function(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (upgradedModel["isWeightedArithmeticMean"] === undefined) {
            upgradedModel["isWeightedArithmeticMean"] = "False";
        }

        return upgradedModel;
    }

    presenter.upgradeExcludeUnvisitedPages = function(model) {
        var upgradedModel = {};
        $.extend(true, upgradedModel, model);

        if (upgradedModel["excludeUnvisitedPages"] === undefined) {
            upgradedModel["excludeUnvisitedPages"] = "False";
        }

        return upgradedModel;
    }

    presenter.upgradeModel = function (model) {
        var upgradedModel = presenter.upgradeAlternativePageNamesProperty(model);
        upgradedModel = presenter.upgradeTextToSpeechSupport(upgradedModel);
        upgradedModel = presenter.upgradeIsWeightedArithmeticMean(upgradedModel);
        upgradedModel = presenter.upgradeExcludeUnvisitedPages(upgradedModel);

        return upgradedModel;
    };

    function getSpeechTextProperty (rawValue, defaultValue) {
        var value = rawValue.trim();

        if (value === undefined || value === null || value === '') {
            return defaultValue;
        }

        return value;
    }

    presenter.setSpeechTexts = function(speechTexts) {
        presenter.speechTexts = {
            expanded:  'Expanded',
            collapsed: 'Collapsed',
            results: 'Percentage results',
            checks: 'Number of checks',
            mistakes: 'Number of mistakes',
            errors: 'Number of errors',
            score: 'Score',
            outOf: 'out of',
            Total: 'Total'
        };

        if (!speechTexts) {
            return;
        }

        presenter.speechTexts = {
            expanded:    getSpeechTextProperty(speechTexts['Expanded']['Expanded'], presenter.speechTexts.expanded),
            collapsed: getSpeechTextProperty(speechTexts['Collapsed']['Collapsed'], presenter.speechTexts.collapsed),
            results:  getSpeechTextProperty(speechTexts['Results']['Results'], presenter.speechTexts.results),
            checks:     getSpeechTextProperty(speechTexts['Checks']['Checks'], presenter.speechTexts.checks),
            mistakes:   getSpeechTextProperty(speechTexts['Mistakes']['Mistakes'], presenter.speechTexts.mistakes),
            errors:      getSpeechTextProperty(speechTexts['Errors']['Errors'], presenter.speechTexts.errors),
            score:        getSpeechTextProperty(speechTexts['Score']['Score'], presenter.speechTexts.score),
            outOf:        getSpeechTextProperty(speechTexts['OutOf']['OutOf'], presenter.speechTexts.outOf),
            total:        getSpeechTextProperty(speechTexts['Total']['Total'], presenter.speechTexts.total)
        };
    };

    presenter.validateModel = function (model) {
        presenter.setSpeechTexts(model['speechTexts']);
        var expandDepth = returnCorrectObject(0);

        if (model['expandDepth'].length > 0) {
            expandDepth = ModelValidationUtils.validateInteger(model['expandDepth']);
            if (!expandDepth.isValid) {
                return returnErrorObject('EXPAND_DEPTH_NOT_NUMERIC');
            }
        }

        var validatedClasses = parseClasses(model["classes"]);
        if (!validatedClasses.isValid) {
            return returnErrorObject(validatedClasses.errorCode);
        }

        var validatedDisabledScorePages = parseScoreDisable(model["scoredisabled"], 'score');
        if (!validatedDisabledScorePages.isValid) {
            return returnErrorObject(validatedDisabledScorePages.errorCode);
        }

        var validatedEnablePages = parseScoreDisable(model["enablePages"], 'pages');
        if (!validatedEnablePages.isValid) {
            return returnErrorObject(validatedEnablePages.errorCode);
        }

        var validatedAlternativePageTitles = presenter.validateAlternativePageTitles(model["alternativePageTitles"]);
        if (!validatedAlternativePageTitles.isValid) {
            return returnErrorObject(validatedAlternativePageTitles.errorCode);
        }

        return {
            ID: model.ID,
            isValid: true,
            width: parseInt(model["Width"], 10),
            height: parseInt(model["Height"], 10),
            isVisible: ModelValidationUtils.validateBoolean(model["Is Visible"]),
            labels: {
                results: model['resultsLabel'],
                errors: model['errorsLabel'],
                checks: model['checksLabel'],
                mistakes: model['mistakesLabel'],
                total: model['totalLabel'],
                title: model['titleLabel'],
                pageScores: model['pageScoresLabel'] || "",
                maxScoreAward: model['maxScoreAwardLabel'] || "",
                unvisitedPageScore: model['unvisitedPageScoresLabel'] || ""
            },
            showResults: ModelValidationUtils.validateBoolean(model["results"]),
            showErrors: ModelValidationUtils.validateBoolean(model["errors"]),
            showChecks: ModelValidationUtils.validateBoolean(model["checks"]),
            showMistakes: ModelValidationUtils.validateBoolean(model["mistakes"]),
            showTotal: ModelValidationUtils.validateBoolean(model["total"]),
            expandDepth: expandDepth.value,
            classes: validatedClasses.value,
            showPageScore: ModelValidationUtils.validateBoolean(model["showpagescore"]),
            showMaxScoreField: ModelValidationUtils.validateBoolean(model["showmaxscorefield"]),
            disabledScorePages: validatedDisabledScorePages.value,
            enablePages: validatedEnablePages.value,
            alternativePageTitles: validatedAlternativePageTitles.value,
            langTag: model['langAttribute'],
            isWeightedArithmeticMean: ModelValidationUtils.validateBoolean(model["isWeightedArithmeticMean"]),
            excludeUnvisitedPages: ModelValidationUtils.validateBoolean(model["excludeUnvisitedPages"])
        };
    };

    presenter.setVisibility = function (isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.initialize = function (view, model, isPreview) {
        presenter.$view = $(view);
        presenter.isPreview = isPreview;
        initLessonScore();

        model = presenter.upgradeModel(model);
        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.isValid) {
            presenter.showErrorMessage(presenter.ERROR_MESSAGES[presenter.configuration.errorCode]);
            return;
        }

        var padding_width = parseInt(presenter.$view.find('.hier_report').css('padding'));
        if(isNaN(padding_width)) padding_width = 0;
        var border_width = parseInt(presenter.$view.find('.hier_report').css('border-width'));
        if(isNaN(border_width)) border_width = 0;
        var actual_height = presenter.configuration.height + ( padding_width + border_width ) *2; // makes it so hier_report and the addons view are the same height

        presenter.$view.css('height',actual_height+'px');
        presenter.$view.find('.hier_report').attr("style", "height: " + presenter.configuration.height + "px");
        presenter.treeID = presenter.configuration.ID + (isPreview ? "Preview" : "");
        presenter.$view.find("div").first().attr('id', presenter.treeID);

        presenter.setVisibility(presenter.configuration.isVisible || isPreview);

        var $table = $("#" + presenter.treeID).find('table');
        addHeader(presenter.configuration, $table);
        resetIndexes();
        if (isPreview) {
            presenter.createPreviewTree();
        } else {
            var $view = $("#" + presenter.treeID);
            var rootNode = createRunStructure();
            presenter.createTree($view, rootNode, null);
        }

        if (presenter.configuration.showTotal) {
            addFooter(presenter.configuration, $table);
        }

        $("#" + presenter.treeID).find('table').not('.hier_report-header').not('.hier_report-footer').treegrid({
            'initialState': 'collapsed',
            'expanderTemplate': '<div class="treegrid-expander"></div>'
        });

        expandTree(presenter.configuration.expandDepth);
        if (!isPreview) {
            handleMouseClickActions();
        }

        checkIfChapterHasChildren();
    };

    function initLessonScore() {
        var initLessonScore = createEmptyScore();

        if (isInPrintableStateMode()) {
            presenter.printableLessonScore = initLessonScore;
        } else {
            presenter.lessonScore = initLessonScore;
        }
    }

    function createEmptyScore(pageId) {
        const _maxScore = isInPrintableStateMode() && !getConfiguration().excludeUnvisitedPages ? getMaxScoreForPrintableVersion(pageId) : 0;
        return {
            // Native score fields
            checkCount: 0,
            errorCount: 0,
            mistakeCount: 0,
            score: 0,
            maxScore: _maxScore,
            scaledScore: 0,
            weight: 0,

            // Score fields to calculate result
            pageCount: 0,
            weightedScaledScoreNumerator: 0,
            weightedScaledScoreDenominator: 0,
        };
    }

    function getMaxScoreForPrintableVersion(pageId) {
        const content = printableController.getContentInformation().find(x => x.id === pageId)
        return content ? +content.maxScore : 0;
    }

    function getLessonScore() {
        if (isInPrintableStateMode()) {
            presenter.printableLessonScore.maxScore = !getConfiguration().excludeUnvisitedPages ? presenter.totalScore : 0;
            return presenter.printableLessonScore;
        }

        if (!getConfiguration().excludeUnvisitedPages) {
            presenter.lessonScore.maxScore = presenter.totalScore;
            return presenter.lessonScore;
        }

        return presenter.lessonScore;
    }

    function getConfiguration() {
        if (isInPrintableStateMode())
            return presenter.printableConfiguration;
        return presenter.configuration;
    }

    function getCell(rowNumber, columnNumber) {
        var $cell = presenter.$view.find('tr:eq('+rowNumber+') > td:eq('+columnNumber+')');
        if($cell.size()>0){
            return $cell[0];
        }
        return null;
    }

    presenter.cellIsVisible = function(rowNumber, columnNumber) {
        var cell = getCell(rowNumber, columnNumber);
        return cell && $(cell).is(':visible');
    };

    function getTableMaxHeight() {
            return presenter.$view.find('tr').size();
        }

        function getTableWidth() {
            return presenter.$view.find('tr:eq(0) > td').size();
        }

    presenter.keyboardController = function(keycode, isShiftKeyDown, event) {
        event.preventDefault();
        presenter.shiftPressed = event.shiftKey;

        var keys = {
            ENTER: 13,
            ESCAPE: 27,
            SPACE: 32,
            ARROW_LEFT: 37,
            ARROW_UP: 38,
            ARROW_RIGHT: 39,
            ARROW_DOWN: 40,
            TAB: 9
        };

        function moveTo(newRow, newColumn) {
            if(!presenter.cellIsVisible(newRow,newColumn)) {
                return;
            }
            currentColumn = newColumn;
            currentRow = newRow;
            presenter.$view.find('.' + CSS_CLASSES.SELECTED_CELL).removeClass(CSS_CLASSES.SELECTED_CELL);
            var cell = getCell(currentRow, currentColumn);
            $(cell).addClass(CSS_CLASSES.SELECTED_CELL);
            scrollCellIntoView();

        }

        function scrollCellIntoView () {
            var cell = getCell(currentRow,currentColumn);
            var $cell = $(cell);
            var $hier_report = presenter.$view.find('.hier_report');
            var scrollPos = $hier_report.scrollTop();

            if($cell.outerHeight() + cell.offsetTop > $hier_report.height() + scrollPos) {
                $hier_report.scrollTop($cell.height() + parseInt($cell.css('padding-top')) + cell.offsetTop - $hier_report.height() );
            } else if(cell.offsetTop < scrollPos) {
                $hier_report.scrollTop(cell.offsetTop + parseInt($cell.css('padding-top')));
            }
        };

        function getNextVisibleRowNumber(rowNumber) {
            var newRow = rowNumber;
            var nRows = getTableMaxHeight();
            while (true) {
                newRow+=1;
                if(newRow>=nRows) {
                    return rowNumber;
                }
                if(presenter.cellIsVisible(newRow,0)){
                    return newRow;
                }
            }
        }

        function getPrevVisibleRowNumber(rowNumber) {
            var newRow = rowNumber;
            while (true) {
                newRow-=1;
                if(newRow<=0) {
                    return rowNumber;
                }
                if(presenter.cellIsVisible(newRow,0)){
                    return newRow;
                }
            }
        }

        var enter = function (){
            if(isShiftKeyDown) {
                return escape();
            }

            moveTo(currentRow,currentColumn);
            presenter.readCurrentRowAndCell();
        };

        var next_element = function (){
            moveTo(currentRow,currentColumn+1);
            presenter.readCurrentCell();
        };

        var previous_element = function (){
            moveTo(currentRow,currentColumn-1);
            presenter.readCurrentCell();
        };

        var next_row = function () {
            var newRow = getNextVisibleRowNumber(currentRow);
            moveTo(newRow,currentColumn);
            presenter.readCurrentRowAndCell();
        };

        var previous_row = function () {
            var newRow = getPrevVisibleRowNumber(currentRow);
            moveTo(newRow,currentColumn);
            presenter.readCurrentRowAndCell();
        };

        var space = function (){
            var $cell = $(getCell(currentRow,currentColumn));
            var $link = $cell.find('a');
            if ($link.size()>0) {
                $link.trigger('click');
            } else {
                var $expand = $cell.find('.treegrid-expander');
                if ($expand.size()>0) {
                    $expand.trigger("click");
                    if ($expand.hasClass("treegrid-expander-collapsed")) {
                        speak([getTextVoiceObject(presenter.speechTexts.collapsed,"")]);
                    } else if ($expand.hasClass("treegrid-expander-expanded")) {
                        speak([getTextVoiceObject(presenter.speechTexts.expanded,"")]);
                    }
                }
            }
        };

        var escape = function (){
            presenter.$view.find('.' + CSS_CLASSES.SELECTED_CELL).removeClass(CSS_CLASSES.SELECTED_CELL);
            currentColumn = 0;
            currentRow = 1;
        };

        function tabHandler() {
            var rowChange = false;
            var maxWidth = getTableWidth();

            var newColumn = currentColumn;
            var newRow = currentRow;

            if (isShiftKeyDown) {
                newColumn -= 1;
            } else {
                newColumn += 1;
            }

            if(newColumn>=maxWidth) {
                newRow = getNextVisibleRowNumber(newRow);
                if(newRow!==currentRow) {
                    newColumn = 0;
                    rowChange=true;
                } else {
                    newColumn = maxWidth-1;
                }
            } else if(newColumn<0) {
                newRow = getPrevVisibleRowNumber(newRow);
                 if(newRow!==currentRow) {
                    newColumn = maxWidth-1;
                    rowChange=true;
                } else {
                    newColumn = 0;
                }
            }

            moveTo(newRow, newColumn);
            if(rowChange) {
                presenter.readCurrentRowAndCell();
            } else {
                presenter.readCurrentCell();
            }

        }

        var mapping = {};
        mapping[keys.ENTER] = enter;
        mapping[keys.ESCAPE] = escape;
        mapping[keys.SPACE] = space;
        mapping[keys.ARROW_LEFT] = previous_element;
        mapping[keys.ARROW_UP] = previous_row;
        mapping[keys.ARROW_RIGHT] = next_element;
        mapping[keys.ARROW_DOWN] = next_row;
        mapping[keys.TAB] = tabHandler;

        try {
            mapping[keycode]();
        } catch (er) {
        }

    };

    function getColumnList() {
        var columns = ['page_title'];
        if(presenter.configuration.showResults){
            columns.push('results');
        }
        if(presenter.configuration.showChecks){
            columns.push('checks');
        }
        if(presenter.configuration.showMistakes){
            columns.push('mistakes');
        }
        if(presenter.configuration.showErrors){
            columns.push('errors');
        }
        if(presenter.configuration.showPageScore){
            columns.push('score');
        }
        return columns;
    }

    function getCurrentCellTextVoiceArray() {
        var TextVoiceArray = [];
        var $cell = $(getCell(currentRow,currentColumn));

        if (currentColumn===0) {
            if(currentRow === getTableMaxHeight()-1 && presenter.configuration.showTotal) {
                TextVoiceArray.push(getTextVoiceObject(presenter.speechTexts.total, ""));
            } else {
                TextVoiceArray.push(getTextVoiceObject($cell.text(), presenter.configuration.langTag));
            }
        } else {
            TextVoiceArray.push(getTextVoiceObject(presenter.speechTexts[getColumnList()[currentColumn]],""));
            if (-1 !== getColumnList()[currentColumn].indexOf('score')) {
                TextVoiceArray.push(getTextVoiceObject($cell.text().replace('/', presenter.speechTexts.outOf, "")));
            } else {
                TextVoiceArray.push(getTextVoiceObject($cell.text(), ""));
            }
        }

        if ($cell.find(".treegrid-expander-collapsed").size()>0) {
            TextVoiceArray.push(getTextVoiceObject(presenter.speechTexts.collapsed,""));
        } else if($cell.find(".treegrid-expander-expanded").size()>0) {
            TextVoiceArray.push(getTextVoiceObject(presenter.speechTexts.expanded,""));
        }

        return TextVoiceArray;
    }

    presenter.readCurrentCell = function() {
        speak(getCurrentCellTextVoiceArray());
    };

    presenter.readCurrentRowAndCell = function() {
        var TextVoiceArray = [];

        if (currentColumn!==0) {
            if(currentRow === getTableMaxHeight()-1 && presenter.configuration.showTotal) {
                TextVoiceArray.push(getTextVoiceObject(presenter.speechTexts.total, ""));
            } else {
                TextVoiceArray.push(getTextVoiceObject($(getCell(currentRow,0)).text(), presenter.configuration.langTag));
            }
        }

        TextVoiceArray = TextVoiceArray.concat(getCurrentCellTextVoiceArray());

        speak(TextVoiceArray);
    };

    presenter.getTextToSpeechOrNull = function (playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    presenter.setWCAGStatus = function (isOn) {
        isWCAGOn = isOn;
    };

    function speak(data) {
        presenter.speak(data);
    }

    presenter.speak = function(data) {
        var tts = presenter.getTextToSpeechOrNull(presentationController);

        if (tts && isWCAGOn) {
            tts.speak(data);
        }
    };

    presenter.setPrintableState = function(state) {
        if (state === null || ModelValidationUtils.isStringEmpty(state))
            return;
        presenter.printableState = JSON.parse(state);
    }

    NodeRepresentation.prototype = Object.create(NodeRepresentation.prototype);
    NodeRepresentation.prototype.constructor = NodeRepresentation;

    /**
     * @param id
     * @param name
     * @param type
     * @param reportable
     * @param visited
     * @constructor
     */
    function NodeRepresentation (id, name, type, reportable, visited) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.reportable = reportable;
        this.visited = visited;
        this.children = [];

        this._isChapter = this.type === "chapter";
    }

    NodeRepresentation.prototype = Object.create(NodeRepresentation.prototype);
    NodeRepresentation.prototype.constructor = NodeRepresentation;

    NodeRepresentation.prototype.get = function (index) {
        return this.children[index];
    }

    NodeRepresentation.prototype.getId = function () {
        return this.id;
    }

    NodeRepresentation.prototype.setId = function (id) {
        this.id = id;
    }

    NodeRepresentation.prototype.getName = function () {
        return this.name;
    }

    NodeRepresentation.prototype.setName = function (name) {
        this.name = name;
    }

    NodeRepresentation.prototype.isReportable = function () {
        return this.reportable;
    }

    NodeRepresentation.prototype.isVisited = function () {
        return this.visited;
    }

    NodeRepresentation.prototype.isChapter = function () {
        return this._isChapter;
    }

    NodeRepresentation.prototype.size = function () {
        return this.children.length;
    }

    NodeRepresentation.prototype.setChildren = function (children) {
        this.children = children;
    }

    NodeRepresentation.prototype.toString = function () {
        return (
            `[id: "${this.getId()}", ` +
            `name: "${this.getName()}", ` +
            `type: "${this.type}", ` +
            `isReportable: ${this.isReportable()}, ` +
            `isVisited: ${this.isVisited()}, ` +
            `isChapter: ${this.isChapter()}, ` +
            `size: ${this.size()}]`
        );
    }

    function createDeepNodeRepresentationOfContentInformation(contentInformation, nodeRepresentation) {
        if (!nodeRepresentation) {
            nodeRepresentation = createEmptyNodeRepresentation();
        }
        let nodeRepresentationChildren = [];
        const childrenInformation = getChildrenContentInformation(contentInformation, nodeRepresentation.getId());
        childrenInformation.forEach((information) => {
            let childNodeRepresentation = createNodeRepresentationBaseOnContentInformation(information);
            if (childNodeRepresentation.isChapter()) {
                createDeepNodeRepresentationOfContentInformation(contentInformation, childNodeRepresentation);
                childNodeRepresentation.setId("chapter");
            }
            nodeRepresentationChildren.push(childNodeRepresentation);
        });
        nodeRepresentation.setChildren(nodeRepresentationChildren);
        return nodeRepresentation;
    }

    function getChildrenContentInformation(contentInformation, parentId) {
        let nodesInformation = [];
        contentInformation.forEach((information) => {
            if (information.parentId === parentId)
                nodesInformation.push(information);
        });
        return nodesInformation;
    }

    function createDeepNodeRepresentationOfNode(node, nodeRepresentation) {
        if (!nodeRepresentation) {
            nodeRepresentation = createEmptyNodeRepresentation();
        }
        let nodeRepresentationChildren = [];
        for (let i = 0; i < node.size(); i++) {
            const childNode = node.get(i);
            let childNodeRepresentation = createNodeRepresentationBaseOnNode(childNode);
            if (childNodeRepresentation.isChapter()) {
                createDeepNodeRepresentationOfNode(childNode, childNodeRepresentation);
            }
            nodeRepresentationChildren.push(childNodeRepresentation);
        }
        nodeRepresentation.setChildren(nodeRepresentationChildren);
        return nodeRepresentation;
    }

    function createNodeRepresentationBaseOnNode (node) {
        const isChapter = node.type === "chapter";
        const id = isChapter ? "chapter" : node.getId();
        const name = node.getName();
        const reportable = node.isReportable ? node.isReportable() : false;
        const visited = node.isVisited ? node.isVisited() : false;
        return new NodeRepresentation(id, name, node.type, reportable, visited);
    }

    function createNodeRepresentationBaseOnContentInformation (contentInformation) {
        const id = contentInformation.id;
        const name = contentInformation.name;
        const reportable = contentInformation.isReportable === "true";
        const visited = contentInformation.isVisited === "true";
        return new NodeRepresentation(id, name, contentInformation.type, reportable, visited);
    }

    presenter.PRINTABLE_STATE_MODE = {
        EMPTY: 0,
        SHOW_RESULTS: 1,
    };

    presenter.getPrintableHTML = function (model, showAnswers) {
        var upgradedModel = presenter.upgradeModel(model);
        presenter.printableConfiguration = presenter.validateModel(upgradedModel);
        var $view = createViewForPrintable(presenter.printableConfiguration);

        chosePrintableStateMode();
        initLessonScore();
        parsePrintableControllerLessonsScoresToValidForm();

        var $hierReport = $(findPrintableHierReport($view));
        var $table = $hierReport.find('table');
        addHeader(presenter.printableConfiguration, $table);

        var rootRepresentation = printableController.isPreview()
            ? createPreviewPrintableStructure()
            : createPrintableStructure();

        resetIndexes();
        presenter.createTree($hierReport, rootRepresentation,null);

        if (presenter.printableConfiguration.showTotal) {
            addFooter(presenter.printableConfiguration, $table);
        }
        addIndentationsInTable($table);

        cleanAfterPrintableState();
        return $view[0].outerHTML;
    };

    function addIndentationsInTable($table) {
        let contentInformation = [];
        const elementRegExp = new RegExp(CSS_CLASSES.PRINTABLE_HIER_REPORT_NODE + "-[0-9]+");
        const parentElementNodeRegExp = new RegExp(CSS_CLASSES.PRINTABLE_HIER_REPORT_PARENT + "-[0-9]+");

        let $rowsWithAddons = $table
            .find(`tr`)
            .not(`.${CSS_CLASSES.PRINTABLE_HIER_REPORT_HEADER}`)
            .not(`.${CSS_CLASSES.PRINTABLE_HIER_REPORT_FOOTER}`);

        $rowsWithAddons.each(
            function() {
                const classes = $(this).attr('class').split(' ');
                let elementRepresentation = {
                    "id": getElementIdUsingClassNameWithId(classes, elementRegExp),
                    "name": $(this),
                    "parentId": getElementIdUsingClassNameWithId(classes, parentElementNodeRegExp),
                    "type": "chapter",
                    "isReportable": null,
                    "isVisited": null,
                };
                contentInformation.push(elementRepresentation)
            }
        );

        let nodeRepresentation = createDeepNodeRepresentationOfContentInformation(contentInformation);
        addIndentationsInTableBaseOnPrintableNodesStructure(nodeRepresentation);
    }

    function getElementIdUsingClassNameWithId(elementClasses, classNameRegExp) {
        for (var i = 0; i < elementClasses.length; i++) {
            var matches = classNameRegExp.exec(elementClasses[i]);
            if (matches != null) {
                var pieces = matches[0].split('-');
                return pieces[pieces.length-1];
            }
        }
        return null;
    }

    function addIndentationsInTableBaseOnPrintableNodesStructure(mainNode, indentNumber = 0) {
        var $indent = $(document.createElement('span'));
        $indent.addClass(CSS_CLASSES.PRINTABLE_HIER_REPORT_INDENT);

        for (var i = 0; i < mainNode.size(); i++ ) {
            var child = mainNode.get(i);
            var $childElement = child.getName().find(`.${CSS_CLASSES.TEXT_WRAPPER}`);
            for (var indentId = 0; indentId < indentNumber; indentId++) {
                $childElement.before($indent.clone());
            }
            addIndentationsInTableBaseOnPrintableNodesStructure(child, indentNumber+1);
        }
    }

    function createPreviewPrintableStructure() {
        const contentInformation = generatePreviewContentInformation();
        return createDeepNodeRepresentationOfContentInformation(contentInformation);
    }

    function generatePreviewContentInformation() {
        return [
           generatePreviewPageForContentInformation("0", "Page1", null),
           generatePreviewChapterForContentInformation("1", "Unit1", null),
           generatePreviewPageForContentInformation("2", "Page2", "1"),
           generatePreviewChapterForContentInformation("3", "Chapter1", "1"),
           generatePreviewPageForContentInformation("4", "Page3", "3"),
           generatePreviewPageForContentInformation("5", "Page4", "3"),
           generatePreviewChapterForContentInformation("6", "Chapter2", "1"),
           generatePreviewPageForContentInformation("7", "Page5", "6"),
           generatePreviewPageForContentInformation("8", "Page6", "1"),
           generatePreviewPageForContentInformation("9", "Page7", null),
           generatePreviewPageForContentInformation("10", "Page8", null),
           generatePreviewPageForContentInformation("11", "Page9", null),
           generatePreviewPageForContentInformation("12", "Page10", null),
           generatePreviewPageForContentInformation("13", "Page11", null),
       ];
    }

    function generatePreviewChapterForContentInformation(id, name, parentId) {
        return generatePreviewObjectForContentInformation(
            id, name, parentId, "chapter");
    }

    function generatePreviewPageForContentInformation(id, name, parentId) {
        return generatePreviewObjectForContentInformation(
            id, name, parentId, "page");
    }

    function generatePreviewObjectForContentInformation(id, name, parentId, type) {
        return {
            "id": id,
            "parentId": parentId,
            "name": name,
            "isReportable": "true",
            "isVisited": "false",
            "type": type
        }
    }

    function createEmptyNodeRepresentation() {
        return new NodeRepresentation(null, null, null, null, false, false);
    }

    function createPrintableStructure() {
        const contentInformation = printableController.getContentInformation();
        return createDeepNodeRepresentationOfContentInformation(contentInformation);
    }

    function createRunStructure() {
        const root = presentationController.getPresentation().getTableOfContents();
        return createDeepNodeRepresentationOfNode(root);
    }

    function createViewForPrintable(configuration) {
        var $table = $('<table></table>');
        $table.addClass(CSS_CLASSES.PRINTABLE_HIER_REPORT_TABLE);

        var $hier_report = $('<div></div>');
        $hier_report.addClass(CSS_CLASSES.PRINTABLE_HIER_REPORT);
        $hier_report.append($table);

        var $view = $("<div></div>");
        $view.attr("id", configuration.ID);
        $view.addClass(CSS_CLASSES.PRINTABLE);
        $view.css("max-width", configuration.width + "px");
        $view.css("min-height", configuration.height + "px");
        $view.append($hier_report);
        return $view;
    }

    function chosePrintableStateMode() {
        if (presenter.printableState) {
            presenter.printableStateMode = presenter.PRINTABLE_STATE_MODE.SHOW_RESULTS;
        } else {
            presenter.printableStateMode = presenter.PRINTABLE_STATE_MODE.EMPTY;
        }
    }

    function isInPrintableShowResultsStateMode() {
        return presenter.printableStateMode === presenter.PRINTABLE_STATE_MODE.SHOW_RESULTS;
    }

    function isInPrintableEmptyStateMode() {
        return presenter.printableStateMode === presenter.PRINTABLE_STATE_MODE.EMPTY;
    }

    function findPrintableHierReport($view) {
        return $view.find(`.${CSS_CLASSES.PRINTABLE_HIER_REPORT}`);
    }

    function isInPrintableStateMode() {
        return presenter.printableStateMode !== null;
    }

    function cleanAfterPrintableState() {
        presenter.printableStateMode = null;
        presenter.printableLessonScore = null;
    }

    function resetIndexes() {
        absoluteIndex = 0;
        relativeIndex = 0;
        chapterIndex = 0;
        pageIndex = 0;
    }

    return presenter;
}
