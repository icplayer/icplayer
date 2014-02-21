function AddonInput_Number_create(){

    var presenter = function(){};

    presenter.run = function(view, model){
        presenter.configuration = presenter.validateModel(model);
        presenter.$view = $(view);
    };

    presenter.groupAnswers = function(answers) {
        var groupedAnswers = {},
            i = 0;

        $.each(answers, function() {
            var answer = this;
            if($.trim(answer).length === 0) { // an empty line
                i++;
            } else {
                groupedAnswers[i] = answer;
            }
        });

        return groupedAnswers;
    };

    presenter.errorCodes = {
        'E01' : 'There is more Activities than Answers groups',
        'E02' : 'There is more Answers groups than Activities',
        'E03' : 'There is difference in amount between \gap{} and Answers values'
    };

    presenter.CheckingType = {
        EVERY_GAP_SEPARATELY: 1,
        ALL_GAPS_TOGETHER: 2
    };

    var mapCheckingTypeStringToEnum = {
        'Every gap separately' : presenter.CheckingType.EVERY_GAP_SEPARATELY,
        'All gaps together' : presenter.CheckingType.ALL_GAPS_TOGETHER
    };

    function isAmountOfGapsCorrect(activites, answers) {
        $.each(activites, function() {
            var activity = this;

        });
        var amountOfGaps = 0;
    }

    presenter.validateModel = function(model) {
        var validatedActivities = Helpers.splitLines(model.activities);

        var validatedAnswers = presenter.groupAnswers( (model.answers).split(/[\n\r]/) );

        if (validatedActivities.length > Object.keys(validatedAnswers).length) {
            return {
                isError: true,
                errorCode: 'E01'
            }
        }

        if (validatedActivities.length < Object.keys(validatedAnswers).length) {
            return {
                isError: true,
                errorCode: 'E02'
            }
        }

        if ( !isAmountOfGapsCorrect(validatedActivities, validatedAnswers) ) {
            return {
                isError: true,
                errorCode: 'E03'
            }
        }

        return {
            isError: false,
            decimalSeparator: model.decimalSeparator,
            checkingType: mapCheckingTypeStringToEnum[model.checkingType],
            activities: validatedActivities,
            answers: validatedAnswers,
            isActivity: !( ModelValidationUtils.validateBoolean(model['isNotActivity']) ),
            isDisabled: ModelValidationUtils.validateBoolean(model.isDisabled),
            isVisible: ModelValidationUtils.validateBoolean(model.isVisible)
        }
    };

    presenter.setShowErrorsMode = function(){
    };

    presenter.setWorkMode = function(){
    };

    presenter.reset = function(){
    };

    presenter.getErrorCount = function(){
    };

    presenter.getMaxScore = function(){
    };

    presenter.getScore = function(){
    };

    presenter.getState = function(){
    };

    presenter.setState = function(state){
    };

    return presenter;
}