function AddonTable_Of_Contents_create(){
    var presenter = function() {};
    var presentationController;

    var elementsHeights = {};

    presenter.keyboardControllerObject = null;

    presenter.ERROR_CODES = {
        E01: "Values in property 'Don't show' pages must be numeric",
        E02: "Values in property 'Don't show' pages must be greater than 0",
        E03: "Values in property 'Don't show' pages must be unique"
    };

    function getErrorObject(ec) { return { isValid: false, errorCode: ec }; }

    function getCorrectObject(v) { return { isValid: true, value: v }; }

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
            $list.append(generateElement(presenter.pages[i].name));
        }

        return $list.outerHeight();
    }

    function generateComboElement (text, isPreview) {
        var element;

        if(!isPreview){
            var presentation = presentationController.getPresentation();
            var currentPageName = presentation.getPage(presentationController.getCurrentPageIndex()).getName();

            if(text == currentPageName){
                element = $('<option selected></option>');
            }else{
                element = $('<option></option>');
            }
        }else{
            element = $('<option></option>');
        }
        element.text(text);

        return element;
    }

    function generateComboList (isPreview) {
        var selectionList = $('<select class="comboList"></select>');
        presenter.$view.find('.table-of-contents').append(selectionList);
        var comboList = presenter.$view.find('.comboList');
        $(comboList).css("width", "100%");

        for (var i = 0; i < presenter.pages.length; i++) {
            comboList.append(generateComboElement(presenter.pages[i].name, isPreview));
        }
    }

    function generateIconListElement (page, isPreview) {
        var anchorElement = $('<a class="imageContainer"></a>'),
            imgElement = document.createElement('img'),
            listElement = $('<div class="listElement"></div>');

        $(imgElement).addClass("imageElement");
        imgElement.src = page.preview;
        $(listElement).text(page.name);
        $(anchorElement).append(imgElement).append(listElement);

        if(!isPreview) {
            var presentation = presentationController.getPresentation(),
                commander = presentationController.getCommands(),
                currentPageIndex = presentation.getPage(presentationController.getCurrentPageIndex()).getId();

            if (currentPageIndex == page.index) {
                $(anchorElement).addClass('current-page');
            }

            $(anchorElement).click(function (event) {
                event.stopPropagation();
                event.preventDefault();

                if (currentPageIndex !== page.index) {
                    commander.gotoPageIndex(page.numberOfIndex);
                }
            });
        }

        return anchorElement;
    }

    function generateIconElement (page, isPreview) {
        var anchorElement = $('<a class="imageContainer"></a>'),
            imgElement = document.createElement('img');

        $(imgElement).addClass("imageElement");
        imgElement.src = page.preview;
        $(anchorElement).append(imgElement);

        if(!isPreview) {
            var presentation = presentationController.getPresentation(),
                commander = presentationController.getCommands(),
                currentPageIndex = presentation.getPage(presentationController.getCurrentPageIndex()).getId();

            if (currentPageIndex == page.index) {
                $(anchorElement).addClass('current-page');
            }

            $(anchorElement).click(function (event) {
                event.stopPropagation();
                event.preventDefault();

                if (currentPageIndex !== page.index) {
                    commander.gotoPageIndex(page.numberOfIndex);
                }
            });
        }

        return anchorElement;
    }

    function generateIcons (isPreview) {
        var iconsList = $('<div class="iconsList"></div>');
        presenter.$view.find('.table-of-contents').append(iconsList);

        for (var i = 0; i < presenter.pages.length; i++) {
            iconsList.append(generateIconElement(presenter.pages[i], isPreview));
        }
    }

    function generateIconsAndList (isPreview) {
        var iconsList = $('<div class="iconsList"></div>');
        presenter.$view.find('.table-of-contents').append(iconsList);

        for (var i = 0; i < presenter.pages.length; i++) {
            iconsList.append(generateIconListElement(presenter.pages[i], isPreview));
        }
    }

    presenter.pageStartIndex = function(page) {
        var index = 0;
        for (var i = 0; i < page; i++) {
            index += presenter.pagination.pages[i].length;
        }
        return index+1;
    };

    function displayPage(page) {
        var $list = presenter.$view.find('.table-of-contents .table-of-contents-list ol'),
            pages = presenter.pagination.pages[page], i,
            startIndex = presenter.pageStartIndex(page),
            $pageList = presenter.$view.find('.table-of-contents-pagination');

        $list.find('li').hide();
        $list.attr('start', '' + startIndex);
        for (i = 0; i < pages.length; i++) {
            $list.find('li:eq(' + pages[i] + ')').show();
        }

        $pageList.children().removeClass('selected');
        $pageList.find('a').each(function(){
            if ($(this).text()==(page+1)) {
                $(this).addClass('selected');
            }
        });
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
            currentPageIndex = presentation.getPage(presentationController.getCurrentPageIndex()).getId(),
            pageName;

        if(presenter.configuration.displayType == 'comboList'){
            presenter.$view.find('.comboList').change(function(event){
                event.stopPropagation();
                event.preventDefault();
                pageName = $(this).val();
                for(var p in presenter.pages) {
                    var page = presenter.pages[p];

                    if (currentPageIndex !== page.index && pageName === page.name) {
                        commander.gotoPageIndex(page.numberOfIndex);
                    }
                }
            });
        }else{
            $list.find('li a').each(function () {
                $(this).click(function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                    pageName = $(this).text();
                    for(var p in presenter.pages) {
                        var page = presenter.pages[p];

                        if (currentPageIndex !== page.index && pageName === page.name) {
                            commander.gotoPageIndex(page.numberOfIndex);
                        }
                    }
                });
            });
        }
    }

    function handlePaginationMouseActions() {
        var lists = presenter.$view.find('.table-of-contents .table-of-contents-list'),
        $pagination = presenter.$view.find('.table-of-contents-pagination');

        $pagination.click(function (event) {
            event.stopPropagation();
        });

        presenter.$view.find('.table-of-contents-pagination a').each(function() {
            $(this).click(function(event) {
                event.stopPropagation();
                event.preventDefault();
                displayPage(parseInt($(this).text(), 10) - 1);
            });
        });
    }

    function presenterLogic(view, model, isPreview) {
        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return false;
        }

        function reportInsufficientSpace() {
            presenter.$view.html('<strong>Available space is insufficient! Please enlarge addon dimensions.</strong>')
        }

        presenter.pages = isPreview ? mockPresentationPages() : presenter.getPresentationPages();
        presenter.$view = $(view);

        setElementsDimensions(model.Width, model.Height);

        if(presenter.configuration.displayType == "comboList"){
            generateComboList(isPreview);
        }else if(presenter.configuration.displayType == "icons"){
            generateIcons(isPreview);
        }else if(presenter.configuration.displayType == "icons+list"){
            generateIconsAndList(isPreview);
        }else{
            var listHeight = generateListElements(),
                spareHeight = elementsHeights.wrapper - elementsHeights.title;

            var $list = presenter.$view.find('.table-of-contents .table-of-contents-list ol');
            if (!isSpaceSufficient($list, spareHeight)) {
                reportInsufficientSpace();
            }
        }

        if ((listHeight > spareHeight) && (presenter.configuration.displayType == "default" || presenter.configuration.displayType == "" || presenter.configuration.displayType == undefined)) {
            if (!paginateList(spareHeight - elementsHeights.pagination, isPreview)) {
                reportInsufficientSpace();
            }
        } else {
            presenter.$view.find('.table-of-contents-pagination').hide();
        }

        if(presenter.configuration.displayType == "list"){
            var titleHeight = presenter.$view.find('.table-of-contents-title').height();
            presenter.$view.find(".table-of-contents-list").css({
               "height":  model.Height-titleHeight+"px",
               "overflow-y": "scroll"
            });
        }

        if (!isPreview) handleMouseClickActions();
        if (!ModelValidationUtils.isStringEmpty(model['Header'])) {
        	presenter.$view.find('.table-of-contents .table-of-contents-title').text(model['Header'])
        }

         presenter.buildKeyboardController();
    }

    presenter.validateHiddenPages = function(hiddenPages) {
        if (typeof(hiddenPages) == 'undefined') {
            hiddenPages = '';
        }

        var pages = hiddenPages.split(';').sort();

        for (var i = 0; i < pages.length; i++) {
            var numberObject = ModelValidationUtils.validateInteger(pages[i]);

            if (!numberObject.isValid && hiddenPages.length > 0) {
                return getErrorObject("E01");
            }

            if (pages[i] < 0) {
                return getErrorObject("E02");
            }

            if (pages[i] === pages[i - 1]) {
                return getErrorObject("E03");
            }
        }
        return getCorrectObject(pages);
    }

    presenter.validateModel = function(model) {
        var pagesValidationResult = presenter.validateHiddenPages(model['DontShowPages']);
        if (!pagesValidationResult.isValid) {
            return pagesValidationResult;
        }

        return {
            ID: model.ID,
            isValid: true,
            hiddenPages: pagesValidationResult.value,
            displayType: model.displayType
        };
    };

    presenter.getPresentationPages = function() {
        var pages = [],
            presentation = presentationController.getPresentation(),
            pageCount = presentation.getPageCount();

        for (var i = 0; i < pageCount; i++) {
            if ($.inArray(String(i+1), presenter.configuration.hiddenPages) == -1) {
                var page = {};
                page.name = presentation.getPage(i).getName();
                page.index = presentation.getPage(i).getId();
                page.numberOfIndex = i;
                page.preview = presentation.getPage(i).getPreview();

                pages.push(page);
            }
        }

        return pages;
    };

    function mockPresentationPages() {
        return [
            {index:"fwrg4g1",
             name:"Page 01",
             numberOfIndex:"0"},
            {index:"fwrg4g2",
             name:"Page 02",
             numberOfIndex:"1"},
            {index:"fwrg4g3",
             name:"Page 03",
             numberOfIndex:"2"},
            {index:"fwrg4g4",
             name:"Page 04",
             numberOfIndex:"3"},
            {index:"fwrg4g5",
             name:"Page 05",
             numberOfIndex:"4"},
            {index:"fwrg4g6",
             name:"Page 06",
             numberOfIndex:"5"},
            {index:"fwrg4g7",
             name:"Page 07",
             numberOfIndex:"6"},
            {index:"fwrg4g8",
             name:"Page 08",
             numberOfIndex:"7"},
            {index:"fwrg4g9",
             name:"Page 09",
             numberOfIndex:"8"},
            {index:"fwrg4g0",
             name:"Page 10",
             numberOfIndex:"9"}
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

    function getElements() {
        var elements = [];

        if(presenter.configuration.displayType == "comboList"){
            for (var i = 0; i < presenter.$view.find('select').length; i++) {
                elements.push($(presenter.$view.find('select')[i]));
            }
        }else if(presenter.configuration.displayType == "icons" || presenter.configuration.displayType == "icons+list"){
            for (var i = 0; i < presenter.$view.find('.iconsList a').length; i++) {
                elements.push($(presenter.$view.find('.iconsList a')[i]));
            }
        }else {
            for (var i = 0; i < presenter.$view.find('li a').length; i++) {
                elements.push($(presenter.$view.find('li a')[i]));
            }

            for (var i = 0; i < presenter.$view.find('.table-of-contents-pagination a').length; i++) {
                elements.push($(presenter.$view.find('.table-of-contents-pagination a')[i]));
            }
        }

        return elements;
    }

    presenter.buildKeyboardController = function () {
        presenter.keyboardControllerObject = new TocKeyboardController(getElements(), 1);
        presenter.keyboardControllerObject.selectEnabled(true);
    };

    presenter.keyboardController = function(keycode) {
        if(presenter.configuration.displayType == "comboList") {
            presenter.$view.find('select').focus();
        }
        presenter.keyboardControllerObject.handle(keycode);
    };

    function TocKeyboardController (elements, columnsCount) {
        KeyboardController.call(this, elements, columnsCount);
    }

    TocKeyboardController.prototype = Object.create(window.KeyboardController.prototype);
    TocKeyboardController.prototype.constructor = TocKeyboardController;

    function scrollHorizontally(element) {
        var pos = $(element).position().left,
            currentscroll = presenter.$view.find('.iconsList').scrollLeft(),
            divwidth = presenter.$view.find('.iconsList').width();

        pos=(pos+currentscroll)-(divwidth/2);

        presenter.$view.find('.iconsList').scrollLeft(pos);
    }

    function scrollVertically(element) {
        var pos = $(element).position().top,
            currentscroll = presenter.$view.find('.table-of-contents-list').scrollTop(),
            divheight = presenter.$view.find('.table-of-contents-list').height();

        pos=(pos+currentscroll)-(divheight/2);

        presenter.$view.find('.table-of-contents-list').scrollTop(pos);
    }

    function centerElement(element){
        if(presenter.configuration.displayType == "icons" || presenter.configuration.displayType == "icons+list"){
            scrollHorizontally(element);
        }else {
            scrollVertically(element);
        }
    }

    TocKeyboardController.prototype.nextElement = function () {
        this.switchElement(1);

        if($(this.keyboardNavigationCurrentElement).parent().style('display') === "none") {
            this.nextElement();
        }

        centerElement(this.keyboardNavigationCurrentElement);
    };

    TocKeyboardController.prototype.previousElement = function () {
        this.switchElement(-1);

        if($(this.keyboardNavigationCurrentElement).parent().style('display') === "none") {
            this.previousElement();
        }

        centerElement(this.keyboardNavigationCurrentElement);
    };

    TocKeyboardController.prototype.nextRow = function () {
        if (event) {
            event.preventDefault();
        }
        this.switchElement(this.columnsCount);

        if($(this.keyboardNavigationCurrentElement).parent().style('display') === "none") {
            this.nextRow();
        }

        centerElement(this.keyboardNavigationCurrentElement);
    };

    TocKeyboardController.prototype.previousRow = function () {
        if (event) {
            event.preventDefault();
        }
        this.switchElement(-this.columnsCount);

        if($(this.keyboardNavigationCurrentElement).parent().style('display') === "none") {
            this.previousRow();
        }

        centerElement(this.keyboardNavigationCurrentElement);
    };

    TocKeyboardController.prototype.select = function () {
        if (!this.isSelectEnabled) {
            return;
        }

        this.selectAction();
    };

    return presenter;
}