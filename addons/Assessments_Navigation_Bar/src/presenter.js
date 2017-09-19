function AddonAssessments_Navigation_Bar_create(){

    var presenter = function(){};

    presenter.SECTION_NAME_HEIGHT = 20;

    presenter.ERROR_MESSAGES = {
        S_00: "Section property cant be empty string",
        S_01: "Pages range are invalid on section %section% in sections property. Numbers have to be integers only.",
        S_02: "Pages range is invalid on section: %section% in sections property.",
        S_03: "Pages descriptions are invalid on section: %section% in sections property. Number of descriptions is too small.",
        S_04: "Pages descriptions are invalid on section: %section% in sections property. Number of descriptions is too big.",
        S_05: "Section: %section_1% pages numbers cant intersect with page numbers of section: %section_2%.",
        S_06: "Number of buttons property can't be equal or below 0.",
        S_07: "Number of buttons property have to be an integer",
        S_08: "Number of buttons can't be greater than number of pages in sections",
        S_09: "Buttons width property can't be equal or below 0.",
        S_10: "Buttons width property have to be an integer"
    };

    presenter.CSS_CLASSES = {
        ALL_ATTEMPTED: "all-attempted"
    };
    
    presenter.attemptedButtons = [];

    presenter.configuration = {
        isValid: undefined,
        addonID: undefined,
        sections: undefined,
        addClassAreAllAttempted: undefined,
        userButtonsNumber: undefined,
        userButtonsWidth: undefined,
        numberOfButtons: undefined,
        navigationLeftIndex: 0,
        navigationRightIndex: 0,
        numberOfPages: 0,
    };

    presenter.keyboardControllerObject = null;

    presenter.showErrorMessage = function(message, substitutions) {
        var errorContainer;
        if(typeof(substitutions) == 'undefined') {
            errorContainer = '<p>' + message + '</p>';
        } else {
            var messageSubst = message;
            for(var key in substitutions) {
                messageSubst = messageSubst.replace('%' + key + '%', substitutions[key]);
            }
            errorContainer = '<p>' + messageSubst + '</p>';
        }

        presenter.$view.html(errorContainer);
    };

    function getErrorObject (errorCode, errorData) {
        return {
            isValid: false,
            errorCode: errorCode,
            errorData: errorData
        };
    }

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.presentation = controller.getPresentation();
        presenter.currentPageIndex = presenter.playerController.getCurrentPageIndex();
        presenter.commander = controller.getCommands();
        presenter.eventBus = controller.getEventBus();

        presenter.eventBus.addEventListener('PageLoaded', this);
        presenter.eventBus.addEventListener('ValueChanged', this);
    };

    presenter.changeToPage = function (index) {
        if (index == presenter.currentPageIndex) {
            return;
        }

        presenter.commander.gotoPageIndex(index);
    };

    presenter.executeCommand = function (name, params) {
        var commands = {
            'bookmarkCurrentPage': presenter.bookmarkCurrentPage,
            'removeBookmark' : presenter.removeBookmark,
            'moveToPage': presenter.moveToPageCommand,
            'moveToPreviousPage': presenter.moveToPreviousPage,
            'moveToNextPage': presenter.moveToNextPage
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.moveToPreviousPage = function() {
        presenter.navigationManager.goLeft();
    };

    presenter.moveToNextPage = function() {
        presenter.navigationManager.goRight();
    };

    presenter.moveToPageCommand = function (params) {
        presenter.moveToPage(params[0]);
    };

    presenter.moveToPage = function (pageIndex) {
        var validatedPageIndex = presenter.validatePageIndex(pageIndex);

        if (validatedPageIndex.isValid) {
            var page = presenter.sections.getPageByIndex(validatedPageIndex.index);

            presenter.changeToPage(page.page);
        }
    };

    presenter.validatePageIndex = function (pageIndex) {
        var parsedIndex = Number(pageIndex);

        if (isNaN(parsedIndex)) {
            return getErrorObject();
        }

        if (presenter.isFloat(parsedIndex)) {
            return getErrorObject();
        }

        if ((parsedIndex < 1) || (parsedIndex > presenter.configuration.numberOfPages)) {
            return getErrorObject();
        }

        return {
            isValid: true,
            index: (parsedIndex - 1)
        };
    };

    presenter.bookmarkCurrentPage = function () {
        presenter.sections.setBookmarkCurrentPage(true);
        presenter.navigationManager.bookmarkCurrentButton();
    };

    presenter.removeBookmark = function () {
        presenter.sections.setBookmarkCurrentPage(false);
        presenter.navigationManager.removeBookmarkFromCurrentButton();
    };

    // Fisher-Yates algorithm
    // based on http://sedition.com/perl/javascript-fy.html
    function shuffleArray (a) {
        var i = a.length;
        if ( i == 0 ) return [];

        while ( --i ) {
            var j = Math.floor( Math.random() * ( i + 1 ) );
            var tempi = a[i];
            a[i] = a[j];
            a[j] = tempi;
        }

        return a;
    }

    presenter.Button = function (view_description) {
        this.description = view_description;
        this.$view = this.createView();
        console.log(this.$view);
        this.$view_text;
        this.actualCommand;
        this.navigateToPage;
        this.isActualButton = false;

        this.connectEvents();
        this.$view.addClass("element");
    };

    presenter.Button.prototype.connectEvents = function () {
        this.$view[0].addEventListener("click", this, false);
        this.$view[0].addEventListener("mouseover", this, false);
        this.$view[0].addEventListener("mouseout", this, false);
    };
    
    presenter.Button.prototype.addCssClass = function (cssClass) {
        this.$view.addClass(cssClass);
    };

    presenter.Button.prototype.removeCssClass = function (cssClass) {
        this.$view.removeClass(cssClass);
    };

    presenter.Button.prototype.setCommand = function (command) {
        this.actualCommand = command;
    };

    presenter.Button.prototype.setNavigateToPage = function (navigateToPage) {
        this.navigateToPage = navigateToPage;
    };

    presenter.Button.prototype.execute = function () {
        this.actualCommand();
    };

    presenter.Button.prototype.handleEvent = function (event) {
        if (presenter.isPreview) {
            return;
        }

        switch (event.type) {
            case "click":
                this.execute();
                break;
            case "mouseover":
                this.$view.addClass("mouse-over");
                break;
            case "mouseout":
                this.$view.removeClass("mouse-over");
                break;
        }

        event.preventDefault();
        event.stopPropagation();
    };

    presenter.Button.prototype.setAsCurrent = function () {
        this.isActualButton = true;
        this.$view.addClass("current_page");
    };

    presenter.Button.prototype.addBookmark = function () {
        this.$view.addClass("bookmark");
    };

    presenter.Button.prototype.removeBookmark = function () {
        this.$view.removeClass("bookmark");
    };

    presenter.Button.prototype.createView = function () {
        var $view = $('<div></div>');

        $view.css({
            width: presenter.configuration.sizes.elementWidth + "px"
        });

        this.$view_text = $('<div></div>');
        this.$view_text.text(this.description);
        this.$view_text.addClass("button_text");

        $view.append(this.$view_text);

        $view.addClass("button");

        return $view;
    };

    presenter.Button.prototype.getView = function () {
        return this.$view;
    };

    presenter.Button.prototype.addInactiveClass = function () {
        this.$view.addClass("inactive");
    };

    presenter.Button.prototype.removeInactiveClass = function () {
        this.$view.removeClass("inactive");
    };

    presenter.NavigationButtonLeft = function () {
        presenter.Button.call(this, "&lt;");
        this.$view.removeClass("button");
        this.$view.addClass("previous");
        this.setCommand(function () {
            presenter.navigationManager.goLeft();
        });
    };

    presenter.NavigationButtonLeft.prototype = Object.create(presenter.Button.prototype);
    presenter.NavigationButtonLeft.constructor = presenter.NavigationButtonLeft;

    presenter.NavigationButtonRight = function () {
        presenter.Button.call(this, "&gt;");
        this.$view.addClass("next");
        this.$view.removeClass("button");
        this.setCommand(function () {
            presenter.navigationManager.goRight();
        });
    };

    presenter.NavigationButtonRight.prototype = Object.create(presenter.Button.prototype);
    presenter.NavigationButtonRight.constructor = presenter.NavigationButtonRight;

    presenter.HellipButton = function (hellipFunction, className) {
        presenter.Button.call(this, "&hellip;"); // ...
        this.$view_text.html(this.description);
        this.$view.removeClass("button");
        this.$view.addClass(className);

        this.setCommand(hellipFunction);
    };

    presenter.HellipButton.prototype = Object.create(presenter.Button.prototype);
    presenter.HellipButton.constructor = presenter.HellipButton;

    presenter.Page = function (page, view_description, sectionName, sectionCssClass) {
        this.description = view_description;
        this.page = page;
        this.isBookmarkOn = false;
        this.sectionName = sectionName;
        this.sectionCssClass = sectionCssClass;
    };

    presenter.Page.prototype.setBookmarkOn = function (bookmark) {
        this.isBookmarkOn = bookmark;
    };

    presenter.Page.prototype.getSectionClassName = function () {
        return this.sectionCssClass;
    };

    presenter.Page.prototype.getSectionName = function () {
        return this.sectionName;
    };

    presenter.Page.prototype.getChangeToPageCommand = function () {
        return function () {
            var index = Number(this);
            presenter.changeToPage(index);
        }.bind(this.page);
    };

    presenter.Page.prototype.isActualPage = function () {
        return presenter.currentPageIndex === this.page;
    };

    presenter.Section = function (pages, sectionName, pagesDescriptions, sectionCssClassName) {
        this.name = sectionName;
        this.cssClass = sectionCssClassName;
        this.pages = this.createPages(pages, pagesDescriptions);
    };

    presenter.Section.prototype.createPages = function (pages, pagesDescriptions) {
        return shuffleArray(pages).map(function (page, index) {
            return new presenter.Page(page, pagesDescriptions[index], this.name, this.cssClass);
        }, this);
    };

    presenter.Sections = function (sections) {
        this.sections = this.createSections(sections);
        this.allPages = this.getAllPagesInOrder(this.sections);
        this.attemptedPages = [];
        this.pagesIndexes = this.getPagesIndexes(this.allPages);
    };

    presenter.Sections.prototype.markPageAsAttempted = function (page) {
        if(!(this.attemptedPages.indexOf(page) > -1)){
            this.attemptedPages.push(page);
        }
    };

    presenter.Sections.prototype.markPageAsNotAttempted = function (page) {
        var attempted_page_index = this.attemptedPages.indexOf(page);
        if (attempted_page_index !== -1) {
            this.attemptedPages.splice(attempted_page_index, 1);
        }
    };

    presenter.Sections.prototype.getPagesIndexes = function (pages) {
        return pages.map(function (page) {
            return page.page;
        });
    };

    presenter.Sections.prototype.getPageByIndex = function (index) {
        return this.allPages[index];
    };

    presenter.Sections.prototype.isHomeCurrentPage = function () {
        return this.allPages[0].isActualPage();
    };

    presenter.Sections.prototype.isLastCurrentPage = function () {
        return this.allPages[this.allPages.length - 1].isActualPage();
    };

    presenter.Sections.prototype.getActualPageIndex = function () {
        for (var i = 0; i < this.allPages.length; i++) {
            if (this.allPages[i].isActualPage()) {
                return i;
            }
        }

        return undefined;
    };

    presenter.Sections.prototype.doesActualPageExists = function () {
        return this.pagesIndexes.indexOf(presenter.currentPageIndex) !== -1;
    };

    presenter.Sections.prototype.getNextPageToCurrent = function () {
        var pageIndex = this.getActualPageIndex();

        if ((pageIndex !== undefined) && (pageIndex < presenter.configuration.numberOfPages - 1)) {
            pageIndex = pageIndex + 1;
            return this.getPageByIndex(pageIndex);
        }

        return undefined;
    };

    presenter.Sections.prototype.getPreviousPageToCurrent = function () {
        var pageIndex = this.getActualPageIndex();

        if ((pageIndex !== undefined) && (pageIndex > 0)) {
            pageIndex = pageIndex - 1;
            return this.getPageByIndex(pageIndex);
        }

        return undefined;
    };

    presenter.Sections.prototype.getAllPagesInOrder = function (sections) {
        return sections.reduce(function (result, section) {
            return result.concat(section.pages);
        }, []);
    };

    presenter.Sections.prototype.addClassAllAttemptedToPage = function (current_page_index) {
        presenter.navigationManager.markCurrentButtonWithAttemptedClass();
        presenter.sections.markPageAsAttempted(current_page_index);
    };

    presenter.Sections.prototype.removeClassAllAttemptedToPage = function (current_page_index) {
        presenter.navigationManager.removeCurrentButtonAttemptedClass();
        presenter.sections.markPageAsNotAttempted(current_page_index);
    };

    presenter.Sections.prototype.setBookmarkCurrentPage = function (bookmark) {
        for (var i = 0; i < this.allPages.length; i++) {
            if (this.allPages[i].isActualPage()) {
                this.allPages[i].isBookmarkOn = bookmark;
                break
            }
        }
    };

    presenter.Sections.prototype.getPages = function (leftIndex, numberOfPages) {
        var pages = [];

        if (leftIndex + numberOfPages >= this.allPages.length) {
            leftIndex = ((this.allPages.length) - numberOfPages)
        }

        if (leftIndex < 0) {
            leftIndex = 0;
        }

        for (var i = leftIndex; i < this.allPages.length; i++) {
            if (numberOfPages == 0) {
                break;
            }

            pages.push(this.allPages[i]);
            numberOfPages--;
        }

        return pages;
    };


    presenter.Sections.prototype.createSections = function (sections) {
        return sections.map(function (section, index) {
            var sectionCssClass = "section_" + index;
            return new presenter.Section(section.pages, section.sectionName, section.pagesDescriptions, sectionCssClass);
        })
    };

    presenter.NavigationManager = function () {
        this.leftSideIndex = 0;
        this.actualSections = [];
        this.actualSectionsNames = [];
        this.$navigationButtonsFirst;
        this.$navigationButtonsLast;
        this.navigationButtonLeft;
        this.navigationButtonRight;
        this.$sections;
        this.buttons = [];
        this.shiftCount = 0;

        this.initView();
    };

    presenter.NavigationManager.prototype.restartLeftSideIndex = function () {
        this.leftSideIndex = 0;
        this.shiftCount = 0;
    };

    presenter.NavigationManager.prototype.goRight = function () {
        var page = presenter.sections.getNextPageToCurrent();

        if (page) {
            presenter.changeToPage(page.page);
        }
    };

    presenter.NavigationManager.prototype.goLeft = function () {
        var page = presenter.sections.getPreviousPageToCurrent();

        if (page) {
            presenter.changeToPage(page.page);
        }
    };

    presenter.NavigationManager.prototype.bookmarkCurrentButton = function () {
        this.buttons.filter(function (element) {
            return element.isActualButton;
        })[0].addBookmark();
    };

    presenter.NavigationManager.prototype.removeBookmarksFromButtons = function () {
        this.buttons.forEach(function(button) {
            button.removeBookmark();
        });

        presenter.sections.allPages.map(function (page) {
            page.isBookmarkOn = false;
        });
    };

    presenter.NavigationManager.prototype.removeBookmarkFromCurrentButton = function () {
        this.buttons.filter(function (element) {
            return element.isActualButton;
        })[0].removeBookmark();
    };

    presenter.NavigationManager.prototype.markButtonsWithAttempted = function (attemptedPages) {
        this.buttons.filter(function (button) {
            return (attemptedPages.indexOf(button.navigateToPage) !== -1);
        }).forEach(function (button) {
            button.addCssClass(presenter.CSS_CLASSES.ALL_ATTEMPTED);
        });
    };

    presenter.NavigationManager.prototype.initView = function () {
        this.appendNavigationButtonsFirst();
        this.appendSectionsContainer();
        this.appendNavigationButtonsLast();
    };

    presenter.NavigationManager.prototype.appendSectionsContainer = function () {
        this.$sections = $('<div></div>');

        this.$sections.addClass("sections");

        presenter.$wrapper.append(this.$sections);
    };

    presenter.NavigationManager.prototype.getActualButtonsArray = function () {
        return this.buttons.filter(function (button) {
            return button.isActualButton
        });
    };

    presenter.NavigationManager.prototype.markCurrentButtonWithAttemptedClass = function () {
        var button = this.getActualButtonsArray();

        if (button.length === 1) {
            button[0].addCssClass(presenter.CSS_CLASSES.ALL_ATTEMPTED);
        }
    };

    presenter.NavigationManager.prototype.removeCurrentButtonAttemptedClass = function () {
        var button = this.getActualButtonsArray();

        if (button.length === 1) {
            button[0].removeCssClass(presenter.CSS_CLASSES.ALL_ATTEMPTED);
        }
    };

    presenter.NavigationManager.prototype.appendNavigationButtonsFirst = function () {
        var $navigationButtonsFirst = $('<div></div>');
        $navigationButtonsFirst.addClass("navigation-buttons-first");

        this.navigationButtonLeft = new presenter.NavigationButtonLeft();
        $navigationButtonsFirst.append(this.navigationButtonLeft.getView());

        this.$navigationButtonsFirst = $navigationButtonsFirst;
        presenter.$wrapper.append(this.$navigationButtonsFirst);
    };

    presenter.NavigationManager.prototype.appendNavigationButtonsLast = function () {
        var $navigationButtonsLast = $('<div></div>');
        $navigationButtonsLast.addClass("navigation-buttons-last");

        this.navigationButtonRight = new presenter.NavigationButtonRight();
        $navigationButtonsLast.append(this.navigationButtonRight.getView());

        this.$navigationButtonsLast = $navigationButtonsLast;
        presenter.$wrapper.append(this.$navigationButtonsLast);
    };

    presenter.NavigationManager.prototype.clearStateAndButtons = function () {
        this.removeSections();
        this.removeHellips();
        this.removeInactiveClassFromNavigationButtons();
        this.buttons = [];
        this.actualPages = [];
    };

    presenter.NavigationManager.prototype.removeInactiveClassFromNavigationButtons = function () {
        this.navigationButtonLeft.removeInactiveClass();
        this.navigationButtonRight.removeInactiveClass();
    };

    presenter.NavigationManager.prototype.addLeftHellip = function () {
        if (this.shouldAddLeftHellip()) {
            this.getHellip($.fn.append.bind(this.$navigationButtonsFirst), this.shiftPagesToLeft.bind(this), "turn_back");
            return 1;
        }

        return 0;
    };

    presenter.NavigationManager.prototype.addRightHellip = function () {
        if (this.shouldAddRightHellip()) {
            this.rightHellip = this.getHellip($.fn.prepend.bind(this.$navigationButtonsLast), this.shiftPagesToRight.bind(this), "turn_forward");
            return 1
        }

        return 0;
    };

    presenter.NavigationManager.prototype.calculateNumberOfPages = function (hellipsCount) {
        var number = presenter.configuration.numberOfButtons - 2 - hellipsCount;
        if (number < 1) {
            return 1;
        } else {
            return number;
        }
    };

    presenter.NavigationManager.prototype.getHellip = function (containerAddFunction, hellipFunction, className) {
        var button = new presenter.HellipButton(hellipFunction, className);

        containerAddFunction(button.getView());

        return button;
    };

    presenter.NavigationManager.prototype.setSections = function () {
        this.clearStateAndButtons();

        this.hellipsCount = 0;

        this.hellipsCount += this.addLeftHellip();
        this.hellipsCount += this.addRightHellip();

        this.addSections(this.calculateNumberOfPages(this.hellipsCount));
    };

    presenter.NavigationManager.prototype.deactivateNavigationButtons = function () {
        if (presenter.sections.isHomeCurrentPage()) {
            this.navigationButtonLeft.addInactiveClass();
            return;
        }

        if (presenter.sections.isLastCurrentPage()) {
            this.navigationButtonRight.addInactiveClass();
        }
    };

    presenter.NavigationManager.prototype.removeSections = function () {
        presenter.$wrapper.find(".sections").children().remove();
        this.actualSections = [];
        this.actualSectionsNames = [];
    };

    presenter.NavigationManager.prototype.moveToCurrentPage = function () {
        if (presenter.sections.doesActualPageExists()) {
            this.moveToCurrentPageLogic();
        }
    };

    presenter.NavigationManager.prototype.moveToCurrentPageLogic = function () {
        for (var i = 0; i < this.actualPages.length; i++) {
            if (this.actualPages[i].isActualPage()) {
                return;
            }
        }

        this.rightHellip.execute();
        this.moveToCurrentPage();
    };

    presenter.NavigationManager.prototype.removeHellips = function () {
        presenter.$wrapper.find(".turn_forward").remove();
        presenter.$wrapper.find(".turn_back").remove();
        delete this.rightHellip;
    };

    presenter.NavigationManager.prototype.shiftPagesToLeft = function () {
        if (this.shiftCount === 1) {
            this.leftSideIndex = 0;
        } else {
            if (presenter.configuration.numberOfButtons - 4 > 0) {
                this.leftSideIndex -=  (presenter.configuration.numberOfButtons - 4);
            } else {
                this.leftSideIndex -= 1;
            }
        }

        this.shiftCount--;
        this.setSections();
    };

    presenter.NavigationManager.prototype.shiftPagesToRight = function () {
        var shift;
        if (presenter.configuration.userButtonsNumber) {
            shift = (presenter.configuration.numberOfButtons - 2 - this.hellipsCount);
        } else {
            shift = this.getNormalRightShift();
        }

        if (shift <= 0) {
            shift = 1;
        }

        this.leftSideIndex += shift;

        this.shiftCount++;
        this.setSections();
    };

    presenter.NavigationManager.prototype.getNormalRightShift = function () {
        if (this.shiftCount === 0) {
            return (presenter.configuration.numberOfButtons - 3);
        } else {
            return (presenter.configuration.numberOfButtons - 4);
        }
    };

    presenter.NavigationManager.prototype.setSectionWidth = function ($section) {
        var numOfButtons = $section.find(".buttons").children().length;
        $section.css({
            width: (numOfButtons*presenter.configuration.sizes.elementWidth) + "px"
        });
    };

    presenter.NavigationManager.prototype.setButtonCurrentPage = function (button, page) {
        if (page.isActualPage()) {
            button.setAsCurrent();
        }
    };

    presenter.NavigationManager.prototype.setButtonBookmark = function (button, page) {
        if (page.isBookmarkOn) {
            button.addBookmark();
        }
    };

    presenter.NavigationManager.prototype.setButtonProperties = function (button, page) {
        if (presenter.isPreview) {
            return;
        }
        this.setButtonCurrentPage(button, page);
        this.setButtonBookmark(button, page);
    };

    presenter.NavigationManager.prototype.addSections = function (numberOfPages) {
        this.actualPages = presenter.sections.getPages(this.leftSideIndex, numberOfPages);
        var sectionIterator = -1;

        var len = this.actualPages.length;
        for (var i = 0; i < len; i++) {
            var button = this.getPageButton(this.actualPages[i]);
            this.setButtonProperties(button, this.actualPages[i]);
            this.buttons.push(button);

            sectionIterator = this.addButtonToSection(button, sectionIterator, this.actualPages[i]);
        }

        this.appendSectionsToView();
        this.deactivateNavigationButtons();
    };

    presenter.NavigationManager.prototype.appendSectionsToView = function () {
        this.actualSections.forEach(function ($section) {
            this.setSectionWidth($section);
            this.$sections.append($section);
        }, this);
    };

    presenter.NavigationManager.prototype.getPageButton = function (page) {
        var button = new presenter.Button(page.description);
        button.setCommand(page.getChangeToPageCommand());
        button.setNavigateToPage(page.page);

        return button;
    };

    presenter.NavigationManager.prototype.addButtonToSection = function (button, sectionIterator, page) {
        if (page.getSectionClassName() === this.actualSectionsNames[sectionIterator]) {
            this.appendButtonToSection(button, sectionIterator);
        } else {
            this.addNewSection(page);
            sectionIterator++;
            this.appendButtonToSection(button, sectionIterator);
        }

        return sectionIterator
    };

    presenter.NavigationManager.prototype.appendButtonToSection = function (button, sectionIterator) {
        this.actualSections[sectionIterator].find(".buttons").append(button.getView());
    };

    presenter.NavigationManager.prototype.addNewSection = function (page) {
        var $section = this.getSection(page.getSectionName(), page.getSectionClassName());
        this.actualSectionsNames.push(page.getSectionClassName());
        this.actualSections.push($section);
    };

    presenter.NavigationManager.prototype.getSection = function (sectionName, cssClass) {
        var $section = $('<div></div>');
        $section.addClass(cssClass);
        $section.addClass("section");

        var $sectionName = $('<div></div>');
        $sectionName.text(sectionName);
        $sectionName.addClass("section_name");

        var $sectionButtons = $('<div></div>');
        $sectionButtons.addClass("buttons");

        $section.append($sectionName);
        $section.append($sectionButtons);

        return $section;
    };

    presenter.NavigationManager.prototype.shouldAddLeftHellip = function () {
        return this.leftSideIndex !== 0;
    };

    presenter.NavigationManager.prototype.shouldAddRightHellip = function () {
        var buttonsWithoutNavigation = presenter.configuration.numberOfButtons - 2;
        if (presenter.configuration.userButtonsNumber) {
            if (presenter.configuration.userButtonsNumber == 1) {
                return this.leftSideIndex + buttonsWithoutNavigation - this.hellipsCount < presenter.configuration.numberOfPages - 1;
            }
        }
        return this.leftSideIndex + buttonsWithoutNavigation - this.hellipsCount < presenter.configuration.numberOfPages;
    };

    presenter.run = function(view, model){
        presenter.isPreview = false;
        presenter.runLogic(view, model);
    };

    presenter.createPreview = function (view, model) {
        presenter.isPreview = true;
        presenter.currentPageIndex = 0;
        presenter.runLogic(view, model);
    };

    function deleteCommands () {
        delete presenter.setState;
        delete presenter.getState;
    }

    presenter.upgradeModel = function (model) {
        return presenter.upgradeNumberAndWidthOfButtons(model);
    };

    presenter.upgradeNumberAndWidthOfButtons = function (model) {
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        if(model.userButtonsWidth == undefined) {
            upgradedModel["userButtonsWidth"] = "";
        }

        if(model.userButtonsNumber == undefined) {
            upgradedModel["userButtonsNumber"] = "";
        }

        return upgradedModel;
    };

    presenter.runLogic = function (view, model) {
    	presenter.$view = $(view);
        presenter.$wrapper = presenter.$view.find('.assessments-navigation-bar-wrapper');

        var upgradedModel = presenter.upgradeModel(model);
        var validatedModel = presenter.validateModel(upgradedModel);

        if (!validatedModel.isValid) {
            presenter.showErrorMessage(presenter.ERROR_MESSAGES[validatedModel.errorCode], validatedModel.errorData);
            deleteCommands();
            return;
        }

        presenter.configuration = validatedModel;
        DOMOperationsUtils.setReducedSize(presenter.$view, presenter.$wrapper);

        presenter.calculateObjectsSizes();

        presenter.initializeAddon();

        if (presenter.isPreview) {
            presenter.navigationManager.buttons[0].setAsCurrent();
        } else {
            presenter.navigationManager.moveToCurrentPage();
        }

        presenter.buildKeyboardController();
    };

    function removeMockupDOM () {
        presenter.$wrapper.find(".navigation-buttons-first").remove();
        presenter.$wrapper.find(".navigation-buttons-last").remove();
        presenter.$wrapper.find(".sections").remove();
    }

    presenter.initializeAddon = function () {
        removeMockupDOM();

        presenter.sections = new presenter.Sections(presenter.configuration.sections);
        presenter.navigationManager = new presenter.NavigationManager();

        presenter.navigationManager.setSections();
    };

    function calculateMaxNumberOfButtons () {
        var numberOfButtons;
        if (presenter.configuration.userButtonsNumber) {
            numberOfButtons = presenter.configuration.maxElementCount > (presenter.configuration.userButtonsNumber + 2) ?
                (presenter.configuration.userButtonsNumber + 2) : presenter.configuration.maxElementCount;

            if (numberOfButtons > presenter.configuration.numberOfPages + 2) {
                numberOfButtons = (presenter.configuration.numberOfPages + 2);
            }
        } else {
            numberOfButtons = presenter.configuration.maxElementCount > (presenter.configuration.numberOfPages + 2) ?
                (presenter.configuration.numberOfPages + 2) : presenter.configuration.maxElementCount;
        }

        presenter.configuration.numberOfButtons = numberOfButtons;
        presenter.configuration.navigationLeftIndex = 0;
        presenter.configuration.navigationRightIndex = numberOfButtons - 1;
    }

    function calculateButtonsSize(elementDistances) {
        var elementWidth;
        if (presenter.configuration.userButtonsWidth) {
            elementWidth = presenter.configuration.userButtonsWidth;
        } else {
            elementWidth = parseInt(presenter.$wrapper.width() / presenter.configuration.numberOfButtons - elementDistances.horizontal, 10);
        }

        var horizontalGap = presenter.$wrapper.width() - (elementWidth + elementDistances.horizontal) * presenter.configuration.maxElementCount;

        presenter.configuration.sizes = {
            elementWidth: elementWidth,
            horizontalGap: horizontalGap
        };
    }

    presenter.calculateObjectsSizes =   function() {
        var $element = presenter.$wrapper.find(".previous");

        var elementDimensions = DOMOperationsUtils.getOuterDimensions($element);
        var elementDistances = DOMOperationsUtils.calculateOuterDistances(elementDimensions);


        var elementBaseWidth;

        if (presenter.configuration.userButtonsWidth) {
            elementBaseWidth = presenter.configuration.userButtonsWidth;
        } else {
            elementBaseWidth = parseInt($element.width(), 10) + elementDistances.horizontal;
        }
        presenter.configuration.maxElementCount = parseInt((presenter.$wrapper.width()) / elementBaseWidth, 10) - 4;

        calculateMaxNumberOfButtons();
        calculateButtonsSize(elementDistances);
    };

    presenter.calculateNumberOfPages = function (sections) {
        return sections.reduce(function (result, section) {
            return result + section.pages.length;
        }, 0);
    };

    presenter.validateModel = function (model) {
        var validatedSections = presenter.validateSections(model["Sections"]);

        if (!validatedSections.isValid) {
            return validatedSections;
        }

        var numberOfPages = presenter.calculateNumberOfPages(validatedSections.sections);

        var validateButtonsNumber = presenter.parseButtonsNumber(model["userButtonsNumber"], numberOfPages);
        if (!validateButtonsNumber.isValid) {
            return validateButtonsNumber;
        }

        var validateButtonsWidth = presenter.parseButtonsWidth(model["userButtonsWidth"]);
        if (!validateButtonsNumber.isValid) {
            return validateButtonsNumber;
        }

        return {
            isValid: true,
            addonID: model["ID"],
            sections: validatedSections.sections,
            addClassAreAllAttempted: ModelValidationUtils.validateBoolean(model["addClassAreAllAttempted"]),
            userButtonsNumber: validateButtonsNumber.value,
            userButtonsWidth: validateButtonsWidth.value,
            numberOfPages: numberOfPages
        };
    };

    presenter.parseButtonsNumber = function (value, numberOfPages) {
        var buttonsNumber = presenter.parseNumericProperty(value, "S_06", "S_07");

        if (!buttonsNumber.isValid) {
            return buttonsNumber;
        }

        if (buttonsNumber.value && buttonsNumber.value > numberOfPages) {
            return getErrorObject("S_08");
        }

        return buttonsNumber;
    };

    presenter.parseButtonsWidth = function (value) {
        return presenter.parseNumericProperty(value, "S_09", "S_10");
    };

    presenter.parseNumericProperty = function (value, belowZeroError, nanError) {
        var trimmedValue = value.trim();
        if (ModelValidationUtils.isStringEmpty(trimmedValue)) {
            return {
                isValid: true,
                value: undefined
            };
        }

        var parsedValue = Number(trimmedValue);

        if (isNaN(parsedValue)) {
            return getErrorObject(nanError);
        }

        if (parsedValue <= 0) {
            return getErrorObject(belowZeroError);
        }

        return {
            isValid: true,
            value: parseInt(parsedValue, 10)
        };
    };

    function isNotValid (element) {
        return element.isValid === false;
    }

    function isSectionPagesIntersecting (pagesA, pagesB) {
        return pagesA.some(function (element) {
            return this.indexOf(element) != -1;
        }, pagesB);
    }


    function validateSectionsIntersecting (sections) {
        var firstSection;
        var secondSection;
        var result = sections.every(function (section, sectionIndex) {
            for (var i = 0; i < this.length; i++) {
                if (sectionIndex == i) {
                    continue;
                }

                if (isSectionPagesIntersecting(section.pages, this[i].pages)) {
                    firstSection = sectionIndex;
                    secondSection = i;
                    return false;
                }
            }

            return true;
        }, sections);

        return {
            isValid: result,
            firstSection: (firstSection + 1),
            secondSection: (secondSection + 1)
        };
    }

    presenter.validateSections = function (sections) {
        sections = sections.trim();
        if (ModelValidationUtils.isStringEmpty(sections)) {
            return getErrorObject("S_00");
        }

        var parsedSections = Helpers.splitLines(sections).map(getTrimmedStringElement).map(parseSection);
        var notValidSections = parsedSections.filter(isNotValid);

        if (notValidSections.length > 0) {
            return notValidSections[0];
        }

        var validatedSections = validateSectionsIntersecting(parsedSections);

        if (!validatedSections.isValid) {
            return getErrorObject("S_05", {
                section_1: validatedSections.firstSection,
                section_2: validatedSections.secondSection
            });
        }

        parsedSections.map(function (element) {
            delete element.isValid;
            return element;
        });

        return {
            isValid: true,
            sections: parsedSections
        };
    };

    function getTrimmedStringElement(element) {
        return element.trim();
    }

    function parseDescriptions(descriptions, expectedLength, sectionIndex) {
        if (ModelValidationUtils.isStringEmpty(descriptions)) {
            return getErrorObject("S_03", {section: sectionIndex});
        }

        var parsedDescriptions = descriptions.split(",").map(getTrimmedStringElement);

        if (parsedDescriptions.length > expectedLength) {
            return getErrorObject("S_04", {section: sectionIndex});
        }

        if (parsedDescriptions.length < expectedLength) {
            return getErrorObject("S_03", {section: sectionIndex});
        }

        return {
            isValid: true,
            descriptions: parsedDescriptions
        };
    }

    function changeToStringOneBigger (element) {
        return ((element + 1) + "");
    }

    function parseSection(section, sectionIndex) {
        section = section.split(";").map(getTrimmedStringElement);
        var len = section.length;
        var sectionName = "";
        var descriptions = [];

        var pages = presenter.parsePagesFromRange(section[0], (sectionIndex + 1));

        if (!pages.isValid) {
            return pages;
        }

        if (len > 1) {
            sectionName = getTrimmedStringElement(section[1]);
        }

        if (len > 2) {
            descriptions = parseDescriptions(section[2], pages.pages.length, (sectionIndex + 1));
            if (!descriptions.isValid) {
                return descriptions;
            }
        } else {
            descriptions = {
                descriptions: pages.pages.map(changeToStringOneBigger)
            };
        }

        return {
            isValid: true,
            pages: pages.pages,
            sectionName: sectionName,
            pagesDescriptions: descriptions.descriptions
        }
    }

    function parseDashRange (section) {
        var result = [];
        var ranges = section.split("-");

        var min = Math.min(ranges[0], ranges[1]);
        var max = Math.max(ranges[0], ranges[1]);

        for (; max >= min; min++) {
            result.push((min - 1));
        }

        return result;
    }

    function changeToIndexesZeroBased(element) {
        return (element - 1);
    }

    function parseCommaSeparatedRange (section) {
        return section.split(",").map(getTrimmedStringElement).map(Number).map(changeToIndexesZeroBased);
    }

    function getArrayOfPagesFromSection (section) {
        // 1-4 -> true,
        // asdfa-123980fda -> false,
        // 1, 2, 3, 4 -> false
        var dashRangeTest = /^\d+-\d+$/;

        if (dashRangeTest.test(section)) {
            return parseDashRange(section);
        } else {
            return parseCommaSeparatedRange(section);
        }
    }

    presenter.isFloat = function (number) {
        return number % 1 !== 0;
    };

    function isNegativeOrZero (number) {
        return number < 0;
    }


    presenter.parsePagesFromRange = function (section, sectionIndex) {
        var pages = getArrayOfPagesFromSection(section);

        for (var i = 0; i < pages.length; i++) {
            if (isNaN(pages[i])) {
                return getErrorObject("S_02", {section: sectionIndex});
            }

            if (presenter.isFloat(pages[i])) {
                return getErrorObject("S_01", {section: sectionIndex});
            }

            if (isNegativeOrZero(pages[i])) {
                return getErrorObject("S_01", {section: sectionIndex});
            }
        }

        var sortedPages = pages.sort(function (a,b) {
            return a - b;
        });

        return {
            isValid: true,
            pages: sortedPages
        };
    };

    presenter.getState = function(){
        var pages = presenter.sections.allPages.map(function (page) {
            return {
                page: page.page,
                description: page.description,
                sectionName: page.sectionName,
                sectionCssClass: page.sectionCssClass,
                isBookmarkOn: page.isBookmarkOn
            };
        });

        var state = {
            pages: pages,
            attemptedPages: presenter.sections.attemptedPages
        };

        return JSON.stringify(state);
    };

    function getRestorePagesObjectArray (pages) {
        return pages.map(function (page) {
            var restoredPage = new presenter.Page(page.page, page.description, page.sectionName, page.sectionCssClass);
            restoredPage.setBookmarkOn(page.isBookmarkOn);

            return restoredPage;
        });
    }

    presenter.setState = function(state){
        if (state === null || state === "" || state === undefined) {
            return;
        }

        var parsedState = JSON.parse(state);
        var upgradedState = presenter.upgradeState(parsedState);

        presenter.sections.allPages = getRestorePagesObjectArray(upgradedState.pages);
        presenter.navigationManager.restartLeftSideIndex();
        presenter.navigationManager.setSections();
        presenter.navigationManager.moveToCurrentPage();

        presenter.sections.attemptedPages = upgradedState.attemptedPages;
        presenter.navigationManager.markButtonsWithAttempted(presenter.sections.attemptedPages);
    };

    presenter.upgradeState = function (state) {
        return presenter.upgradeAttemptedPages(state);
    };

    presenter.upgradeAttemptedPages = function (state) {
        var upgradedState = {};
        jQuery.extend(true, upgradedState, state); // Deep copy of model object

        if(state.attemptedPages === undefined) {
            upgradedState["attemptedPages"] = [];
        }

        return upgradedState;
    };

    function currentPageAreAllAttempted() {
        if(presenter.presentation.getPage(presenter.currentPageIndex).isReportable()){
            
            var modules = getAllModulesImplementingIsAttempted(presenter.currentPageIndex);

            if(areAllModulesAttempted(modules)){
                presenter.sections.addClassAllAttemptedToPage(presenter.currentPageIndex);
            }else{
                presenter.sections.removeClassAllAttemptedToPage(presenter.currentPageIndex);
            }
        }
    }

    function getAllModulesImplementingIsAttempted(page) {
        var ids = presenter.playerController.getPresentation().getPage(page).getModulesAsJS(),
            modules = [];

        for(var i = 0; i < ids.length; i++){
            var currentModule = presenter.playerController.getModule(ids[i]);

            if (currentModule && currentModule.isAttempted !== undefined) {
                modules.push(currentModule);
            }
        }

        return modules;
    }

    function areAllModulesAttempted(modules) {
        if(modules.length == 0){
            return false;
        }

        var areAllAttempted = true;

        $.each(modules, function() {
            if (!this.isAttempted()) {
                areAllAttempted = false;
                return false; // break;
            }
        });

        return areAllAttempted;
    }

    presenter.areAllModulesAttempted = function () {
        currentPageAreAllAttempted();
    };

    presenter.reset = function () {
        presenter.sections.removeClassAllAttemptedToPage(presenter.currentPageIndex);
    };

    presenter.onEventReceived = function(eventName, eventData) {
        if (eventName == 'PageLoaded' && presenter.configuration.addClassAreAllAttempted) {
            presenter.areAllModulesAttempted();
        }

        if (eventName == "ValueChanged" && presenter.configuration.addClassAreAllAttempted && !presenter.isShowAnswersActive) {
            presenter.areAllModulesAttempted();
        }

        if (eventName == "ValueChanged" && eventData.item == "Lesson Reset") {
            presenter.navigationManager.removeBookmarksFromButtons();
        }

        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        }

        if (eventName == "HideAnswers") {
            presenter.hideAnswers();
        }
    };

    presenter.showAnswers = function () {
        presenter.isShowAnswersActive = true;
    };

    presenter.hideAnswers = function () {
        presenter.isShowAnswersActive = false;
    };

    function AssesmentsNavigationKeyboardController (elements, columnsCount) {
        KeyboardController.call(this, elements, columnsCount);
    }

    AssesmentsNavigationKeyboardController.prototype = Object.create(window.KeyboardController.prototype);
    AssesmentsNavigationKeyboardController.prototype.constructor = AssesmentsNavigationKeyboardController;

    AssesmentsNavigationKeyboardController.prototype.selectAction = function () {
        this.getTarget(this.keyboardNavigationCurrentElement, true)[0].click();
    };

    presenter.buildKeyboardController = function () {
        presenter.keyboardControllerObject = new AssesmentsNavigationKeyboardController(presenter.getElementsForKeyboardNavigation(), 1);
    };
    
    presenter.getElementsForKeyboardNavigation = function () {
        var buttonsViews = [];
        for (var i = 0; i < presenter.navigationManager.buttons.length; i++) {
            buttonsViews.push(presenter.navigationManager.buttons[i].$view);
        }

        return $(buttonsViews);
    };

    presenter.keyboardController = function(keycode, isShiftKeyDown) {
        presenter.keyboardControllerObject.handle(keycode, isShiftKeyDown)
    };

    return presenter;
}