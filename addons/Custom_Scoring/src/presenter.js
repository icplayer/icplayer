function AddonCustom_Scoring_create(){
    var presenter = function(){};

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
    };

    presenter.run = function (view, model) {
        presenter.presenterLogic(view, model);
    };

    presenter.createPreview = function (view, model) {
        presenter.presenterLogic(view, model);
    };

    presenter.ERROR_CODES = {
        'ERR_02': "Invalid max score!"
    };

    function removeAPIMethods() {
        delete presenter.getMaxScore;
        delete presenter.getScore;
        delete presenter.getErrorCount;
        delete presenter.executeCommand;
        delete presenter.evaluate;
        delete presenter.setShowErrorsMode;
        delete presenter.setScore;
        delete presenter.setScoreCommand;
        delete presenter.setErrors;
        delete presenter.setErrorsCommand;
    }

    presenter.presenterLogic = function (view, model) {
        presenter.$view = $(view);
        presenter.model = model;

        presenter.configuration = presenter.parseModel(model);
        if (!presenter.configuration.isValid) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);

            removeAPIMethods();
        }
    };

    presenter.parseModel = function (model) {
        var modelMaxScore = model['Max Score'],
            maxScore = 0;

        if (!ModelValidationUtils.isStringEmpty(modelMaxScore)) {
            var validatedMaxScore = ModelValidationUtils.validatePositiveInteger(modelMaxScore);

            if (!validatedMaxScore.isValid) {
                return { isValid: false, errorCode: 'ERR_02'}
            }

            maxScore = validatedMaxScore.value;
        }

        return {
            isValid: true,
            addonID: model.ID,
            script: model['Script'],
            scoring: {
                maxScore: maxScore,
                score: 0,
                errors: 0
            }
        };
    };

    presenter.setScore = function (score) {
        var validatedScore = ModelValidationUtils.validateIntegerInRange(score, presenter.configuration.scoring.maxScore);

        if (validatedScore.isValid) {
            presenter.configuration.scoring.score = validatedScore.value;
        } else {
            presenter.configuration.scoring.score = 0;
        }
    };

    presenter.setErrors = function (errors) {
        var validatedErrors = ModelValidationUtils.validatePositiveInteger(errors);

        if (validatedErrors.isValid) {
            presenter.configuration.scoring.errors = validatedErrors.value;
        } else {
            presenter.configuration.scoring.errors = 0;
        }
    };

    presenter.getMaxScore = function () {
        return presenter.configuration.scoring.maxScore;
    };

    presenter.getErrorCount = function () {
        presenter.evaluateScript();

        return presenter.configuration.scoring.errors;
    };

    presenter.getScore = function () {
        presenter.evaluateScript();

        return presenter.configuration.scoring.score;
    };

    presenter.evaluateScript = function () {
        if (!presenter.configuration.script) {
            return;
        }

        try {
            eval(presenter.configuration.script);
        } catch (error) {
            Helpers.alertErrorMessage(error, "Custom Score - problem occurred while running scripts!");
        }
    };

    presenter.evaluate = function () {
        presenter.evaluateScript();

        return {
            score: presenter.configuration.scoring.score,
            errors: presenter.configuration.scoring.errors
        };
    };

    presenter.executeCommand = function (name, params) {
        var commands = {
            'evaluate': presenter.evaluate,
            'setScore': presenter.setScoreCommand,
            'setErrors': presenter.setErrorsCommand
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setShowErrorsMode = function () {
        presenter.evaluateScript();
    };

    presenter.setScoreCommand = function (params) {
        presenter.setScore(params[0]);
    };

    presenter.setErrorsCommand = function (params) {
        presenter.setErrors(params[0]);
    };

    presenter.getState = function () {
        return JSON.stringify({
            score: presenter.configuration.scoring.score,
            errors: presenter.configuration.scoring.errors
        });
    };

    presenter.setState = function (state) {
        if (!state) return;

        var parsedState = JSON.parse(state);

        presenter.configuration.scoring.score = parsedState.score;
        presenter.configuration.scoring.errors = parsedState.errors;
    };

    return presenter;
}