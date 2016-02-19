function AddonNavigation_Bar_create() {
    var presenter = function () { };
    presenter.eventBus = null;
    presenter.pagesOk = [];

    var NAVIGATION_PAGE = {
        FIRST: 0,
        LAST: 1,
        PREVIOUS: 2,
        NEXT: 3,
        OTHER: 4
    };

    presenter.ERROR_CODES = {
        'E_01': "Pages and Style or Class attribute in 'Styles' must be filled",
        'E_04': "Pages attribute in Styles may contain only previous, next, first, last and positive integer page numbers",
        'P_01': "Cannot load module - HTML element doesn't exists"
    };

    function returnErrorObject(errorCode) {
        return { isError: true, errorCode: errorCode };
    }

    var DOTTED_SIDE = {
        LEFT: { CSSClass: "dotted-element-left" },
        RIGHT: { CSSClass: "dotted-element-right" }
    };

    var movedFromIndex,
        maxElementCount;

    function getLanguage(model) {
    	if (model['Numericals'] == 'Eastern Arabic') {
    		return Internationalization.EASTERN_ARABIC;
    	}
    	if (model['Numericals'] == 'Perso-Arabic') {
    		return Internationalization.PERSO_ARABIC;
    	}
    	return Internationalization.WESTERN_ARABIC;
    }

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.eventBus = controller.getEventBus();
        presenter.presentation = controller.getPresentation();
        presenter.commander = controller.getCommands();
        presenter.pageCount = controller.getPresentation().getPageCount();
        presenter.currentIndex = controller.getCurrentPageIndex();
        presenter.scoreService = controller.getScore();
        presenter.eventBus.addEventListener('PageLoaded', this);
        presenter.eventBus.addEventListener('ValueChanged', this);
        presenter.eventBus.addEventListener('ShowAnswers', this);
        presenter.eventBus.addEventListener('HideAnswers', this);
    };

    function goToPage(whereTo, index) {
        var currentIndex = presenter.playerController.getCurrentPageIndex(),
            goToIndex = 0;

        switch (whereTo) {
            case NAVIGATION_PAGE.FIRST:
                if (currentIndex !== 0) {
                    goToIndex = 0;
                }
                break;
            case NAVIGATION_PAGE.LAST:
                if (currentIndex !== (presenter.pageCount - 1)) {
                    goToIndex = presenter.pageCount - 1;
                }
                break;
            case NAVIGATION_PAGE.NEXT:
                if (currentIndex !== (presenter.pageCount - 1)) {
                    goToIndex = presenter.currentIndex + 1;
                }
                break;
            case NAVIGATION_PAGE.PREVIOUS:
                if (currentIndex !== 0) {
                    goToIndex = presenter.currentIndex - 1;
                }
                break;
            case NAVIGATION_PAGE.OTHER:
                if (currentIndex !== index && (index >= 0) && (index <= (presenter.pageCount - 1))) {
                    goToIndex = index;
                }
                break;
        }

        presenter.commander.gotoPageIndex(goToIndex);
    }

    function handleMouseActions(dotsLeftIndex, dotsRightIndex, elementWidth, elementHeight, preview, horizontalGap) {
        handleArrowClickActions();
        handleIndexClickActions();
        handleDottedClickActions(dotsLeftIndex, dotsRightIndex, elementWidth, elementHeight, preview, horizontalGap);
        handleHoverAndMouseDownActions();
    }

    function handleArrowClickActions() {
        presenter.$view.find('[class="navigationbar-element-first"]').parent().click(function () {
            goToPage(NAVIGATION_PAGE.FIRST);
            return false;
        });

        presenter.$view.find('[class="navigationbar-element-previous"]').parent().click(function () {
            goToPage(NAVIGATION_PAGE.PREVIOUS);
            return false;
        });

        presenter.$view.find('[class="navigationbar-element-next"]').parent().click(function () {
            goToPage(NAVIGATION_PAGE.NEXT);
            return false;
        });

        presenter.$view.find('[class="navigationbar-element-last"]').parent().click(function () {
            goToPage(NAVIGATION_PAGE.LAST);
            return false;
        });
    }

    function handleIndexClickActions() {
        presenter.$view.find('[class*="navigationbar-indexed-element"]').each(function () {
            var isCurrentPage = $(this).hasClass("navigationbar-element-current");
            var pageIndex = parseInt($(this).attr("data-page-number"), 10) - 1;

            $(this).parent().click(function (event) {
                event.stopPropagation();
                event.preventDefault();

                if (!isCurrentPage) {
                    goToPage(NAVIGATION_PAGE.OTHER, pageIndex);
                }
            });
        });

    }

    presenter.checkIfPagesOk = function () {
        presenter.$view.find(".navigationbar-indexed-element").each(function () {
            if($(this).hasClass('navigationbar-page-ok')){
                var pageIndex = parseInt($(this).attr("data-page-number"), 10);
                presenter.pagesOk.push(pageIndex);
            }
        });
    };

    presenter.addClassPageOK = function () {
        for (var i=0; i < presenter.pagesOk.length; i++){
            presenter.$wrapper.find("[data-page-number='" + presenter.pagesOk[i] + "']").addClass('navigationbar-page-ok');
        }
    };

    function handleDottedClickActions(dotsLeftIndex, dotsRightIndex, elementWidth, elementHeight, preview, horizontalGap) {
        presenter.$view.find(".dotted-element-left:first").click(function () {
            if (dotsLeftIndex === undefined || dotsLeftIndex < 0) {
                dotsLeftIndex = 0;
            }

            removeAllElements();
            if (movedFromIndex == undefined) {
                movedFromIndex = presenter.currentIndex;
            }
            presenter.currentIndex = dotsLeftIndex;

            generateElements(elementWidth, elementHeight, true, preview, horizontalGap);

            presenter.addClassPageOK();

            presenter.isPageOK();

            return false;
        });

        presenter.$view.find(".dotted-element-right:first").click(function () {
            if (dotsRightIndex === undefined || dotsRightIndex > presenter.pageCount - 1) {
                dotsRightIndex = presenter.pageCount - 1;
            }

            removeAllElements();
            if (movedFromIndex == undefined) {
                movedFromIndex = presenter.currentIndex;
            }
            presenter.currentIndex = dotsRightIndex;

            generateElements(elementWidth, elementHeight, true, preview, horizontalGap);

            presenter.addClassPageOK();

            presenter.isPageOK();

            return false;
        });
    }

    function handleHoverAndMouseDownActions() {
        var isHomeInactive = presenter.currentIndex === 0;
        var isReportInactive = presenter.currentIndex === presenter.pageCount - 1;

        handleSpecificElementHoverAndMouseDown('navigationbar-element-first', isHomeInactive);
        handleSpecificElementHoverAndMouseDown('navigationbar-element-previous', isHomeInactive);
        handleSpecificElementHoverAndMouseDown('navigationbar-element-next', isReportInactive);
        handleSpecificElementHoverAndMouseDown('navigationbar-element-last', isReportInactive);
        handleSpecificElementHoverAndMouseDown('navigationbar-element-current', false);

        handleElementHoverAndMouseDown();
    }

    function handleSpecificElementHoverAndMouseDown(selector, inactive) {
        var removeClassNames = selector + ' ' + selector + '-mouse-hover' +
            ' ' + selector + '-mouse-click' + ' ' + selector + '-inactive';

        var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );

        presenter.$wrapper.find("span[class^=" + selector + "]").each(function() {
            var addClassName = inactive ? selector + '-inactive' : selector;

            if (!iOS) {
            	$(this).hover(
            		function() {
                    	$(this).removeClass(removeClassNames);
                    	$(this).addClass(selector + '-mouse-hover');
                	},
                	function() {
                    	$(this).removeClass(removeClassNames);
                    	$(this).addClass(addClassName);
                	}
            	);
            }

            $(this).mousedown(
                function() {
                    $(this).removeClass(removeClassNames);
                    $(this).addClass(selector + '-mouse-click');
                }
            );

            $(this).mouseup(
                function() {
                    $(this).removeClass(removeClassNames);
                    $(this).addClass(addClassName);
                }
            );
        });
    }

    function handleElementHoverAndMouseDown() {
        var notSelectorsList = '.navigationbar-element-first,.navigationbar-element-last,' +
            '.navigationbar-element-next,.navigationbar-element-previous,.navigationbar-element-current';

        var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );

        presenter.$wrapper.find('.navigationbar-element').not(notSelectorsList).each(function() {
            if (!iOS) {
            	$(this).hover(
            		function() {
                    	$(this).removeClass('navigationbar-element');
                    	$(this).addClass('navigationbar-element-mouse-hover');
                	},
                	function() {
                    	$(this).removeClass('navigationbar-element-mouse-hover');
                    	$(this).addClass('navigationbar-element');
                	}
            	);
            }

            $(this).mousedown(
                function() {
                    $(this).removeClass('navigationbar-element');
                    $(this).addClass('navigationbar-element-mouse-click');
                }
            );

            $(this).mouseup(
                function() {
                    $(this).removeClass('navigationbar-element-mouse-click');
                    $(this).addClass('navigationbar-element');
                }
            );
        });
    }

    function removeAllElements() {
        presenter.$view.find("span[class*=navigationbar-element]").parent().remove();
    }

    function generateHomeArrowElement() {
        var isElementInactive = presenter.currentIndex === 0;
        var elementStyle = isElementInactive ? "navigationbar-element-first-inactive" : "navigationbar-element-first";

        if (presenter.$view.has('[class*="navigationbar-element-first"]').length < 1) {
            var homeElementArrow = '<a href="#">' +
                '<span class="' + elementStyle + '">&lt;&lt;</span>' +
                '</a>';

            presenter.$wrapper.append(homeElementArrow);
        }
    }

    function generatePreviousArrowElement() {
        var homeElement = presenter.$view.find('[class*="navigationbar-element-first"]:first').parent();
        var isElementInactive = presenter.currentIndex === 0;
        var elementStyle = isElementInactive ? "navigationbar-element-previous-inactive inactive" : "navigationbar-element-previous";

        var previousElementArrow = '<a href="#"><span class="' + elementStyle + '">&lt;</span></a>';

        if (presenter.configuration.hideHomeLastArrows) {
            presenter.$wrapper.append(previousElementArrow);
        } else {
            homeElement.after(previousElementArrow);
        }

    }

    function generateNextArrowElement() {
        var previousElement = presenter.$view.find('[class*="navigationbar-element-previous"]:first').parent();
        var isElementInactive = presenter.currentIndex === presenter.pageCount - 1;
        var elementStyle = isElementInactive ? "navigationbar-element-next-inactive inactive" : "navigationbar-element-next";

        var nextElementArrow = '<a href="#"><span class="' + elementStyle + '">&gt;</span></a>';

        presenter.$wrapper.append(nextElementArrow);
    }

    function generateReportArrowElement() {
        var isElementInactive = presenter.currentIndex === presenter.pageCount - 1;
        var elementStyle = isElementInactive ? "navigationbar-element-last-inactive" : "navigationbar-element-last";

        if (presenter.$view.has('[class*="navigationbar-element-last"]').length < 1) {
            var reportElementArrow = '<a href="#"><span class="' + elementStyle + '">&gt;&gt;</span></a>';

            presenter.$wrapper.append(reportElementArrow);
        }
    }

    function generateHomeAndPreviousArrowsElements() {
        if (!presenter.configuration.hideHomeLastArrows) {
            generateHomeArrowElement();
        }

        if (presenter.configuration.showNextPrevArrows) {
            generatePreviousArrowElement();
        }
    }

    function generateReportAndNextArrowsElements() {
        if (presenter.configuration.showNextPrevArrows) {
            generateNextArrowElement();
        }

        if (!presenter.configuration.hideHomeLastArrows) {
            generateReportArrowElement();
        }
    }

    function generateDottedElement(dotsSide) {
        return '<a href="#">' +
            '<span class="navigationbar-element navigationbar-dotted-element ' + dotsSide.CSSClass + '">&hellip;</span>' +
            '</a>';
    }

    // Index is displayed page number
    function generateIndexElementStub(index, navigationBarMoved) {
        var isCurrentElement, pageIndex;

        if(presenter.configuration.firstPageAsCover){
            isCurrentElement = !navigationBarMoved ? (index - 1 + 1) === presenter.currentIndex : (index - 1 + 1) === movedFromIndex;
            pageIndex = parseInt(index, 10) + 1;
        }else{
            isCurrentElement = !navigationBarMoved ? (index - 1) === presenter.currentIndex : (index - 1) === movedFromIndex;
            pageIndex = parseInt(index, 10);
        }

        var currentElementStyle = isCurrentElement ? "navigationbar-element-current" : "navigationbar-element";

        return '<a href="#">' +
            '<span class="' + currentElementStyle + ' navigationbar-indexed-element' +'" data-page-number="' + pageIndex + '">' + Internationalization.translate(index, presenter.configuration.language) + '</span>' +
            '</a>';
    }

    function generateIndexedElements(navigationBarMoved) {
        var firstElementSelector = presenter.configuration.showNextPrevArrows ? '[class*="navigationbar-element-previous"]' : '[class*="navigationbar-element-first"]';
        //var firstElement = presenter.$view.find(firstElementSelector).parent();

        var element; // Works as temporary indexed element
        var dottedElement; // Works as temporary dotted element

        var dotsLeftTargetIndex;
        var dotsRightTargetIndex;
        var n = 0;

        var pageCount;
        if(presenter.configuration.firstPageAsCover){
            pageCount = presenter.pageCount-1;
        }else{
            pageCount = presenter.pageCount;
        }

        if (maxElementCount >= pageCount) { // All pages will be displayed
            for (n = 1; n <= pageCount; n++) {
                element = generateIndexElementStub(n, navigationBarMoved);
                presenter.$wrapper.append(element);
            }
        } else {
            if (presenter.currentIndex < (maxElementCount - 1)) { // -1 for dotted element
                for (n = 0; n < maxElementCount - 1; n++) {
                    element = generateIndexElementStub(n + 1, navigationBarMoved);
                    presenter.$wrapper.append(element);
                }

                // Dots are displayed on the right
                dotsRightTargetIndex = maxElementCount - 1;
                presenter.$wrapper.append(generateDottedElement(DOTTED_SIDE.RIGHT));
            } else if (presenter.currentIndex > (presenter.pageCount - maxElementCount)) {
                // Dots are displayed on the left -> -1 to max element count
                dotsLeftTargetIndex = (pageCount - 1) - (maxElementCount - 2) - 1;
                dottedElement = generateDottedElement(DOTTED_SIDE.LEFT);
                presenter.$wrapper.append(dottedElement);

                for (n = pageCount - maxElementCount + 1; n < pageCount; n++) {
                    element = generateIndexElementStub(n + 1, navigationBarMoved);
                    presenter.$wrapper.append(element);
                }
            } else {
                var numberOfElement = maxElementCount - 2;

                var temp = presenter.currentIndex - (numberOfElement + 1);
                var multiplier = parseInt(temp / numberOfElement, 10);
                var startIndex = (numberOfElement + 1) + multiplier * numberOfElement;

                dotsLeftTargetIndex = startIndex - 1;
                dottedElement = generateDottedElement(DOTTED_SIDE.LEFT);
                presenter.$wrapper.append(dottedElement);

                for (n = 0; n < numberOfElement; n++) {
                    var indexedElement = generateIndexElementStub(startIndex + 1 + n, navigationBarMoved);
                    presenter.$wrapper.append(indexedElement);
                }

                dotsRightTargetIndex = startIndex + numberOfElement;
                presenter.$wrapper.append(generateDottedElement(DOTTED_SIDE.RIGHT));
            }
        }

        return {
            leftIndex: dotsLeftTargetIndex,
            rightIndex: dotsRightTargetIndex
        };
    }

    function generateElements(elementWidth, elementHeight, navigationBarMoved, preview, horizontalGap) {
        removeAllElements();

        generateHomeAndPreviousArrowsElements();

        var dotsIndexes = generateIndexedElements(navigationBarMoved);

        generateReportAndNextArrowsElements();

        if (!preview) {
            handleMouseActions(dotsIndexes.leftIndex, dotsIndexes.rightIndex, elementWidth, elementHeight, preview, horizontalGap);
        }

        if (presenter.$wrapper.css('direction') === 'rtl') {
            reorderElements(dotsIndexes, elementWidth, elementHeight, preview, horizontalGap);
        }

        presenter.$view.find("span[class^=navigationbar-element]").each(function () {
            var width = $(this).hasClass('navigationbar-element-last') ? elementWidth + horizontalGap : elementWidth;
            $(this).width(width + 'px');
            $(this).height(elementHeight + 'px');
            $(this).css('line-height', elementHeight + 'px');
        });

        return dotsIndexes;
    }

    function reorderElements(dotsIndexes, elementWidth, elementHeight, preview, horizontalGap) {
        var elements = [];

        presenter.$wrapper.children('a').each(function () {
            elements.push($(this));
            $(this).remove();
        });

        for (var i = elements.length - 1; i >= 0; i--) {
            presenter.$wrapper.append(elements[i]);
        }

        if (!preview) {
            handleMouseActions(dotsIndexes.leftIndex, dotsIndexes.rightIndex, elementWidth, elementHeight, preview, horizontalGap);
        }
    }

    presenter.arePagesNamesCorrect = function (pageNames, length) {
        for (var i = 0; i < pageNames.length; i++) {
            if (length > 1 && pageNames[i] == "") {
                return false;
            }
            if (isNaN(pageNames[i])) {
                switch (pageNames[i]) {
                    case "previous":
                        break;
                    case "first":
                        break;
                    case "last":
                        break;
                    case "next":
                        break;
                    default:
                        return false;
                }
            } else {
                if(length>1) {
                    if (pageNames[i] % 1 !== 0 || pageNames[i] <= 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    };

    presenter.validateModel = function (model) {
        var validatedModel = {
            isError: false,
            styles: model['Styles'],
            showNextPrevArrows: model.ShowNextPrevArrows === 'True',
            hideHomeLastArrows: model.HideHomeLastArrows === 'True',
            language: getLanguage(model),
            addClassNBPageOK: model.AddClassNBPageOK === 'True',
            firstPageAsCover: ModelValidationUtils.validateBoolean(model["firstPageAsCover"])
        };

        if (!model['Styles']) {
            return validatedModel;
        }

        for (var i = 0; i < model['Styles'].length; i++) {
            var pages = model['Styles'][i].Pages;
            var pageNames = pages.trim().split(',');
            if (model['Styles'].length > 1) {
                if (!pages) {
                    return returnErrorObject('E_01');
                }
                if (!model['Styles'][i]['Style'] && !model['Styles'][i]['Class']) {
                    return returnErrorObject('E_01');
                }
            }
            if(!presenter.arePagesNamesCorrect(pageNames, model['Styles'].length)){
                return returnErrorObject('E_04');
            }
        }

        return validatedModel;
    };

    presenter.getArrowsCount = function () {
        var arrowsCount = 0;

        if (!presenter.configuration.hideHomeLastArrows) arrowsCount += 2;
        if (presenter.configuration.showNextPrevArrows) arrowsCount += 2;

        return arrowsCount;
    };

    presenter.addAdditionalStyleToPage = function (page, styleName, styleValue, clazz) {
        if (isNaN(page)) {
            presenter.$wrapper.find("span[class^='navigationbar-element-"+ page +"']").css(styleName, styleValue);
            presenter.$wrapper.find("span[class^='navigationbar-element-"+ page +"']").addClass(clazz);

        } else {
            presenter.$wrapper.find("[data-page-number='" + page + "']").addClass(clazz);
            presenter.$wrapper.find("[data-page-number='" + page + "']").css(styleName, styleValue);
        }
    };

    presenter.setPageStyles = function() {
        $.each(presenter.configuration.styles, function() {
            var pages = this['Pages'].split(',');
            var cssStyle = this['Style'];
            var styles = cssStyle.split(';');

            for (var page = 0; page < pages.length; page++) {
                var pageElement = pages[page].trim();
                for(var pageStyle = 0; pageStyle < styles.length; pageStyle++) {
                    var oneStyle =  styles[pageStyle].split(':');
                    if(oneStyle[0]) {
                        oneStyle[0] = oneStyle[0].trim();
                    }
                    if(oneStyle[1]) {
                        oneStyle[1] = oneStyle[1].trim();
                    }
                    presenter.addAdditionalStyleToPage(pageElement, oneStyle[0], oneStyle[1], this['Class']);
                }
            }
        });
    };

    function presenterLogic(view, model, isPreview) {
    	presenter.$view = $(view);
        presenter.$wrapper = presenter.$view.find('.navigationbar-wrapper:first');
        var $element = presenter.$view.find('.navigationbar-element-first');

        presenter.configuration = presenter.validateModel(model);
        var arrowsCount = presenter.getArrowsCount();

        if(presenter.configuration.isError){
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        if (isPreview) {
            presenter.currentIndex = 0;
            presenter.pageCount = 21;
        }

        DOMOperationsUtils.setReducedSize(presenter.$view, presenter.$wrapper);
        var elementDimensions = DOMOperationsUtils.getOuterDimensions($element),
            elementDistances = DOMOperationsUtils.calculateOuterDistances(elementDimensions);

        var elementBaseWidth = parseInt($element.width(), 10) + elementDistances.horizontal;
        maxElementCount = parseInt((presenter.$wrapper.width() - (arrowsCount * elementBaseWidth)) / elementBaseWidth, 10) - 4;
        var pageCount;
        if(presenter.configuration.firstPageAsCover){
            pageCount = presenter.pageCount-1;
        }else{
            pageCount = presenter.pageCount;
        }
        var numberOfElements = pageCount < maxElementCount ? pageCount + arrowsCount : maxElementCount + arrowsCount;
        var elementWidth = parseInt(presenter.$wrapper.width() / numberOfElements  - elementDistances.horizontal, 10);
        var elementHeight = parseInt(presenter.$wrapper.height() - elementDistances.vertical, 10);
        var horizontalGap = presenter.$wrapper.width() - (elementWidth + elementDistances.horizontal) * numberOfElements;

        removeAllElements();

        generateElements(elementWidth, elementHeight, false, isPreview, horizontalGap);
        if(model['Styles']) {
            presenter.setPageStyles();
        }
    }

    presenter.setShowErrorsMode = function(){
        presenter.isCurrentPageOk();
    };

    presenter.reset = function () {
        presenter.isCurrentPageOk();
    };

    presenter.getPercentageScore = function (pageIndex) {
        var id = presenter.presentation.getPage(pageIndex).getId();
        var pageScore = presenter.scoreService.getPageScoreById(id);

        return (pageScore.score/pageScore.maxScore) * 100;
    };

    presenter.isCurrentPageOk = function () {
        if(presenter.presentation.getPage(presenter.currentIndex).isReportable()){
            var percentageScore = presenter.getPercentageScore(presenter.currentIndex);
            var $page = presenter.$wrapper.find("[data-page-number='" + (presenter.currentIndex + 1) + "']");
            var id = presenter.presentation.getPage(presenter.currentIndex).getId();
            var pageScore = presenter.scoreService.getPageScoreById(id);

            if((percentageScore == 100 && pageScore.errorCount == 0) || isNaN(percentageScore)){
                $page.addClass("navigationbar-page-ok");
                presenter.pagesOk.push(presenter.currentIndex + 1);
            }

            if(percentageScore < 100 || pageScore.errorCount > 0){
                $page.removeClass("navigationbar-page-ok");
                for(var k = presenter.pagesOk.length - 1; k >= 0; k--) {
                    if(presenter.pagesOk[k] === (presenter.currentIndex + 1)) {
                        presenter.pagesOk.splice(k, 1);
                    }
                }
            }
        }
    };

    presenter.isPageOK = function () {
      for (var i=0; i<presenter.pageCount; i++){
          if(presenter.presentation.getPage(i).isReportable() && presenter.presentation.getPage(i).isVisited()){
              var percentageScore = presenter.getPercentageScore(i);
              var id = presenter.presentation.getPage(i).getId();
              var pageScore = presenter.scoreService.getPageScoreById(id);

              if(isNaN(percentageScore)){
                  percentageScore = 100;
              }

              if(percentageScore == 100 && pageScore.errorCount == 0){
                  presenter.$wrapper.find("[data-page-number='" + (i+1) + "']").addClass("navigationbar-page-ok");
              }
          }
      }
    };

    presenter.createPreview = function(view, model) {
        presenterLogic(view, model, true);
    };

    presenter.run = function (view, model) {
        presenter.pageLoadedDeferred = new $.Deferred();
        presenter.pageLoaded = presenter.pageLoadedDeferred.promise();

        presenterLogic(view, model, false);

        presenter.pageLoaded.then(function() {
            presenter.isPageOK();
        });
    };
    
    presenter.onEventReceived = function(eventName, eventData) {
        if (eventName == 'PageLoaded') {
            presenter.currentIndex = presenter.playerController.getCurrentPageIndex();
            presenter.pageIndex = presenter.currentIndex;
            presenter.pageLoadedDeferred.resolve();
        }
        if (eventName == "ValueChanged" && presenter.configuration.addClassNBPageOK && !presenter.isShowAnswersActive) {
            presenter.currentIndex = presenter.pageIndex;
            presenter.isCurrentPageOk();
        }
        if(eventData.value == "resetClicked"){
            presenter.currentIndex = presenter.pageIndex;
            presenter.isCurrentPageOk();
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

    return presenter;
}