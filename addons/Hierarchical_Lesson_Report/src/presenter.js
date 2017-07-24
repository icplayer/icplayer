function AddonHierarchical_Lesson_Report_create() {
    var presenter = function () {};
    var presentationController;
    var pageIndex = 0;
    var absolutePageIndex = 0;
    var chapters = 0;

    presenter.ERROR_MESSAGES = {
        EXPAND_DEPTH_NOT_NUMERIC: "Depth of expand is not proper",

        C01: "Wrong classes name format",
        C02: "Class names has to be separated by new line",

        D01: "Values in Disable score on pages property should be numeric and non empty",
        D02: "Values in Disable score on pages property should be greater than 0",
        D03: "Values in Disable score on pages property should be unique",

        P01: "Values in Disable pages property should be numeric and non empty",
        P02: "Values in Disable pages property should be greater than 0",
        P03: "Values in Disable pages property should be unique"
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

    presenter.run = function (view, model) {
        presenter.initialize(view, model, false);
    };

    presenter.createPreview = function (view, model) {
        presenter.initialize(view, model, true);
    };

    function addHeader() {
        var headerHTML = "<td> " + presenter.configuration.labels.title + "</td>";
        if (presenter.configuration.showResults) headerHTML += "<td class='hier_report-progress'> " + presenter.configuration.labels.results + "</td>";
        if (presenter.configuration.showChecks) headerHTML += "<td class='hier_report-checks'> " + presenter.configuration.labels.checks + "</td>";
        if (presenter.configuration.showMistakes) headerHTML += "<td class='hier_report-mistakes'> " + presenter.configuration.labels.mistakes + "</td>";
        if (presenter.configuration.showErrors) headerHTML += "<td class='hier_report-errors'> " + presenter.configuration.labels.errors + "</td>";
        if (presenter.configuration.showPageScore) headerHTML += "<td class='hier_report-page-score'>" + presenter.configuration.labels.pageScores + "</td>";
        if (presenter.configuration.showMaxScoreField) headerHTML += "<td class='hier_report-page-max-score'>" + presenter.configuration.labels.maxScoreAward + "</td>";
        $("<tr></tr>").prependTo($("#" + presenter.treeID).find('table')).addClass("hier_report-header").html(headerHTML);
    }

    presenter.calculateLessonScaledScore = function () {
        if (presenter.lessonScore.pageCount == 0) {
            return 0;
        }

        return Math.floor((presenter.lessonScore.scaledScore / presenter.lessonScore.pageCount) * 100) / 100;
    };

    function addFooter() {
        var row = document.createElement('tr');
        $(row).appendTo($("#" + presenter.treeID).find('table'));
        $(row).addClass("hier_report-footer");

        $("<td></td>").appendTo($(row)).html(presenter.configuration.labels.total);

        if (presenter.configuration.showResults) {
            createProgressCell(row, {
                score: presenter.isPreview ? 0 : presenter.calculateLessonScaledScore(),
                count: 1
            });
        }

        if (presenter.configuration.showChecks) {
            $("<td></td>").appendTo($(row)).addClass("hier_report-checks").html(presenter.lessonScore.checks);
        }

        if (presenter.configuration.showMistakes) {
            $("<td></td>").appendTo($(row)).addClass("hier_report-mistakes").html(presenter.lessonScore.mistakes);
        }

        if (presenter.configuration.showErrors) {
            $("<td></td>").appendTo($(row)).addClass("hier_report-errors").html(presenter.lessonScore.errors);
        }

        if (presenter.configuration.showPageScore) {
            var content = presenter.lessonScore.score + "<span class='hier_report-separator'>/</span>" + presenter.lessonScore.maxScore;
            $("<td></td>").appendTo($(row)).addClass("hier_report-page-score").html(content);
        }

        if (presenter.configuration.showMaxScoreField) {
            $("<td></td>").appendTo($(row));
        }
    }

    function createRow(index, parentIndex, isChapter) {
        var row = document.createElement('tr');

        $(row).appendTo($("#" + presenter.treeID).find('table'));
        $(row).addClass("treegrid-" + index);
        $(row).addClass(presenter.configuration.classes[index % presenter.configuration.classes.length]);

        if (parentIndex != null) {
            $(row).addClass("treegrid-parent-" + parentIndex);
        }

        if (isChapter) {
            $(row).addClass("hier_report-chapter");
        } else {
            $(row).addClass(index % 2 > 0 ? "hier_report-odd" : "hier_report-even");
        }

        return row;
    }

    function createProgressCell(row, score, index, isChapter) {
        var progressCell = document.createElement('td');
        $(progressCell).appendTo($(row)).addClass("hier_report-progress");

        var progressbar = document.createElement('div');
        $(progressbar).appendTo($(progressCell));
        $(progressbar).attr("id", "progressbar-" + index);
        $(progressbar).addClass("hier_report-progressbar");
        var percent = Math.floor(score.score / score.count * 100);

        var progressInfo = document.createElement('div');
        $(progressInfo).appendTo($(progressCell)).attr("style", "float: right").html(percent + "%");

        if (!isChapter) {
            $(progressbar).progressbar({
                value: Math.floor(score.score * 100),
                max: 100
            });
        }
    }

    presenter.isPageVisited = function (pageId) {
        return presentationController.getPresentation().getPageById(pageId).isVisited();
    };

    presenter.getPageScaledScore = function(maxScore, score, isChapter, pageID) {
        if (maxScore) {
            return score / maxScore;
        }

        if (!presenter.isPreview && !isChapter) {
            return presenter.isPageVisited(pageID) ? 1 : 0;
        }

        return 0;
    };

    presenter.getProperScore = function(score, pageId) {
        if (!presenter.isPreview) {
            score.score = score.maxScore !== 0 ? score.score / score.maxScore : presenter.isPageVisited(pageId) ? 1 : 0;
        } else {
            score.score = score.maxScore !== 0 ? score.score / score.maxScore : 0;
        }

        return score.score;
    };

    function createScoreCells(row, pageId, index, isChapter) {
        var isScoreEnable = presenter.configuration.disabledScorePages.indexOf(absolutePageIndex) === -1;
        var score = resetScore();
        if (!presenter.isPreview) {
            score = presentationController.getScore().getPageScoreById(pageId);
        }

        var pageScore = 0;

        if (!isChapter) {
            pageScore = score.score;
            score.count = 1;
            score.score = presenter.getProperScore(score, pageId);
        }

        if (isScoreEnable) {

            if (presenter.configuration.showResults) {
                createProgressCell(row, score, index, isChapter);
            }

            if (!isChapter) {
                presenter.lessonScore.pageCount++;
            }
            presenter.lessonScore.checks += score.checkCount;
            presenter.lessonScore.mistakes += score.mistakeCount;
            presenter.lessonScore.errors += score.errorCount;
            presenter.lessonScore.score += pageScore;
            presenter.lessonScore.maxScore += score.maxScore;
            presenter.lessonScore.scaledScore += presenter.getPageScaledScore(score.maxScore, pageScore, isChapter, pageId);

            if (presenter.configuration.showChecks) {
                var checksCell = document.createElement('td');
                $(checksCell).appendTo($(row))
                    .addClass("hier_report-checks")
                    .html(score.checkCount);
            }

            if (presenter.configuration.showMistakes) {
                var mistakesCell = document.createElement('td');
                $(mistakesCell).appendTo($(row))
                    .addClass("hier_report-mistakes")
                    .html(score.mistakeCount);
            }

            if (presenter.configuration.showErrors) {
                var errorsCell = document.createElement('td');
                $(errorsCell).appendTo($(row))
                    .addClass("hier_report-errors")
                    .html(score.errorCount);
            }

            if (presenter.configuration.showPageScore) {
                $("<td></td>").appendTo($(row))
                    .addClass("hier_report-page-score")
                    .html(presenter.insertPageScoreValuesToPage(pageScore, score));
            }

            if (presenter.configuration.showMaxScoreField) {
                var isMaxScore = pageScore === score.maxScore && score.maxScore !== 0;

                var $td = $('<td></td>');
                $td.addClass(isMaxScore ? 'hier_report-page-max-score' : 'hier_report-page-non-max-score');

                $(row).append($td);
            }
        } else {
            var c = presenter.configuration;
            var columns = [c.showResults, c.showChecks, c.showMistakes, c.showErrors, c.showPageScore, c.showMaxScoreField].filter(function(a) { return a }).length;
            $("<td colspan='" + columns + "'></td>").appendTo($(row)).addClass("hier_report-score-disabled-row");
        }
    }

    presenter.insertPageScoreValuesToPage = function(pageScore, score) {
        if (score.score == 0 && score.maxScore == 0) {
            return presenter.configuration.labels.unvisitedPageScore;
        }

        return pageScore + "<span class='hier_report-separator'>/</span>" + score.maxScore;
    };

    function generatePageLinks(text, isChapter, pageId) {
        var $element = $(document.createElement('td')),
            $link = $("<a></a>").text(text).attr('href', '#').attr('data-page-id', pageId);

        $element.append($('<div class="text-wrapper">').html(isChapter ? text : $link));

        return $element;
    }

    function checkIfChapterHasChildren () {
        presenter.$view.find(".hier_report-chapter").each(function () {
           if(!$(this).hasClass('treegrid-collapsed') && !$(this).hasClass('treegrid-expanded')) {
               $(this).remove();
           }
        });
    }

    function buildRow (name, index, parrentIndex, isChapter, pageId) {
        var row = createRow(index, parrentIndex, isChapter);

        var nameCell = generatePageLinks(name, isChapter, pageId);
        $(nameCell).appendTo($(row));

        createScoreCells(row, pageId, index, isChapter);
    }

    function checkIfPageEnabled (index) {
        var realIndex = parseInt(index-chapters, 10);
        if(presenter.configuration.enablePages != '' && presenter.configuration.enablePages != undefined){
            return presenter.configuration.enablePages.indexOf(realIndex) > -1;
        } else {
            return true;
        }
    }

    function addRow(name, index, parrentIndex, isChapter, pageId, isPreview) {
        if(!isPreview){
            if(isChapter){
                buildRow(name, index, parrentIndex, isChapter, pageId);
                chapters++;
            } else if (checkIfPageEnabled(index)) {
                buildRow(name, index, parrentIndex, isChapter, pageId);
            }
        } else {
            buildRow(name, index, parrentIndex, isChapter, pageId);
        }
    }

    function updateRow(pageIndex, pageScore) {
        var row = $(".treegrid-" + pageIndex);
        var hasChildren = pageScore.count > 0;

        if (presenter.configuration.showResults) {
            var percent = Math.floor((pageScore.score / pageScore.count) * 100) || 0;
            var progressbar = $(row).find("#progressbar-" + pageIndex);
            if (hasChildren) {
                $(progressbar).progressbar({value: Math.floor((pageScore.score / pageScore.count) * 100), max: 100});
                $(progressbar).closest("div").next().html(percent + '%');
            } else {
                $(progressbar).closest("div").next().html('-').attr('style', '');
            }
        }

        if (presenter.configuration.showChecks) {
            $(row).find(".hier_report-checks").html(hasChildren ? pageScore.checkCount : '-');
        }

        if (presenter.configuration.showMistakes) {
            $(row).find(".hier_report-mistakes").html(hasChildren ? pageScore.mistakeCount : '-');
        }

        if (presenter.configuration.showErrors) {
            $(row).find(".hier_report-errors").html(hasChildren ? pageScore.errorCount : '-');
        }

        if (presenter.configuration.showPageScore) {
            $(row).find(".hier_report-page-score").html(hasChildren ? presenter.insertPageScoreValuesToChapter(pageScore) : '-');
        }
    }

    presenter.insertPageScoreValuesToChapter = function(pageScore) {
        if (pageScore.countedMaxScore != 0) {
            return pageScore.countedScore + "<span class='hier_report-separator'>/</span>" + pageScore.countedMaxScore;
        } else {
            return presenter.configuration.labels.unvisitedPageScore;
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
            score: 0,
            countedScore: 0,
            maxScore: 0,
            countedMaxScore: 0,
            errorCount: 0,
            checkCount: 0,
            mistakeCount: 0,
            count: 0
        };
    }

    presenter.createPreviewTree = function() {
        var pagesMockup = [
            {name : "Page1", parent : null},
            {name : "Unit1", parent : null},
            {name : "Page2", parent : 1},
            {name : "Chapter1", parent : 1},
            {name : "Page3", parent : 3},
            {name : "Page4", parent : 3},
            {name : "Chapter2", parent : 1},
            {name : "Page5", parent : 6},
            {name : "Page6", parent : 1},
            {name : "Page7", parent : null},
            {name : "Page8", parent : null},
            {name : "Page9", parent : null},
            {name : "Page10", parent : null},
            {name : "Page11", parent : null}
        ];

        var chapterScore = resetScore();
        for (var i = 0; i < pagesMockup.length; i++) {
            addRow(pagesMockup[i].name, i, pagesMockup[i].parent, false, "some_id", true);
        }
        return chapterScore;
    };

    presenter.createTree = function(root, parrentIndex, pageCount) {
        var chapterIndex = 0,
            chapterScore = resetScore(),
            pageScore = resetScore(),
            isEmpty = true,
            values = {},
            isEnabled = true;

        for (var i = 0; i < pageCount; i++) {
            var isChapter = root.get(i).type == 'chapter';

            if (!isChapter) {
                if (root.get(i).isReportable()) {
                    // at least one page is reportable
                    isEmpty = false;
                } else {
                    if(presenter.configuration.enablePages != '' && presenter.configuration.enablePages != undefined) {
                        pageIndex++;
                    }

                    absolutePageIndex++;
                    continue;
                }
            }

            var pageId = isChapter ? "chapter" : root.get(i).getId();

            addRow(root.get(i).getName(), pageIndex, parrentIndex, isChapter, pageId, false);
            absolutePageIndex++;

            pageScore = presentationController.getScore().getPageScoreById(pageId);
            pageScore.count = 1;
            pageIndex++;

            if (isChapter) {
                chapterIndex = pageIndex - 1;
                values = presenter.createTree(root.get(i), chapterIndex, root.get(i).size());
                updateRow(chapterIndex, values.pagesScore);
                pageScore = values.pagesScore;
            }

            isEnabled = presenter.configuration.disabledScorePages.indexOf(absolutePageIndex) === -1;
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

    presenter.validateModel = function (model) {
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
            enablePages: validatedEnablePages.value
        };
    };

    presenter.setVisibility = function (isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.initialize = function (view, model, isPreview) {
        presenter.$view = $(view);
        presenter.isPreview = isPreview;
        presenter.lessonScore = {
            pageCount: 0,
            checks: 0,
            errors: 0,
            mistakes: 0,
            score: 0,
            maxScore: 0,
            scaledScore: 0
        };

        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.isValid) {
            presenter.showErrorMessage(presenter.ERROR_MESSAGES[presenter.configuration.errorCode]);
            return;
        }

        $('.hier_report').attr("style", "height: " + presenter.configuration.height + "px");
        presenter.treeID = presenter.configuration.ID + (isPreview ? "Preview" : "");
        presenter.$view.find("div").first().attr('id', presenter.treeID);

        presenter.setVisibility(presenter.configuration.isVisible);

        addHeader();
        if (isPreview) {
            presenter.createPreviewTree();
        } else {
            var presentation = presentationController.getPresentation();
            presenter.createTree(presentation.getTableOfContents(), null, presentation.getTableOfContents().size());
        }

        if (presenter.configuration.showTotal) {
            addFooter();
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

    return presenter;
}