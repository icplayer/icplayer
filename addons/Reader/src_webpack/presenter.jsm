import { validateModel } from './validation.jsm';

function AddonReader_create () {
    let presenter = function(){};

    let configuration = {
    };

    let state = {
    };

    presenter.run = function(view, model) {
    };

    presenter.createPreview = function (view, model) {

    };

    presenter.initialize = function (model) {
        configuration = validateModel(model);
    };

    presenter.setShowErrorsMode = function() {
    };

    presenter.setWorkMode = function() {
    };

    presenter.reset = function() {
    };

    presenter.getErrorCount = function() {
    };

    presenter.getMaxScore = function() {
    };

    presenter.getScore = function() {
    };

    presenter.getState = function() {
    };

    presenter.setState = function(state){
    };

    return presenter;
}

window.AddonReader_create = AddonReader_create;