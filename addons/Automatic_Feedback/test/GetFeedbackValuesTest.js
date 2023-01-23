TestCase("tetFeedbackValues", {
    setUp: function () {
        this.presenter = AddonAutomatic_Feedback_create();
        this.presenter.initializeActivityTypeDict();
        this.model = {
            ID: "Automatic_Feedback1",
            Height: "100",
            Width: "100",
            ActivityModuleID: "Text1",
            ActivityType: "",
            Display: "block",
            DisplayFeedbackButtons: "False",
            ResetResponseOnPageChange: "False",
            ReactTo: "Check",
            CorrectFeedback: [
             {ActivityItem: '', Feedback: 'defcorrect'},
             {ActivityItem: '1-3', Feedback: 'correct'}
            ],
            PartialFeedback: [
             {ActivityItem: '', Feedback: 'defpartial'},
             {ActivityItem: '1', Feedback: 'partial1'},
             {ActivityItem: '2', Feedback: 'partial2'},
             {ActivityItem: '3', Feedback: 'partial3'}
            ],
            EmptyFeedback: [
             {ActivityItem: '', Feedback: 'defempty'},
             {ActivityItem: '1-2', Feedback: 'empty1'},
             {ActivityItem: '3', Feedback: 'empty2'}
            ],
            IncorrectFeedback: [
             {ActivityItem: '', Feedback: 'defincorrect'},
             {ActivityItem: '1', Feedback: 'incorrect1'},
             {ActivityItem: '2-3', Feedback: 'incorrect2'}
            ],
            langAttribute: ""
        };

        this.presenter.configuration = this.presenter.validateModel(this.model);
    },

    'test given configured feedbacks when getCorrectFeedbacks is called then return all correct feedback values': function () {
        let result = this.presenter.getCorrectFeedbacks();

        assertEquals(4, Object.keys(result).length);
        assertEquals("defcorrect", result["default"]);
        assertEquals("correct", result["1"]);
        assertEquals("correct", result["2"]);
        assertEquals("correct", result["3"]);
    },

    'test given configured feedbacks when getIncorrectFeedbacks is called then return all incorrect feedback values': function () {
        let result = this.presenter.getIncorrectFeedbacks();

        assertEquals(4, Object.keys(result).length);
        assertEquals("defincorrect", result["default"]);
        assertEquals("incorrect1", result["1"]);
        assertEquals("incorrect2", result["2"]);
        assertEquals("incorrect2", result["3"]);
    },

    'test given configured feedbacks when getPartiallyCorrectFeedbacks is called then return all partial feedback values': function () {
        let result = this.presenter.getPartiallyCorrectFeedbacks();

        assertEquals(4, Object.keys(result).length);
        assertEquals("defpartial", result["default"]);
        assertEquals("partial1", result["1"]);
        assertEquals("partial2", result["2"]);
        assertEquals("partial3", result["3"]);
    },

    'test given configured feedbacks when getEmptyFeedbacks is called then return all empty feedback values': function () {
        let result = this.presenter.getEmptyFeedbacks();

        assertEquals(4, Object.keys(result).length);
        assertEquals("defempty", result["default"]);
        assertEquals("empty1", result["1"]);
        assertEquals("empty1", result["2"]);
        assertEquals("empty2", result["3"]);
    }
});