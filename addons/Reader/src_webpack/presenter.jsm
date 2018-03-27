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
        presenter.connectHandlers();
    };

    presenter.createPreview = function (view, model) {

    };

    presenter.initialize = function (view, model) {
        configuration = validateModel(model).value;

        state.manager = new ShowingManager(configuration.list);
        state.imageWrapper = $(view).find(".reader-wrapper")[0];
        state.leftArea = $(view).find(".left.area")[0];
        state.rightArea = $(view).find(".right.area")[0];

        presenter.actualizeElement();
    };

    presenter.connectHandlers = function () {
        state.leftArea.addEventListener('click', presenter.onLeftClick);
        state.rightArea.addEventListener('click', presenter.onRightClick);
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

    presenter.onRightClick = function (event) {
        presenter.next();
        event.stopPropagation();
        event.preventDefault();
    };

    presenter.onLeftClick = function (event) {
        presenter.previous();
        event.stopPropagation();
        event.preventDefault();
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