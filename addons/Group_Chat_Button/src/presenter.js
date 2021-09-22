function AddonGroup_Chat_Button_create() {
    var presenter = function() {};

    var groupChatEventType = "groupChat";

    presenter.DISPLAY_CONTENT_TYPE = {
        NONE: 0,
        TITLE: 1,
        IMAGE: 2,
        BOTH: 3
    };

    presenter.createPreview = function(view, model) {
        presenter.presenterLogic(view, model);
        presenter.setVisibility(true);
    };

    presenter.run = function(view, model){
        presenter.presenterLogic(view, model);
        presenter.setVisibility(presenter.configuration.isVisibleByDefault);
    };

    presenter.getWrapper = function () {
        return presenter.$view.find('.group-chat-button-wrapper');
    };

    presenter.presenterLogic = function (view, model) {
        presenter.addonID = model.ID;
        presenter.$view = $(view);

        presenter.configuration = presenter.validateModel(model);

        presenter.$wrapper = presenter.getWrapper();
        var $element = presenter.createElements(presenter.$wrapper);

        presenter.setElementsDimensions(model, presenter.$wrapper, $element);
        presenter.connectHandlers();
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
        var title = presenter.validateString(model.Title);
        var image = presenter.validateString(model.Image);
        var isVisible = ModelValidationUtils.validateBoolean(model['Is Visible']);

        return {
            displayContent: presenter.determineDisplayContent(title, image),
            title: model.Title,
            image: image.value,
            isVisible: isVisible,
            isVisibleByDefault: isVisible
        };
    };

    presenter.validateString = function (str) {
        var isEmpty = ModelValidationUtils.isStringEmpty(str);

        return {
            isEmpty: isEmpty,
            value: isEmpty ? "" : str
        };
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
        $imageElement.addClass('group-chat-button-image');
        $imageElement.attr('src', presenter.configuration.image);
        $(element).append($imageElement);
    };

    presenter.createTitleElement = function (element) {
        var $titleElement = $(document.createElement('span'));
        $titleElement.addClass('group-chat-button-title');
        $titleElement.html(presenter.configuration.title);
        $(element).append($titleElement);
    };

    presenter.createElements = function (wrapper) {
        var $element = $(document.createElement('div'));
        $element.addClass('group-chat-button-element');

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
        wrapper.append($element);
        return $element;
    };

    presenter.connectHandlers = function () {
        presenter.$wrapper[0].addEventListener('click', presenter.clickHandler);
        presenter.$wrapper[0].addEventListener('touchend', presenter.clickHandler);
    };

    presenter.clickHandler = function (event) {
        event.preventDefault();
        event.stopPropagation();
        presenter.requestGroupChat();
    };

    function handleMouseActions() {
        var $element = presenter.$view.find('div[class*=singlestate-button-element]:first');
        $element.click(presenter.clickHandler);
    }

    presenter.createEventData = function() {
        return {};
    };

    presenter.requestGroupChat = function() {
        if (presenter.playerController == null) {
            console.error("Cannot make a request: no player controller");
            return;
        }
        var data = presenter.createEventData();
        var jsonData = JSON.stringify(data);
        presenter.playerController.sendExternalEvent(groupChatEventType, jsonData);
    };

    presenter.setPlayerController = function(controller) {
        presenter.playerController = controller;
    };

    presenter.show = function() {
        presenter.configuration.isVisible = true;
        presenter.setVisibilityFromConfig();
    };

    presenter.hide = function() {
        presenter.configuration.isVisible = false;
        presenter.setVisibilityFromConfig();
    };

    presenter.setVisibility = function(isVisible) {
        presenter.$view.css("visibility", isVisible ? "visible" : "hidden");
    };

    presenter.setVisibilityFromConfig = function() {
        presenter.setVisibility(presenter.configuration.isVisible);
    };

    presenter.executeCommand = function(name, params) {
        var commands = {
            'requestGroupChat': presenter.requestGroupChat,
            'show': presenter.show,
            'hide': presenter.hide
        };

        Commands.dispatch(commands, name, params, presenter);
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
        if (ModelValidationUtils.isStringEmpty(stateString)) {
            return;
        }
        var state = JSON.parse(stateString);

        presenter.configuration.isVisible = state.isVisible;
        presenter.setVisibilityFromConfig();
    };

    return presenter;
}