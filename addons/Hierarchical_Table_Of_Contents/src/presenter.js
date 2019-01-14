function AddonHierarchical_Table_Of_Contents_create() {
    var presenter = function () {};
    var presentationController;
    var pageIndex = 0;

    presenter.ERROR_MESSAGES = {
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
        $("<tr></tr>").prependTo($("#" + presenter.treeID).find('table')).addClass("hier_report-header").html(headerHTML);
    }

    function addFooter() {
        var row = document.createElement('tr');
        $(row).appendTo($("#" + presenter.treeID).find('table'));
        $(row).addClass("hier_report-footer");
    }

    function createRow(index, parentIndex, isChapter) {
        var row = document.createElement('tr');

        $(row).appendTo($("#" + presenter.treeID).find('table'));
        $(row).addClass("treegrid-" + index);

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

    function generatePageLinks(text, isChapter, pageId) {
        var $element = $(document.createElement('td')),
            $link = $("<a></a>").text(text).attr('href', '#').attr('data-page-id', pageId);

        $element.append($('<div class="text-wrapper">').html(isChapter ? text : $link));

        return $element;
    }

    function addRow(name, index, parrentIndex, isChapter, pageId) {
        var row = createRow(index, parrentIndex, isChapter);

        var nameCell = generatePageLinks(name, isChapter, pageId);
        if(row != null){
            $(nameCell).appendTo($(row));
        }
    }

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
            {name : "Chapter2", parent : 1},
            {name : "Page5", parent : 6},
            {name : "Page6", parent : 1},
            {name : "Page7", parent : null},
            {name : "Page8", parent : null},
            {name : "Page9", parent : null},
            {name : "Page10", parent : null},
            {name : "Page11", parent : null},
            {name : "Unit2", parent : null},
            {name : "Page12", parent : 10},
            {name : "Page13", parent : 10}
        ];

        var chapterScore = resetScore();
        for (var i = 0; i < pagesMockup.length; i++) {
            if(pagesMockup[i].name == "Unit1" || pagesMockup[i].name == "Unit2"){
                addRow(pagesMockup[i].name, i, pagesMockup[i].parent, true, "some_id");
            }else{
                addRow(pagesMockup[i].name, i, pagesMockup[i].parent, false, "some_id");
            }
        }
        return chapterScore;
    };

    presenter.createTree = function (root, parrentIndex, pageCount) {
        var chapterIndex = 0,
            chapterScore = resetScore(),
            pageScore = resetScore(),
            isEmpty = true,
            values = {},
            isEnabled = true;

        for (var i = 0; i < pageCount; i++) {
            var isChapter = (root.get(i).type == "chapter");

            if (!isChapter && !root.get(i).isReportable() && presenter.configuration.showPages == "Reportable") continue;
            if (!isChapter && root.get(i).isReportable() && presenter.configuration.showPages == "Not-reportable") continue;
            if (!isChapter && root.get(i).isReportable()) {
                isEmpty = false;
            }
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
                pageScore =  values.pagesScore;
            }
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

    presenter.validateModel = function (model) {
        return {
            ID: model.ID,
            isValid: true,
            width: parseInt(model["Width"], 10),
            height: parseInt(model["Height"], 10),
            isVisible: ModelValidationUtils.validateBoolean(model["Is Visible"]),
            labels: {
                title: model['titleLabel']
            },
            displayOnlyChapters: ModelValidationUtils.validateBoolean(model.displayOnlyChapters),
            showPages: model.showPages
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

        presenter.setVisibility(presenter.configuration.isVisible || isPreview);

        addHeader();
        if (isPreview) {
            presenter.createPreviewTree();
        } else {
            var presentation = presentationController.getPresentation();
            presenter.createTree(presentation.getTableOfContents(), null, presentation.getTableOfContents().size());
            checkIfChapterHasChildren(false);
            if(presenter.configuration.displayOnlyChapters){
                displayOnlyChapters();
            }
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

        if(presenter.configuration.displayOnlyChapters){
            presenter.$view.find("tr").each(function () {
                if($(this).hasClass("hier_report-even") || $(this).hasClass("hier_report-odd")){
                    $(this).remove();
                }
            });
        }

        checkIfChapterHasChildren(true);
    };

    function displayOnlyChapters() {
        presenter.$view.find(".hier_report-chapter").each(function () {
            var element = $(this);
            element.find(".text-wrapper").wrap('<a href=""></a>');
            if(element.next('tr[class*=treegrid-parent]').length > 0){
                var dataPageId = element.next().find("a").attr("data-page-id");
                element.find("a").attr("data-page-id", dataPageId);
            }
        });
    }

    function checkIfChapterHasChildren (isDisplayOnlyChapters) {
        presenter.$view.find(".hier_report-chapter").each(function () {
            if($(this).next('tr[class*=treegrid-parent]').length == 0){
                if(isDisplayOnlyChapters){
                    $(this).find(".treegrid-expander").removeClass("treegrid-expander-collapsed").removeClass("treegrid-expander-expanded");
                }else{
                    $(this).remove();
                }
            }
        });
    }

    return presenter;
}