TestCase("[Lesson_Progress] Upgrading model test", {
    setUp: function () {
        this.presenter = new AddonLesson_Progress_create();

        this.model = {
            'Show_Progress_Bar': 'True',
            'Show_Checks': 'True',
            'Show_Errors': 'True',
            'Show_Mistakes': 'True',
            'Show_All_Answers': 'True',
            'Show_Correct_Answers': 'True'
        };
    },

    'test given model without Calculate_Score_On_Page_Change when upgrading model then will return model with that field set to False': function () {
        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertEquals('False', upgradedModel['Calculate_Score_On_Page_Change']);
    },

    'test given model with Calculate_Score_On_Page_Change set to True when upgrading model then will return model with that field set to True': function () {
        this.model['Calculate_Score_On_Page_Change'] = 'True';
        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertEquals('True', upgradedModel['Calculate_Score_On_Page_Change']);
    }


});