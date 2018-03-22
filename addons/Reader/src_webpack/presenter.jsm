import { validateModel } from './validation.jsm';
import { ShowingManager } from './manager.jsm';

function AddonReader_create () {
    let presenter = function(){};

    /**
     * @type {{imagesList: Array[string]}}
     */
    let configuration = {
        imagesList: []
    };

    let state = {
        manager: null,
        imageWrapper: null
    };

    presenter.run = function(view, model) {
        presenter.initialize(view, model);
    };

    presenter.createPreview = function (view, model) {

    };

    presenter.initialize = function (view, model) {
        configuration = validateModel(model);

        state.manager = new ShowingManager(configuration.imagesList);
        state.imageWrapper = $(view).find(".reader-wrapper")[0];
        presenter.actualizeElement();
    };

    presenter.actualizeElement = function () {
        state.imageWrapper.innerHTML = '';
        state.imageWrapper.appendChild(state.manager.getActualElement());
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

    presenter.next = function () {
        state.manager.next();
        presenter.actualizeElement();
    };

    presenter.previous = function () {
        state.manager.previous();
        presenter.actualizeElement();
    };

    return presenter;
}

window.AddonReader_create = AddonReader_create;