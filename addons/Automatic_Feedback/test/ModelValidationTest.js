TestCase("Model validation", {
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
            ],
            langAttribute: ""
        };
    },

    'test given empty model when validation was called then return configuration with default values': function () {
        var validatedModel = this.presenter.validateModel(this.model);

        assertEquals("Automatic_Feedback1", validatedModel.ID);
        assertEquals("Text1", validatedModel.activityModuleID);
        assertEquals("Default", validatedModel.activityType);
        assertFalse(validatedModel.displayFeedbackButtons);
        assertFalse(validatedModel.resetResponseOnPageChange);
        assertEquals("block", validatedModel.displayMode);
        assertEquals("Check", validatedModel.reactTo);


        assertEquals({"correct":"","incorrect":"","empty":"","partial":""},validatedModel.defaultFeedback);
        assertEquals({}, validatedModel.itemFeedbacks);
        assertEquals("", validatedModel.langTag);
    },

    'test given model with only default feedbacks when validation was called then return configuration with default feedbacks set': function () {
            this.model.CorrectFeedback = [
                {ActivityItem: '', Feedback: 'correctdef'}
            ];
            this.model.PartialFeedback = [
                {ActivityItem: '', Feedback: 'partialdef'}
            ];
            this.model.EmptyFeedback = [
                {ActivityItem: '', Feedback: 'emptydef'}
            ];
            this.model.IncorrectFeedback = [
                {ActivityItem: '', Feedback: 'incorrectdef'}
            ];

            var validatedModel = this.presenter.validateModel(this.model);

            assertEquals({"correct":"correctdef",
                "incorrect":"incorrectdef",
                "empty":"emptydef",
                "partial":"partialdef"},validatedModel.defaultFeedback);
            assertEquals({}, validatedModel.itemFeedbacks);
        },

        'test given model with set feedbacks when validation was called then return configuration with correctly set feedbacks': function () {
        this.model.CorrectFeedback = [
            {ActivityItem: '1', Feedback: 'correct1'}
        ];
        this.model.PartialFeedback = [
            {ActivityItem: '1', Feedback: 'partial1'}
        ];
        this.model.EmptyFeedback = [
            {ActivityItem: '2', Feedback: 'empty2'}
        ];
        this.model.IncorrectFeedback = [
            {ActivityItem: '2', Feedback: 'incorrect2'}
        ];

        var validatedModel = this.presenter.validateModel(this.model);

        assertEquals({"correct":"",
            "incorrect":"",
            "empty":"",
            "partial":""},
            validatedModel.defaultFeedback);
        assertEquals({"correct":"correct1",
            "incorrect":"",
            "empty":"",
            "partial":"partial1"},
            validatedModel.itemFeedbacks[1]);
        assertEquals({"correct":"",
            "incorrect":"incorrect2",
            "empty":"empty2",
            "partial":""},
            validatedModel.itemFeedbacks[2]);
    },

    'test given feedback with items separated by commas when validation was called then return configuration with correctly set feedbacks': function () {
        this.model.CorrectFeedback = [
            {ActivityItem: '1,2,3', Feedback: 'correct'}
        ];
        this.model.PartialFeedback = [
            {ActivityItem: '1,2,3', Feedback: 'partial'}
        ];
        this.model.EmptyFeedback = [
            {ActivityItem: '1,2', Feedback: 'empty'}
        ];
        this.model.IncorrectFeedback = [
            {ActivityItem: '2,3', Feedback: 'incorrect'}
        ];

        var validatedModel = this.presenter.validateModel(this.model);

        assertEquals({"correct":"",
            "incorrect":"",
            "empty":"",
            "partial":""},
            validatedModel.defaultFeedback);
        assertEquals({"correct":"correct",
            "incorrect":"",
            "empty":"empty",
            "partial":"partial"},
            validatedModel.itemFeedbacks[1]);
        assertEquals({"correct":"correct",
            "incorrect":"incorrect",
            "empty":"empty",
            "partial":"partial"},
            validatedModel.itemFeedbacks[2]);
        assertEquals({"correct":"correct",
            "incorrect":"incorrect",
            "empty":"",
            "partial":"partial"},
            validatedModel.itemFeedbacks[3]);
    },

    'test given feedback with items separated by dash when validation was called then return configuration with correctly set feedbacks': function () {
        this.model.CorrectFeedback = [
            {ActivityItem: '1-3', Feedback: 'correct'}
        ];
        this.model.PartialFeedback = [
            {ActivityItem: '1-3', Feedback: 'partial'}
        ];
        this.model.EmptyFeedback = [
            {ActivityItem: '1-2', Feedback: 'empty'}
        ];
        this.model.IncorrectFeedback = [
            {ActivityItem: '2-3', Feedback: 'incorrect'}
        ];

        var validatedModel = this.presenter.validateModel(this.model);

        assertEquals({"correct":"",
            "incorrect":"",
            "empty":"",
            "partial":""},
            validatedModel.defaultFeedback);
        assertEquals({"correct":"correct",
            "incorrect":"",
            "empty":"empty",
            "partial":"partial"},
            validatedModel.itemFeedbacks[1]);
        assertEquals({"correct":"correct",
            "incorrect":"incorrect",
            "empty":"empty",
            "partial":"partial"},
            validatedModel.itemFeedbacks[2]);
        assertEquals({"correct":"correct",
            "incorrect":"incorrect",
            "empty":"",
            "partial":"partial"},
            validatedModel.itemFeedbacks[3]);
    }
});