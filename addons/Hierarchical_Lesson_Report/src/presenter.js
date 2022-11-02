function AddonHierarchical_Lesson_Report_create() {
    var presenter = function () {};
    var presentationController;
    var printableController;
    var isWCAGOn = false;

    var pageInChapterIndex = 0;
    var absolutePageIndex = 0;
    var realPageIndex = 0;
    var chapters = 0;

    var printablePageInChapterIndex = 0;
    var printableAbsolutePageIndex = 0;
    var printableRealPageIndex = 0;
    var printableChapters = 0;

    var currentRow = 1;
    var currentColumn = 0;

    presenter.printableState = null;
    presenter.printableStateMode = null;

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
        var isInPrintableMode = isInPrintableStateMode();
        var labels = configuration.labels;

        var $row = generateHeaderRow(isInPrintableMode);

        addTitleCell($row, labels.title);
        if (configuration.showResults)
            addResultsHeaderCell($row, labels.results, isInPrintableMode);
        if (configuration.showChecks)
            addChecksCell($row, labels.checks, isInPrintableMode);
        if (configuration.showMistakes)
            addMistakesCell($row, labels.mistakes, isInPrintableMode);
        if (configuration.showErrors)
            addErrorsCell($row, labels.errors, isInPrintableMode);
        if (configuration.showPageScore)
            addPageScoreCell($row, labels.pageScores, isInPrintableMode);
        if (configuration.showMaxScoreField)
            addMaxScoreAwardCell($row, labels.maxScoreAward, isInPrintableMode);

        $row.prependTo($view);
    }

    function addFooter(configuration, $view) {
        var isInPrintableMode = isInPrintableStateMode();
        var lessonScore = getLessonScore();

        var $row = generateFooterRow(isInPrintableMode);

        addTitleCell($row, configuration.labels.total);
        if (configuration.showResults)
            addResultsFooterCell($row, isInPrintableMode);
        if (configuration.showChecks)
            addChecksCell($row, lessonScore.checks, isInPrintableMode);
        if (configuration.showMistakes)
            addMistakesCell($row, lessonScore.mistakes, isInPrintableMode);
        if (configuration.showErrors)
            addErrorsCell($row, lessonScore.errors, isInPrintableMode);
        if (configuration.showPageScore)
            addPageScoreFooterCell($row, lessonScore, isInPrintableMode);
        if (configuration.showMaxScoreField)
            addMaxScoreAwardCell($row, undefined, isInPrintableMode);

        $row.appendTo($view);
    }

    function generateHeaderRow(isInPrintableMode) {
        const className = isInPrintableMode
            ? CSS_CLASSES.PRINTABLE_HIER_REPORT_HEADER
            : CSS_CLASSES.HIER_REPORT_HEADER;
        return generateRow(className);
    }

    function generateFooterRow(isInPrintableMode) {
        const className = isInPrintableMode
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

    function addResultsHeaderCell($row, header, isInPrintableMode) {
        const className = isInPrintableMode
            ? CSS_CLASSES.PRINTABLE_HIER_REPORT_PROGRESS_HEADER
            : CSS_CLASSES.HIER_REPORT_PROGRESS;
        addCell($row, header, className);
    }

    function addChecksCell($row, checks, isInPrintableMode) {
        const className = isInPrintableMode
            ? CSS_CLASSES.PRINTABLE_HIER_REPORT_CHECKS
            : CSS_CLASSES.HIER_REPORT_CHECKS;
        addCell($row, checks, className);
    }

    function addMistakesCell($row, mistakes, isInPrintableMode) {
        const className = isInPrintableMode
            ? CSS_CLASSES.PRINTABLE_HIER_REPORT_MISTAKES
            : CSS_CLASSES.HIER_REPORT_MISTAKES;
        addCell($row, mistakes, className);
    }

    function addErrorsCell($row, errors, isInPrintableMode) {
        const className = isInPrintableMode
            ? CSS_CLASSES.PRINTABLE_HIER_REPORT_ERRORS
            : CSS_CLASSES.HIER_REPORT_ERRORS;
        addCell($row, errors, className);
    }

    function addPageScoreCell($row, pageScore, isInPrintableMode) {
        const className = isInPrintableMode
            ? CSS_CLASSES.PRINTABLE_HIER_REPORT_PAGE_SCORE
            : CSS_CLASSES.HIER_REPORT_PAGE_SCORE;
        addCell($row, pageScore, className);
    }

    function addMaxScoreAwardCell($row, maxScoreAward, isInPrintableMode) {
        const className = maxScoreAward
            ? (isInPrintableMode
                ? CSS_CLASSES.PRINTABLE_HIER_REPORT_PAGE_MAX_SCORE
                : CSS_CLASSES.HIER_REPORT_PAGE_MAX_SCORE)
            : undefined;
        addCell($row, maxScoreAward, className);
    }

    function addCell($row, value, className) {
        var $cell = $(document.createElement('td'));
        if (className !== undefined)
            $cell.addClass(className);
        if (value !== undefined)
            $cell.html(value);
        $cell.appendTo($row);
    }

    function addResultsFooterCell($row, isInPrintableMode) {
        var isInPrintableEmptyState = isInPrintableEmptyStateMode();
        var isPreview = isPreviewConsideringPrintableState(isInPrintableMode);
        var calculateScore = !(isPreview || (isInPrintableMode && isInPrintableEmptyState));

        createProgressCell($row, {
            score: calculateScore ? presenter.calculateLessonScaledScore() : 0,
            count: 1
        }, undefined, undefined, isInPrintableMode);
    }

    function isPreviewConsideringPrintableState(isInPrintableMode) {
        return isInPrintableMode
           ? printableController.isPreview()
           : presenter.isPreview;
    }

    presenter.calculateLessonScaledScore = function () {
        var lessonScore = getLessonScore();
        if (lessonScore.pageCount === 0) {
            return 0;
        }

        return Math.round((lessonScore.scaledScore / lessonScore.pageCount) * 100) / 100;
    };

    function addPageScoreFooterCell($cell, lessonScore, isInPrintableMode) {
        var $separator = generateSeparator(isInPrintableMode);
        var content = lessonScore.score + $separator[0].outerHTML + lessonScore.maxScore;
        addPageScoreCell($cell, content, isInPrintableMode);
    }

    function createRow($view, index, parentIndex, isChapter, configuration, isInPrintableMode) {
        var row = document.createElement('tr');
        $(row).appendTo($view.find('table'));
        $(row).addClass(configuration.classes[index % configuration.classes.length]);

        var nodeClassName = isInPrintableMode
          ? CSS_CLASSES.PRINTABLE_HIER_REPORT_NODE + '-' + index
          : "treegrid-" + index;
        $(row).addClass(nodeClassName);

        if (parentIndex != null) {
            var parentNodeClassName = isInPrintableMode
              ? CSS_CLASSES.PRINTABLE_HIER_REPORT_PARENT + '-' + parentIndex
              : "treegrid-parent-" + parentIndex
            $(row).addClass(parentNodeClassName);
        }

        var isOdd = index % 2 > 0;
        var typeClassName = isChapter
          ? getRowChapterClassName(isInPrintableMode)
          : getRowPageClassName(isOdd, isInPrintableMode);
        $(row).addClass(typeClassName);

        return row;
    }

    function getRowChapterClassName(isInPrintableMode) {
        return isInPrintableMode
            ? CSS_CLASSES.PRINTABLE_HIER_REPORT_CHAPTER
            : CSS_CLASSES.HIER_REPORT_CHAPTER;
    }

    function  getRowPageClassName(isOdd, isInPrintableMode) {
        if (isOdd) {
            return isInPrintableMode
              ? CSS_CLASSES.PRINTABLE_HIER_REPORT_ODD
              : CSS_CLASSES.HIER_REPORT_ODD;
        }
        return isInPrintableMode
          ? CSS_CLASSES.PRINTABLE_HIER_REPORT_EVEN
          : CSS_CLASSES.HIER_REPORT_EVEN;
    }

    function createProgressCell(row, score, index, isChapter, isInPrintableState) {
        var progressCell = document.createElement('td');
        $(progressCell).appendTo($(row));

        var progressCellClassName = isInPrintableState
            ? CSS_CLASSES.PRINTABLE_HIER_REPORT_PROGRESS
            : CSS_CLASSES.HIER_REPORT_PROGRESS;
        $(progressCell).addClass(progressCellClassName);

        var percent = Math.floor(score.score / score.count * 100);
        var innerHTML = percent + "%";

        if (isInPrintableState) {
            $(progressCell).html(innerHTML);
        } else {
            var progressbar = document.createElement('div');
            $(progressbar).attr("id", "progressbar-" + index);
            $(progressbar).addClass(CSS_CLASSES.HIER_REPORT_PROGRESSBAR);
            $(progressbar).appendTo($(progressCell));

            var progressInfo = document.createElement('div');
            $(progressInfo).attr("style", "float: right");
            $(progressInfo).html(innerHTML);
            $(progressInfo).appendTo($(progressCell));

            if (!isChapter) {
                $(progressbar).progressbar({
                    value: Math.floor(score.score * 100),
                    max: 100
                });
            }
        }
    }

    presenter.isPageVisited = function (pageId) {
        if (isInPrintableStateMode()) {
            if (printableController.isPreview())
                return false;

            if (isInPrintableEmptyStateMode())
                return false;
            return printableController.getContentInformation().find(x => x.id === pageId).isVisited === "true";
        }
        return presentationController.getPresentation().getPageById(pageId).isVisited();
    };

    presenter.getPageScaledScore = function(maxScore, score, isChapter, pageID) {
        var isInPrintableMode = isInPrintableStateMode();
        var isInPrintableEmptyState = isInPrintableEmptyStateMode();

        if (isInPrintableMode && isInPrintableEmptyState)
            return 0;

        if (maxScore) {
            return score / maxScore;
        }

        var isPreview = isPreviewConsideringPrintableState(isInPrintableMode);
        if (!isPreview && !isChapter)
            return presenter.isPageVisited(pageID) ? 1 : 0;
        return 0;
    };

    presenter.getProperScore = function(score, pageId) {
        var isInPrintableMode = isInPrintableStateMode();
        var isInPrintableEmptyState = isInPrintableEmptyStateMode();
        var isPreview = isPreviewConsideringPrintableState(isInPrintableMode);

        if (isPreview || (isInPrintableMode && isInPrintableEmptyState)) {
            score.score = score.maxScore !== 0
                ? (score.score / score.maxScore)
                : 0;
        } else {
            score.score = score.maxScore !== 0
                ? (score.score / score.maxScore)
                : (presenter.isPageVisited(pageId) ? 1 : 0);
        }
        return score.score;
    };

    function createScoreCells(row, pageId, index, isChapter, configuration, isInPrintableMode) {
        var lessonScore = getLessonScore();
        var absPageIndex = isInPrintableMode ? printableAbsolutePageIndex : absolutePageIndex;
        var isScoreEnable = configuration.disabledScorePages.indexOf(absPageIndex) === -1;
        var score = getScoreByPageIdForScoreCell(pageId, isInPrintableMode);
        var pageScore = 0;

        if (!isChapter) {
            pageScore = score.score;
            score.count = 1;
            score.score = presenter.getProperScore(score, pageId);
        }

        if (isScoreEnable) {
            if (configuration.showResults) createProgressCell(row, score, index, isChapter, isInPrintableMode);

            if (!isChapter) {
                lessonScore.pageCount++;
            }
            lessonScore.checks += score.checkCount;
            lessonScore.mistakes += score.mistakeCount;
            lessonScore.errors += score.errorCount;
            lessonScore.score += pageScore;
            lessonScore.maxScore += score.maxScore;
            lessonScore.scaledScore += presenter.getPageScaledScore(score.maxScore, pageScore, isChapter, pageId);

            if (configuration.showChecks)
                addChecksCell($(row), score.checkCount, isInPrintableMode);
            if (configuration.showMistakes)
                addMistakesCell($(row), score.mistakeCount, isInPrintableMode);
            if (configuration.showErrors)
                addErrorsCell($(row), score.errorCount, isInPrintableMode);
            if (configuration.showPageScore)
                addPageScoreRowCell($(row), pageScore, score, isInPrintableMode);
            if (configuration.showMaxScoreField)
                addMaxScoreAwardRowCell($(row), pageScore, score, pageId, isInPrintableMode);
        } else {
            var c = configuration;
            var columns = [c.showResults, c.showChecks, c.showMistakes, c.showErrors, c.showPageScore, c.showMaxScoreField].filter(function(a) { return a }).length;
            var $colspan = $("<td colspan='" + columns + "'></td>");
            const className = isInPrintableMode
                ? CSS_CLASSES.PRINTABLE_HIER_REPORT_SCORE_DISABLED_ROW
                : CSS_CLASSES.HIER_REPORT_SCORE_DISABLED_ROW;
            $colspan.addClass(className);
            $colspan.appendTo($(row));
        }
    }

    function getScoreByPageIdForScoreCell(pageId, isInPrintableMode) {
        if (isPreviewConsideringPrintableState(isInPrintableMode))
            return resetScore();

        if (isInPrintableMode)
            return getPrintablePageScoreById(pageId);
        return presentationController.getScore().getPageScoreById(pageId);
    }

    function getPrintablePageScoreById(pageId) {
        var score = printableController.getScore();
        if (score === null)
            return resetScore();

        if (score.hasOwnProperty(pageId))
            return {...score[pageId]}
        return resetScore();
    }

    function addPageScoreRowCell($view, pageScore, score, isInPrintableMode) {
        var innerHTML = presenter.insertPageScoreValuesToPage(pageScore, score, isInPrintableMode);
        addPageScoreCell($view, innerHTML, isInPrintableMode);
    }

    function addMaxScoreAwardRowCell($view, pageScore, score, pageId, isInPrintableMode) {
        var $cell = $(document.createElement('td'));

        var isMaxScore = pageScore === score.maxScore && score.maxScore !== 0;
        const className = isMaxScore
            ? (isInPrintableMode
                ? CSS_CLASSES.PRINTABLE_HIER_REPORT_PAGE_MAX_SCORE
                : CSS_CLASSES.HIER_REPORT_PAGE_MAX_SCORE)
            : (isInPrintableMode
                ? CSS_CLASSES.PRINTABLE_HIER_REPORT_PAGE_NON_MAX_SCORE
                : CSS_CLASSES.HIER_REPORT_PAGE_NON_MAX_SCORE);
        $cell.addClass(className);

        if (!isInPrintableMode) {
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

    presenter.insertPageScoreValuesToPage = function(pageScore, score, isInPrintableState) {
        var configuration = getConfiguration();
        if (score.score === 0 && score.maxScore === 0) {
            return configuration.labels.unvisitedPageScore;
        }

        var $separator = generateSeparator(isInPrintableState);
        return pageScore + $separator[0].outerHTML + score.maxScore;
    };

    function generateSeparator(isInPrintableState) {
        const className = isInPrintableState
            ? CSS_CLASSES.PRINTABLE_HIER_REPORT_SEPARATOR
            : CSS_CLASSES.HIER_REPORT_SEPARATOR;
        var $separator = $('<span></span>');
        $separator.html('/');
        $separator.addClass(className);
        return $separator;
    }

    function generateTextWrapper(text, isChapter, pageId, isInPrintableMode) {
        var $textWrapper = $(document.createElement('div'));
        $textWrapper.addClass(CSS_CLASSES.TEXT_WRAPPER);
        var innerHTML = text;
        if (!isChapter && !isInPrintableMode)
            innerHTML = generatePageLinks(text, isChapter, pageId);
        $textWrapper.html(innerHTML);

        var $element = $(document.createElement('td'));
        $element.append($textWrapper);

        return $element;
    }

    function generatePageLinks(text, isChapter, pageId) {
        return $("<a></a>").html(text).attr('href', '#').attr('data-page-id', pageId);
    }

    function checkIfChapterHasChildren () {
        presenter.$view.find(".hier_report-chapter").each(function () {
           if(!$(this).hasClass('treegrid-collapsed') && !$(this).hasClass('treegrid-expanded')) {
               $(this).remove();
           }
        });
    }

    function checkIfPageEnabled (index) {
        var configuration = getConfiguration();
        var isInPrintableState = isInPrintableStateMode();
        var realChapter = isInPrintableState ? printableChapters : chapters;
        var realIndex = parseInt(index-realChapter, 10);
        if(configuration.enablePages != '' && configuration.enablePages != undefined){
            return configuration.enablePages.indexOf(realIndex) > -1;
        } else {
            return true;
        }
    }

    function addRow($view, node, index, parentIndex, isChapter, pageId, isPreview) {
        if (isPreview){
            addRowForPreview($view, node, index, parentIndex, isChapter, pageId);
        } else {
            addRowForRun($view, node, index, parentIndex, isChapter, pageId)
        }
    }

    function addRowForPreview($view, node, index, parentIndex, isChapter, pageId) {
        var name = node.getName();
        buildRow($view, name, index, parentIndex, isChapter, pageId);
    }

    function addRowForRun($view, node, index, parentIndex, isChapter, pageId) {
        var name = node.getName();
        var isInPrintableState = isInPrintableStateMode();
        if (isChapter){
            addChapterRowForRun($view, name, index, parentIndex, pageId, isInPrintableState)
        } else if (checkIfPageEnabled(index)) {
            addPageRowForRun($view, name, index, parentIndex, pageId, isInPrintableState);
        }
    }

    function addChapterRowForRun($view, name, index, parentIndex, pageId, isInPrintableState) {
        if (isInPrintableState) {
            printableChapters++
            var chapterIndex = printableChapters;
        } else {
            chapters++;
            var chapterIndex = chapters;
        }

        var alternativeName = presenter.findAlternativeName(chapterIndex, true);
        name = alternativeName || name;
        buildRow($view, name, index, parentIndex, true, pageId);
    }

    function addPageRowForRun($view, name, index, parentIndex, pageId, isInPrintableState) {
        var pageIndex = isInPrintableState ? printableRealPageIndex : realPageIndex;

        var alternativeName = presenter.findAlternativeName(pageIndex, false);
        name = alternativeName || name;
        buildRow($view, name, index, parentIndex, false, pageId);
    }

    presenter.findAlternativeName = function (index, isChapter){
        var result = undefined;
        var configuration = getConfiguration();
        var alternativeTitles = configuration.alternativePageTitles;

        for (var i =0; i < alternativeTitles.length; i++){
            if (alternativeTitles[i].alternativePageNumber === index && alternativeTitles[i].alternativePageIsChapter === isChapter){
                result = alternativeTitles[i].alternativePageName;
            }
        }
        return result;
    };

    function buildRow ($view, name, index, parentIndex, isChapter, pageId) {
        var configuration = getConfiguration();
        var isInPrintableMode = isInPrintableStateMode();

        var row = createRow($view, index, parentIndex, isChapter, configuration, isInPrintableMode);

        var $nameCell = generateTextWrapper(name, isChapter, pageId, isInPrintableMode);
        $nameCell.appendTo($(row));

        createScoreCells(row, pageId, index, isChapter, configuration, isInPrintableMode);
    }

    function updateRow($row, pageIndex, pageScore) {
        var hasChildren = pageScore.count > 0;

        var configuration = getConfiguration();
        var isInPrintableMode = isInPrintableStateMode();

        if (configuration.showResults)
            updateResultsCell($row, pageIndex, pageScore.score, pageScore.count, hasChildren, isInPrintableMode);
        if (configuration.showChecks)
            updateChecksCell($row, pageScore.checkCount, hasChildren, isInPrintableMode);
        if (configuration.showMistakes)
            updateMistakesCell($row, pageScore.mistakeCount, hasChildren, isInPrintableMode);
        if (configuration.showErrors)
            updateErrorsCell($row, pageScore.errorCount, hasChildren, isInPrintableMode);
        if (configuration.showPageScore)
            updatePageScoreCell($row, pageScore, hasChildren, configuration, isInPrintableMode);
    }

    function updateResultsCell($row, pageIndex, score, count, hasChildren, isInPrintableMode) {
        if (isInPrintableMode)
            updateResultsPrintableCell($row, pageIndex, score, count, hasChildren);
        else
            updateResultsRunCell($row, pageIndex, score, count, hasChildren);
    }

    function updateResultsPrintableCell($row, pageIndex, score, count, hasChildren) {
        const className = CSS_CLASSES.PRINTABLE_HIER_REPORT_PROGRESS;
        const percent = (Math.floor((score / count) * 100) || 0) + '%';
        updateCell($row, percent, hasChildren, className);
    }

    function updateResultsRunCell($row, pageIndex, score, count, hasChildren) {
        var percent = Math.floor((score / count) * 100) || 0;
        var progressbar = $row.find("#progressbar-" + pageIndex);
        if (hasChildren) {
            $(progressbar).progressbar({value: Math.floor((score / count) * 100), max: 100});
            $(progressbar).closest("div").next().html(percent + '%');
        } else {
            $(progressbar).closest("div").next().html('-').attr('style', '');
        }
    }

    function updateChecksCell($row, checks, hasChildren, isInPrintableMode) {
        const className = isInPrintableMode
            ? CSS_CLASSES.PRINTABLE_HIER_REPORT_CHECKS
            : CSS_CLASSES.HIER_REPORT_CHECKS;
        updateCell($row, checks, hasChildren, className);
    }

    function updateMistakesCell($row, mistakes, hasChildren, isInPrintableMode) {
        const className = isInPrintableMode
            ? CSS_CLASSES.PRINTABLE_HIER_REPORT_MISTAKES
            : CSS_CLASSES.HIER_REPORT_MISTAKES;
        updateCell($row, mistakes, hasChildren, className);
    }

    function updateErrorsCell($row, errors, hasChildren, isInPrintableMode) {
        const className = isInPrintableMode
            ? CSS_CLASSES.PRINTABLE_HIER_REPORT_ERRORS
            : CSS_CLASSES.HIER_REPORT_ERRORS;
        updateCell($row, errors, hasChildren, className);
    }

    function updatePageScoreCell($row, pageScore, hasChildren, configuration, isInPrintableMode) {
        const className = isInPrintableMode
            ? CSS_CLASSES.PRINTABLE_HIER_REPORT_PAGE_SCORE
            : CSS_CLASSES.HIER_REPORT_PAGE_SCORE;
        const value = presenter.insertPageScoreValuesToChapter(pageScore, configuration, isInPrintableMode);
        updateCell($row, value, hasChildren, className);
    }

    function updateCell($row, value, hasChildren, searchClassName) {
        const searchPhrase = `.${searchClassName}`;
        const innerHTML = hasChildren ? value : '-';
        $row.find(searchPhrase).html(innerHTML);
    }

    presenter.insertPageScoreValuesToChapter = function(pageScore, configuration, isInPrintableMode) {
        if (pageScore.countedMaxScore != 0) {
            var $separator = generateSeparator(isInPrintableMode);
            return pageScore.countedScore + $separator[0].outerHTML + pageScore.countedMaxScore;
        } else {
            return configuration.labels.unvisitedPageScore;
        }
    };

    presenter.updateChapterScore = function(score, update, isEnabled) {
        if (isEnabled) {
            score.countedScore += update.countedScore || update.score;
            score.countedMaxScore += update.countedMaxScore || update.maxScore;
            score.score += update.maxScore === 0 ? update.score : update.score / update.maxScore;
            score.errorCount += update.errorCount;
            score.checkCount += update.checkCount;
            score.mistakeCount += update.mistakeCount;
            score.count += update.count;
        }

        return score;
    };

    function resetScore() {
        return {
            checkCount: 0,
            count: 0,
            countedScore: 0,
            countedMaxScore: 0,
            errorCount: 0,
            maxScore: 0,
            mistakeCount: 0,
            score: 0,
        };
    }

    presenter.createPreviewTree = function() {
        var mainNode = new PrintableNode(null, null, null, null, null);
        var contentInformation = generatePreviewContentInformation();
        findAndSetChildrenForPrintableNode(contentInformation, mainNode);

        var chapterScore = resetScore();
        for (var i = 0; i < mainNode.size(); i++) {
            var $view = $("#" + presenter.treeID);
            addRow($view, mainNode.get(i), i, contentInformation[i].parentId, false, "some_id", true);
        }
        return chapterScore;
    };

    presenter.createTree = function(root, parentIndex, pageCount) {
        var chapterIndex = 0,
            chapterScore = resetScore(),
            pageScore = resetScore(),
            isEmpty = true,
            values = {},
            isEnabled = true;

        for (var i = 0; i < pageCount; i++) {
            var isChapter = root.get(i).type === 'chapter';

            if (!isChapter) {
                realPageIndex++;
                if (root.get(i).isReportable()) {
                    // at least one page is reportable
                    isEmpty = false;
                } else {
                    if(presenter.configuration.enablePages != '' && presenter.configuration.enablePages != undefined) {
                        pageInChapterIndex++;
                    }
                    absolutePageIndex++;
                    continue;
                }
            }

            var pageId = isChapter ? "chapter" : root.get(i).getId();
            var $view = $("#" + presenter.treeID);
            addRow($view, root.get(i), pageInChapterIndex, parentIndex, isChapter, pageId, false);
            absolutePageIndex++;

            pageScore = presentationController.getScore().getPageScoreById(pageId);
            pageScore.count = 1;
            pageInChapterIndex++;

            if (isChapter) {
                chapterIndex = pageInChapterIndex - 1;
                values = presenter.createTree(root.get(i), chapterIndex, root.get(i).size());
                var $row = $(".treegrid-" + chapterIndex);
                updateRow($row, chapterIndex, values.pagesScore);
                pageScore = values.pagesScore;
            }

            isEnabled = presenter.configuration.disabledScorePages.indexOf(absolutePageIndex);
            chapterScore = presenter.updateChapterScore(chapterScore, pageScore, isEnabled);
        }

        return { pagesScore: chapterScore, isEmpty: isEmpty };
    };

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
            state.push($(this).treegrid('isExpanded'))
        });
        return state;
    }

    function restoreTreeState(state) {
        $('.hier_report table').find('tr').not('.hier_report-header').not('.hier_report-footer').each(function () {
            $(this).treegrid(state[$(this).treegrid('getNodeId')] ? 'expand' : 'collapse');
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

    presenter.upgradeModel = function (model) {
        var newModel = presenter.upgradeAlternativePageNamesProperty(model);
        newModel = presenter.upgradeTextToSpeechSupport(newModel);
        return newModel;
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
            langTag: model['langAttribute']
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
        if (isPreview) {
            presenter.createPreviewTree();
        } else {
            var presentation = presentationController.getPresentation();
            presenter.createTree(presentation.getTableOfContents(), null, presentation.getTableOfContents().size());
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
        var initLessonScore = {
            pageCount: 0,
            checks: 0,
            errors: 0,
            mistakes: 0,
            score: 0,
            maxScore: 0,
            scaledScore: 0
        };

        if (isInPrintableStateMode()) {
            presenter.printableLessonScore = initLessonScore;
        } else {
            presenter.lessonScore = initLessonScore;
        }
    }

    function getLessonScore() {
        if (isInPrintableStateMode())
            return presenter.printableLessonScore;
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

    /**
     * @param id
     * @param name
     * @param type
     * @param reportable
     * @param visited
     * @constructor
     */
    function PrintableNode (id, name, type, reportable, visited) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.reportable = reportable === "true";
        this.visited = visited === "true";
        this.children = [];
    }

    PrintableNode.prototype = Object.create(PrintableNode.prototype);
    PrintableNode.prototype.constructor = PrintableNode;

    PrintableNode.prototype.get = function (index) {
        return this.children[index];
    }

    PrintableNode.prototype.getId = function () {
        return this.id;
    }

    PrintableNode.prototype.getName = function () {
        return this.name;
    }

    PrintableNode.prototype.isReportable = function () {
        return this.reportable;
    }

    PrintableNode.prototype.isVisited = function () {
        return this.visited;
    }

    PrintableNode.prototype.size = function () {
        return this.children.length;
    }

    PrintableNode.prototype.setChildren = function (children) {
        this.children = children;
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

        var root = printableController.isPreview()
            ? createPreviewPrintableStructure()
            : createPrintableStructure();

        presenter.createPrintableTree(
            $hierReport, root,null, root.size());

        if (presenter.printableConfiguration.showTotal) {
            addFooter(presenter.printableConfiguration, $table);
        }
        addIndentationsInTable($table);

        cleanAfterPrintableState();
        return $view[0].outerHTML;
    };

    function addIndentationsInTable($table) {
        var elementsRepresentations = [];
        const elementRegExp = new RegExp(CSS_CLASSES.PRINTABLE_HIER_REPORT_NODE + "-[0-9]+");
        const parentElementNodeRegExp = new RegExp(CSS_CLASSES.PRINTABLE_HIER_REPORT_PARENT + "-[0-9]+");

        var $rowsWithAddons = $table
            .find(`tr`)
            .not(`.${CSS_CLASSES.PRINTABLE_HIER_REPORT_HEADER}`)
            .not(`.${CSS_CLASSES.PRINTABLE_HIER_REPORT_FOOTER}`);

        $rowsWithAddons.each(
            function() {
                var classes = $(this).attr('class').split(' ');
                var elementRepresentation = {
                    "id": getElementIdUsingClassNameWithId(classes, elementRegExp),
                    "name": $(this),
                    "parentId": getElementIdUsingClassNameWithId(classes, parentElementNodeRegExp),
                    "type": null,
                    "isReportable": null,
                    "isVisited": null,
                };
                elementsRepresentations.push(elementRepresentation)
            }
        );

        var nodeStructure = new PrintableNode(null, null, null, null, null);
        findAndSetChildrenForPrintableNode(elementsRepresentations, nodeStructure);
        addIndentationsInTableBaseOnPrintableNodesStructure(nodeStructure);
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
        var mainNode = new PrintableNode(null, null, null, null, null);
        var contentInformation = generatePreviewContentInformation();
        findAndSetChildrenForPrintableNode(contentInformation, mainNode);
        return mainNode;
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

    function createPrintableStructure() {
        var mainNode = new PrintableNode(null, null, null, null, null);
        var contentInformation = printableController.getContentInformation();
        findAndSetChildrenForPrintableNode(contentInformation, mainNode);
        return mainNode;
    }

    function findAndSetChildrenForPrintableNode(array, node) {
        var childrenNodes = [];
        var childrenElements = getElementsWithParentId(array, node.getId());
        childrenElements.forEach((element) => {
            var childNode = new PrintableNode(
                element.id, element.name, element.type,
                element.isReportable, element.isVisited
            );
            childrenNodes.push(childNode);
            findAndSetChildrenForPrintableNode(array, childNode);
        });
        node.setChildren(childrenNodes);
    }

    function getElementsWithParentId(array, id) {
        var elements = [];
        array.forEach((element) => {
            if (element.parentId === id)
                elements.push(element);
        });
        return elements;
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

    presenter.createPrintableTree = function($view, root, parentIndex, pageCount) {
        var chapterIndex = 0,
            chapterScore = resetScore(),
            pageScore = resetScore(),
            isEmpty = true,
            values = {},
            isEnabled = true;

        for (var i = 0; i < pageCount; i++) {
            var isChapter = root.get(i).type === 'chapter';

            if (!isChapter) {
                printableRealPageIndex++;
                if (root.get(i).isReportable()) {
                    // at least one page is reportable
                    isEmpty = false;
                } else {
                    if(presenter.printableConfiguration.enablePages !== ''
                      && presenter.printableConfiguration.enablePages !== undefined) {
                        printablePageInChapterIndex++;
                    }
                    printableAbsolutePageIndex++;
                    continue;
                }
            }

            var pageId = isChapter ? "chapter" : root.get(i).getId();
            var isPreview = isPreviewConsideringPrintableState(true)
            addRow($view, root.get(i), printablePageInChapterIndex, parentIndex, isChapter, pageId, isPreview);
            printableAbsolutePageIndex++;

            pageScore = getPrintablePageScoreById(pageId);
            pageScore.count = 1;
            printablePageInChapterIndex++;

            if (isChapter) {
                chapterIndex = printablePageInChapterIndex - 1;
                values = presenter.createPrintableTree($view, root.get(i), chapterIndex, root.get(i).size());
                var $row = $($view.find(`.${CSS_CLASSES.PRINTABLE_HIER_REPORT_NODE}-` + chapterIndex));
                updateRow($row, chapterIndex, values.pagesScore);
                pageScore = values.pagesScore;
            }

            isEnabled = presenter.printableConfiguration.disabledScorePages.indexOf(printableAbsolutePageIndex) === -1;
            chapterScore = presenter.updateChapterScore(chapterScore, pageScore, isEnabled);
        }

        return { pagesScore: chapterScore, isEmpty: isEmpty };
    }

    function isInPrintableStateMode() {
        return presenter.printableStateMode !== null;
    }

    function cleanAfterPrintableState() {
        presenter.printableStateMode = null;
        presenter.printableLessonScore = null;
    }

    return presenter;
}
