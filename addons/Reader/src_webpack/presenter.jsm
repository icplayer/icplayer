import { validateModel } from './validation.jsm';
import { ShowingManager } from './manager.jsm';
import { Viewer } from './viewer.jsm';

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

        state.imageWrapper = $(view).find(".reader-wrapper")[0];
        state.leftArea = $(view).find(".left.area")[0];
        state.rightArea = $(view).find(".right.area")[0];


        let viewerConfig = {
            width: configuration.Width,
            height: configuration.Height
        };

        state.viewer = new Viewer(state.imageWrapper, configuration.list, viewerConfig);

    };

    presenter.connectHandlers = function () {
        if (MobileUtils.isEventSupported('touchstart')) {
            state.leftArea.addEventListener('touchstart', presenter.onLeftClick);
            state.rightArea.addEventListener('touchstart', presenter.onRightClick);
        } else {
            state.leftArea.addEventListener('click', presenter.onLeftClick);
            state.rightArea.addEventListener('click', presenter.onRightClick);
        }

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
        state.viewer.next();
    };

    presenter.previous = function () {
        state.viewer.previous();
    };

    return presenter;
}

window.AddonReader_create = AddonReader_create;