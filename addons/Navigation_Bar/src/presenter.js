function AddonNavigation_Bar_create() {
    var presenter = function () { };

    var NAVIGATION_PAGE = {
        FIRST: 0,
        LAST: 1,
        PREVIOUS: 2,
        NEXT: 3,
        OTHER: 4
    };

    var DOTTED_SIDE = {
        LEFT: { CSSClass: "dotted-element-left" },
        RIGHT: { CSSClass: "dotted-element-right" }
    };

    var movedFromIndex,
        maxElementCount;

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
        presenter.presentation = controller.getPresentation();
        presenter.commander = controller.getCommands();
        presenter.pageCount = controller.getPresentation().getPageCount();
        presenter.currentIndex = controller.getCurrentPageIndex();
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
        presenter.$view.find('[class*="navigationbar-element-first"]').parent().click(function () {
            goToPage(NAVIGATION_PAGE.FIRST);
            return false;
        });

        presenter.$view.find('[class*="navigationbar-element-previous"]').parent().click(function () {
            goToPage(NAVIGATION_PAGE.PREVIOUS);
            return false;
        });

        presenter.$view.find('[class*="navigationbar-element-next"]').parent().click(function () {
            goToPage(NAVIGATION_PAGE.NEXT);
            return false;
        });

        presenter.$view.find('[class*="navigationbar-element-last"]').parent().click(function () {
            goToPage(NAVIGATION_PAGE.LAST);
            return false;
        });
    }

    function handleIndexClickActions() {
        presenter.$view.find('[class*="navigationbar-indexed-element"]').each(function () {
            var isCurrentPage = $(this).hasClass("navigationbar-element-current");
            var pageIndex = parseInt($(this).html(), 10) - 1;

            $(this).parent().click(function (event) {
                event.preventDefault();

                if (!isCurrentPage) {
                    goToPage(NAVIGATION_PAGE.OTHER, pageIndex);
                }
            });
        });
    }

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

        presenter.$wrapper.find("span[class^=" + selector + "]").each(function() {
            var addClassName = inactive ? selector + '-inactive' : selector;

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

        presenter.$wrapper.find('.navigationbar-element').not(notSelectorsList).each(function() {
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
            var homeElementArrow = '<a title="First page" href="#">' +
                '<span class="' + elementStyle + '">&lt;&lt;</span>' +
                '</a>';

            presenter.$wrapper.append(homeElementArrow);
        }
    }

    function generatePreviousArrowElement() {
        var homeElement = presenter.$view.find('[class*="navigationbar-element-first"]:first').parent();
        var isElementInactive = presenter.currentIndex === 0;
        var elementStyle = isElementInactive ? "navigationbar-element-previous-inactive" : "navigationbar-element-previous";

        var previousElementArrow = '<a title="Previous page" href="#">' +
            '<span class="' + elementStyle + '">&lt;</span>' +
            '</a>';

        if (presenter.configuration.hideHomeLastArrows) {
            presenter.$wrapper.append(previousElementArrow);
        } else {
            homeElement.after(previousElementArrow);
        }

    }

    function generateNextArrowElement() {
        var previousElement = presenter.$view.find('[class*="navigationbar-element-previous"]:first').parent();
        var isElementInactive = presenter.currentIndex === presenter.pageCount - 1;
        var elementStyle = isElementInactive ? "navigationbar-element-next-inactive" : "navigationbar-element-next";

        var nextElementArrow = '<a title="Next page" href="#">' +
            '<span class="' + elementStyle + '">&gt;</span>' +
            '</a>';

        previousElement.after(nextElementArrow);
    }

    function generateReportArrowElement() {
        var isElementInactive = presenter.currentIndex === presenter.pageCount - 1;
        var elementStyle = isElementInactive ? "navigationbar-element-last-inactive" : "navigationbar-element-last";

        if (presenter.$view.has('[class*="navigationbar-element-last"]').length < 1) {
            var reportElementArrow = '<a title="Last page" href="#">' +
                '<span class="' + elementStyle + '">&gt;&gt;</span>' +
                '</a>';

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

    function generateRaportAndNextArrowsElements() {
        if (!presenter.configuration.hideHomeLastArrows) {
            generateReportArrowElement();
        }

        if (presenter.configuration.showNextPrevArrows) {
            generateNextArrowElement();
        }
    }

    function generateDottedElement(dotsSide) {
        var title = dotsSide === DOTTED_SIDE.LEFT ? "Lower page indexes" : "Higher page indexes";

        return '<a title="' + title + '" href="#">' +
            '<span class="navigationbar-element navigationbar-dotted-element ' + dotsSide.CSSClass + '">&hellip;</span>' +
            '</a>';
    }

    // Index is displayed page number
    function generateIndexElementStub(index, navigationBarMoved) {
        var isCurrentElement = !navigationBarMoved ? (index - 1) === presenter.currentIndex : (index - 1) === movedFromIndex;

        var currentElementStyle = isCurrentElement ? "navigationbar-element-current" : "navigationbar-element";
        var elementTitle = isCurrentElement ? "Current page" : "Page " + index;

        return '<a title="' + elementTitle + '" href="#">' +
            '<span class="' + currentElementStyle + ' navigationbar-indexed-element' +'">' + index + '</span>' +
            '</a>';
    }

    function generateIndexedElements(navigationBarMoved) {
        var firstElementSelector = presenter.configuration.showNextPrevArrows ? '[class*="navigationbar-element-previous"]' : '[class*="navigationbar-element-first"]';
        var firstElement = presenter.$view.find(firstElementSelector).parent();

        var element; // Works as temporary indexed element
        var dottedElement; // Works as temporary dotted element

        var dotsLeftTargetIndex;
        var dotsRightTargetIndex;
        var n = 0;
        var nthChildCount = 0;
        if (!presenter.configuration.hideHomeLastArrows) {
            nthChildCount++;
        }
        if (presenter.configuration.showNextPrevArrows) {
            nthChildCount++;
        }

        if (maxElementCount >= presenter.pageCount) { // All pages will be displayed
            for (n = 1; n <= presenter.pageCount; n++) {
                element = generateIndexElementStub(n, navigationBarMoved);

                if (presenter.configuration.hideHomeLastArrows && !presenter.configuration.showNextPrevArrows && n === 1) {
                    presenter.$wrapper.append(element);
                } else {
                    $(firstElement).after(element);
                }

                nthChildCount++;
                firstElement = presenter.$wrapper.find('a:nth-child(' + nthChildCount + ')');
            }
        } else {
            if (presenter.currentIndex < maxElementCount - 1) { // -1 for dotted element
                for (n = 0; n < maxElementCount - 1; n++) {
                    element = generateIndexElementStub(n + 1, navigationBarMoved);

                    if (presenter.configuration.hideHomeLastArrows && !presenter.configuration.showNextPrevArrows && n === 0) {
                        presenter.$wrapper.append(element);
                    } else {
                        $(firstElement).after(element);
                    }

                    nthChildCount++;
                    firstElement = presenter.$wrapper.find('a:nth-child(' + nthChildCount + ')');
                }

                // Dots are displayed on the right
                dotsRightTargetIndex = maxElementCount - 1;
                firstElement.after(generateDottedElement(DOTTED_SIDE.RIGHT));
            } else if (presenter.currentIndex > (presenter.pageCount - maxElementCount)) {
                // Dots are displayed on the left -> -1 to max element count
                dotsLeftTargetIndex = (presenter.pageCount - 1) - (maxElementCount - 2) - 1;
                dottedElement = generateDottedElement(DOTTED_SIDE.LEFT);

                if (presenter.configuration.hideHomeLastArrows && !presenter.configuration.showNextPrevArrows) {
                    presenter.$wrapper.append(dottedElement);
                } else {
                    firstElement.after(dottedElement);
                }

                nthChildCount++;
                firstElement = presenter.$wrapper.find('a:nth-child(' + nthChildCount + ')');

                for (n = presenter.pageCount - maxElementCount + 1; n < presenter.pageCount; n++) {
                    element = generateIndexElementStub(n + 1, navigationBarMoved);
                    $(firstElement).after(element);

                    nthChildCount++;
                    firstElement = presenter.$wrapper.find('a:nth-child(' + nthChildCount + ')');
                }
            } else {
                var numberOfElement = maxElementCount - 2;

                var temp = presenter.currentIndex - (numberOfElement + 1);
                var multiplier = parseInt(temp / numberOfElement, 10);
                var startIndex = (numberOfElement + 1) + multiplier * numberOfElement;

                dotsLeftTargetIndex = startIndex - 1;
                dottedElement = generateDottedElement(DOTTED_SIDE.LEFT);

                if (presenter.configuration.hideHomeLastArrows && !presenter.configuration.showNextPrevArrows) {
                    presenter.$wrapper.append(dottedElement);
                } else {
                    firstElement.after(dottedElement);
                }

                nthChildCount++;
                firstElement = presenter.$wrapper.find('a:nth-child(' + nthChildCount + ')');

                for (n = 0; n < numberOfElement; n++) {
                    var indexedElement = generateIndexElementStub(startIndex + 1 + n, navigationBarMoved);
                    firstElement.after(indexedElement);

                    nthChildCount++;
                    firstElement = presenter.$wrapper.find('a:nth-child(' + nthChildCount + ')');
                }


                dotsRightTargetIndex = startIndex  + numberOfElement;
                firstElement.after(generateDottedElement(DOTTED_SIDE.RIGHT));
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
        generateRaportAndNextArrowsElements();

        var dotsIndexes = generateIndexedElements(navigationBarMoved);

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

    presenter.validateModel = function (model) {
        return {
            showNextPrevArrows: model.ShowNextPrevArrows === 'True',
            hideHomeLastArrows: model.HideHomeLastArrows === 'True'
        };
    };

    presenter.getArrowsCount = function () {
        var arrowsCount = 0;

        if (!presenter.configuration.hideHomeLastArrows) arrowsCount += 2;
        if (presenter.configuration.showNextPrevArrows) arrowsCount += 2;

        return arrowsCount;
    };

    function presenterLogic(view, model, isPreview) {
        presenter.$view = $(view);
        presenter.$wrapper = presenter.$view.find('.navigationbar-wrapper:first');
        var $element = presenter.$view.find('[class*="navigationbar-element-first"]:first');

        presenter.configuration = presenter.validateModel(model);
        var arrowsCount = presenter.getArrowsCount();

        if (isPreview) {
            presenter.currentIndex = 0;
            presenter.pageCount = 21;
        }

        DOMOperationsUtils.setReducedSize(presenter.$view, presenter.$wrapper);
        var elementDimensions = DOMOperationsUtils.getOuterDimensions($element),
            elementDistances = DOMOperationsUtils.calculateOuterDistances(elementDimensions);

        var elementBaseWidth = parseInt($element.width(), 10) + elementDistances.horizontal;
        maxElementCount = parseInt((presenter.$wrapper.width() - (arrowsCount * elementBaseWidth)) / elementBaseWidth, 10) - 4;
        var numberOfElements = presenter.pageCount < maxElementCount ? presenter.pageCount + arrowsCount : maxElementCount + arrowsCount;
        var elementWidth = parseInt(presenter.$wrapper.width() / numberOfElements - elementDistances.horizontal, 10);
        var elementHeight = parseInt(presenter.$wrapper.height() - elementDistances.vertical, 10);
        var horizontalGap = presenter.$wrapper.width() - (elementWidth + elementDistances.horizontal) * numberOfElements;

        removeAllElements();

        generateElements(elementWidth, elementHeight, false, isPreview, horizontalGap);
    }

    presenter.createPreview = function(view, model) {
        presenterLogic(view, model, true);
    };

    presenter.run = function (view, model) {
        presenterLogic(view, model, false);
    };

    return presenter;
}