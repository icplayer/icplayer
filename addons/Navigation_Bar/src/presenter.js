function AddonNavigation_Bar_create() {
    var presenter = function () {
    };

    var NAVIGATION_PAGE = {
        FIRST:0,
        LAST:1,
        PREVIOUS:2,
        NEXT:3,
        OTHER:4
    };

    var DOTTED_SIDE = {
        LEFT:{CSSClass:"dotted-element-left"},
        RIGTH:{CSSClass:"dotted-element-right"}
    };

    var viewContainer;
    var wrapper;

    var presentationController;
    var showNextPrevArrows;
    var hideHomeLastArrows;

    var pageCount;
    var currentIndex;
    var movedFromIndex;
    var maxElementCount;

    presenter.setPlayerController = function (controller) {
        presentationController = controller;
        pageCount = presentationController.getPresentation().getPageCount();
        currentIndex = presentationController.getCurrentPageIndex();
    };

    function getElementDimensions(element) {
        element = $(element);

        return {
            border:{
                top:parseInt(element.css('border-top-width'), 10),
                bottom:parseInt(element.css('border-bottom-width'), 10),
                left:parseInt(element.css('border-left-width'), 10),
                right:parseInt(element.css('border-right-width'), 10)
            },
            margin:{
                top:parseInt(element.css('margin-top'), 10),
                bottom:parseInt(element.css('margin-bottom'), 10),
                left:parseInt(element.css('margin-left'), 10),
                right:parseInt(element.css('margin-right'), 10)
            },
            padding:{
                top:parseInt(element.css('padding-top'), 10),
                bottom:parseInt(element.css('padding-bottom'), 10),
                left:parseInt(element.css('padding-left'), 10),
                right:parseInt(element.css('padding-right'), 10)
            }
        };
    }

    function calculateInnerDistance(elementDimensions) {
        var vertical = elementDimensions.border.top + elementDimensions.border.bottom;
        vertical += elementDimensions.margin.top + elementDimensions.margin.bottom;
        vertical += elementDimensions.padding.top + elementDimensions.padding.top;

        var horizontal = elementDimensions.border.left + elementDimensions.border.right;
        horizontal += elementDimensions.margin.left + elementDimensions.margin.right;
        horizontal += elementDimensions.padding.left + elementDimensions.padding.right;

        return {
            vertical : vertical,
            horizontal : horizontal
        };
    }

    function gotoPage(whereTo, index) {
        var presentation = presentationController.getPresentation();
        var commander = presentationController.getCommands();

        var currentIndex = presentationController.getCurrentPageIndex();
        var pageCount = presentation.getPageCount();
        var gotoIndex;

        switch (whereTo) {
            case NAVIGATION_PAGE.FIRST:
                if (currentIndex !== 0) {
                    gotoIndex = 0;
                }
                break;
            case NAVIGATION_PAGE.LAST:
                if (currentIndex !== (pageCount - 1)) {
                    gotoIndex = pageCount - 1;
                }
                break;
            case NAVIGATION_PAGE.NEXT:
                if (currentIndex !== (pageCount - 1)) {
                    gotoIndex = currentIndex + 1;
                }
                break;
            case NAVIGATION_PAGE.PREVIOUS:
                if (currentIndex !== 0) {
                    gotoIndex = currentIndex - 1;
                }
                break;
            case NAVIGATION_PAGE.OTHER:
                if (currentIndex !== index && (index >= 0) && (index <= (pageCount - 1))) {
                    gotoIndex = index;
                }
                break;
        }

        var pageName = presentation.getPage(gotoIndex).getName();
        commander.gotoPage(pageName);
    }

    function handleMouseActions(dotsLeftIndex, dotsRightIndex, elementWidth, elementHeight, preview, horizontalGap) {
        handleArrowClickActions();
        handleIndexClickActions();
        handleDottedClickActions(dotsLeftIndex, dotsRightIndex, elementWidth, elementHeight, preview, horizontalGap);
        handleHoverAndMouseDownActions();
    }

    function handleArrowClickActions() {
        viewContainer.find('[class*="navigationbar-element-first"]').parent().click(function () {
            gotoPage(NAVIGATION_PAGE.FIRST);

            return false;
        });

        viewContainer.find('[class*="navigationbar-element-previous"]').parent().click(function () {
            gotoPage(NAVIGATION_PAGE.PREVIOUS);

            return false;
        });

        viewContainer.find('[class*="navigationbar-element-next"]').parent().click(function () {
            gotoPage(NAVIGATION_PAGE.NEXT);

            return false;
        });

        viewContainer.find('[class*="navigationbar-element-last"]').parent().click(function () {
            gotoPage(NAVIGATION_PAGE.LAST);

            return false;
        });
    }

    function handleIndexClickActions() {
        viewContainer.find('[class*="navigationbar-indexed-element"]').each(function () {
            var pageIndex = parseInt($(this).html(), 10) - 1;
            var isCurrentPage = $(this).hasClass("navigationbar-element-current");

            $(this).parent().click(function () {
                if (!isCurrentPage) {
                    gotoPage(NAVIGATION_PAGE.OTHER, pageIndex);
                }

                return false;
            });
        });
    }

    function handleDottedClickActions(dotsLeftIndex, dotsRightIndex, elementWidth, elementHeight, preview, horizontalGap) {
        viewContainer.find(".dotted-element-left:first").click(function () {
            if (dotsLeftIndex === undefined || dotsLeftIndex < 0) {
                dotsLeftIndex = 0;
            }

            removeAllElements();
            if (movedFromIndex == undefined) {
                movedFromIndex = currentIndex;
            }
            currentIndex = dotsLeftIndex;

            generateElements(elementWidth, elementHeight, true, preview, horizontalGap);

            return false;
        });

        viewContainer.find(".dotted-element-right:first").click(function () {
            if (dotsRightIndex === undefined || dotsRightIndex > pageCount - 1) {
                dotsRightIndex = pageCount - 1;
            }

            removeAllElements();
            if (movedFromIndex == undefined) {
                movedFromIndex = currentIndex;
            }
            currentIndex = dotsRightIndex;

            generateElements(elementWidth, elementHeight, true, preview, horizontalGap);

            return false;
        });
    }

    function handleHoverAndMouseDownActions() {
        var isHomeInactive = currentIndex === 0;
        var isReportInactive = currentIndex === pageCount - 1;

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


        wrapper.find("span[class^=" + selector + "]").each(function() {
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

        wrapper.find('.navigationbar-element').not(notSelectorsList).each(function() {
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
        viewContainer.find("span[class*=navigationbar-element]").parent().each(function() {
            $(this).remove();
        })
    }

    function generateHomeArrowElement() {
        var isElementInactive = currentIndex === 0;
        var elementStyle = isElementInactive ? "navigationbar-element-first-inactive" : "navigationbar-element-first";

        if (viewContainer.has('[class*="navigationbar-element-first"]').length < 1) {
            var homeElementArrow = '<a title="First page" href="#">' +
                '<span class="' + elementStyle + '">&lt;&lt;</span>' +
                '</a>';

            wrapper.append(homeElementArrow);
        }
    }

    function generatePreviousArrowElement() {
        var homeElement = $(viewContainer).find('[class*="navigationbar-element-first"]:first').parent();
        var isElementInactive = currentIndex === 0;
        var elementStyle = isElementInactive ? "navigationbar-element-previous-inactive" : "navigationbar-element-previous";

        var previousElementArrow = '<a title="Previous page" href="#">' +
            '<span class="' + elementStyle + '">&lt;</span>' +
            '</a>';

        if (hideHomeLastArrows) {
            wrapper.append(previousElementArrow);
        } else {
            homeElement.after(previousElementArrow);
        }

    }

    function generateNextArrowElement() {
        var raportElement = $(viewContainer).find('[class*="navigationbar-element-last"]:first').parent();
        var previousElement = $(viewContainer).find('[class*="navigationbar-element-previous"]:first').parent();
        var isElementInactive = currentIndex === pageCount - 1;
        var elementStyle = isElementInactive ? "navigationbar-element-next-inactive" : "navigationbar-element-next";

        var nextElementArrow = '<a title="Next page" href="#">' +
            '<span class="' + elementStyle + '">&gt;</span>' +
            '</a>';

        previousElement.after(nextElementArrow);
    }

    function generateReportArrowElement() {
        var isElementInactive = currentIndex === pageCount - 1;
        var elementStyle = isElementInactive ? "navigationbar-element-last-inactive" : "navigationbar-element-last";

        if (viewContainer.has('[class*="navigationbar-element-last"]').length < 1) {
            var raportElementArrow = '<a title="Last page" href="#">' +
                '<span class="' + elementStyle + '">&gt;&gt;</span>' +
                '</a>';

            wrapper.append(raportElementArrow);
        }
    }

    function generateHomeAndPreviousArrowsElements() {
        if (!hideHomeLastArrows) {
            generateHomeArrowElement();
        }

        if (showNextPrevArrows) {
            generatePreviousArrowElement();
        }
    }

    function generateRaportAndNextArrowsElements() {
        if (!hideHomeLastArrows) {
            generateReportArrowElement();
        }

        if (showNextPrevArrows) {
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
    function generateIndedexElementStub(index, navigationBarMoved) {
        var isCurrentElement = !navigationBarMoved ? (index - 1) === currentIndex : (index - 1) === movedFromIndex;

        var currentElementStyle = isCurrentElement ? "navigationbar-element-current" : "navigationbar-element";
        var elementTitle = isCurrentElement ? "Current page" : "Page " + index;

        return '<a title="' + elementTitle + '" href="#">' +
            '<span class="' + currentElementStyle + ' navigationbar-indexed-element' +'">' + index + '</span>' +
            '</a>';
    }

    function generateIndexedElements(navigationBarMoved) {
        var firstElementSelector = showNextPrevArrows ? '[class*="navigationbar-element-previous"]' : '[class*="navigationbar-element-first"]';
        var firstElement = viewContainer.find(firstElementSelector).parent();

        var element; // Works as temporary indexed element
        var dottedElement; // Works as temporary dotted element

        var dotsLeftTargetIndex;
        var dotsRightTargetIndex;
        var n = 0;
        var nthChildCount = 0;
        if (!hideHomeLastArrows) {
            nthChildCount++;
        }
        if (showNextPrevArrows) {
            nthChildCount++;
        }

        if (maxElementCount >= pageCount) { // All pages will be displayed
            for (n = 1; n <= pageCount; n++) {
                element = generateIndedexElementStub(n, navigationBarMoved);

                if (hideHomeLastArrows && !showNextPrevArrows && n === 1) {
                    wrapper.append(element);
                } else {
                    $(firstElement).after(element);
                }

                nthChildCount++;
                firstElement = $(wrapper).find('a:nth-child(' + nthChildCount + ')');
            }
        } else {
            if (currentIndex < maxElementCount - 1) { // -1 for dotted element
                for (n = 0; n < maxElementCount - 1; n++) {
                    element = generateIndedexElementStub(n + 1, navigationBarMoved);

                    if (hideHomeLastArrows && !showNextPrevArrows && n === 0) {
                        wrapper.append(element);
                    } else {
                        $(firstElement).after(element);
                    }

                    nthChildCount++;
                    firstElement = $(wrapper).find('a:nth-child(' + nthChildCount + ')');
                }

                // Dots are displayed on the right
                dotsRightTargetIndex = maxElementCount - 1;
                firstElement.after(generateDottedElement(DOTTED_SIDE.RIGTH));
            } else if (currentIndex > (pageCount - maxElementCount)) {
                // Dots are displayed on the left -> -1 to max element count
                dotsLeftTargetIndex = (pageCount - 1) - (maxElementCount - 2) - 1;
                dottedElement = generateDottedElement(DOTTED_SIDE.LEFT);

                if (hideHomeLastArrows && !showNextPrevArrows) {
                    wrapper.append(dottedElement);
                } else {
                    firstElement.after(dottedElement);
                }

                nthChildCount++;
                firstElement = $(wrapper).find('a:nth-child(' + nthChildCount + ')');

                for (n = pageCount - maxElementCount + 1; n < pageCount; n++) {
                    element = generateIndedexElementStub(n + 1, navigationBarMoved);
                    $(firstElement).after(element);

                    nthChildCount++;
                    firstElement = $(wrapper).find('a:nth-child(' + nthChildCount + ')');
                }
            } else {
                var numberOfElement = maxElementCount - 2;

                var temp = currentIndex - (numberOfElement + 1);
                var multiplier = parseInt(temp / numberOfElement, 10);
                var startIndex = (numberOfElement + 1) + multiplier * numberOfElement;

                dotsLeftTargetIndex = startIndex - 1;
                dottedElement = generateDottedElement(DOTTED_SIDE.LEFT);

                if (hideHomeLastArrows && !showNextPrevArrows) {
                    wrapper.append(dottedElement);
                } else {
                    firstElement.after(dottedElement);
                }

                nthChildCount++;
                firstElement = $(wrapper).find('a:nth-child(' + nthChildCount + ')');

                for (n = 0; n < numberOfElement; n++) {
                    var indexedElement = generateIndedexElementStub(startIndex + 1 + n, navigationBarMoved);
                    firstElement.after(indexedElement);

                    nthChildCount++;
                    firstElement = $(wrapper).find('a:nth-child(' + nthChildCount + ')');
                }


                dotsRightTargetIndex = startIndex  + numberOfElement;
                firstElement.after(generateDottedElement(DOTTED_SIDE.RIGTH));
            }
        }

        return {
            leftIndex:dotsLeftTargetIndex,
            rightIndex:dotsRightTargetIndex
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

        if (wrapper.css('direction') === 'rtl') {
            reorderElements(dotsIndexes, elementWidth, elementHeight, preview, horizontalGap);
        }

        viewContainer.find("span[class^=navigationbar-element]").each(function () {
            var width = $(this).hasClass('navigationbar-element-last') ? elementWidth + horizontalGap : elementWidth;
            $(this).width(width + 'px');
            $(this).height(elementHeight + 'px');
            $(this).css('line-height', elementHeight + 'px');
        });

        return dotsIndexes;
    }

    function reorderElements(dotsIndexes, elementWidth, elementHeight, preview, horizontalGap) {
        var elements = [];

        $(wrapper).children('a').each(function () {
            elements.push($(this));
            $(this).remove();
        });

        for (var i = elements.length - 1; i >= 0; i--) {
            wrapper.append(elements[i]);
        }

        if (!preview) {
            handleMouseActions(dotsIndexes.leftIndex, dotsIndexes.rightIndex, elementWidth, elementHeight, preview, horizontalGap);
        }
    }

    function presenterLogic(view, model, preview) {
        viewContainer = $(view);
        wrapper = viewContainer.find('.navigationbar-wrapper:first');
        var element = viewContainer.find('[class*="navigationbar-element-first"]:first');

        showNextPrevArrows = model.ShowNextPrevArrows === 'True';
        hideHomeLastArrows = model.HideHomeLastArrows === 'True';

        var arrowsCount = 0;
        if (!hideHomeLastArrows) {
            arrowsCount += 2;
        }
        if (showNextPrevArrows) {
            arrowsCount += 2;
        }

        var wrapperDimensions = getElementDimensions(wrapper);
        var wrapperDistances = calculateInnerDistance(wrapperDimensions);

        var elementDimensions = getElementDimensions(element);
        var elementDistances = calculateInnerDistance(elementDimensions);

        wrapper.height(viewContainer.height() - wrapperDistances.vertical);
        wrapper.width(viewContainer.width() - wrapperDistances.horizontal);

        var elementBaseWidth = parseInt(element.width(), 10) + elementDistances.horizontal;
        maxElementCount = parseInt((wrapper.width() - (arrowsCount * elementBaseWidth)) / elementBaseWidth, 10) - 4;
        var numberOfElements = pageCount < maxElementCount ? pageCount + arrowsCount : maxElementCount + arrowsCount;
        var elementWidth = parseInt(wrapper.width() / numberOfElements - elementDistances.horizontal, 10);
        var elementHeight = parseInt(wrapper.height() - elementDistances.vertical, 10);
        var horizontalGap = model.Width - (elementWidth + elementDistances.horizontal) * numberOfElements;

        removeAllElements();

        generateElements(elementWidth, elementHeight, false, preview, horizontalGap);
    }

    presenter.createPreview = function(view, model) {
        currentIndex = 0;
        pageCount = 21;

        presenterLogic(view, model, true);
    };

    presenter.run = function (view, model) {
        presenterLogic(view, model, false);
    };

    return presenter;
}