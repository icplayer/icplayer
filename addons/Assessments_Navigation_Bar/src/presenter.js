function AddonAssessments_Navigation_Bar_create(){

    var presenter = function(){};

    presenter.isWCAGOn = false;
    presenter.SECTION_NAME_HEIGHT = 20;
    presenter.isFirstEnter = true;

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
        S_10: "Buttons width property have to be an integer",
        S_11: "Pages CSS classes are invalid on section: %section% in sections property. Number of CSS classes is too small.",
        S_12: "Pages CSS classes are invalid on section: %section% in sections property. At least one of CSS classes is invalid.",
        S_13: "Static position value in section %section% is invalid: the value must be 'left', 'right', or left empty."
    };

    presenter.DEFAULT_TTS_PHRASES = {
        PreviousPage: "Go to previous page",
        ShowPreviousPages: "Show previous pages",
        Title: "Title",
        GoToPage: "Go to page",
        ShowNextPages: "Show next pages",
        NextPage: "Go to next page",
    };

    presenter.CSS_CLASSES = {
        ALL_ATTEMPTED: "all-attempted",
        PREVIOUS: "previous",
        BUTTON_TEXT: "button_text",
        SECTION_NAME: "section_name",
        NEXT: "next",
        BUTTON: "button",
        ELEMENT: "element",
        TURN_BACK: "turn_back",
        TURN_FORWARD: "turn_forward",
        CURRENT_PAGE: "current_page",
        BOOKMARK: "bookmark",
        INACTIVE: "inactive"
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
        defaultOrder: false
    };

    presenter.keyboardControllerObject = null;
    //this field is set based on the metadata. It overrides the defaultOrder property
    // If set to false it prevents state import
    presenter.randomizeLesson = null;

    presenter.ASSESSMENT_USER_TYPES = {
        NONE: 0,
        TEACHER: 1,
        STUDENT: 2,
    }
    presenter.assessmentUser = presenter.ASSESSMENT_USER_TYPES.NONE;

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
        var currentIndex = presenter.playerController.getCurrentPageIndex();
        var mappings = presenter.playerController.getPagesMapping();
        mappings.forEach(function (value, index) {
            if (value === currentIndex) {
                presenter.currentPageIndex = index;
            }
        });
        var context = controller.getContextMetadata();
         if (context != null) {
            if ("randomizeLesson" in context) {
                 presenter.randomizeLesson = context["randomizeLesson"];
            }
            if ("assessmentUser" in context) {
               if (context["assessmentUser"] == "teacher") {
                    presenter.assessmentUser = presenter.ASSESSMENT_USER_TYPES.TEACHER;
               } else if (context["assessmentUser"] == "student") {
                    presenter.assessmentUser = presenter.ASSESSMENT_USER_TYPES.STUDENT;
               }
            }
         }
        presenter.commander = controller.getCommands();
        presenter.eventBus = controller.getEventBus();
        presenter.addEventListeners();
    };

    presenter.addEventListeners = function () {
        presenter.eventBus.addEventListener('PageLoaded', this);
        presenter.eventBus.addEventListener('ValueChanged', this);
        presenter.eventBus.addEventListener('ShowAnswers', this);
        presenter.eventBus.addEventListener('HideAnswers', this);
    };

    presenter.changeToPage = function (index) {
        var mappings = presenter.playerController.getPagesMapping();
        var i = mappings[index];
        if (index !== presenter.currentPageIndex) {
            presenter.commander.gotoPageIndex(i);
        }
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

    presenter.Button = function (viewDescription, customCssClassNames) {
        this.description = viewDescription;
        this.customCssClassNames = customCssClassNames;
        this.$view = this.createView();
        this.$view_text;
        this.actualCommand;
        this.navigateToPage;
        this.isActualButton = false;

        this.connectEvents();
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
        this.$view.addClass(presenter.CSS_CLASSES.CURRENT_PAGE);
    };

    presenter.Button.prototype.addBookmark = function () {
        this.$view.addClass(presenter.CSS_CLASSES.BOOKMARK);
    };

    presenter.Button.prototype.removeBookmark = function () {
        this.$view.removeClass(presenter.CSS_CLASSES.BOOKMARK);
    };

    presenter.Button.prototype.removeAttempted = function () {
        this.$view.removeClass(presenter.CSS_CLASSES.ALL_ATTEMPTED);
    };

    presenter.Button.prototype.createView = function () {
        var $view = $('<div></div>');

        $view.css({
            width: presenter.configuration.sizes.elementWidth + "px"
        });

        this.$view_text = $('<div></div>');
        this.$view_text.text(this.description);
        this.$view_text.addClass(presenter.CSS_CLASSES.BUTTON_TEXT);

        $view.append(this.$view_text);
        $view.addClass(presenter.CSS_CLASSES.BUTTON);
        $view.addClass(presenter.CSS_CLASSES.ELEMENT);

        if (this.customCssClassNames && this.customCssClassNames.length !== 0) {
            this.customCssClassNames.map((cssClassName) => {
                $view.addClass(cssClassName);
            })
        }

        return $view;
    };

    presenter.Button.prototype.getView = function () {
        return this.$view;
    };

    presenter.Button.prototype.addInactiveClass = function () {
        this.$view.addClass(presenter.CSS_CLASSES.INACTIVE);
    };

    presenter.Button.prototype.removeInactiveClass = function () {
        this.$view.removeClass(presenter.CSS_CLASSES.INACTIVE);
    };

    presenter.NavigationButtonLeft = function () {
        presenter.Button.call(this, "<");
        this.$view.removeClass(presenter.CSS_CLASSES.BUTTON);
        this.$view.addClass(presenter.CSS_CLASSES.PREVIOUS);
        this.setCommand(function () {
            presenter.navigationManager.goLeft();
        });
    };

    presenter.NavigationButtonLeft.prototype = Object.create(presenter.Button.prototype);
    presenter.NavigationButtonLeft.constructor = presenter.NavigationButtonLeft;

    presenter.NavigationButtonRight = function () {
        presenter.Button.call(this, ">");
        this.$view.addClass(presenter.CSS_CLASSES.NEXT);
        this.$view.removeClass(presenter.CSS_CLASSES.BUTTON);
        this.setCommand(function () {
            presenter.navigationManager.goRight();
        });
    };

    presenter.NavigationButtonRight.prototype = Object.create(presenter.Button.prototype);
    presenter.NavigationButtonRight.constructor = presenter.NavigationButtonRight;

    presenter.HellipButton = function (hellipFunction, className) {
        presenter.Button.call(this, "&hellip;"); // ...
        this.$view_text.html(this.description);
        this.$view.removeClass(presenter.CSS_CLASSES.BUTTON);
        this.$view.addClass(className);

        this.setCommand(hellipFunction);
    };

    presenter.HellipButton.prototype = Object.create(presenter.Button.prototype);
    presenter.HellipButton.constructor = presenter.HellipButton;

    presenter.Page = function (page, view_description, sectionName, sectionCssClass, buttonCssClassNames, staticPosition) {
        this.description = view_description;
        this.page = page;
        this.isBookmarkOn = false;
        this.sectionName = sectionName;
        this.sectionCssClass = sectionCssClass;
        this.buttonCssClassNames = buttonCssClassNames;
        if (staticPosition === undefined) {
            this.staticPosition = '';
        } else {
            this.staticPosition = staticPosition;
        }
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

    presenter.Section = function (pages, sectionName, pagesDescriptions, sectionCssClassName, buttonsCssClassNames, staticPosition) {
        this.name = sectionName;
        this.cssClassName = sectionCssClassName;
        this.buttonsCssClassNames = buttonsCssClassNames;
        this.staticPosition = staticPosition;
        this.pages = this.createPages(pages, pagesDescriptions);
    };

    presenter.Section.prototype.createPages = function (pages, pagesDescriptions) {
        var keepDefaultOrder = presenter.configuration.defaultOrder;
        if (presenter.assessmentUser != presenter.ASSESSMENT_USER_TYPES.NONE) {
            if (presenter.assessmentUser == presenter.ASSESSMENT_USER_TYPES.TEACHER) {
                keepDefaultOrder = true;
            } else {
                // presenter.assessmentUser set to student
                keepDefaultOrder = false;
            }
        } else if (presenter.randomizeLesson != null) {
            keepDefaultOrder = !presenter.randomizeLesson;
        }

        if (isTestGeneratorPreview()) {
            keepDefaultOrder = true;
        }

        var pagesToCreate = keepDefaultOrder ? pages : shuffleArray(pages);

        return pagesToCreate.map(function (page, index) {
            if (page == -1) return null;
            return new presenter.Page(
                page, pagesDescriptions[index], this.name,
                this.cssClassName, this.buttonsCssClassNames,
                this.staticPosition
            );
        }, this).filter(function(page) {
            return page != null;
        });
    };

    // keep default page order in test generator preview
    function isTestGeneratorPreview() {
        const parentUrl = window.parent?.location.href;

        return parentUrl.includes('lesson/view/assessment') && parentUrl.includes('preview');
    }

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

    presenter.Sections.prototype.markAllPagesAsNotAttempted = function () {
        this.attemptedPages = [];
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

        var standardPages = [];
        for (var i = 0; i < this.allPages.length; i++) {
            if (this.allPages[i].staticPosition === undefined || this.allPages[i].staticPosition.length === 0) {
                standardPages.push(this.allPages[i]);
            }
        }

        if (leftIndex + numberOfPages >= standardPages.length) {
            leftIndex = ((standardPages.length) - numberOfPages);
        }

        if (leftIndex < 0) {
            leftIndex = 0;
        }

        for (var i = leftIndex; i < standardPages.length; i++) {
            if (numberOfPages == 0) {
                break;
            }

            pages.push(standardPages[i]);
            numberOfPages--;
        }

        return pages;
    };

    presenter.Sections.prototype.getStaticPages = function () {
        var pages = [];
        for (var i = 0; i < this.allPages.length; i++) {
            if (this.allPages[i].staticPosition && this.allPages[i].staticPosition.length > 0) {
                pages.push(this.allPages[i]);
            }
        }
        return pages;
    }

    presenter.filterSectionsWithTooManyPages = function(sections) {
        var mapping = presenter.playerController.getPagesMapping();

        if (presenter.assessmentUser == presenter.ASSESSMENT_USER_TYPES.TEACHER) {
            for (var i = 0; i < sections.length; i++) {
                for(var j = 0; j < sections[i].pages.length; j++) {
                    var page = sections[i].pages[j];
                    if (mapping[page] == -1) {
                        sections[i].pages[j] = -1;
                    }
                }
            }
        } else {
            for (var i = 0; i < sections.length; i++) {
                sections[i].pages = sections[i].pages.filter(function (page) {
                    return mapping[page] >= 0;
                });
            }
        }

        sections = sections.filter(function(section) {
            return section.pages.length > 0;
        });

        return sections;
    };

    presenter.Sections.prototype.createSections = function (sections) {
        if (presenter.playerController) {
            sections = presenter.filterSectionsWithTooManyPages(sections);
        }

        return sections.map(
            function (section, index) {
                var sectionCssClass = "section_" + index;
                return new presenter.Section(
                    section.pages, section.sectionName,
                    section.pagesDescriptions, sectionCssClass,
                    section.sectionButtonsCssClassNames,
                    section.staticPosition
                );
        });
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
        this.leftOffset = 0;
        this.nextPrevBtnWasClicked = false;

        this.initView();
    };

    presenter.NavigationManager.prototype.isBackButtonVisible = function () {
        return presenter.$wrapper.find("." + presenter.CSS_CLASSES.TURN_BACK).length;
    };

    presenter.NavigationManager.prototype.getNumberOfNavElements = function () {
        return this.isBackButtonVisible() ? 4 : 3;
    };

    presenter.NavigationManager.prototype.calculateLeftOffset = function (previousLeftSideValue, nextPrevBtnWasClicked) {
        const currentIndex = presenter.playerController.getCurrentPageIndex();
        const staticPages = presenter.configuration.numberOfStaticPages;
        const navElements = this.getNumberOfNavElements();
        const rightSideIndex = previousLeftSideValue + presenter.configuration.numberOfButtons - navElements - staticPages;
        const isBackButtonVisible = this.isBackButtonVisible();

        if (rightSideIndex === (currentIndex + 1)) {
            this.setLeftOffset(1);
        }

        // situation when there are static pages and show next page was clicked
        if (rightSideIndex === currentIndex && nextPrevBtnWasClicked && !isBackButtonVisible) {
            this.setLeftOffset(1);
        }

        if (previousLeftSideValue === currentIndex) {
            this.setLeftOffset(0);
        }
    };

    presenter.NavigationManager.prototype.setLeftOffset = function (leftOffset) {
        this.leftOffset = leftOffset;
    };

    presenter.NavigationManager.prototype.getLeftSideIndex = function () {
        return this.leftSideIndex;
    };

    presenter.NavigationManager.prototype.setLeftSideIndex = function (previousLeftSideIndex, previousLeftSideValue) {
        if (!presenter.configuration.useDynamicPagination) {
            return;
        }

        const navElements = this.getNumberOfNavElements();
        const currentIndex = presenter.playerController.getCurrentPageIndex();
        const numberOfButtonsInShift = presenter.configuration.numberOfButtons - navElements;
        const actualCurrentIndex = this.getLeftIndex(currentIndex);
        if (previousLeftSideIndex >= this.actualPages.length || previousLeftSideIndex < 0) {
            previousLeftSideIndex = this.getLeftIndex(previousLeftSideValue);
        }

        if (this.staticPages.length) {
            if (currentIndex <= previousLeftSideValue) {
                this.leftSideIndex = actualCurrentIndex - 1;
                this.setIndexToFirst(this.leftSideIndex);
            } else {
                this.leftSideIndex = previousLeftSideIndex;
            }
            this.shiftCount = Math.floor((this.leftSideIndex + 1) / numberOfButtonsInShift);
        }

        if (this.staticPages.length === 0) {
            const staticPages = presenter.configuration.numberOfStaticPages;
            const rightSideIndex = previousLeftSideValue + presenter.configuration.numberOfButtons - navElements - staticPages;
            if (currentIndex <= previousLeftSideValue) {
                const actualCurrentIndex = this.getLeftIndex(currentIndex);
                this.leftSideIndex = actualCurrentIndex - 1;
                this.setIndexToFirst(this.leftSideIndex);
                this.setLeftOffset(0);
            } else if (currentIndex - rightSideIndex >= -1) {
                this.setLeftOffset(1);
            } else {
                this.leftSideIndex = previousLeftSideIndex;
                this.setLeftOffset(0);
            }

            this.shiftCount = Math.floor((this.leftSideIndex + 1) / numberOfButtonsInShift);
        }
    };

    presenter.NavigationManager.prototype.setIndexToFirst = function (index) {
        if (index !== 1) { return; }
        try {
            const page = presenter.sections.allPages[1];
            const _page = this.actualPages[index];
            if (page.description === _page.description) {
                this.leftSideIndex = 0;
            }
        } catch (e) {}
    };

    presenter.NavigationManager.prototype.getLeftIndex = function (previousLeftSideValue) {
        return this.actualPages.findIndex((page) => page.page === previousLeftSideValue);
    };

    presenter.NavigationManager.prototype.restartLeftSideIndex = function () {
        this.leftSideIndex = 0;
        this.shiftCount = 0;
    };

    presenter.NavigationManager.prototype.goRight = function () {
        this.nextPrevBtnWasClicked = true;
        var page = presenter.sections.getNextPageToCurrent();

        if (page) {
            presenter.changeToPage(page.page);
        }
    };

    presenter.NavigationManager.prototype.goLeft = function () {
        this.nextPrevBtnWasClicked = true;
        var page = presenter.sections.getPreviousPageToCurrent();

        if (page) {
            presenter.changeToPage(page.page);
        }
    };

    presenter.NavigationManager.prototype.bookmarkCurrentButton = function () {
        var currentButton = this.buttons.filter(function (element) {
            return element.isActualButton;
        })[0];
        if (currentButton !== undefined) currentButton.addBookmark();
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
        var currentButton = this.buttons.filter(function (element) {
            return element.isActualButton;
        })[0];
        if (currentButton !== undefined) currentButton.removeBookmark();
    };

    presenter.NavigationManager.prototype.markButtonsWithAttempted = function (attemptedPages) {
        this.buttons.filter(function (button) {
            return (attemptedPages.indexOf(button.navigateToPage) !== -1);
        }).forEach(function (button) {
            button.addCssClass(presenter.CSS_CLASSES.ALL_ATTEMPTED);
        });
    };

    presenter.NavigationManager.prototype.removeAttemptedFromButtons = function () {
        this.buttons.forEach(function(button) {
            button.removeAttempted();
        });
        presenter.sections.markAllPagesAsNotAttempted();
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
        const $navigationButtonsFirst = $('<div></div>');
        $navigationButtonsFirst.addClass("navigation-buttons-first");

        this.navigationButtonLeft = new presenter.NavigationButtonLeft();
        $navigationButtonsFirst.append(this.navigationButtonLeft.getView());

        this.$navigationButtonsFirst = $navigationButtonsFirst;
        presenter.$wrapper.append(this.$navigationButtonsFirst);
    };

    presenter.NavigationManager.prototype.appendNavigationButtonsLast = function () {
        const $navigationButtonsLast = $('<div></div>');
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
        this.staticPages = [];
    };

    presenter.NavigationManager.prototype.removeInactiveClassFromNavigationButtons = function () {
        this.navigationButtonLeft.removeInactiveClass();
        this.navigationButtonRight.removeInactiveClass();
    };

    presenter.NavigationManager.prototype.addLeftHellip = function () {
        if (this.shouldAddLeftHellip()) {
            this.getHellip($.fn.append.bind(this.$navigationButtonsFirst), this.shiftPagesToLeft.bind(this), presenter.CSS_CLASSES.TURN_BACK);
            return 1;
        }

        return 0;
    };

    presenter.NavigationManager.prototype.addRightHellip = function () {
        if (this.shouldAddRightHellip()) {
            this.rightHellip = this.getHellip($.fn.prepend.bind(this.$navigationButtonsLast), this.shiftPagesToRight.bind(this), presenter.CSS_CLASSES.TURN_FORWARD);
            return 1;
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
        var allPages = this.actualPages.concat(this.staticPages);
        for (var i = 0; i < allPages.length; i++) {
            var page = allPages[i];
            if (page != undefined && page.isActualPage != undefined && page.isActualPage()) {
                return;
            }
        }

        if (this.leftOffset === 1 && presenter.configuration.useDynamicPagination) {
            this.shiftPagesToRight(1);
            this.moveToCurrentPage();
        } else if (this.rightHellip) {
            this.shiftPagesToRight();
            this.moveToCurrentPage();
        }
    };

    presenter.NavigationManager.prototype.removeHellips = function () {
        presenter.$wrapper.find("." + presenter.CSS_CLASSES.TURN_FORWARD).remove();
        presenter.$wrapper.find("." + presenter.CSS_CLASSES.TURN_BACK).remove();
        delete this.rightHellip;
    };

    presenter.NavigationManager.prototype.shiftPagesToLeft = function () {
        var staticPagesNumber = presenter.configuration.numberOfStaticPages;
        if (this.shiftCount === 1) {
            this.leftSideIndex = 0;
        } else {
            if (presenter.configuration.numberOfButtons - 4 - staticPagesNumber> 0) {
                this.leftSideIndex -=  (presenter.configuration.numberOfButtons - 4 - staticPagesNumber);
            } else {
                this.leftSideIndex -= 1;
            }
        }
        this.leftOffset = 0;

        if (this.shiftCount > 0) {
            this.shiftCount--;
        } else {
            this.leftSideIndex = 0;
        }
        this.setSections();
    };

    presenter.NavigationManager.prototype.shiftPagesToRight = function (shift = 0) {
        if (shift === 0) {
            shift = this.getShiftToRight();
            this.shiftCount++;
        } else {
            this.shiftCount = Math.floor((presenter.sections.getActualPageIndex() + 1) / (presenter.configuration.numberOfButtons - 4));
        }

        this.leftSideIndex += shift;
        this.setSections();
    };

    presenter.NavigationManager.prototype.getShiftToRight = function () {
        let shift;
        if (presenter.configuration.userButtonsNumber) {
            shift = (presenter.configuration.numberOfButtons - 2 - this.hellipsCount);
        } else {
            shift = this.getNormalRightShift();
        }

        shift = shift - presenter.configuration.numberOfStaticPages;
        if (shift <= 0) {
            shift = 1;
        }

        return shift;
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
            const _self = this;
            setTimeout(function () {
                _self.updateVisiblePages(button);
            }, 0);
         }
    };

    presenter.NavigationManager.prototype.updateVisiblePages = function (button) {
        if (presenter.configuration.useDynamicPagination && this.leftOffset === 1 && this.isLastVisibleElement(button)) {
            this.shiftPagesToRight(1);
        }
    };

    presenter.NavigationManager.prototype.isLastVisibleElement = function (button) {
        const lastVisiblePage = this.actualPages[(this.actualPages.length - 1)].description;
        const lastPageIndex = presenter.sections.allPages.slice(-1).page;
        const isForwardButton = presenter.$wrapper.find("." + presenter.CSS_CLASSES.TURN_FORWARD).length > 0;

        return lastVisiblePage === button.description && button.navigateToPage !== lastPageIndex && isForwardButton;
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
        this.staticPages = presenter.sections.getStaticPages();
        this.actualPages = presenter.sections.getPages(this.leftSideIndex, numberOfPages - this.staticPages.length);
        var sectionIterator = -1;

        var len = this.actualPages.length;
        for (var i = 0; i < len; i++) {
            var button = this.getPageButton(this.actualPages[i]);
            this.setButtonProperties(button, this.actualPages[i]);
            this.buttons.push(button);

            sectionIterator = this.addButtonToSection(button, sectionIterator, this.actualPages[i]);
        }

        this.appendSectionsToView();
        this.appendStaticPages(this.staticPages);
        this.deactivateNavigationButtons();
    };

    presenter.NavigationManager.prototype.appendSectionsToView = function () {
        this.actualSections.forEach(function ($section) {
            this.setSectionWidth($section);
            this.$sections.append($section);
        }, this);
    };

    presenter.NavigationManager.prototype.appendStaticPages = function (pages) {
        presenter.$view.find('.navigation-buttons-first .section').remove();
        presenter.$view.find('.navigation-buttons-last .section').remove();
        var staticSections = [];
        for (var i = pages.length - 1; i > -1; i--) {
            var page = pages[i];
            var sectionName = page.getSectionName();
            var $section = null;
            if (staticSections.indexOf(sectionName) == -1) {
                $section = this.getSection(sectionName, page.getSectionClassName());
                staticSections[sectionName] = $section;
                if (page.staticPosition == 'left') {
                    presenter.$view.find('.navigation-buttons-first .previous').after($section);
                } else {
                    if (presenter.$view.find('.navigation-buttons-last .section').length == 0) {
                        presenter.$view.find('.navigation-buttons-last .next').before($section);
                    } else {
                        presenter.$view.find('.navigation-buttons-last .section').first().before($section);
                    }
                }
            } else {
                $section = staticSections[sectionName];
            }


            var button = this.getPageButton(page);
            this.setButtonProperties(button, pages[i]);
            $section.find('.buttons').append(button.getView());
        };
        if (pages.length > 0) {
            presenter.$view.find('.navigation-buttons-first > div').css('float', 'left');
            presenter.$view.find('.navigation-buttons-last > div').css('float', 'left');
        }
    }

    presenter.NavigationManager.prototype.getPageButton = function (page) {
        var button = new presenter.Button(page.description, page.buttonCssClassNames);
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
        $sectionName.addClass(presenter.CSS_CLASSES.SECTION_NAME);

        var $sectionButtons = $('<div></div>');
        $sectionButtons.addClass("buttons");

        $section.append($sectionName);
        $section.append($sectionButtons);

        return $section;
    };

    presenter.NavigationManager.prototype.shouldAddLeftHellip = function () {
        return this.leftSideIndex > 0;
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
        var upgradedModel = presenter.upgradeNumberAndWidthOfButtons(model);
        upgradedModel = presenter.upgradeDefaultOrder(upgradedModel);
        upgradedModel = presenter.upgradeLangTag(upgradedModel);
        upgradedModel = presenter.upgradeUseDynamicPagination(upgradedModel);

        return presenter.upgradeSpeechTexts(upgradedModel);
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

    presenter.upgradeDefaultOrder = function (model) {
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        if(model.defaultOrder === undefined) {
            upgradedModel["defaultOrder"] = "False";
        }

        return upgradedModel;
    };

    presenter.upgradeLangTag = function (model) {
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        if (upgradedModel['langAttribute'] === undefined) {
            upgradedModel['langAttribute'] =  '';
        }

        return upgradedModel;
    };

    presenter.upgradeSpeechTexts = function (model) {
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        if (!model['speechTexts']) {
            upgradedModel['speechTexts'] = {
                PreviousPage: {PreviousPage: ""},
                ShowPreviousPages: {ShowPreviousPages: ""},
                Title: {Title: ""},
                GoToPage: {GoToPage: ""},
                ShowNextPages: {ShowNextPages: ""},
                NextPage: {NextPage: ""},
            }
        }

        return upgradedModel;
    };

    presenter.upgradeUseDynamicPagination = function (model) {
        var upgradedModel = {};
        jQuery.extend(true, upgradedModel, model); // Deep copy of model object

        if (!model.hasOwnProperty('useDynamicPagination')) {
            upgradedModel['useDynamicPagination'] = 'False';
        }

        return upgradedModel;
    }

    presenter.setSpeechTexts = function(speechTexts) {
        presenter.speechTexts = {
            PreviousPage: presenter.DEFAULT_TTS_PHRASES.PreviousPage,
            ShowPreviousPages: presenter.DEFAULT_TTS_PHRASES.ShowPreviousPages,
            Title: presenter.DEFAULT_TTS_PHRASES.Title,
            GoToPage: presenter.DEFAULT_TTS_PHRASES.GoToPage,
            ShowNextPages: presenter.DEFAULT_TTS_PHRASES.ShowNextPages,
            NextPage: presenter.DEFAULT_TTS_PHRASES.NextPage,
        };

        if (!speechTexts || $.isEmptyObject(speechTexts)) {
            return;
        }

        presenter.speechTexts = {
            PreviousPage: presenter.getSpeechTextProperty(
                speechTexts.PreviousPage.PreviousPage,
                presenter.speechTexts.PreviousPage),
            ShowPreviousPages: presenter.getSpeechTextProperty(
                speechTexts.ShowPreviousPages.ShowPreviousPages,
                presenter.speechTexts.ShowPreviousPages),
            Title: presenter.getSpeechTextProperty(
                speechTexts.Title.Title,
                presenter.speechTexts.Title),
            GoToPage: presenter.getSpeechTextProperty(
                speechTexts.GoToPage.GoToPage,
                presenter.speechTexts.GoToPage),
            ShowNextPages: presenter.getSpeechTextProperty(
                speechTexts.ShowNextPages.ShowNextPages,
                presenter.speechTexts.ShowNextPages),
            NextPage: presenter.getSpeechTextProperty(
                speechTexts.NextPage.NextPage,
                presenter.speechTexts.NextPage)
        };
    };

    presenter.getSpeechTextProperty = function (rawValue, defaultValue) {
        if (rawValue === undefined || rawValue === null) {
            return defaultValue;
        }

        var value = rawValue.trim();
        if (value === '') {
            return defaultValue;
        }

        return value;
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

        presenter.setSpeechTexts(model['speechTexts']);
        presenter.configuration = validatedModel;
        DOMOperationsUtils.setReducedSize(presenter.$view, presenter.$wrapper);

        presenter.calculateObjectsSizes();

        presenter.initializeAddon();

        if (presenter.isPreview) {
            if (presenter.navigationManager.buttons.length > 0) {
                presenter.navigationManager.buttons[0].setAsCurrent();
            }
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
        var $element = presenter.$wrapper.find("." + presenter.CSS_CLASSES.PREVIOUS);

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

    presenter.calculateNumberOfStaticPages = function (sections) {
        var staticSections = [];
        for (var i = 0; i < sections.length; i++) {
            if (sections[i].staticPosition.length > 0) {
                staticSections.push(sections[i]);
            }
        }
        return presenter.calculateNumberOfPages(staticSections);
    }

    presenter.validateModel = function (model) {
        var validatedSections = presenter.validateSections(model["Sections"]);

        if (!validatedSections.isValid) {
            return validatedSections;
        }

        var numberOfPages = presenter.calculateNumberOfPages(validatedSections.sections);
        var numberOfStaticPages = presenter.calculateNumberOfStaticPages(validatedSections.sections);

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
            defaultOrder: ModelValidationUtils.validateBoolean(model["defaultOrder"]),
            userButtonsNumber: validateButtonsNumber.value,
            userButtonsWidth: validateButtonsWidth.value,
            numberOfPages: numberOfPages,
            numberOfStaticPages: numberOfStaticPages,
            useDynamicPagination: ModelValidationUtils.validateBoolean(model["useDynamicPagination"])
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

    presenter.parseSectionButtonsCssClassNames = function (cssClasses, sectionIndex) {
        if (ModelValidationUtils.isStringEmpty(cssClasses)) {
            return getErrorObject("S_11", {section: sectionIndex});
        }

        var parsedCssClasses = cssClasses.split(",").map(getTrimmedStringElement);
        var cssClassesWithoutDuplication = removeDuplicatedCssClassNames(parsedCssClasses);

        for (var i = 0; i < cssClassesWithoutDuplication.length; i++) {
            if (ModelValidationUtils.isStringEmpty(cssClassesWithoutDuplication[i])) {
                return getErrorObject("S_11", {section: sectionIndex});
            }

            if (!isValidClassName(cssClassesWithoutDuplication[i])) {
                return getErrorObject("S_12", {section: sectionIndex});
            }
        }

        return {
            isValid: true,
            cssClasses: cssClassesWithoutDuplication
        };
    }

    function removeDuplicatedCssClassNames(cssClassNames) {
        return [...new Set(cssClassNames)];
    }

    function isValidClassName(className) {
        return /^[a-z_-][a-z\d_-]*$/i.test(className);
    }

    function changeToStringOneBigger (element) {
        return ((element + 1) + "");
    }

    function parseSection(section, sectionIndex) {
        section = section.split(";").map(getTrimmedStringElement);
        var len = section.length;
        var sectionName = "";
        var descriptions = [];
        var sectionButtonsCssClassNames = {cssClasses: []};
        var staticPosition = '';

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

        if (len > 3) {
            if (len <= 4 || getTrimmedStringElement(section[3]).length != 0) {
                sectionButtonsCssClassNames = presenter.parseSectionButtonsCssClassNames(section[3], (sectionIndex + 1));
                if (!sectionButtonsCssClassNames.isValid) {
                    return sectionButtonsCssClassNames;
                }
            }
        }

        if (len > 4) {
            var rawPosition = getTrimmedStringElement(section[4]).toLowerCase();
            if (rawPosition == 'left') staticPosition = 'left';
            if (rawPosition == 'right') staticPosition = 'right';
            if (rawPosition.length > 0 && staticPosition.length == 0) {
                return getErrorObject("S_13", {section: sectionIndex});
            }
        }

        return {
            isValid: true,
            pages: pages.pages,
            sectionName: sectionName,
            pagesDescriptions: descriptions.descriptions,
            sectionButtonsCssClassNames: sectionButtonsCssClassNames.cssClasses,
            staticPosition: staticPosition
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
        if (presenter.sections.allPages == null
        || presenter.sections.allPages.length ==0
        || presenter.navigationManager.actualPages.length == 0) return "";
        var pages = presenter.sections.allPages.map(function (page) {
            return {
                page: page.page,
                description: page.description,
                sectionName: page.sectionName,
                sectionCssClass: page.sectionCssClass,
                buttonCssClassNames: page.buttonCssClassNames,
                isBookmarkOn: page.isBookmarkOn,
                staticPosition: page.staticPosition,
            };
        });

        var state = {
            pages: pages,
            attemptedPages: presenter.sections.attemptedPages,
            leftSideIndex: presenter.navigationManager.getLeftSideIndex(),
            leftSideValue: presenter.navigationManager.actualPages[0].page,
            nextPrevBtnWasClicked: presenter.navigationManager.nextPrevBtnWasClicked
        };
        return JSON.stringify(state);
    };

    function getRestorePagesObjectArray (pages) {
        var restoredPages = pages.map(function (page) {
            var restoredPage = new presenter.Page(
                page.page, page.description, page.sectionName,
                page.sectionCssClass, page.buttonCssClassNames,
                page.staticPosition
            );
            restoredPage.setBookmarkOn(page.isBookmarkOn);

            return restoredPage;
        });

        if (presenter.sections.allPages.length > 0) {
            var pagesIndexesInSections = presenter.sections.allPages.map(function(page) {
                return page.page;
            });

            return restoredPages.filter(function (page) {
                return pagesIndexesInSections.indexOf(page.page) !== -1;
            });
        } else {
            // if all pages are empty, then just return given state
            return restoredPages;
        }
    }

    presenter.setState = function (state) {
        if (state === null || state === "" || state === undefined) {
            return;
        }
        if (presenter.randomizeLesson === false
        || presenter.assessmentUser == presenter.ASSESSMENT_USER_TYPES.TEACHER) {
            //Randomize lesson == false and assessmentUser == teacher override state
            return;
        }

        var parsedState = JSON.parse(state);
        var upgradedState = presenter.upgradeState(parsedState);
        const previousLeftSideIndex = parsedState.leftSideIndex;
        const previousLeftSideValue = parsedState.leftSideValue;
        const nextPrevBtnWasClicked = parsedState.nextPrevBtnWasClicked;

        var restoredPages = getRestorePagesObjectArray(upgradedState.pages);
        // This if fix on wrong state when filter of sections worked wrong
        presenter.sections.allPages = restoredPages.length === presenter.sections.allPages.length ? restoredPages : presenter.sections.allPages;
        presenter.navigationManager.calculateLeftOffset(previousLeftSideValue, nextPrevBtnWasClicked);
        presenter.navigationManager.restartLeftSideIndex();
        presenter.navigationManager.setLeftSideIndex(previousLeftSideIndex, previousLeftSideValue);
        presenter.navigationManager.setSections();
        presenter.navigationManager.moveToCurrentPage();

        if (presenter.keyboardControllerObject != null) {
            presenter.keyboardControllerObject.setElements(presenter.getElementsForKeyboardNavigation());

            var keyboardElements = presenter.keyboardControllerObject.keyboardNavigationElements;
            for (var i = 0; i < keyboardElements.length; i++) {
                if ($(keyboardElements[i]).hasClass(presenter.CSS_CLASSES.CURRENT_PAGE)) {
                    presenter.keyboardControllerObject.keyboardNavigationCurrentElementIndex = i;
                }
            }
        }

        presenter.sections.attemptedPages = upgradedState.attemptedPages;
        presenter.navigationManager.markButtonsWithAttempted(presenter.sections.attemptedPages);
    };

    presenter.upgradeState = function (state) {
        var upgradedState = presenter.upgradeAttemptedPages(state);
        upgradedState = presenter.upgradePagesButtonCssClassNames(upgradedState);
        return presenter.upgradePagesStaticPosition(upgradedState);
    };

    presenter.upgradeAttemptedPages = function (state) {
        var upgradedState = {};
        jQuery.extend(true, upgradedState, state); // Deep copy of model object

        if(state.attemptedPages === undefined) {
            upgradedState["attemptedPages"] = [];
        }

        return upgradedState;
    };

    presenter.upgradePagesButtonCssClassNames = function (state) {
        var upgradedState = {};
        jQuery.extend(true, upgradedState, state); // Deep copy of model object

        if (upgradedState.pages) {
            upgradedState.pages.map(function (page) {
                if(page.buttonCssClassNames === undefined) {
                    page["buttonCssClassNames"] = [];
                }
            });
        }

        return upgradedState;
    };

    presenter.upgradePagesStaticPosition = function (state) {
        var upgradedState = {};
        jQuery.extend(true, upgradedState, state); // Deep copy of model object

        if (upgradedState.pages) {
            upgradedState.pages.map(function (page) {
                if(page.staticPosition === undefined) {
                    page["staticPosition"] = '';
                }
            });
        }

        return upgradedState;
    };

    function getPlayerIndex(lessonIndex) {
        var mapping = presenter.playerController.getPagesMapping();
        return mapping[lessonIndex];
    }

    function currentPageAreAllAttempted() {
        var playerIndex = getPlayerIndex(presenter.currentPageIndex);
        if(presenter.presentation.getPage(playerIndex).isReportable()){

            var modules = getAllModulesImplementingIsAttempted(playerIndex);

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
        if(modules.length === 0) return false;

        return modules.every(module => module.isAttempted());
    }

    presenter.areAllModulesAttempted = function () {
        currentPageAreAllAttempted();
    };

    presenter.reset = function () {
        presenter.sections.removeClassAllAttemptedToPage(presenter.currentPageIndex);
    };

    presenter.onEventReceived = function(eventName, eventData) {
        switch (eventName) {
            case "PageLoaded":
                if (presenter.configuration.addClassAreAllAttempted) {
                    presenter.areAllModulesAttempted();
                }
                break;
            case "ValueChanged":
                presenter.handleValueChanged(eventData);
                break;
            case "ShowAnswers":
                presenter.showAnswers();
                break;
            case "HideAnswers":
                presenter.hideAnswers();
                break;
        }
    };

    presenter.handleValueChanged = function (eventData) {
        if (presenter.configuration.addClassAreAllAttempted && !presenter.isShowAnswersActive) {
            presenter.areAllModulesAttempted();
        }
        if (eventData.item === "Lesson Reset") {
            presenter.navigationManager.removeBookmarksFromButtons();
            presenter.navigationManager.removeAttemptedFromButtons();
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
        var $element = this.getTarget(this.keyboardNavigationCurrentElement, true);
        $element[0].click();
        if ($element.hasClass(presenter.CSS_CLASSES.TURN_BACK) || $element.hasClass(presenter.CSS_CLASSES.TURN_FORWARD)) {
            AssesmentsNavigationKeyboardController.prototype.setNewElements.call(this);
        };
    };

    AssesmentsNavigationKeyboardController.prototype.setNewElements = function () {
          if (presenter.isTTS()) {
              KeyboardController.prototype.setElements.call(this, presenter.getElementsForTTS());
          } else {
              KeyboardController.prototype.setElements.call(this, presenter.getElementsForKeyboardNavigation());
          }
    };

    AssesmentsNavigationKeyboardController.prototype.getTarget = function (element, willBeClicked) {
        return $(element);
    };

    AssesmentsNavigationKeyboardController.prototype.switchElement = function (move) {
        var new_position_index = this.keyboardNavigationCurrentElementIndex + move;
        if (new_position_index < this.keyboardNavigationElementsLen && new_position_index >= 0) {
            KeyboardController.prototype.markCurrentElement.call(this, new_position_index);
        }
        this.readCurrentElement();
    };

    AssesmentsNavigationKeyboardController.prototype.enter = function (event) {
        if (presenter.isTTS() && presenter.isFirstEnter) {
            KeyboardController.prototype.setElements.call(this, presenter.getElementsForTTS());
            presenter.isFirstEnter = false;
        }
        KeyboardController.prototype.enter.call(this, event);
        this.readCurrentElement();
    };

    AssesmentsNavigationKeyboardController.prototype.exitWCAGMode = function () {
        presenter.isFirstEnter = true;
        KeyboardController.prototype.setElements.call(this, presenter.getElementsForKeyboardNavigation());
        KeyboardController.prototype.exitWCAGMode.call(this);
    };

    presenter.buildKeyboardController = function () {
        presenter.keyboardControllerObject = new AssesmentsNavigationKeyboardController(presenter.getElementsForKeyboardNavigation(), 1);
    };

    presenter.getElementsForTTS = function () {
        return this.$view.find(".element:visible, .section_name:visible").filter(":not(.inactive)");
    };

    presenter.getElementsForKeyboardNavigation = function () {
        return this.$view.find(".element:visible").filter(":not(.inactive)");
    };

    presenter.keyboardController = function(keycode, isShiftKeyDown, event) {
        presenter.keyboardControllerObject.handle(keycode, isShiftKeyDown, event)
    };

    AssesmentsNavigationKeyboardController.prototype.readCurrentElement = function () {
        var $element = this.getTarget(this.keyboardNavigationCurrentElement, false);
        if ($element.hasClass(presenter.CSS_CLASSES.PREVIOUS)) {
            presenter.speak(presenter.speechTexts.PreviousPage);
        } else if ($element.hasClass(presenter.CSS_CLASSES.TURN_BACK)) {
            presenter.speak(presenter.speechTexts.ShowPreviousPages);
        } else if ($element.hasClass(presenter.CSS_CLASSES.SECTION_NAME)) {
            presenter.speak(getSpeechForSectionName($element));
        } else if ($element.hasClass(presenter.CSS_CLASSES.BUTTON)) {
            presenter.speak(getSpeechForGoToPage($element));
        } else if ($element.hasClass(presenter.CSS_CLASSES.TURN_FORWARD)) {
            presenter.speak(presenter.speechTexts.ShowNextPages);
        } else if ($element.hasClass(presenter.CSS_CLASSES.NEXT)) {
            presenter.speak(presenter.speechTexts.NextPage);
        }
    };

    getSpeechForSectionName = function (element) {
        return `${presenter.speechTexts.Title} ${element[0].innerText}`;
    };

    getSpeechForGoToPage = function (element) {
        let pageName = element.find("." + presenter.CSS_CLASSES.BUTTON_TEXT).val();
        return `${presenter.speechTexts.GoToPage} ${element[0].innerText}`;
    };

    presenter.setWCAGStatus = function(isWCAGOn) {
        presenter.isWCAGOn = isWCAGOn;
    };

    presenter.getTextToSpeechOrNull = function Assessments_Navigation_Bar_getTextToSpeechOrNull(playerController) {
        if (playerController) {
            return playerController.getModule('Text_To_Speech1');
        }

        return null;
    };

    presenter.speak = function Assessments_Navigation_Bar_speak(data) {
        var tts = presenter.getTextToSpeechOrNull(presenter.playerController);
        if (tts && presenter.isWCAGOn) {
            tts.speak(data);
        }
    };

    presenter.isTTS = function () {
        return presenter.getTextToSpeechOrNull(presenter.playerController) && presenter.isWCAGOn;
    };

    return presenter;
}
