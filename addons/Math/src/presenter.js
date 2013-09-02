function AddonMath_create() {
    var presenter = function () {};

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
    };

    presenter.run = function (view, model) {
        presenter.presenterLogic(view, model);
        presenter.$view.css('visibility', 'hidden');
    };

    presenter.createPreview = function (view, model) {
        presenter.presenterLogic(view, model);
    };

    presenter.presenterLogic = function (view, model) {
        presenter.$view = $(view);
        presenter.model = model;

        presenter.configuration = presenter.convertModel(model);
        if (presenter.configuration.isError) {
            DOMOperationsUtils.showErrorMessage(view, presenter.ERROR_CODES, presenter.configuration.errorCode);
        }
    };

    presenter.ERROR_CODES = {
        'CV_01': "Missing assignment operator!",
        'CV_02': "Missing gap ID!",
        'CV_03': "Unused variable!",
        'CV_04': "Decimal separator and thousand separator are the same!"
    };

    presenter.convertVariables = function (variables, expressions) {
        if (ModelValidationUtils.isStringEmpty(variables)) return { isError: false, variables: [] };

        var variablesArray = [], splittedVariables = variables.split('\n'), i, j, expVariables = [];

        for (i = 0; i < splittedVariables.length; i++) {
            var line = splittedVariables[i];
            if (line.indexOf('=') === -1) return { isError: true, errorCode: 'CV_01' };

            var splittedLine = line.split('=');
            if (splittedLine.length !== 2 || splittedLine[1].length === 0) return { isError: true, errorCode: 'CV_02' };

            variablesArray.push({
                name: splittedLine[0].trim(),
                value: splittedLine[1].trim()
            });
        }

        for (i = 0; i < expressions.length; i++) {
            var variablesInExp = presenter.selectVariablesFromExpression(expressions[i], variablesArray);
            for (j = 0; j < variablesInExp.length; j++) {
                expVariables.push(variablesInExp[j]);
            }
        }

        for (i = 0; i < variablesArray.length; i++) {
            if (expVariables.indexOf(variablesArray[i].name) === -1) return { isError: true, errorCode: 'CV_03' };
        }

        return { isError: false, variables: variablesArray };
    };

    presenter.convertExpressions = function (expressions) {
        var expressionsArray = [], splittedExpressions = expressions.split('\n');

        for (var i = 0; i < splittedExpressions.length; i++) {
            expressionsArray.push(splittedExpressions[i]);
        }

        return expressionsArray;
    };

    presenter.convertModel = function (model) {
        var expressions = presenter.convertExpressions(model.Expressions);

        var convertedVariables = presenter.convertVariables(model.Variables, expressions);
        if (convertedVariables.isError) {
            return { isError: true, errorCode: convertedVariables.errorCode };
        }

        var decimalSeparator = model["Decimal separator"],
            isDecimalSeparatorSet = !ModelValidationUtils.isStringEmpty(decimalSeparator);

        var thousandSeparator = model["Thousand separator"],
            isThousandSeparatorSet = !ModelValidationUtils.isStringEmpty(thousandSeparator);

        if (decimalSeparator == thousandSeparator && isDecimalSeparatorSet && isThousandSeparatorSet) {
            return { isError: true, errorCode: 'CV_04' };
        }

        var separators =  {
            decimalSeparator: isDecimalSeparatorSet ? decimalSeparator : undefined,
            isDecimalSeparatorSet: isDecimalSeparatorSet,
            thousandSeparator: isThousandSeparatorSet ? thousandSeparator : undefined,
            isThousandSeparatorSet: isThousandSeparatorSet
        };

        return {
            isError: false,
            variables: convertedVariables.variables,
            expressions: expressions,
            onCorrectEvent: model.onCorrect,
            onIncorrectEvent: model.onIncorrect,
            onPartialEvent: model.onPartiallyCompleted,
            separators: separators
        };
    };

    presenter.evaluateExpression = function (expression, variables, separators) {
        var i, expressionRunner = {
            run: function (expression, variables) {
                presenter.assignVariablesToObject(this, variables);
                eval(expression);
                return this.result;
            }
        };

        try {
            var convertedVariables = [];
            for (i = 0; i < variables.length; i++) {
                var convertedVariable = presenter.convertVariable(variables[i].value, separators);
                if (convertedVariable === undefined) return { isValid: false, result: getAlertMessage(variables[i]) };

                convertedVariables.push({
                    name: variables[i].name,
                    value: convertedVariable
                });
            }

            var convertedExpression = presenter.convertExpression(expression, convertedVariables);
            return {isValid: true, result: expressionRunner.run(convertedExpression, convertedVariables)};
        } catch (exception) {
            return {isValid: true, result: false};
        }
    };

    presenter.selectVariablesFromExpression = function (expression, variables) {
        var presentVariables = [], tempVariables = [], i, j;

        for (i = 0; i < variables.length; i++) {
            if (expression.indexOf(variables[i].name) !== -1) {
                tempVariables.push({
                    name: variables[i].name,
                    index: expression.indexOf(variables[i].name)
                });
            }
        }

        for (i = 0; i < tempVariables.length; i++) {
            if (!tempVariables[i]) continue;

            var variable = tempVariables[i];
            for (j = 0; j < tempVariables.length; j++) {
                if (i === j || tempVariables[j] === undefined) continue;

                if (variable.index === tempVariables[j].index) {
                    if (variable.name.length < tempVariables[j].name.length) {
                        delete tempVariables[i];
                    } else {
                        delete tempVariables[j];
                    }
                }
            }
        }

        for (i = 0; i < tempVariables.length; i++) {
            if (tempVariables[i]) presentVariables.push(tempVariables[i].name);
        }

        return presentVariables;
    };

    presenter.evaluateAllExpressions = function (expressions, variables, separators) {

        var results = [], i, overall = true, evaluationResult;

        for (i = 0; i < expressions.length; i++) {
            evaluationResult = presenter.evaluateExpression(expressions[i], variables, separators);
            if (!evaluationResult.isValid) {
                return { isError: true, errorMessage: evaluationResult.result };
            }

            results.push(evaluationResult.result);
        }

        for (i = 0; i < results.length; i++) {
            if (!results[i]) {
                overall = false;
            }
        }

        return { overall: overall, isError: false };
    };

    presenter.getModule = function (moduleID) {
        return presenter.playerController.getModule(moduleID);
    };

    function isNumber (number) {
        return !isNaN(parseFloat(number)) && isFinite(number);
    }

    presenter.convertVariable = function (gapIdentifier, separators) {
        var decodedReference = presenter.decodeModuleReference(gapIdentifier);

        if (!decodedReference.isValid) return undefined;

        try {
            var textModule = presenter.getModule(decodedReference.moduleID);
            if (!textModule) return undefined;

            var gapText = textModule.getGapValue(decodedReference.gapIndex);
            if (gapText == "[error]") return undefined;

            if (separators.isThousandSeparatorSet) {
                gapText = StringUtils.replaceAll(gapText, separators.thousandSeparator, '');
            }

            if (separators.isDecimalSeparatorSet) {
                gapText = gapText.replace(separators.decimalSeparator, '.');
            }

            return isNumber(gapText) ? Number(gapText) : gapText;
        } catch (exception) {
            return undefined;
        }
    };

    presenter.convertExpression = function (expression, variables) {
        var convertedExpression = 'this.result = ' + expression,
            expressionVariables = presenter.selectVariablesFromExpression(expression, variables), i;

        for (i = 0; i < expressionVariables.length; i++) {
            convertedExpression = presenter.replaceVariableNameWithReference(convertedExpression, expressionVariables[i]);
        }

        return convertedExpression;
    };

    presenter.findTextOccurrences = function (expression, variable) {
        var indexes = [], tempExpression = expression, offset = 0;

        while (tempExpression.indexOf(variable) !== -1) {
            var indexOf = tempExpression.indexOf(variable);
            indexes.push(indexOf + offset);
            offset += indexOf + variable.length;

            tempExpression = tempExpression.substring(indexOf + variable.length);
        }

        return indexes;
    };

    presenter.replaceVariableNameWithReference = function (expression, variable) {
        var prefix = "this.variables['";
        var indexes = presenter.findTextOccurrences(expression, variable);
        var fixedExpression = expression.substring(0, indexes[0]);

        for (var i = 0; i < indexes.length - 1; i++) {
            fixedExpression += prefix + variable + "']";
            fixedExpression += expression.substring(indexes[i] + variable.length, indexes[i + 1]);
        }

        fixedExpression += prefix + variable + "']";
        fixedExpression += expression.substring(indexes[indexes.length - 1] + variable.length);

        return fixedExpression;
    };

    presenter.assignVariablesToObject = function (object, variables) {
        object.variables = {};

        for (var i = 0; i < variables.length; i++) {
            object.variables[variables[i].name] = variables[i].value;
        }
    };

    presenter.decodeModuleReference = function (reference) {
        var dotIndex = reference.lastIndexOf('.');
        if (dotIndex === -1) return { isValid: false };

        var moduleID = reference.substring(0, dotIndex);
        if (ModelValidationUtils.isStringEmpty(moduleID)) return { isValid: false };

        var gapIndex = reference.substring(dotIndex + 1);
        if (ModelValidationUtils.isStringEmpty(gapIndex)) return { isValid: false };

        return { isValid: true, moduleID: moduleID, gapIndex: gapIndex };
    };

    presenter.getModuleReferenceFromVariable = function (variables, variableName) {
        for (var i = 0, length = variables.length; i < length; i++) {
            if (variables[i].name === variableName) return variables[i].value;
        }
    };

    presenter.markGapsCorrectness = function (variables, overall) {
        var i, decodedReference, length, textModule;

        for (i = 0, length = variables.length; i < length; i++) {
            decodedReference = presenter.decodeModuleReference(variables[i].value);
            textModule = presenter.playerController.getModule(decodedReference.moduleID);

            if (overall) {
                textModule.markGapAsCorrect(decodedReference.gapIndex);
            } else {
                textModule.markGapAsWrong(decodedReference.gapIndex);
            }
        }
    };

    presenter.setShowErrorsMode = function () {
        presenter.isErrorMode = true;

        var variables = presenter.configuration.variables,
            emptyGaps = presenter.getEmptyGaps(variables);

        if (!emptyGaps.isValid) {
            alert(emptyGaps.errorMessage);
            return;
        }

        if (emptyGaps.gaps.length !== 0) return;

        var separators = presenter.configuration.separators,
            expressions = presenter.configuration.expressions,
            evaluationResult = presenter.evaluateAllExpressions(expressions, variables, separators);

        presenter.markGapsCorrectness(presenter.configuration.variables, evaluationResult.overall);
    };

    presenter.setWorkMode = function () {
        presenter.isErrorMode = false;
    };

    presenter.executeEventCode = function (eventCode) {
        presenter.playerController.getCommands().executeEventCode(eventCode);
    };

    presenter.markGapsEmptiness = function (gaps) {
        var moduleReference, decodedReference, textModule, i, length;

        for (i = 0, length = gaps.length; i < length; i++) {
            moduleReference = presenter.getModuleReferenceFromVariable(presenter.configuration.variables, gaps[i]);
            decodedReference = presenter.decodeModuleReference(moduleReference);
            textModule = presenter.playerController.getModule(decodedReference.moduleID);
            textModule.markGapAsEmpty(decodedReference.gapIndex);
        }
    };

    presenter.evaluate = function () {
        if (presenter.isErrorMode) return;

        var emptyGaps = presenter.getEmptyGaps(presenter.configuration.variables);
        if (!emptyGaps.isValid) {
            alert(emptyGaps.errorMessage);
            return;
        }

        if (emptyGaps.gaps.length !== 0) {
            presenter.executeEventCode(presenter.configuration.onPartialEvent);
            presenter.markGapsEmptiness(emptyGaps.gaps);
        } else {
            var separators = presenter.configuration.separators,
                evaluationResult = presenter.evaluateAllExpressions(presenter.configuration.expressions,
                                                                    presenter.configuration.variables, separators),
                eventCode = evaluationResult.overall ? presenter.configuration.onCorrectEvent : presenter.configuration.onIncorrectEvent;
            presenter.executeEventCode(eventCode);
        }
    };

    presenter.getScore = function () {
        var variables = presenter.configuration.variables,
            emptyGaps = presenter.getEmptyGaps(variables);
        if (!emptyGaps.isValid || emptyGaps.gaps.length !== 0) return 0;

        var separators = presenter.configuration.separators,
            expressions = presenter.configuration.expressions,
            evaluationResult = presenter.evaluateAllExpressions(expressions, variables, separators);
        if (evaluationResult.isError) return;

        return evaluationResult.overall ? presenter.getMaxScore() : 0;
    };

    presenter.getErrorCount = function () {
        var variables = presenter.configuration.variables,
            emptyGaps = presenter.getEmptyGaps(variables);

        if (!emptyGaps.isValid || emptyGaps.gaps.length !== 0) return 0;

        var separators = presenter.configuration.separators,
            expressions = presenter.configuration.expressions,
            evaluationResult = presenter.evaluateAllExpressions(expressions, variables, separators);

        if (evaluationResult.isError) return;

        return !evaluationResult.overall ? presenter.getMaxScore() : 0;
    };

    presenter.getMaxScore = function () {
        return presenter.configuration.variables.length;
    };

    presenter.reset = function () {
        presenter.isErrorMode = false;
    };

    presenter.executeCommand = function(name, params) {
        if (presenter.isErrorMode) return;

        var commands = {
            'evaluate': presenter.evaluate
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    function getAlertMessage(variable) {
        var decodedReference = presenter.decodeModuleReference(variable.value);

        return "Text module with ID " + decodedReference.moduleID + " doesn't have gap with "
            + decodedReference.gapIndex + " index or does not exists!";
    }

    presenter.getEmptyGaps = function (variables) {
        var emptyGaps = [], i, convertedVariable;

        for (i = 0; i < variables.length; i++) {
            convertedVariable = presenter.convertVariable(variables[i].value, presenter.configuration.separators);
            if (convertedVariable === undefined) return { isValid: false, errorMessage: getAlertMessage(variables[i]) };

            if (convertedVariable === "") emptyGaps.push(variables[i].name);
        }

        return { isValid: true, gaps: emptyGaps };
    };

    return presenter;
}