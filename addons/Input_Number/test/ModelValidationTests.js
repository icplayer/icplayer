TestCase("Model validation", {
    setUp: function () {
        this.presenter = AddonInput_Number_create();
        this.model = {
            checkingType : 'Every gap separately',
            activities: '\gap{} + \gap{} = \gap{}',
            answers: '1 2 3',
            isNotActivity: 'False'
        }
    },

    'test checking type is correctly set as enum': function () {
        var validated = this.presenter.validateModel(this.model);
        assertEquals(this.presenter.CheckingType.EVERY_GAP_SEPARATELY, validated.checkingType);
    },

    'test less answers than activities bombs an error' : function() {
        this.model.activities += '\n\gap{} - \gap{} = 5';

        var validated = this.presenter.validateModel(this.model);
        assertEquals(true, validated.isError);
        assertEquals('E01', validated.errorCode);
    },

    'test less activities than answers bombs an error' : function() {
        this.model.answers += '\n';
        this.model.answers += '\n10 5';

        var validated = this.presenter.validateModel(this.model);
        assertEquals(true, validated.isError);
        assertEquals('E02', validated.errorCode);
    },

    'test isActivity converted correctly from isNotActivity' : function() {
        var validated = this.presenter.validateModel(this.model);
        assertEquals(true, validated.isActivity);
    },

    'test groupAnswers did the correct grouping': function() {
        this.model.answers += '\n';
        this.model.answers += '\n10 5';
        this.model.activities += '\n\gap{} - \gap{} = 5';

        var validated = this.presenter.validateModel(this.model);
        assertEquals('1 2 3', validated.answers[0]);
        assertEquals('10 5', validated.answers[1]);
    },

    'test less amount of \gap{} than answers values in specific line of answers bombs an error': function() {

    }

});