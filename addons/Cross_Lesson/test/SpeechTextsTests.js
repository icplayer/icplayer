TestCase("[Cross Lesson] Set speech texts", {
    setUp: function () {
        this.presenter = AddonCross_Lesson_create();
        this.presenter.getElementsForKeyboardNavigation = sinon.stub();
        this.presenter.getElementsForKeyboardNavigation.returns([sinon.spy()]);
        this.presenter.buildKeyboardController();
    },

    generateExpectedDefaultPresenterSpeechTexts: function () {
        return {
            GoToLesson: "Go to lesson",
        };
    },

    "test given empty speechTexts object when setSpeechText then presenter.speechText is default": function () {
        var speechText = {};
        var expectedResult = this.generateExpectedDefaultPresenterSpeechTexts();

        this.presenter.setSpeechTexts(speechText);

        assertNotUndefined(this.presenter.speechTexts);
        assertEquals(expectedResult, this.presenter.speechTexts);
    },

    "test given null speechTexts when setSpeechText then presenter.speechText is default": function () {
        var speechText = null;
        var expectedResult = this.generateExpectedDefaultPresenterSpeechTexts();

        this.presenter.setSpeechTexts(speechText);

        assertNotUndefined(this.presenter.speechTexts);
        assertEquals(expectedResult, this.presenter.speechTexts);
    },

    "test given undefined speechTexts when setSpeechText then presenter.speechText is default": function () {
        var speechText = undefined;
        var expectedResult = this.generateExpectedDefaultPresenterSpeechTexts();

        this.presenter.setSpeechTexts(speechText);

        assertNotUndefined(this.presenter.speechTexts);
        assertEquals(expectedResult, this.presenter.speechTexts);
    },

    "test given valid speechTexts when setSpeechText then presenter.speechText is equals to input": function () {
       var speechText = {
           GoToLesson: {GoToLesson: "Idź do lekcji"},
       };

       this.presenter.setSpeechTexts(speechText);

       assertNotUndefined(this.presenter.speechTexts);
       assertEquals(speechText.GoToLesson.GoToLesson, this.presenter.speechTexts.GoToLesson);
    }
});
