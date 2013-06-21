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
        'ERR_01': "Script cannot be empty!",
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
        delete presenter.setErrors;
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
        if (ModelValidationUtils.isStringEmpty(model['Script'])) {
            return { isValid: false, errorCode: 'ERR_01'}
        }

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

    presenter.setScoringValue = function (score, field) {
        var validatedScore = ModelValidationUtils.validateIntegerInRange(score, presenter.configuration.scoring.maxScore);

        if (validatedScore.isValid) {
            presenter.configuration.scoring[field] = validatedScore.value;
        }
    };

    presenter.setScore = function (score) {
        presenter.setScoringValue(score, 'score');
    };

    presenter.setErrors = function (score) {
        presenter.setScoringValue(score, 'errors');
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
            'evaluate': presenter.evaluate
        };

        return Commands.dispatch(commands, name, params, presenter);
    };

    presenter.setShowErrorsMode = function () {
        presenter.evaluateScript();
    };

    return presenter;
}