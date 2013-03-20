function AddonPage_Counter_create() {
    var presenter = function() { };
    var presentationController;

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

    function presenterLogic(view, currentPageIndex, pageCount) {
        var viewContainer = $(view);
        var addonText = currentPageIndex + ' / ' + pageCount;
        var element = viewContainer.find(".pagecounter:first")[0];

        var dimensions = getElementDimensions(element);
        var distances = calculateInnerDistance(dimensions);

        $(element).width(viewContainer.width() - distances.horizontal);
        $(element).height(viewContainer.height() - distances.vertical);

        // This asures us that text will be center vertically
        $(element).css('line-height', $(element).height() + 'px');
        $(element).html(addonText);
    }

    presenter.setPlayerController = function(controller) {
        presentationController = controller;
    };

    presenter.createPreview = function(view, model) {
        presenterLogic(view, 1, 5);
    }

    presenter.run = function(view, model) {
        // Page index is counted from 0!
        var currentPageIndex = presentationController.getCurrentPageIndex() + 1;
        var pageCount = presentationController.getPresentation().getPageCount();

        presenterLogic(view, currentPageIndex, pageCount);
    };

    return presenter;
}