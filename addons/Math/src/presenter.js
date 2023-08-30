function AddonMath_create() {

    function getCorrectObject(val) { return { isError: false, value: val }; }
    function getErrorObject(ec) { return { isError: true, errorCode: ec }; }

    var presenter = function() {};
    presenter.isShowAnswers = false;
    presenter.currentGapIndex = 0;

    presenter.setPlayerController = function (controller) {
        presenter.playerController = controller;
    };

    presenter.setEventBus = function (eventBus) {
        presenter.eventBus = eventBus;
    };

    presenter.run = function (view, model) {
        presenter.presenterLogic(view, model);
        presenter.$view.css('visibility', 'hidden');

        if (presenter.eventBus) {
            presenter.eventBus.addEventListener('ShowAnswers', this);
            presenter.eventBus.addEventListener('HideAnswers', this);
            presenter.eventBus.addEventListener('PageLoaded', this);
            presenter.eventBus.addEventListener('ValueChanged', this);
            presenter.eventBus.addEventListener('GradualShowAnswers', this);
            presenter.eventBus.addEventListener('GradualHideAnswers', this);
        }
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
        'CV_04': "Decimal separator and thousand separator are the same!",
        'CV_05': "Number of defined gaps in Show Answers is different than number of Variables",
        'CV_06': "Incorrect gap name defined in Show Answers property",
        'SA04': "Empty line is inserted in Show Answers property",
        'SA02': "Name of gap is not defined in Show Answers",
        'SA03': "Value of gap is not defined in Show Answers",
        'EV_01': "Only one string can be declared"
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

    presenter.parseShowAnswers = function (answers, convertedVariables) {
        if (ModelValidationUtils.isStringEmpty(answers)) return getCorrectObject([]);

        var variables = answers.split('\n').map(function(line) {
            return {
                name:line.substr(0, line.indexOf('=')).trim(),
                value:line.substr(line.indexOf('=') + 1).trim(),
                users: ''
            }
        });

        if (variables.some(function(v) { return v.value === '' && v.name === ''; })) {
            return getErrorObject('SA04'); // check if empty line is in property
        }

        if (variables.some(function(v) { return v.name === ''; })) {
            return getErrorObject('SA02'); // check if name of gap is defined
        }

        if (variables.some(function(v) { return v.value === ''; })) {
            return getErrorObject('SA03'); // check if value of gap is defined
        }

        if(variables.length > 0 && (variables.length != convertedVariables.length)){
            return getErrorObject('CV_05'); // check if number of gaps equals number of defined gaps in Show Answers
        }

        var definedGaps = [];
        for (var j = 0; j <  convertedVariables.length; j++){
            definedGaps.push(convertedVariables[j].name);
        }

        for (var i = 0; i <  variables.length; i++){
            if(!(definedGaps.indexOf(variables[i].name) > -1)){
                return getErrorObject('CV_06'); // check if defined gap names are correct
            }
        }

        return getCorrectObject(variables);
    };

    presenter.convertExpressions = function (expressions) {
        var expressionsArray = [], splittedExpressions = expressions.split('\n');

        for (var i = 0; i < splittedExpressions.length; i++) {
            expressionsArray.push(splittedExpressions[i]);
        }

        return expressionsArray;
    };


    presenter.convertEmptyAnswer = function(variable) {
        if (!variable) return "";
        if (variable.indexOf(' ') >= 0) return { isError: true, errorCode: 'EV_01' };

        return variable;
    };

    presenter.convertModel = function (model) {
        var expressions = presenter.convertExpressions(model.Expressions);

        var convertedVariables = presenter.convertVariables(model.Variables, expressions);
        if (convertedVariables.isError) {
            return { isError: true, errorCode: convertedVariables.errorCode };
        }

        var parsedShowAnswers = presenter.parseShowAnswers(model['Show Answers'], convertedVariables.variables);
        if (parsedShowAnswers.isError) {
            return { isError: true, errorCode: parsedShowAnswers.errorCode };
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

        var emptyAnswer = presenter.convertEmptyAnswer(model['Empty Answer']);
        if (emptyAnswer.isError) {
            return { isError: true, errorCode: 'EV_01' };
        }

        return {
            isError: false,
            variables: convertedVariables.variables,
            expressions: expressions,
            answers: parsedShowAnswers.value,
            onCorrectEvent: model.onCorrect,
            onIncorrectEvent: model.onIncorrect,
            onPartialEvent: model.onPartiallyCompleted,
            separators: separators,
            emptyAnswer: emptyAnswer,
            addonID: model.ID
        };
    };

    function isInExpressionString (expressions) {
        for (var i = 0; i < expressions.length; i++) {
            if (!isNumber(expressions[i].value)) {
                return true;
            }
        }
    }

    function changeExpressionToString (expressions) {
        for (var i = 0; i < expressions.length; i++) {
            expressions[i].value = expressions[i].value + "";
        }
        return expressions;
    }

    presenter.evaluateExpression = function (expression, variables, separators) {
        var i, expressionRunner = {
            /**
             * @param  {string} expression
             * @param  {} variables
             */
            run: function (expression, variables) {
                presenter.assignVariablesToObject(this, variables, expression);
                var parser = math.parser();

                parser.set('variables', this.variables);

                if ((expression.indexOf("{") > -1) && (expression.indexOf("function") > -1)) {     // There will be probably function declaration
                    delete math.iifeFunction;

                    math.import({
                        iifeFunction: new Function(expression + "; return result;")
                    });

                    expression = "result = iifeFunction.call({variables:variables})";
                } else {
                    expression = expression.replace(/&&/g," and ").replace(/\|\|/g, " or ").replace(/'/g, '"');
                }

                parser.eval(expression);
                return parser.get('result');
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

            if(isInExpressionString(convertedVariables)) {
                convertedVariables = changeExpressionToString(convertedVariables);
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

    presenter.isGapAttempted = function (gapIdentifier) {
        var decodedReference = presenter.decodeModuleReference(gapIdentifier);

        if (!decodedReference.isValid) return undefined;

        try {
            var textModule = presenter.getModule(decodedReference.moduleID);
            if (!textModule) return undefined;

            return textModule.isGapAttempted(decodedReference.gapIndex);
        } catch (exception) {
            return undefined;
        }
    };

    presenter.convertExpression = function (expression, variables) {
        var convertedExpression = 'result = ' + expression,
            expressionVariables = presenter.selectVariablesFromExpression(expression, variables), i;

        for (i = 0; i < expressionVariables.length; i++) {
            convertedExpression = presenter.replaceVariableNameWithReference(convertedExpression, expressionVariables[i]);
        }

        return convertedExpression;
    };

    function checkIfCorrectVariable(tempExpression, variable) {
        var lastChar = tempExpression.charAt(tempExpression.indexOf(variable)+variable.length);
        return lastChar == "." || lastChar == "(" || lastChar == ")" || lastChar == "" || lastChar == " " || lastChar == "/" || lastChar == "*" || lastChar == "=" || lastChar == "+" || lastChar == "-" || lastChar == ">" || lastChar == "<" || lastChar == "%" || lastChar == "!";
    }

    presenter.findTextOccurrences = function (expression, variable) {
        var indexes = [], tempExpression = expression, offset = 0;

        while (tempExpression.indexOf(variable) !== -1 && checkIfCorrectVariable(tempExpression, variable)) {
            var indexOf = tempExpression.indexOf(variable);
            indexes.push(indexOf + offset);
            offset += indexOf + variable.length;

            tempExpression = tempExpression.substring(indexOf + variable.length);
        }

        return indexes;
    };

    presenter.replaceVariableNameWithReference = function (expression, variable) {
        var prefix = 'variables["';
        var indexes = presenter.findTextOccurrences(expression, variable);
        var fixedExpression = expression.substring(0, indexes[0]);

        for (var i = 0; i < indexes.length - 1; i++) {
            fixedExpression += prefix + variable + '"]';
            fixedExpression += expression.substring(indexes[i] + variable.length, indexes[i + 1]);
        }

        fixedExpression += prefix + variable + '"]';
        fixedExpression += expression.substring(indexes[indexes.length - 1] + variable.length);

        return fixedExpression;
    };

    presenter.assignVariablesToObject = function (object, variables, expression) {
        object.variables = {};
        if (expression != null) {
            var parsedExpression = expression.replace(/[\s]/g, '').replace(/'/g, '"').replace(/[<>+\-]/g, '=');
            parsedExpression = parsedExpression.replace(/===?/g, '=').replace(/variables\["(.*?)"]/g, '$1');
        }

        for (var i = 0; i < variables.length; i++) {
            var name = variables[i].name;
            if (parsedExpression != null && (parsedExpression.indexOf('"='+name) != -1 || parsedExpression.indexOf(name+'="') != -1)) {
                object.variables[variables[i].name] = variables[i].value.toString();
            } else {
                object.variables[variables[i].name] = variables[i].value;
            }
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

    presenter.setShowErrorsMode = function() {
        if (presenter.isShowAnswers) {
            presenter.toggleAnswers(false, true);
        }

        presenter.isErrorMode = true;

        var variables = presenter.configuration.variables,
            emptyGaps = presenter.getEmptyGaps(variables);

        if (!emptyGaps.isValid) {
            presenter.hideAnswers();
            alert(emptyGaps.errorMessage);
            return;
        }

        presenter.markGapsEmptiness(emptyGaps.gaps);

        if (emptyGaps.gaps.length !== 0) return;

        var separators = presenter.configuration.separators,
            expressions = presenter.configuration.expressions,
            evaluationResult = presenter.evaluateAllExpressions(expressions, variables, separators);

        presenter.markGapsCorrectness(presenter.configuration.variables, evaluationResult.overall);
    };

    presenter.setWorkMode = function() {
        presenter.isErrorMode = false;
    };

    presenter.executeEventCode = function(eventCode) {
        presenter.playerController.getCommands().executeEventCode(eventCode);
    };

    presenter.markGapsEmptiness = function(gaps) {
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
            presenter.hideAnswers();
            alert(emptyGaps.errorMessage);
            return;
        }

        if (emptyGaps.gaps.length !== 0) {
            presenter.executeEventCode(presenter.configuration.onPartialEvent);
        } else {
            var separators = presenter.configuration.separators,
                evaluationResult = presenter.evaluateAllExpressions(presenter.configuration.expressions,
                                                                    presenter.configuration.variables, separators),
                eventCode = evaluationResult.overall ? presenter.configuration.onCorrectEvent : presenter.configuration.onIncorrectEvent;
            presenter.executeEventCode(eventCode);
        }
    };

    presenter.isAttempted = function() {
        var notAttemptedGaps = presenter.getNotAttemptedGaps(presenter.configuration.variables);
        return notAttemptedGaps.gaps.length === 0;
    };

    presenter.getScore = function () {
        if(presenter.configuration.isError){
            return;
        }
        const isShowAnswers = presenter.isShowAnswers;
        if (isShowAnswers) presenter.toggleAnswers(false);

        const variables = presenter.configuration.variables,
            emptyGaps = presenter.getEmptyGaps(variables);
        if (!emptyGaps.isValid || emptyGaps.gaps.length !== 0) {
            if (isShowAnswers) presenter.toggleAnswers(true);
            return 0;
        }

        const separators = presenter.configuration.separators,
            expressions = presenter.configuration.expressions,
            evaluationResult = presenter.evaluateAllExpressions(expressions, variables, separators);

        if (isShowAnswers) presenter.toggleAnswers(true);
        if (evaluationResult.isError) return;

        return evaluationResult.overall ? presenter.getMaxScore() : 0;
    };

    presenter.getErrorCount = function () {
        if (presenter.configuration.isError){
            return;
        }

        var isShowAnswers = presenter.isShowAnswers;
        if (isShowAnswers) {
            presenter.toggleAnswers(false);
        }

        var variables = presenter.configuration.variables,
            emptyGaps = presenter.getEmptyGaps(variables);

        if (!emptyGaps.isValid || emptyGaps.gaps.length !== 0) {
            if (isShowAnswers) presenter.toggleAnswers(true);
            return 0;
        }

        var separators = presenter.configuration.separators,
            expressions = presenter.configuration.expressions,
            evaluationResult = presenter.evaluateAllExpressions(expressions, variables, separators);
        if (isShowAnswers) presenter.toggleAnswers(true);

        if (evaluationResult.isError) return;

        return !evaluationResult.overall ? presenter.getMaxScore() : 0;
    };

    presenter.getMaxScore = function () {
        if(presenter.configuration.isError){
            return;
        }
        return presenter.configuration.variables.length;
    };

    presenter.reset = function () {
        presenter.isErrorMode = false;
        presenter.isShowAnswers = false;
    };

    presenter.isAllOK = function () {
        return presenter.getMaxScore() === presenter.getScore();
    };

    presenter.createAllOKEventData = function (){
        return{
            'source': presenter.configuration.addonID,
            'item': 'all',
            'value': '',
            'score': ''
        }
    };

    presenter.sendAllOKEvent = function (){
        presenter.eventBus.sendEvent('ValueChanged', presenter.createAllOKEventData());
    };

    presenter.executeCommand = function(name, params) {
        if (presenter.isErrorMode) return;

        var commands = {
            'evaluate': presenter.evaluate,
            'isAttempted': presenter.isAttempted,
            'showAnswers': presenter.showAnswers,
            'hideAnswers': presenter.hideAnswers,
            'isAllOK': presenter.isAllOK
        };

        Commands.dispatch(commands, name, params, presenter);
    };

    function getAlertMessage(variable) {
        var decodedReference = presenter.decodeModuleReference(variable.value);

        return "Text module with ID [ID] doesn't have gap with [INDEX] index or does not exists!"
            .replace('[ID]', decodedReference.moduleID)
            .replace('[INDEX]', decodedReference.gapIndex);
    }

    function isVariableEmpty(variable) {
        return variable === "" || variable === presenter.configuration.emptyAnswer;
    }

    presenter.getEmptyGaps = function (variables) {
        var emptyGaps = [], i, convertedVariable;

        for (i = 0; i < variables.length; i++) {
            convertedVariable = presenter.convertVariable(variables[i].value, presenter.configuration.separators);
            if (convertedVariable === undefined) return { isValid: false, errorMessage: getAlertMessage(variables[i]) };

            if (isVariableEmpty(convertedVariable)) emptyGaps.push(variables[i].name);
        }

        return { isValid: true, gaps: emptyGaps };
    };

    presenter.getNotAttemptedGaps = function (variables) {
        var notAttemptedGaps = [], i, convertedVariable;

        for (i = 0; i < variables.length; i++) {
            convertedVariable = presenter.isGapAttempted(variables[i].value);
            if (convertedVariable === undefined) return { isValid: false, errorMessage: getAlertMessage(variables[i]) };

            if (convertedVariable === false) notAttemptedGaps.push(variables[i].name);
        }

        return { isValid: true, gaps: notAttemptedGaps };
    };

    presenter.toggleAnswers = function (on, blockUnlocking = false) {
        presenter.isShowAnswers = on;
        for (var i=0; i<presenter.configuration.answers.length; i++) {
            var answer = presenter.configuration.answers[i];
            var gapName = null;
            for (var j= 0; j<presenter.configuration.variables.length; j++){
                if(presenter.configuration.variables[j].name == answer.name){
                    gapName = presenter.configuration.variables[j].value;
                }
            }
            if(gapName == null){
                return;
            }

            var moduleReference = presenter.decodeModuleReference(gapName);
            var module = presenter.getModule(moduleReference.moduleID);

            if (module != null && !module.isActivity()) {
                if (on) {
                    answer.users = module.getValue(moduleReference.gapIndex);
                    module.setGapAnswer(moduleReference.gapIndex, answer.value, presenter.moduleAnswersCounter(moduleReference.moduleID));
                } else {
                    module.setUserValue(moduleReference.gapIndex, answer.users);
                    if (!blockUnlocking && module.hasOwnProperty('enableGap')) module.enableGap(moduleReference.gapIndex);
                }
            }
        }

        presenter.reloadMathJax();
    }

    presenter.reloadMathJax = function() {
        MathJax.CallBack.Queue().Push(function () {
            MathJax.Hub.Typeset();
        });
    }

    presenter.moduleAnswersCounter = function (module) {
        var counter = 0;

        for (var j= 0; j<presenter.configuration.variables.length; j++){
            if(presenter.configuration.variables[j].value.indexOf(module) > -1){
                counter++;
            }
        }

        return counter;
    };

    presenter.showAnswers = function() {
        if (!presenter.isShowAnswers) {
            presenter.toggleAnswers(true);
        }
    };

    presenter.hideAnswers = function() {
        if (presenter.isShowAnswers) {
            presenter.toggleAnswers(false);
        }
    };

    presenter.getActivitiesCount = function () {
        return presenter.configuration.answers.length;
    }

    presenter.gradualShowAnswers = function (data) {
        if (data.moduleID !== presenter.configuration.addonID) { return; }

        var answer = presenter.configuration.answers[presenter.currentGapIndex];
        var gapName = null;
        for (var j = 0; j < presenter.configuration.variables.length; j++) {
            if (presenter.configuration.variables[j].name === answer.name) {
                gapName = presenter.configuration.variables[j].value;
            }
        }
        if (gapName == null) {
            return;
        }

        var moduleReference = presenter.decodeModuleReference(gapName);
        var module = presenter.getModule(moduleReference.moduleID);

        module.setGapAnswer(moduleReference.gapIndex, answer.value, presenter.moduleAnswersCounter(moduleReference.moduleID));
        presenter.currentGapIndex++;

        presenter.reloadMathJax();
    }

    presenter.allOkSent = false;

    presenter.onEventReceived = function(eventName, eventData) {
        switch(eventName) {
            case 'ShowAnswers': presenter.showAnswers(); break;
            case 'HideAnswers': presenter.hideAnswers(); break;
            case 'PageLoaded': markModules(); break;
            case 'ValueChanged':
                if (presenter.isAllOK() && !presenter.allOkSent) {
                    presenter.allOkSent = true;
                    presenter.sendAllOKEvent();
                }else if(!presenter.isAllOK()){
                    presenter.allOkSent = false;
                }
                break;
            case 'GradualShowAnswers':
                presenter.gradualShowAnswers(eventData);
                break;
            case 'GradualHideAnswers':
                presenter.currentGapIndex = 0;
                presenter.hideAnswers();
                break;
        }
    };

    function markModules() {
        if(presenter.configuration.isError){
            return;
        }

        for (var i=0; i<presenter.configuration.answers.length; i++) {
            var answer = presenter.configuration.answers[i];
            var moduleReference = presenter.decodeModuleReference(answer.name);
            var module = presenter.getModule(moduleReference.moduleID);

            if (module != null && !module.isActivity()) {
                module.markConnectionWithMath();
            }
        }

        for (var j=0; j < presenter.configuration.variables.length; j++){
            var decodedReference = presenter.decodeModuleReference(presenter.configuration.variables[j].value);
            var notSAmodule = presenter.getModule(decodedReference.moduleID);

            if (notSAmodule != null && !notSAmodule.isActivity()) {
                notSAmodule.markConnectionWithMath();
            }
        }
    }

    return presenter;
}