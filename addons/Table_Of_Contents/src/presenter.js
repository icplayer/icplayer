function AddonTable_Of_Contents_create(){
    var presenter = function() {};
    var presentationController;

    var elementsHeights = {};

    presenter.isWCAGOn = false;
    presenter.keyboardControllerObject = null;
    presenter.isFirstEnter = true;

    presenter.ERROR_CODES = {
        E01: "Values in property 'Don't show' pages must be numeric",
        E02: "Values in property 'Don't show' pages must be greater than 0",
        E03: "Values in property 'Don't show' pages must be unique"
    };

    presenter.DISPAY_TYPES = {
        DEFAULT: "default",
        LIST: "list",
        COMBO_LIST: "comboList",
        ICONS: "icons",
        ICONS_LIST: "icons+list"
    }

    presenter.DEFAULT_TTS_PHRASES = {
        TITLE: "Title",
        GO_TO_PAGE: "Go to page",
        GO_TO_PAGE_NUMBER: "Go to page number",
        PAGES_LIST: "List of pages",
        PAGINATION: "Pagination",
        OUT_OFF: "out of",
        SELECTED: "Selected",
    };

    presenter.CSS_CLASSES = {
        TABLE_OF_CONTENTS: "table-of-contents",
        PAGINATION: "table-of-contents-pagination",
        LIST: "table-of-contents-list",
        TITLE: "table-of-contents-title",
        SELECTED: "selected",
        COMBO_LIST: "comboList",
        ICONS_LIST: "iconsList",
        IMAGE_CONTAINER: "imageContainer",
        IMAGE_ELEMENT: "imageElement",
        LIST_ELEMENT: "listElement",
        CURRENT_PAGE: "current-page",
    };

    presenter.ATTRIBUTES = {
        DATA_PAGE_NUMBER: "data-page-number",
    };

    function getErrorObject(ec) { return { isValid: false, errorCode: ec }; }

    function getCorrectObject(v) { return { isValid: true, value: v }; }

    function setElementsDimensions(addonWidth, addonHeight) {
        var wrapper = presenter.$view.find(`.${presenter.CSS_CLASSES.TABLE_OF_CONTENTS}:first`)[0];
        var wrapperDimensions = DOMOperationsUtils.getOuterDimensions(wrapper);
        var wrapperDistances = DOMOperationsUtils.calculateOuterDistances(wrapperDimensions);
        $(wrapper).css({
            width: addonWidth - wrapperDistances.horizontal,
            height: addonHeight - wrapperDistances.vertical
        });

        elementsHeights.wrapper = $(wrapper).height();

        var title = presenter.$view.find(`.${presenter.CSS_CLASSES.TITLE}`)[0];
        var titleDimensions = DOMOperationsUtils.getOuterDimensions(title);
        var titleDistances = DOMOperationsUtils.calculateOuterDistances(titleDimensions);
        $(title).css({
            width: $(wrapper).width() - titleDistances.horizontal
        });

        elementsHeights.title = $(title).height() + titleDistances.vertical;

        var pagination = presenter.$view.find(`.${presenter.CSS_CLASSES.PAGINATION}`)[0];
        var paginationDimensions = DOMOperationsUtils.getOuterDimensions(pagination);
        var paginationDistances = DOMOperationsUtils.calculateOuterDistances(paginationDimensions);
        $(pagination).css({
            width: $(wrapper).width() - paginationDistances.horizontal
        });

        elementsHeights.pagination = $(pagination).height() + paginationDistances.vertical;

        var list = presenter.$view.find(`.${presenter.CSS_CLASSES.LIST}`)[0];
        var listDimensions = DOMOperationsUtils.getOuterDimensions(list);
        var listDistances = DOMOperationsUtils.calculateOuterDistances(listDimensions);
        $(list).css({
            height: $(wrapper).height - elementsHeights.title - elementsHeights.pagination - listDistances.vertical,
            width: $(wrapper).width - listDistances.horizontal
        });

        elementsHeights.list = $(list).height() + listDistances.vertical;
    }


    function generateElement (text, page, isPreview) {
        var $element = $(document.createElement('li')),
            $link = $(document.createElement('a'));

        $link.text(text);
        $link.attr('href', '#');
        $element.html($link);
        
        if (!isPreview){
            var presentation = presentationController.getPresentation(),
                currentPageIndex = presentation.getPage(presentationController.getCurrentPageIndex()).getId();
            
            if (currentPageIndex == page.index) {
                $link.addClass(presenter.CSS_CLASSES.CURRENT_PAGE);
            }
        }
        
        return $element;
    }

    function generateListElements (isPreview) {
        var $list = presenter.$view.find(`.${presenter.CSS_CLASSES.TABLE_OF_CONTENTS} .${presenter.CSS_CLASSES.LIST} ol`);

        for (var i = 0; i < presenter.pages.length; i++) {
            $list.append(generateElement(presenter.pages[i].name, presenter.pages[i], isPreview));
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
        presenter.$view.find(`.${presenter.CSS_CLASSES.TABLE_OF_CONTENTS}`).append(selectionList);
        var comboList = presenter.$view.find(`.${presenter.CSS_CLASSES.COMBO_LIST}`);
        $(comboList).css("width", "100%");

        for (var i = 0; i < presenter.pages.length; i++) {
            comboList.append(generateComboElement(presenter.pages[i].name, isPreview));
        }
    }

    function generateIconListElement (page, isPreview) {
        var anchorElement = $('<a></a>');
        $(anchorElement).addClass(presenter.CSS_CLASSES.IMAGE_CONTAINER);

        var imgElement = document.createElement('img');
        $(imgElement).addClass(presenter.CSS_CLASSES.IMAGE_ELEMENT);
        imgElement.src = page.preview;

        var listElement = $('<div></div>');
        $(listElement).addClass(presenter.CSS_CLASSES.LIST_ELEMENT);
        $(listElement).text(page.name);
        $(anchorElement).append(imgElement).append(listElement);

        if(!isPreview) {
            var presentation = presentationController.getPresentation(),
                commander = presentationController.getCommands(),
                currentPageIndex = presentation.getPage(presentationController.getCurrentPageIndex()).getId();

            $(anchorElement).attr(presenter.ATTRIBUTES.DATA_PAGE_NUMBER, page.numberOfIndex + 1);

            if (currentPageIndex == page.index) {
                $(anchorElement).addClass(presenter.CSS_CLASSES.CURRENT_PAGE);
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
        var anchorElement = $('<a class="imageContainer"></a>');
        $(anchorElement).addClass(presenter.CSS_CLASSES.IMAGE_CONTAINER);
        var imgElement = document.createElement('img');

        $(imgElement).addClass(presenter.CSS_CLASSES.IMAGE_ELEMENT);
        imgElement.src = page.preview;
        $(anchorElement).append(imgElement);

        if(!isPreview) {
            var presentation = presentationController.getPresentation(),
                commander = presentationController.getCommands(),
                currentPageIndex = presentation.getPage(presentationController.getCurrentPageIndex()).getId();

            $(anchorElement).attr(presenter.ATTRIBUTES.DATA_PAGE_NUMBER, page.numberOfIndex + 1);

            if (currentPageIndex == page.index) {
                $(anchorElement).addClass(presenter.CSS_CLASSES.CURRENT_PAGE);
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
        var iconsList = $('<div></div>');
        iconsList.addClass(presenter.CSS_CLASSES.ICONS_LIST);
        presenter.$view.find(`.${presenter.CSS_CLASSES.TABLE_OF_CONTENTS}`).append(iconsList);

        for (var i = 0; i < presenter.pages.length; i++) {
            iconsList.append(generateIconElement(presenter.pages[i], isPreview));
        }
    }

    function generateIconsAndList (isPreview) {
        var iconsList = $('<div></div>');
        iconsList.addClass(presenter.CSS_CLASSES.ICONS_LIST);
        presenter.$view.find(`.${presenter.CSS_CLASSES.TABLE_OF_CONTENTS}`).append(iconsList);

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
        var $list = presenter.$view.find(`.${presenter.CSS_CLASSES.TABLE_OF_CONTENTS} .${presenter.CSS_CLASSES.LIST} ol`),
            pages = presenter.pagination.pages[page], i,
            startIndex = presenter.pageStartIndex(page),
            $pageList = presenter.$view.find(`.${presenter.CSS_CLASSES.PAGINATION}`);

        $list.find('li').hide();
        $list.attr('start', '' + startIndex);
        for (i = 0; i < pages.length; i++) {
            $list.find('li:eq(' + pages[i] + ')').show();
        }

        $pageList.children().removeClass(presenter.CSS_CLASSES.SELECTED);
        $pageList.find('a').each(function(){
            if ($(this).text()==(page+1)) {
                $(this).addClass(presenter.CSS_CLASSES.SELECTED);
            }
        });
   }

    function isSpaceSufficient($list, spareHeight) {
        return $list.find('li:first').outerHeight() < spareHeight;
    }

    function paginateList(spareHeight, isPreview) {
        var $list = presenter.$view.find(`.${presenter.CSS_CLASSES.TABLE_OF_CONTENTS} .${presenter.CSS_CLASSES.LIST} ol`);
        var $pagination = presenter.$view.find(`.${presenter.CSS_CLASSES.TABLE_OF_CONTENTS} .${presenter.CSS_CLASSES.PAGINATION}`);

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
            $list = presenter.$view.find(`.${presenter.CSS_CLASSES.LIST} ol`),
            currentPageIndex = presentation.getPage(presentationController.getCurrentPageIndex()).getId(),
            pageName;

        if(presenter.isComboListDisplayType()){
            presenter.$view.find(`.${presenter.CSS_CLASSES.COMBO_LIST}`).change(function(event){
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
        var lists = presenter.$view.find(`.${presenter.CSS_CLASSES.TABLE_OF_CONTENTS} .${presenter.CSS_CLASSES.LIST}`),
        $pagination = presenter.$view.find(`.${presenter.CSS_CLASSES.PAGINATION}`);

        $pagination.click(function (event) {
            event.stopPropagation();
        });

        presenter.$view.find(`.${presenter.CSS_CLASSES.PAGINATION} a`).each(function() {
            $(this).click(function(event) {
                event.stopPropagation();
                event.preventDefault();
                displayPage(parseInt($(this).text(), 10) - 1);
            });
        });
    }

    function presenterLogic(view, model, isPreview) {
        var upgradedModel = presenter.upgradeModel(model);
        presenter.setSpeechTexts(upgradedModel["speechTexts"]);
        presenter.configuration = presenter.validateModel(upgradedModel);

        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return false;
        }

        function reportInsufficientSpace() {
            presenter.$view.html('<strong>Available space is insufficient! Please enlarge addon dimensions.</strong>')
        }

        presenter.pages = isPreview ? mockPresentationPages() : presenter.getPresentationPages();
        presenter.$view = $(view);

        setElementsDimensions(upgradedModel.Width, upgradedModel.Height);

        if(presenter.isComboListDisplayType()){
            generateComboList(isPreview);
        }else if(presenter.isIconsDisplayType()){
            generateIcons(isPreview);
        }else if(presenter.isIconsListDisplayType()){
            generateIconsAndList(isPreview);
        }else{
            var listHeight = generateListElements(isPreview),
                spareHeight = elementsHeights.wrapper - elementsHeights.title;

            var $list = presenter.$view.find(`.${presenter.CSS_CLASSES.TABLE_OF_CONTENTS} .${presenter.CSS_CLASSES.LIST} ol`);
            if (!isSpaceSufficient($list, spareHeight)) {
                reportInsufficientSpace();
            }
        }

        if ((listHeight > spareHeight) && (presenter.isDefaultDisplayType())) {
            if (!paginateList(spareHeight - elementsHeights.pagination, isPreview)) {
                reportInsufficientSpace();
            }
        } else {
            presenter.$view.find(`.${presenter.CSS_CLASSES.PAGINATION}`).hide();
        }

        if(presenter.isListDisplayType()){
            var titleHeight = presenter.$view.find(`.${presenter.CSS_CLASSES.TITLE}`).height();
            presenter.$view.find(`.${presenter.CSS_CLASSES.LIST}`).css({
               "height":  upgradedModel.Height-titleHeight+"px",
               "overflow-y": "scroll"
            });
        }

        if (!isPreview) handleMouseClickActions();
        if (!ModelValidationUtils.isStringEmpty(upgradedModel['Header'])) {
        	presenter.$view.find(`.${presenter.CSS_CLASSES.TABLE_OF_CONTENTS} .${presenter.CSS_CLASSES.TITLE}`).text(upgradedModel['Header'])
        }

         presenter.buildKeyboardController();
    }

    presenter.upgradeModel = function (model) {
        var upgradedModel = presenter.upgradeLangTag(model);
        return presenter.upgradeSpeechTexts(upgradedModel);
    };

    presenter.upgradeLangTag = function (model) {
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        if (upgradedModel["langAttribute"] === undefined) {
            upgradedModel["langAttribute"] =  '';
        }

        return upgradedModel;
    };

    presenter.upgradeSpeechTexts = function (model) {
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        if (!upgradedModel["speechTexts"]) {
            upgradedModel["speechTexts"] = {};
        }
        if (!upgradedModel["speechTexts"]["Title"]) {
            upgradedModel["speechTexts"]["Title"] = {Title: ""};
        }
        if (!upgradedModel["speechTexts"]["GoToPage"]) {
            upgradedModel["speechTexts"]["GoToPage"] = {GoToPage: ""};
        }
        if (!upgradedModel["speechTexts"]["GoToPageNumber"]) {
            upgradedModel["speechTexts"]["GoToPageNumber"] = {GoToPageNumber: ""};
        }
        if (!upgradedModel["speechTexts"]["PagesList"]) {
            upgradedModel["speechTexts"]["PagesList"] = {PagesList: ""};
        }
        if (!upgradedModel["speechTexts"]["Pagination"]) {
            upgradedModel["speechTexts"]["Pagination"] = {Pagination: ""};
        }
        if (!upgradedModel["speechTexts"]["OutOf"]) {
            upgradedModel["speechTexts"]["OutOf"] = {OutOf: ""};
        }
        if (!upgradedModel["speechTexts"]["Selected"]) {
            upgradedModel["speechTexts"]["Selected"] = {Selected: ""};
        }

        return upgradedModel;
    };

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
            displayType: model.displayType,
            langTag: model.langAttribute,
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

    presenter.buildKeyboardController = function () {
        presenter.keyboardControllerObject = new TocKeyboardController(presenter.getElementsForKeyboardNavigation(), 1);
        presenter.keyboardControllerObject.selectEnabled(true);
    };

    presenter.getElementsForTTS = function() {
        var elements = presenter.getElementsForKeyboardNavigation();
        elements.unshift(presenter.getTitleElementForKeyboardNavigation());
        return elements;
    };

    presenter.getElementsForKeyboardNavigation = function() {
        if (presenter.isComboListDisplayType()){
            return presenter.getComboListDisplayTypeElementsForKeyboardNavigation();
        } else if (presenter.isIconsDisplayType() || presenter.isIconsListDisplayType()) {
            return presenter.getIconsDisplayTypeElementsForKeyboardNavigation();
        } else if (presenter.isDefaultDisplayType()) {
            return presenter.getDefaultDisplayTypeElementsForKeyboardNavigation();
        } else if (presenter.isListDisplayType()) {
            return presenter.getListDisplayTypeElementsForKeyboardNavigation();
        }
    };

    presenter.getDefaultDisplayTypeElementsForKeyboardNavigation = function() {
        var elements = presenter.getListDisplayTypeElementsForKeyboardNavigation();

        for (var i = 0; i < presenter.$view.find(`.${presenter.CSS_CLASSES.PAGINATION} a`).length; i++) {
            elements.push($(presenter.$view.find(`.${presenter.CSS_CLASSES.PAGINATION} a`)[i]));
        }

        return elements;
    };

    presenter.getListDisplayTypeElementsForKeyboardNavigation = function() {
        var elements = [];

        for (var i = 0; i < presenter.$view.find('li a').length; i++) {
            elements.push($(presenter.$view.find('li a')[i]));
        }

        return elements;
    };

    presenter.getIconsDisplayTypeElementsForKeyboardNavigation = function() {
        var elements = [];

        for (var i = 0; i < presenter.$view.find(`.${presenter.CSS_CLASSES.ICONS_LIST} a`).length; i++) {
            elements.push($(presenter.$view.find(`.${presenter.CSS_CLASSES.ICONS_LIST} a`)[i]));
        }

        return elements;
    };

    presenter.getComboListDisplayTypeElementsForKeyboardNavigation = function() {
        var elements = [];

        for (var i = 0; i < presenter.$view.find('select').length; i++) {
            elements.push($(presenter.$view.find('select')[i]));
        }

        return elements;
    };

    presenter.getTitleElementForKeyboardNavigation = function() {
        return $(presenter.$view.find(`.${presenter.CSS_CLASSES.TITLE}`)[0]);
    };

    presenter.isDefaultDisplayType = function() {
        var displayType = presenter.configuration.displayType;
        return (
          displayType == presenter.DISPAY_TYPES.DEFAULT
          || displayType == ""
          || displayType == undefined
        )
    };

    presenter.isListDisplayType = function() {
        return presenter.configuration.displayType == presenter.DISPAY_TYPES.LIST;
    };

    presenter.isComboListDisplayType = function() {
        return presenter.configuration.displayType == presenter.DISPAY_TYPES.COMBO_LIST;
    };

    presenter.isIconsDisplayType = function() {
        return presenter.configuration.displayType == presenter.DISPAY_TYPES.ICONS;
    };

    presenter.isIconsListDisplayType = function() {
        return presenter.configuration.displayType == presenter.DISPAY_TYPES.ICONS_LIST;
    };

    presenter.keyboardController = function(keycode, isShiftDown, event) {
        if (presenter.isComboListDisplayType()) {
            presenter.$view.find('select').focus();
        }
        presenter.keyboardControllerObject.handle(keycode, isShiftDown, event);
    };

    function TocKeyboardController (elements, columnsCount) {
        KeyboardController.call(this, elements, columnsCount);
    }

    TocKeyboardController.prototype = Object.create(window.KeyboardController.prototype);
    TocKeyboardController.prototype.constructor = TocKeyboardController;

    function scrollHorizontally(element) {
        var pos = $(element).position().left,
            currentscroll = presenter.$view.find(`.${presenter.CSS_CLASSES.ICONS_LIST}`).scrollLeft(),
            divwidth = presenter.$view.find(`.${presenter.CSS_CLASSES.ICONS_LIST}`).width();

        pos=(pos+currentscroll)-(divwidth/2);

        presenter.$view.find(`.${presenter.CSS_CLASSES.ICONS_LIST}`).scrollLeft(pos);
    }

    function scrollVertically(element) {
        var pos = $(element).position().top,
            currentscroll = presenter.$view.find(`.${presenter.CSS_CLASSES.LIST}`).scrollTop(),
            divheight = presenter.$view.find(`.${presenter.CSS_CLASSES.LIST}`).height();

        pos=(pos+currentscroll)-(divheight/2);

        presenter.$view.find(`.${presenter.CSS_CLASSES.LIST}`).scrollTop(pos);
    }

    function centerElement(element){
        if(presenter.isIconsDisplayType() || presenter.isIconsListDisplayType()){
            scrollHorizontally(element);
        }else {
            scrollVertically(element);
        }
    }

    presenter.setWCAGStatus = function(isWCAGOn) {
        presenter.isWCAGOn = isWCAGOn;
    };

    presenter.setSpeechTexts = function(speechTexts) {
        presenter.speechTexts = {
            Title: presenter.DEFAULT_TTS_PHRASES.TITLE,
            GoToPage: presenter.DEFAULT_TTS_PHRASES.GO_TO_PAGE,
            GoToPageNumber: presenter.DEFAULT_TTS_PHRASES.GO_TO_PAGE_NUMBER,
            PagesList: presenter.DEFAULT_TTS_PHRASES.PAGES_LIST,
            Pagination: presenter.DEFAULT_TTS_PHRASES.PAGINATION,
            OutOf: presenter.DEFAULT_TTS_PHRASES.OUT_OFF,
            Selected: presenter.DEFAULT_TTS_PHRASES.SELECTED,
        };

        if (!speechTexts || $.isEmptyObject(speechTexts)) {
            return;
        }

        presenter.speechTexts = {
            Title: TTSUtils.getSpeechTextProperty(
                speechTexts.Title.Title,
                presenter.speechTexts.Title),
            GoToPage: TTSUtils.getSpeechTextProperty(
                speechTexts.GoToPage.GoToPage,
                presenter.speechTexts.GoToPage),
            GoToPageNumber: TTSUtils.getSpeechTextProperty(
                speechTexts.GoToPageNumber.GoToPageNumber,
                presenter.speechTexts.GoToPageNumber),
            PagesList: TTSUtils.getSpeechTextProperty(
                speechTexts.PagesList.PagesList,
                presenter.speechTexts.PagesList),
            Pagination: TTSUtils.getSpeechTextProperty(
                speechTexts.Pagination.Pagination,
                presenter.speechTexts.Pagination),
            OutOf: TTSUtils.getSpeechTextProperty(
                speechTexts.OutOf.OutOf,
                presenter.speechTexts.OutOf),
            Selected: TTSUtils.getSpeechTextProperty(
                speechTexts.Selected.Selected,
                presenter.speechTexts.Selected)
        };
    };

    // TAB or Right Arrow
    TocKeyboardController.prototype.nextElement = function (event) {
        if (event && this.isActiveTTSOrCurrentElementNotComboList()) {
            event.preventDefault();
        }

        const isArrowRight = event && event.keyCode === 39;
        if (isArrowRight && this.isActiveTTSAndCurrentElementComboList()) {
            this.switchOption(1);
        } else {
            this.switchElement(1);

            if (this.isCurrentElementNotDisplayed()) {
                this.nextElement();
            }

            centerElement(this.keyboardNavigationCurrentElement);
        }
    };

    // SHIFT+TAB or Left Arrow
    TocKeyboardController.prototype.previousElement = function (event) {
        if (event && this.isActiveTTSOrCurrentElementNotComboList()) {
            event.preventDefault();
        }

        const isArrowLeft = event && event.keyCode === 37;
        if (isArrowLeft && this.isActiveTTSAndCurrentElementComboList()) {
            this.switchOption(-1);
        } else {
            this.switchElement(-1);

            if(this.isCurrentElementNotDisplayed()) {
                this.previousElement();
            }

            centerElement(this.keyboardNavigationCurrentElement);
        }
    };

    // DOWN Arrow
    TocKeyboardController.prototype.nextRow = function (event) {
        if (event && this.isActiveTTSOrCurrentElementNotComboList()) {
            event.preventDefault();
        }

        if (this.isActiveTTSAndCurrentElementComboList()) {
            this.switchOption(1);
        } else {
            this.switchElement(this.columnsCount);

            if(this.isCurrentElementNotDisplayed()) {
                this.nextRow();
            }

            centerElement(this.keyboardNavigationCurrentElement);
        }
    };

    // UP Arrow
    TocKeyboardController.prototype.previousRow = function (event) {
        if (event && this.isActiveTTSOrCurrentElementNotComboList()) {
            event.preventDefault();
        }

        if (this.isActiveTTSAndCurrentElementComboList()) {
            this.switchOption(-1);
        } else {
            this.switchElement(-this.columnsCount);

            if (this.isCurrentElementNotDisplayed()) {
                this.previousRow();
            }

            centerElement(this.keyboardNavigationCurrentElement);
        }
    };

    TocKeyboardController.prototype.switchElement = function (move) {
        KeyboardController.prototype.switchElement.call(this, move);
        if(!this.isCurrentElementNotDisplayed()) {
            this.readCurrentElement();
        }
    };

    TocKeyboardController.prototype.switchOption = function (move) {
        const $option = this.getCurrentElement();
        const optionSize = $option.find("option").size();
        const currentIndex = $option.prop("selectedIndex");
        const nextIndex = currentIndex + move;

        if (0 <= nextIndex && nextIndex < optionSize) {
            $option.prop("selectedIndex", nextIndex);
            this.readCurrentElement();
        }
    };

    TocKeyboardController.prototype.select = function (event) {
        const $currentElement = this.getCurrentElement();
        const isCurrentElementComboList = isElementComboList($currentElement);
        const isActiveTTS = presenter.isTTS();

        if (event && (isActiveTTS || !isCurrentElementComboList)) {
            event.preventDefault();
        }
        if (!this.isSelectEnabled) {
            return;
        }

        if (isActiveTTS && isCurrentElementComboList) {
            $currentElement.change();
        } else {
            this.selectAction();
            if (isParentOfElementPaginationList($currentElement)) {
                presenter.speak(presenter.speechTexts.Selected);
            }
        }
    };

    TocKeyboardController.prototype.isCurrentElementNotDisplayed = function () {
        return this.getCurrentElement().parent().style("display") === "none";
    };

    TocKeyboardController.prototype.isActiveTTSAndCurrentElementComboList = function () {
        return presenter.isTTS() && this.isCurrentElementComboList();
    };

    TocKeyboardController.prototype.isActiveTTSOrCurrentElementNotComboList = function () {
        return presenter.isTTS() || !this.isCurrentElementComboList();
    };

    TocKeyboardController.prototype.isCurrentElementComboList = function () {
        const $currentElement = this.getCurrentElement();
        return isElementComboList($currentElement);
    };

    TocKeyboardController.prototype.getCurrentElement = function () {
        return this.getTarget(this.keyboardNavigationCurrentElement, false);
    };

    TocKeyboardController.prototype.enter = function (event) {
        if (presenter.isTTS() && presenter.isFirstEnter) {
            KeyboardController.prototype.setElements.call(this, presenter.getElementsForTTS());
            presenter.isFirstEnter = false;
        }
        KeyboardController.prototype.enter.call(this, event);
        this.readCurrentElement();
    };

    TocKeyboardController.prototype.exitWCAGMode = function () {
        presenter.isFirstEnter = true;
        KeyboardController.prototype.setElements.call(this, presenter.getElementsForKeyboardNavigation());
        KeyboardController.prototype.exitWCAGMode.call(this);
        presenter.setWCAGStatus(false);
    };

    TocKeyboardController.prototype.readCurrentElement = function () {
        var $element = this.getTarget(this.keyboardNavigationCurrentElement, false);

        if ($element.hasClass(presenter.CSS_CLASSES.TITLE)) {
            presenter.speak(getTitleTTS($element));
        } else {
            if ($element.parent().hasClass(presenter.CSS_CLASSES.PAGINATION)) {
                presenter.speak(getPaginationHyperLinkTTS($element));
            } else if (isElementComboList($element)) {
                presenter.speak(getComboListTTS($element));
            } else if (presenter.isIconsDisplayType()) {
                presenter.speak(getIconTTS($element));
            } else {
                presenter.speak(getHyperLinkTTS($element));
            }
        }
    };

    function isElementComboList($element) {
        return $element.hasClass(presenter.CSS_CLASSES.COMBO_LIST);
    }

    function isParentOfElementPaginationList($element) {
        return $element.parent().hasClass(presenter.CSS_CLASSES.PAGINATION);
    }

    function getTitleTTS($element) {
        var textVoiceObject = [];

        const titlePrefix = presenter.speechTexts.Title;
        pushMessageToTextVoiceObject(textVoiceObject, titlePrefix);

        const titleText = $element[0].innerText;
        pushMessageToTextVoiceObject(textVoiceObject, titleText, true);

        return textVoiceObject;
    }

    function getHyperLinkTTS($element) {
        const goToPagePrefix = presenter.speechTexts.GoToPage;
        const pageName = $element[0].innerText;
        return `${goToPagePrefix} ${pageName}`;
    }

    function getPaginationHyperLinkTTS($element) {
        const language = document.documentElement.lang;
        const currentPaginationIndexAsText
          = window.TTSUtils.numberToOrdinalNumber($element[0].innerText, language, window.TTSUtils.GENDER.NEUTER);
        const paginationSizeAsText
          = window.TTSUtils.numberToOrdinalNumber(presenter.pagination.size + 1, language, window.TTSUtils.GENDER.FEMININE);

        var texts = [presenter.speechTexts.Pagination, ];
        if ($element.hasClass(presenter.CSS_CLASSES.SELECTED)) {
            texts.push(presenter.speechTexts.Selected);
        }
        texts.push(`${currentPaginationIndexAsText} ${presenter.speechTexts.OutOf} ${paginationSizeAsText}`);

        return createVoiceObject(texts);
    }

    function getIconTTS($element) {
        return `${presenter.speechTexts.GoToPageNumber} ${$element.attr(presenter.ATTRIBUTES.DATA_PAGE_NUMBER)}`;
    }

    function getComboListTTS($element) {
        var textVoiceObject = [];

        const prefix = presenter.speechTexts.PagesList;
        pushMessageToTextVoiceObject(textVoiceObject, prefix);

        const pageName = $element.val();
        const gotToPageText = `${presenter.speechTexts.GoToPage} ${pageName}`;
        pushMessageToTextVoiceObject(textVoiceObject, gotToPageText);

        return textVoiceObject;
    }

    presenter.getTextToSpeechOrNull = function Toc_getTextToSpeechOrNull(playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    presenter.speak = function(data) {
        var tts = presenter.getTextToSpeechOrNull(presentationController);
        if (tts && presenter.isWCAGOn) {
            tts.speak(data);
        }
    };

    presenter.isTTS = function () {
        return presenter.getTextToSpeechOrNull(presentationController) && presenter.isWCAGOn;
    };

    function createVoiceObject(messages, usePresenterLangTag = false) {
        var textVoiceObject = [];
        for (var i = 0; i < messages.length; i++) {
            pushMessageToTextVoiceObject(textVoiceObject, messages[i], usePresenterLangTag);
        }
        return textVoiceObject;
    }

    function pushMessageToTextVoiceObject(textVoiceObject, message, usePresenterLangTag = false) {
        if (usePresenterLangTag)
            textVoiceObject.push(window.TTSUtils.getTextVoiceObject(message, presenter.configuration.langTag));
        else
            textVoiceObject.push(window.TTSUtils.getTextVoiceObject(message));
    }

    return presenter;
}