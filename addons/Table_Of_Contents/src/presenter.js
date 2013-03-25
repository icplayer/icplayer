function AddonTable_Of_Contents_create(){
    var presenter = function() {};
    var presentationController;

    var elementsHeights = {};

    function setElementsDimensions(addonWidth, addonHeight) {
        var wrapper = presenter.$view.find('.table-of-contents:first')[0];
        var wrapperDimensions = DOMOperationsUtils.getOuterDimensions(wrapper);
        var wrapperDistances = DOMOperationsUtils.calculateOuterDistances(wrapperDimensions);
        $(wrapper).css({
            width: addonWidth - wrapperDistances.horizontal,
            height: addonHeight - wrapperDistances.vertical
        });

        elementsHeights.wrapper = $(wrapper).height();

        var title = presenter.$view.find('.table-of-contents-title')[0];
        var titleDimensions = DOMOperationsUtils.getOuterDimensions(title);
        var titleDistances = DOMOperationsUtils.calculateOuterDistances(titleDimensions);
        $(title).css({
            width: $(wrapper).width() - titleDistances.horizontal
        });

        elementsHeights.title = $(title).height() + titleDistances.vertical;

        var pagination = presenter.$view.find('.table-of-contents-pagination')[0];
        var paginationDimensions = DOMOperationsUtils.getOuterDimensions(pagination);
        var paginationDistances = DOMOperationsUtils.calculateOuterDistances(paginationDimensions);
        $(pagination).css({
            width: $(wrapper).width() - paginationDistances.horizontal
        });

        elementsHeights.pagination = $(pagination).height() + paginationDistances.vertical;

        var list = presenter.$view.find('.table-of-contents-list')[0];
        var listDimensions = DOMOperationsUtils.getOuterDimensions(list);
        var listDistances = DOMOperationsUtils.calculateOuterDistances(listDimensions);
        $(list).css({
            height: $(wrapper).height - elementsHeights.title - elementsHeights.pagination - listDistances.vertical,
            width: $(wrapper).width - listDistances.horizontal
        });

        elementsHeights.list = $(list).height() + listDistances.vertical;
    }


    function generateElement (text) {
        var $element = $(document.createElement('li')),
            $link = $(document.createElement('a'));

        $link.text(text);
        $link.attr('href', '#');
        $element.html($link);

        return $element;
    }

    function generateListElements () {
        var $list = presenter.$view.find('.table-of-contents .table-of-contents-list ol');

        for (var i = 0; i < presenter.pages.length; i++) {
            $list.append(generateElement(presenter.pages[i]));
        }

        return $list.outerHeight();
    }

    function displayPage(page) {
        var $list = presenter.$view.find('.table-of-contents .table-of-contents-list ol'),
            pages = presenter.pagination.pages[page], i,
            startIndex = page == 0 ? 1 : presenter.pagination.pages[page - 1].length + 1;

        $list.find('li').hide();
        $list.attr('start', '' + startIndex);
        for (i = 0; i < pages.length; i++) {
            $list.find('li:eq(' + pages[i] + ')').show();
        }
    }

    function isSpaceSufficient($list, spareHeight) {
        return $list.find('li:first').outerHeight() < spareHeight;
    }

    function paginateList(spareHeight, isPreview) {
        var $list = presenter.$view.find('.table-of-contents .table-of-contents-list ol');
        var $pagination = presenter.$view.find('.table-of-contents .table-of-contents-pagination');

        if (!isSpaceSufficient($list, spareHeight)) return false;

        var currentPageHeight = 0, page, i;
        presenter.pagination = {
            pages: [[]],
            size: 0
        };

        $list.find('li').each(function (index, value) {
            var outerHeight = $(value).outerHeight();

            if (currentPageHeight + outerHeight > spareHeight) {
                presenter.pagination.size++;
                currentPageHeight = 0;
                presenter.pagination.pages[presenter.pagination.size] = [];
            }

            currentPageHeight += outerHeight;
            presenter.pagination.pages[presenter.pagination.size].push(index);
        });

        for (i = 1; i <= presenter.pagination.size; i++) {
            var $element = $(document.createElement('a'));
            $element.text(i + 1);
            $element.attr('href', '#');
            $pagination.append($element);
        }

        displayPage(0);
        if (!isPreview) handlePaginationMouseActions();

        return true;
    }

    function handleMouseClickActions() {
        var commander = presentationController.getCommands(),
            presentation = presentationController.getPresentation(),
            $list = presenter.$view.find('.table-of-contents-list ol'),
            currentPageName = presentation.getPage(presentationController.getCurrentPageIndex()),
            pageName;

        $list.find('li a').each(function () {
            $(this).click(function (event) {
                event.preventDefault();
                pageName = $(this).text();
                if (currentPageName !== pageName) commander.gotoPage(pageName);
            });
        });
    }

    function handlePaginationMouseActions() {
        var lists = presenter.$view.find('.table-of-contents .table-of-contents-list');

        presenter.$view.find('.table-of-contents-pagination a').each(function() {
            $(this).click(function(event) {
                event.preventDefault();
                displayPage(parseInt($(this).text(), 10) - 1);
            });
        });
    }

    function presenterLogic(view, model, isPreview) {
        function reportInsufficientSpace() {
            presenter.$view.html('<strong>Available space is insufficient! Please enlarge addon dimensions.</strong>')
        }

        presenter.pages = isPreview ? mockPresentationPages() : presenter.getPresentationPages();
        presenter.$view = $(view);

        setElementsDimensions(model.Width, model.Height);

        var listHeight = generateListElements(),
            spareHeight = elementsHeights.wrapper - elementsHeights.title;

        var $list = presenter.$view.find('.table-of-contents .table-of-contents-list ol');
        if (!isSpaceSufficient($list, spareHeight)) {
            reportInsufficientSpace();
        }

        if (listHeight > spareHeight) {
            if (!paginateList(spareHeight - elementsHeights.pagination, isPreview)) {
                reportInsufficientSpace();
            }
        } else {
            presenter.$view.find('.table-of-contents-pagination').hide();
        }

        if (!isPreview) handleMouseClickActions();
    }

    presenter.getPresentationPages = function() {
        var pages = [];

        var presentation = presentationController.getPresentation();
        var pageCount = presentation.getPageCount();

        for (var i = 0; i < pageCount; i++) {
            pages.push(presentation.getPage(i).getName());
        }

        return pages;
    };

    function mockPresentationPages() {
        return [
            "Page 01",
            "Page 02",
            "Page 03",
            "Page 04",
            "Page 05",
            "Page 06",
            "Page 07",
            "Page 08",
            "Page 09",
            "Page 10",
            "Page 11",
            "Page 12",
            "Page 13",
            "Page 14",
            "Page 15",
            "Page 16"
        ];
    }

    presenter.createPreview = function(view, model){
        presenterLogic(view, model, true);
    };

    presenter.run = function(view, model){
        presenterLogic(view, model, false);
    };

    presenter.setPlayerController = function(controller) {
        presentationController = controller;
    };

    return presenter;
}