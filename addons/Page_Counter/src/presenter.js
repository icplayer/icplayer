function AddonPage_Counter_create() {
    var presenter = function() { };
    var presentationController;

    function getLanguage(model) {
    	if (model['Numericals'] == 'Eastern Arabic') {
    		return Internationalization.EASTERN_ARABIC;
    	}
    	if (model['Numericals'] == 'Perso-Arabic') {
    		return Internationalization.PERSO_ARABIC;
    	}
    	return Internationalization.WESTERN_ARABIC;
    }

    function presenterLogic(view, model, currentPageIndex, pageCount) {
        var viewContainer = $(view);
        var element = viewContainer.find(".pagecounter:first")[0];
        DOMOperationsUtils.setReducedSize(view, element);

        var language = getLanguage(model);
        var addonText = Internationalization.translate(currentPageIndex, language) + ' / ' + Internationalization.translate(pageCount, language);

        // This asures us that text will be center vertically
        $(element).css('line-height', $(element).height() + 'px');
        $(element).html(addonText);
    }

    presenter.setPlayerController = function(controller) {
        presentationController = controller;
    };

    presenter.createPreview = function(view, model) {
        presenterLogic(view, model, 1, 5);
    }

    presenter.run = function(view, model) {
        // Page index is counted from 0!
        var currentPageIndex = presentationController.getCurrentPageIndex() + 1;
        var pageCount = presentationController.getPresentation().getPageCount();

        presenterLogic(view, model, currentPageIndex, pageCount);
    };

    return presenter;
}