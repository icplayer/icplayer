function AddonHierarchical_Lesson_Report_create() {
    var presenter = function () {};
    var presentationController;
    var pageIndex = 0;
    var totalChecks = 0;
    var totalErrors = 0;
    var totalMistakes = 0;
    var chapterScore = null;
    var isPreview = false;

    var pagesMockup = [
        {name: "Page1", parrent: null, pageId : "some_id"},
        {name: "Unit1", parrent: null, pageId : "some_id"},
        {name: "Page2", parrent: 1, pageId : "some_id"},
        {name: "Chapter1", parrent: 1, pageId : "some_id"},
        {name: "Page3", parrent: 3, pageId : "some_id"},
        {name: "Page4", parrent: 3, pageId : "some_id"},
        {name: "Chapter2", parrent: 1, pageId : "some_id"},
        {name: "Page5", parrent: 6, pageId : "some_id"},
        {name: "Page6", parrent: 1, pageId : "some_id"},
        {name: "Page7", parrent: null, pageId : "some_id"},
        {name: "Page8", parrent: null, pageId : "some_id"},
        {name: "Page9", parrent: null, pageId : "some_id"},
        {name: "Page10", parrent: null, pageId : "some_id"},
        {name: "Page11", parrent: null, pageId : "some_id"}
    ];

    presenter.ERROR_MESSAGES = {
        EXPAND_DEPTH_NOT_NUMERIC: "Depth of expand is not proper"
    };

    presenter.showErrorMessage = function (message, substitutions) {
        var errorContainer;
        if (typeof(substitutions) == 'undefined') {
            errorContainer = '<p>' + message + '</p>';
        } else {
            var messageSubst = message;
            for (var key in substitutions) {
                messageSubst = messageSubst.replace('%' + key + '%', substitutions[key]);
            }
            errorContainer = '<p>' + messageSubst + '</p>';
        }
       presenter.$view.html(errorContainer);
    };

    presenter.setPlayerController = function (controller) {
        presentationController = controller;
    };

    presenter.run = function (view, model) {
        isPreview = false;
        presenter.initialize(view, model);
    };

    presenter.createPreview = function (view, model) {
        isPreview = true;
        presenter.initialize(view, model);
    };

    function addHeader() {
        var headerHTML = "<td> " + presenter.configuration.titleLabel + "</td>"
        if (presenter.configuration.showResults)    headerHTML += "<td class='hier_report-progress'> " + presenter.configuration.resultsLabel + "</td>";
        if (presenter.configuration.showChecks)    headerHTML += "<td class='hier_report-checks'> " + presenter.configuration.checksLabel + "</td>";
        if (presenter.configuration.showMistakes)    headerHTML += "<td class='hier_report-mistakes'> " + presenter.configuration.mistakesLabel + "</td>";
        if (presenter.configuration.showErrors)    headerHTML += "<td class='hier_report-errors'> " + presenter.configuration.errorsLabel + "</td>";
        row = document.createElement('tr');
        $(row).prependTo($("#" + presenter.treeID).find('table'))
            .addClass("hier_report-header")
            .html(headerHTML);
    }

    function addFooter() {
        row = document.createElement('tr');
        $(row).appendTo($("#" + presenter.treeID).find('table'))
            .addClass("hier_report-footer");

        nameCell = document.createElement('td');
        $(nameCell).appendTo($(row))
            .html(presenter.configuration.totalLabel);

        if (presenter.configuration.showResults) {
            var score = resetScore();

            if (!isPreview)  {
                var playerUtils = new PlayerUtils({});
                playerUtils.scoreService = presentationController.getScore();
                var totalScore = playerUtils.getPresentationScore(presentationController.getPresentation());
                score = {
                    score: totalScore.scaledScore,
                    count: 1
                }
            }
            createProgressCell(row, score);
        }

        if (presenter.configuration.showChecks) {
            checksCell = document.createElement('td');
            $(checksCell).appendTo($(row))
                .addClass("hier_report-checks")
                .html(totalChecks);
        }

        if (presenter.configuration.showMistakes) {
            mistakesCell = document.createElement('td');
            $(mistakesCell).appendTo($(row))
                .addClass("hier_report-mistakes")
                .html(totalMistakes);
        }

        if (presenter.configuration.showErrors) {
            errorsCell = document.createElement('td');
            $(errorsCell).appendTo($(row))
                .addClass("hier_report-errors")
                .html((totalErrors));
        }
    }

    function createRow(index, parrentIndex, isChapter) {
        row = document.createElement('tr');
        $(row).appendTo($("#" + presenter.treeID).find('table'))
            .addClass("treegrid-" + index);
        if (parrentIndex != null) {
        	$(row).addClass("treegrid-parent-" + parrentIndex);
        }
        if (isChapter) {
        	$(row).addClass("hier_report-chapter");
        } else {
            if (index % 2 > 0) {
            	$(row).addClass("hier_report-odd");
            } else {
            	$(row).addClass("hier_report-even");
            }
        }
        return row;
    }

    function createProgressCell(row, score, index, isChapter) {
        progressCell = document.createElement('td');
        $(progressCell).appendTo($(row)).addClass("hier_report-progress");

        progressbar = document.createElement('div');
        $(progressbar).appendTo($(progressCell));
        $(progressbar).attr("id", "progressbar-" + index)
        $(progressbar).addClass("hier_report-progressbar");

        var percent = Math.floor(score.score / score.count * 100);

        progressInfo = document.createElement('div');
        $(progressInfo).appendTo($(progressCell))
            .attr("style", "float: right")
            .html(percent + "%");

        if (!isChapter) {
            $(progressbar).progressbar({
                value: Math.floor(score.score * 100),
                max: 100
            });
        }
    }

    function createScoreCells(row, pageId, index, isChapter) {
        var score = resetScore();
        if (!isPreview) score = presentationController.getScore().getPageScoreById(pageId);

        if (!isChapter) {
        	score.count = 1;
        	score.score = score.score / score.maxScore;
        }
        
        if (presenter.configuration.showResults) {
            createProgressCell(row, score, index, isChapter);
        }

        if (presenter.configuration.showChecks) {
            checksCell = document.createElement('td');
            $(checksCell).appendTo($(row))
                .addClass("hier_report-checks")
                .html(score.checkCount);
            totalChecks += score.checkCount;
        }

        if (presenter.configuration.showMistakes) {
            mistakesCell = document.createElement('td');
            $(mistakesCell).appendTo($(row))
                .addClass("hier_report-mistakes")
                .html(score.mistakeCount);
            totalMistakes += score.mistakeCount;
        }

        if (presenter.configuration.showErrors) {
            errorsCell = document.createElement('td');
            $(errorsCell).appendTo($(row))
                .addClass("hier_report-errors")
                .html(score.errorCount);
            totalErrors += score.errorCount;
        }
    }

    function generatePageLinks(text, isChapter, pageId) {
        var $element = $(document.createElement('td')),
            $link = $(document.createElement('a'))
                .text(text)
                .attr('href', '#')
                .attr('data-page-id', pageId);

        if (isChapter) $element.html(text)
        else $element.html($link);

        return $element;
    }

    function addRow(name, index, parrentIndex, isChapter, pageId) {
        row = createRow(index, parrentIndex, isChapter);

        nameCell = generatePageLinks(name, isChapter, pageId);
        $(nameCell).appendTo($(row));

        createScoreCells(row, pageId, index, isChapter, pageId);
    }

    function updateRow(pageIndex, pageScore, isEmptyChapter) {
        row = $(".treegrid-" + pageIndex);

        if (presenter.configuration.showResults) {
            if (isEmptyChapter) {
                progresscell = $(row).find(".hier_report-progress");
                $(progresscell).children().remove();
                $(progresscell).html("-");
            } else {
                var percent = (Math.floor((pageScore.score / pageScore.count) * 100));
                progressbar = $(row).find("#progressbar-" + pageIndex);
                $(progressbar).progressbar({value: Math.floor((pageScore.score / pageScore.count) * 100), max: 100});
                $(progressbar).closest("div").next().html(percent + "%");
            }
        }

        if (presenter.configuration.showChecks) {
            $(row).find(".hier_report-checks").html((isEmptyChapter)?"-": pageScore.checkCount);
        }

        if (presenter.configuration.showMistakes) {
            $(row).find(".hier_report-mistakes").html((isEmptyChapter)?"-": pageScore.mistakeCount);
        }

        if (presenter.configuration.showErrors) {
            $(row).find(".hier_report-errors").html((isEmptyChapter)?"-": pageScore.errorCount);
        }
    }

    function updateScore(score, update) {
        score.score += update.maxScore === 0 ? update.score : update.score/update.maxScore;
        score.errorCount += update.errorCount;
        score.checkCount += update.checkCount;
        score.mistakeCount += update.mistakeCount;
        score.count += update.count;
        return score;
    }

    function resetScore() {
        var score = {
            score: 0,
            maxScore: 0,
            errorCount: 0,
            checkCount: 0,
            mistakeCount: 0,
            count: 0
        }
        return score;
    }

    presenter.createPreviewTree = function () {
        var chapterScore = resetScore();
        for (var i = 0; i < pagesMockup.length; i++) {
            addRow(pagesMockup[i].name, i, pagesMockup[i].parrent, false, pagesMockup[i].pageId);
        }
        return chapterScore;
    }

    presenter.createTree = function (root, parrentIndex, pageCount) {
        var chapterIndex = 0,
            chapterScore = resetScore(),
            pageScore = resetScore(),
            isEmpty = true,
            values = {};

        for (var i = 0; i < pageCount; i++) {
            var isChapter = (root.get(i).type == "chapter");
            if (!isChapter && !root.get(i).isReportable())  continue;
            isEmpty = false;
            var pageId = "chapter";
            if (!isChapter) {
            	pageId = root.get(i).getId();
            }
            addRow(root.get(i).getName(), pageIndex, parrentIndex, isChapter, pageId);
            pageScore = presentationController.getScore().getPageScoreById(pageId);
            pageScore.count = 1;
            pageIndex++;
            if (isChapter) {
                chapterIndex = pageIndex - 1;
                values = presenter.createTree(root.get(i), chapterIndex, root.get(i).size());
                updateRow(chapterIndex, values.pagesScore, values.isEmpty);
                pageScore =  values.pagesScore;
            }
            chapterScore = updateScore(chapterScore, pageScore);
        }
        return {pagesScore: chapterScore, isEmpty:isEmpty};
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
            state.push($(this).treegrid('isExpanded'))
        });
        return state;
    }

    function restoreTreeState(state) {
        $('.hier_report table').find('tr').not('.hier_report-header').not('.hier_report-footer').each(function () {
            if (state[$(this).treegrid('getNodeId')]) {
                $(this).treegrid('expand');
            } else {
                $(this).treegrid('collapse');
            }
        });
    }

    presenter.getState = function () {
        var state = {
            'treeState': saveTreeState(),
            'isVisible': presenter.configuration.isVisible
        };
        return JSON.stringify(state);
    };

    presenter.setState = function (stateString) {
        var state = JSON.parse(stateString);

        restoreTreeState(state.treeState);

        presenter.setVisibility(state.isVisible);
        presenter.configuration.isVisible = state.isVisible;
    };


    presenter.validateModel = function (model) {
        var expandDepth = {value:0, isValid: true};

        if (model['expandDepth'].length > 0) {
            var expandDepth = ModelValidationUtils.validateInteger(model['expandDepth']);
            if (!expandDepth.isValid) {
                return { isValid: false, errorCode: 'EXPAND_DEPTH_NOT_NUMERIC' };
            }
        }

        return {
            ID: model.ID,
            isValid: true,
            width: parseInt(model["Width"], 10),
            height: parseInt(model["Height"], 10),
            isVisible: ModelValidationUtils.validateBoolean(model["Is Visible"]),
            showResults: ModelValidationUtils.validateBoolean(model["results"]),
            showErrors: ModelValidationUtils.validateBoolean(model["errors"]),
            showChecks: ModelValidationUtils.validateBoolean(model["checks"]),
            showMistakes: ModelValidationUtils.validateBoolean(model["mistakes"]),
            resultsLabel: model['resultsLabel'],
            errorsLabel: model['errorsLabel'],
            checksLabel: model['checksLabel'],
            mistakesLabel: model['mistakesLabel'],
            showTotal: ModelValidationUtils.validateBoolean(model["total"]),
            totalLabel: model['totalLabel'],
            titleLabel: model['titleLabel'],
            expandDepth: expandDepth.value
        };
    };

    presenter.setVisibility = function (isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.initialize = function (view, model) {
        presenter.$view = $(view);
        presenter.configuration = presenter.validateModel(model);

        if (!presenter.configuration.isValid) {
            presenter.showErrorMessage(presenter.ERROR_MESSAGES[presenter.configuration.errorCode]);
            return;
        }

        $('.hier_report').attr("style", "height: " + presenter.configuration.height + "px");
        if (isPreview) {
            presenter.treeID = presenter.configuration.ID + "Preview";
        } else {
            presenter.treeID = presenter.configuration.ID;
        }
        presenter.$view.find("div").first().attr('id', presenter.treeID);

        presenter.setVisibility(presenter.configuration.isVisible);

        addHeader();
        if (isPreview) {
            presenter.createPreviewTree();
        } else {
            var presentation = presentationController.getPresentation();

            presenter.createTree(presentation.getTableOfContents(), null, presentation.getTableOfContents().size());
        }
        if (presenter.configuration.showTotal) addFooter();

        $("#" + presenter.treeID).find('table').not('.hier_report-header').not('.hier_report-footer').treegrid({
            'initialState': 'collapsed'
        });

        expandTree(presenter.configuration.expandDepth);
        if (!isPreview) {
            handleMouseClickActions();
        }
    }

    return presenter;
}