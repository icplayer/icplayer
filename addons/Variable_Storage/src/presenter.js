function AddonVariable_Storage_create(){
    var presenter = function(){}
    presenter.Variables = [];
    presenter.executeCommand = function(name, params) {
        switch(name.toLowerCase()) {
            case 'getVariable'.toLowerCase():
                presenter.getVariable(params[0]);
                break;
            case 'setVariable'.toLowerCase():
                presenter.setVariable(params[0],params[1]);
                break;
            case 'reset'.toLowerCase():
                presenter.reset();
                break;
        }
    }
    function validateVariables(list){
        var variable = [], variableName, variableValue, tmpVariable;
        for (i = 0; i < list.length; i++) {
            variable = [];
            variableName = list[i]['Name'];
            if (variableName != '') {
                variableValue = list[i]['Start'];
                tmpVariable = {
                    name: variableName,
                    startValue: variableValue,
                    currentValue: variableValue
                };
                presenter.Variables.push(tmpVariable);
            }
        };
    }
    presenter.initiate = function(view, model){
        presenter.$view = $(view);
        presenter.model = model;
        presenter.addonID = model.ID;
        validateVariables(presenter.model['Variables']);
        presenter.notReset = false;
        presenter.notReset = ModelValidationUtils.validateBoolean(presenter.model['NotReset']);
    }
    presenter.run = function(view, model){
        presenter.initiate(view, model);
    }
    presenter.createPreview = function(view, model){
        presenter.initiate(view, model);
    }
    presenter.getVariable = function(varName) {
        for (var i = 0; i < presenter.Variables.length; i++) {
            if (presenter.Variables[i]['name'] == varName)
                return presenter.Variables[i]['currentValue'];
        }
        return false;
    }
    presenter.setVariable = function(varName, varValue) {
        var isValue = false;
        for (var i = 0; i < presenter.Variables.length; i++) {
            if (presenter.Variables[i]['name'] == varName) {
                presenter.Variables[i]['currentValue'] = varValue;
                isValue = true;
            }
        }
        if (!isValue) {
            var tmpVariable = {
                name: varName,
                startValue: false,
                currentValue: varValue
            };
            presenter.Variables.push(tmpVariable);
        }
    }
    presenter.reset = function() {
        if (!presenter.notReset) {
            for (var i = 0; i < presenter.Variables.length; i++) {
                presenter.Variables[i]['currentValue'] = presenter.Variables[i]['startValue'];
            }
        }
    }
    presenter.getState = function() {
        var tmpVariablesValue = [], tmpVariablesStart = [], tmpVariablesName = [];
        for (var i = 0; i < presenter.Variables.length; i++) {
            tmpVariablesValue[i] = presenter.Variables[i]['currentValue'];
            tmpVariablesStart[i] = presenter.Variables[i]['startValue'];
            tmpVariablesName[i] = presenter.Variables[i]['name'];
        }
        return JSON.stringify({
            Variables : tmpVariablesValue,
            VariablesName : tmpVariablesName,
            VariableValue : tmpVariablesStart,
            VariablesNumber: presenter.Variables.length
        });
    }
    presenter.setState = function(state) {
        var VariablesNumber = JSON.parse(state).VariablesNumber;
        var tmpVariable;
        for (var i = 0; i < presenter.Variables.length; i++) {
            presenter.Variables[i]['currentValue'] = JSON.parse(state).Variables[i];
        }
        for (; i < VariablesNumber; i++) {
            tmpVariable = {
                name: JSON.parse(state).VariablesName[i],
                startValue: JSON.parse(state).VariableValue[i],
                currentValue: JSON.parse(state).Variables[i]
            };
            presenter.Variables.push(tmpVariable);
        }
    }
    return presenter;
}