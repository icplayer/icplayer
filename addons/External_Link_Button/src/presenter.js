function AddonExternal_Link_Button_create() {
    var presenter = function() {};
    
    presenter.ERROR_CODES = {
    	'M01': 'URL property cannot be empty!'
    };
    
    presenter.DISPLAY_CONTENT_TYPE = {
        NONE: 0,
        TITLE: 1,
        IMAGE: 2,
        BOTH: 3
    };

    presenter.playerController = undefined;

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
    };

    presenter.setElementsDimensions = function (model, wrapper, element) {
        var viewDimensions = DOMOperationsUtils.getOuterDimensions(presenter.$view);
        var viewDistances = DOMOperationsUtils.calculateOuterDistances(viewDimensions);

        presenter.$view.css({
            width:(model.Width - viewDistances.horizontal) + 'px',
            height:(model.Height - viewDistances.vertical) + 'px'
        });

        DOMOperationsUtils.setReducedSize(presenter.$view, wrapper);
        DOMOperationsUtils.setReducedSize(wrapper, element);
    };

    presenter.createImageElement = function (element) {
        var $imageElement = $(document.createElement('img'));

        $imageElement.addClass('external-link-button-image');
        $imageElement.attr('src', presenter.configuration.image);

        $(element).append($imageElement);
    };
    
    presenter.createTitleElement = function (element) {
        var $titleElement = $(document.createElement('span'));

        $titleElement.addClass('external-link-button-title');
        $titleElement.html(presenter.configuration.title);

        $(element).append($titleElement);
    };

    presenter.createElements = function (wrapper) {
        var $ahref = $(document.createElement('a'));
        $ahref.attr('href',presenter.configuration.URI);

        if (presenter.configuration.targetType == 'Blank'){
            $ahref.attr('target','_blank');
        } else if (presenter.configuration.targetType == 'Top') {
            $ahref.attr('target','_top');
        } else {
            $ahref.attr('target','_blank');
        }

        $ahref.click(function (event) { event.stopPropagation(); });

        var $element = $(document.createElement('div'));
        $element.addClass('external-link-button-element');
        
        switch (presenter.configuration.displayContent) {
	        case presenter.DISPLAY_CONTENT_TYPE.TITLE:
	            presenter.createTitleElement($element);
	            break;
	        case presenter.DISPLAY_CONTENT_TYPE.IMAGE:
	            presenter.createImageElement($element);
	            break;
	        case presenter.DISPLAY_CONTENT_TYPE.BOTH:
	            presenter.createImageElement($element);
	            presenter.createTitleElement($element);
	            break;
        }
        
        $ahref.append($element);
        wrapper.append($ahref);

        return $element;
    };
    
    presenter.getWrapper = function () {
    	return presenter.$view.find('.external-link-button-wrapper');
    };

    presenter.isLocalResource = function (uri) {
        var regex = new RegExp('^\.\.\/resources\/[0-9]*\.[a-zA-Z]+$');

        return regex.test(uri);
    };

    presenter.fixLocalResourceURI = function () {
        var currentPageIndex = presenter.playerController.getCurrentPageIndex(),
            currentPage = presenter.playerController.getPresentation().getPage(currentPageIndex),
            pageBaseURL = currentPage.getBaseURL();

        presenter.configuration.URI = pageBaseURL + presenter.configuration.URI;
    };

    presenter.presenterLogic = function (view, model, isPreview) {
        presenter.addonID = model.ID;
        presenter.$view = $(view);

        presenter.configuration = presenter.validateModel(model);
        if (!presenter.configuration.isValid) {
        	DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
        	return;
        }

        if (presenter.isLocalResource(presenter.configuration.URI)) {
            presenter.fixLocalResourceURI();
        }

        var $wrapper = presenter.getWrapper();
        var $element = presenter.createElements($wrapper);
        
        presenter.setElementsDimensions(model, $wrapper, $element);
        
        presenter.setVisibility(presenter.configuration.isVisibleByDefault || isPreview);
    };

    presenter.createPreview = function(view, model) {
    	presenter.presenterLogic(view, model, true);
    };

    presenter.run = function(view, model){
    	presenter.presenterLogic(view, model, false);
    };

    presenter.validateString = function (imageSrc) {
        var isEmpty = ModelValidationUtils.isStringEmpty(imageSrc);

        return {
            isEmpty: isEmpty,
            value: isEmpty ? "" : imageSrc
        };
    };

    presenter.determineDisplayContent = function(title, image) {
        var displayContent = presenter.DISPLAY_CONTENT_TYPE.NONE;

        if (!title.isEmpty && image.isEmpty) {
            displayContent = presenter.DISPLAY_CONTENT_TYPE.TITLE;
        } else if (title.isEmpty && !image.isEmpty) {
            displayContent = presenter.DISPLAY_CONTENT_TYPE.IMAGE;
        } else if (!title.isEmpty && !image.isEmpty) {
            displayContent = presenter.DISPLAY_CONTENT_TYPE.BOTH;
        }

        return displayContent;
    };
    
    presenter.validateModel = function (model) {
    	if (ModelValidationUtils.isStringEmpty(model.URI)) {
    		return { isValid: false, errorCode: 'M01' };
    	}
    	
    	var image = presenter.validateString(model.Image);
    	var title = presenter.validateString(model.Title);
    	
        var isVisible = ModelValidationUtils.validateBoolean(model['Is Visible']);
        
        return {
        	displayContent: presenter.determineDisplayContent(title, image),
        	isValid: true,
            title: model.Title,
            image: image.value,
            URI: model.URI,
            isVisible: isVisible,
            isVisibleByDefault: isVisible,
            targetType: model['targetType']
        };
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide
        };

        Commands.dispatch(commands, name, params, presenter);
    };    
    
    presenter.show = function() {
        presenter.configuration.isVisible = true;
        presenter.setVisibilityFromConfig();
    };

    presenter.hide = function() {
        presenter.configuration.isVisible = false;
        presenter.setVisibilityFromConfig();
    };
    
    presenter.setVisibilityFromConfig = function() {
    	presenter.setVisibility(presenter.configuration.isVisible);
    };

    presenter.reset = function() {
    	presenter.configuration.isVisible = presenter.configuration.isVisibleByDefault;
    	presenter.setVisibilityFromConfig();
    };
    
    presenter.getState = function() {
    	return JSON.stringify({
    		isVisible: presenter.configuration.isVisible
    	});
    };
    
    presenter.setState = function(stateString) {
        if (ModelValidationUtils.isStringEmpty(stateString)) return;

        var state = JSON.parse(stateString);

        presenter.configuration.isVisible = state.isVisible;
        presenter.setVisibilityFromConfig();
    };

    return presenter;
}