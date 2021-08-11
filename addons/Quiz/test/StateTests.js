TestCase("[Quiz] States tests", {
    setUp: function () {
        this.presenter = AddonQuiz_create();
        this.presenter.addonID = 'Quiz1';
        this.presenter.config = {
            visibility: true,
            helpButtons: false,
        };
        var that = this;
        that.questionAppeard = false;
        that.visible = false;
        that.defaultState = {
            currentQuestion: 2,
            answersOrder: [0, 1, 2, 3],
            wasWrong: true,
            haveWon: false,
            fiftyFiftyUsed: true,
            hintUsed: true,
            selectedAnswer: 3,
            isVisible: true
        };

        this.presenter.showCurrentQuestion = function () {
            that.questionAppeard = true;
        };
        this.presenter.setVisibility = function (isVisible) {
            that.visible = isVisible;
        };
    },

    'test get the same state as was setted': function () {
        var state = this.defaultState;

        this.presenter.setState(JSON.stringify(state));
        var gotState = JSON.parse(this.presenter.getState());

        for (var key in state) {
            assertEquals(state[key], gotState[key])
        }
        assertTrue(this.questionAppeard);
        assertTrue(this.visible);
    },

});
