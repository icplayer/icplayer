function AddonPage_Rating_create() {
    var presenter = function () { };

    var selected_img = [],
    	deselected_img = [];
    
	presenter.isElementSelected = null;
	presenter.isModelError = false;

    presenter.ERROR_CODES = {
        'E_01': "You have to add at least 2 rates.",
        'E_02': "You did not add Selected or/and Deselected image for at least one rate."
    };

    function returnErrorObject(errorCode) {
        return { isError: true, errorCode: errorCode };
    }

    presenter.sanitizeModel = function (model)  {
        if(model.Rates.length <2){
            return returnErrorObject('E_01');
        }

    	for (var model_img=0; model_img < model.Rates.length; model_img++){
    		selected_img[model_img] = model.Rates[model_img].Selected;
			deselected_img[model_img] = model.Rates[model_img].Deselected;
    	}
        if(model.Rates.length > 1) {
            for (var img = 0; img < model.Rates.length; img++) {
                if (!model.Rates[img].Selected || !model.Rates[img].Deselected) {
                    return returnErrorObject('E_02');
                }
            }
        }
        var isVisible = ModelValidationUtils.validateBoolean(model['Is Visible']);
        var buttonCloseVisible = ModelValidationUtils.validateBoolean(model['Close button visible']);

        return {
            isError: false,
            rates: {
                selected: selected_img,
                deselected: deselected_img
            },
            length: model.Rates.length,
            title: model['Title Text'],
            comment: model['Comment Text'],
            isVisible: isVisible,
            closeButtonVisible: buttonCloseVisible
        }
    };

    function submitEventHandler (e) {
        e.stopPropagation();

        presenter.hide();
    }

    function clickEventHandler (e) {
        e.stopPropagation();

    	var $image = $(this),
            index = parseInt($image.data('index'), 10);
   	
        if( $image.attr("name") === "deselected" ) {
        	if(presenter.isElementSelected !== null){
                var $selectedImage = presenter.$view.find('img[data-index="'+ presenter.isElementSelected +'"]');

                $selectedImage.attr({
                    'src': deselected_img[presenter.isElementSelected],
                    'name': "deselected"
                });
            }
              presenter.setSelectedImage(index);
        }
        else {
        	if(presenter.isElementSelected === index){
                $image.attr({
                    "src": deselected_img[index],
                    "name": "deselected"
                });

                presenter.isElementSelected = null;
                presenter.$view.find('.page-rating-submit-button').attr('disabled','disabled');
        	}
        }
    }
    
    function updateTitle (view, title) {
    	if(title){
        	$(view).find('.page-rating-title').html(title);
        }
    }
    
    function updateComment(view, comment, isPreview){
        $(view).find('.page-rating-comment').prepend('<p class="CommentText"></p>');
        $(view).find('.CommentText').html(comment);
        $(view).find('.page-rating-comment').append('<textarea></textarea>');
        $(view).find('textarea').attr('data-name', 'textarea');
        $(view).find('.page-rating-comment').append('<button type="button" class="page-rating-submit-button">Submit</button>');
        $(view).find('.page-rating-submit-button').attr('disabled','disabled');

        if(!isPreview) {
            $(view).find(".page-rating-submit-button").live("click", submitEventHandler);
        }
    }
    
    function updateRates(view, rates, length,isPreview){
        if(rates){
            for (var i=0; i<length; i++){
                var $image = $(document.createElement('img'));

                $image.attr({
                    'src': deselected_img[i],
                    'name': "deselected",
                    'data-index': i
                });

                $(view).find('.page-rating-rates').append($image);
            }
            if(!isPreview){
                $(view).find("img").live("click", clickEventHandler);
            }
        }
    }

    presenter.updateView = function (isPreview){
        if(presenter.configuration.closeButtonVisible){
            presenter.$view.find('.page-rating-wrapper').prepend('<button type="button" class="page-rating-close-button">Close</button>');
            presenter.$view.find(".page-rating-close-button").live("click", submitEventHandler);
        }
        updateTitle(presenter.$view, presenter.configuration.title);
        updateRates(presenter.$view, presenter.configuration.rates, presenter.configuration.length, isPreview);
        updateComment(presenter.$view, presenter.configuration.comment, isPreview);
    };

    presenter.presenterLogic = function (view, model, isPreview) {
    	presenter.$view = $(view);
    	presenter.configuration = presenter.sanitizeModel(model);

        if(presenter.configuration.isError){
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

        presenter.setVisibility(presenter.configuration.isVisible);
        presenter.updateView(isPreview);
    };

    presenter.run = function (view, model) {
        presenter.presenterLogic(view, model, false);
    };
    
    presenter.createPreview = function (view, model) {
        presenter.presenterLogic(view, model, true);
    };

    presenter.setSelectedImage = function(index){
        var $img_RateIndex = presenter.$view.find('img[data-index="'+ index +'"]');
        $img_RateIndex.attr({
            'src': selected_img[index],
            'name': 'selected'
        });

        presenter.isElementSelected = index;

        if(index == null){
            presenter.$view.find('.page-rating-submit-button').attr('disabled', 'disabled');
        }else {
            presenter.$view.find('.page-rating-submit-button').removeAttr('disabled');
        }
    };

    presenter.setCommentValue = function(comment){
        presenter.$view.find('textarea[data-name="textarea"]').text(comment);
    };

    presenter.getCommentValue = function(){
        return presenter.$view.find('textarea[data-name="textarea"]').val();
    };

    presenter.getState = function () {
        if (presenter.configuration.isError) {
            return "";
        }

    	return JSON.stringify({
    		commentValue: presenter.getCommentValue(),
    		isVisible: presenter.configuration.isVisible,
    		selectedItem: presenter.isElementSelected
        });
    };

    presenter.setState = function (state) {
        if (!state) return;

    	var parsedState = JSON.parse(state),
            selectedItem = parsedState.selectedItem;

        presenter.setCommentValue(parsedState.commentValue);
        presenter.setSelectedImage(selectedItem);

    	presenter.configuration.isVisible = parsedState.isVisible;
    	presenter.setVisibility(presenter.configuration.isVisible);
    };
    
    presenter.executeCommand = function (name, params) {
        var commands = {
            'show': presenter.show,
            'hide': presenter.hide
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setVisibility = function (isVisible) {
        presenter.$view.css('visibility', isVisible ? 'visible' : 'hidden');
    };
    
    presenter.hide = function () {
        presenter.setVisibility(false);
        presenter.configuration.isVisible = false;
    };

    presenter.show = function () {
        presenter.setVisibility(true);
        presenter.configuration.isVisible = true;
    };
        
    return presenter;
}