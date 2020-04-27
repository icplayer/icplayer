TestCase("[Lesson_Progress] Validating model test", {
    setUp: function () {
        this.presenter = new AddonLesson_Progress_create();

        this.model = {
            'Show_Progress_Bar': 'True',
            'Show_Checks': 'True',
            'Show_Errors': 'True',
            'Show_Mistakes': 'True',
            'Show_All_Answers': 'True',
            'Show_Correct_Answers': 'True',
            'Calculate_Score_On_Page_Change': 'True'
        };
    },

    'test given all fields set to true when validateModel is executed then all properties are true': function() {
        var result = this.presenter.validateModel(this.model);

        for (var prop in result) {
            if (result.hasOwnProperty(prop)) {
                assertTrue(result[prop]);
            }
        }
    },

    'test given Show_Progress_Bar set to False when validateModel is called then validated model will have corresponding property set to false': function() {
        this.model['Show_Progress_Bar'] = 'False';
        var result = this.presenter.validateModel(this.model);

        assertFalse(result.showProgressBar);
    },

    'test given Calculate_Score_On_Page_Change set to False when validateModel is called then validated model will have corresponding property set to false': function() {
        this.model['Calculate_Score_On_Page_Change'] = 'False';
        var result = this.presenter.validateModel(this.model);

        assertFalse(result.calculateScoreOnPageChange);
    }
});