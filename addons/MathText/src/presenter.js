function AddonMathText_create() {

    var presenter = function() {};
    presenter.isShowAnswers = false;

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
    };

    presenter.run = function (view, model) {
        console.log('test mat')
        presenter.presenterLogic(view, model);
    };

    presenter.setPlayerController = function AddonMathText_setPlayerController(playerController) {
        presenter.playerController = playerController;
        presenter.eventBus = playerController.getEventBus();
    };

    presenter.createPreview = function (view, model) {
        var $view = $(view);
        $view.text(model['text']);
    };

    presenter.presenterLogic = function (view, model) {
        presenter.view = view;
        presenter.$view = $(view);
        presenter.model = model;

        presenter.editor = window.com.wiris.jsEditor.JsEditor.newInstance({});

        var wrapper = view.getElementsByClassName('wrapper');
        presenter.editor.insertInto(wrapper[0]);
        // presenter.$view.find('.wrapper').text(model['text']);
        // editor.setMathML(model['text']);

        presenter.configuration = {
            correctAnswer: model['text']
        };
        presenter.isShowAnswers = false;

        if (presenter.eventBus) {
            presenter.eventBus.addEventListener('ShowAnswers', this);
            presenter.eventBus.addEventListener('HideAnswers', this);
        }
    };

    presenter.showAnswers = function () {
        if (presenter.isShowAnswers) {
            return false;
        }

        presenter.isShowAnswers = true;

        presenter.currentUserText = presenter.editor.getMathML();
        presenter.editor.setMathML(presenter.configuration.correctAnswer);
    };

    presenter.hideAnswers = function () {
        if (!presenter.isShowAnswers) {
            return false;
        }

        presenter.isShowAnswers = false;

        presenter.editor.setMathML(presenter.currentUserText);
    };


    presenter.onEventReceived = function (eventName) {
        if (eventName == "ShowAnswers") {
            presenter.showAnswers();
        }
        if (eventName == "HideAnswers") {
            presenter.hideAnswers();
        }
    };

    presenter.setShowErrorsMode = function () {
        if (presenter.currentUserText === presenter.configuration.correctAnswer) {
            presenter.view.classList.add('correct');
        } else {
            presenter.view.classList.add('wrong');
        }
    };

     presenter.setWorkMode = function () {
        presenter.view.classList.remove('correct');
        presenter.view.classList.remove('wrong');
    };


    return presenter;
}