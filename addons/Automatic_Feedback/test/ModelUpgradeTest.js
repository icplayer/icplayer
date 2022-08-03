TestCase("Model Upgrade", {
    setUp: function () {
        this.presenter = AddonAutomatic_Feedback_create();
        this.model = {
            ID: "Automatic_Feedback1",
            Height: "100",
            Width: "100",
            ActivityModuleID: "Text1",
            ActivityType: "",
            Display: "block",
            DisplayFeedbackButtons: "False",
            ReactTo: "Check",
            CorrectFeedback: [
             {ActivityItem: '', Feedback: ''}
            ],
            PartialFeedback: [
             {ActivityItem: '', Feedback: ''}
            ],
            EmptyFeedback: [
             {ActivityItem: '', Feedback: ''}
            ],
            IncorrectFeedback: [
             {ActivityItem: '', Feedback: ''}
            ]
        };
    },

    'test given model without upgradeable properties when upgrade was called then return configuration with default values': function () {
        const upgradedModel = this.presenter.upgradeModel(this.model);

        assertEquals("False", upgradedModel.ResetResponseOnPageChange);
        assertEquals("", upgradedModel.langAttribute);
    },

});