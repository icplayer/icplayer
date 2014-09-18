function AddonSmart_Pen_Data_create() {

    var presenter = function(){};

    presenter.run = function(view, model) {
        //view.innerHTML = "run";
    }

    presenter.createPreview = function(view, model) {
        //view.innerHTML = "preview";
    }

    presenter.setShowErrorsMode = function(){
        //element.innerHTML = 'setShowErrorsMode';
    }

    presenter.setWorkMode = function(){
        //element.innerHTML = 'setWorkMode';
    }

    presenter.reset = function(){
        //element.innerHTML = 'Reset';
    }

    //presenter.getErrorCount = function() { }
    //presenter.getMaxScore = function() { }
    //presenter.getScore = function() { }
    //presenter.getState = function(){ }
    //presenter.setState = function(state){ }

    return presenter;
}