function AddonAnimated_Page_Progress_create() {
    var presenter = function () { };

    presenter.ERROR_CODES = {
        'E_01': "You have to add at least 2 rates.",
        'E_02': "You did not add Selected or/and Deselected image for at least one rate."
    };

    function returnErrorObject(errorCode) {
        return { isError: true, errorCode: errorCode };
    }

    presenter.sanitizeModel = function (model)  {

        return {

        }
    };

    presenter.presenterLogic = function (view, model, isPreview) {
    	presenter.$view = $(view);
    	presenter.configuration = presenter.sanitizeModel(model);

        if(presenter.configuration.isError){
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
            return;
        }

    };

    presenter.run = function (view, model) {
        presenter.presenterLogic(view, model, false);
    };
    
    presenter.createPreview = function (view, model) {
        presenter.presenterLogic(view, model, true);
    };


    presenter.getState = function () {
        if (presenter.configuration.isError) {
            return "";
        }

    	return JSON.stringify({
        });
    };

    presenter.setState = function (state) {
        if (!state) return;

    	var parsedState = JSON.parse(state);
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