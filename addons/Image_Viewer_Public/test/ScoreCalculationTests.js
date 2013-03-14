TestCase("Score calculation - helper method", {
    setUp: function () {
        this.presenter = AddonImage_Viewer_Public_create();
    },

    'test correct answer from single choice': function () {
        this.presenter.configuration = {
            currentFrame: 2,
            correctFrames: {
                frames: [2]
            }
        };

        var isCorrect = this.presenter.isCurrentFrameCorrectlySelected();

        assertTrue(isCorrect);
    },

    'test correct answer from multiple choices': function () {
        this.presenter.configuration = {
            currentFrame: 3,
            correctFrames: {
                frames: [2, 3, 4]
            }
        };

        var isCorrect = this.presenter.isCurrentFrameCorrectlySelected();

        assertTrue(isCorrect);
    },

    'test incorrect answer from single choice': function () {
        this.presenter.configuration = {
            currentFrame: 3,
            correctFrames: {
                frames: [2]
            }
        };

        var isCorrect = this.presenter.isCurrentFrameCorrectlySelected();

        assertFalse(isCorrect);
    },

    'test incorrect answer from multiple choices': function () {
        this.presenter.configuration = {
            currentFrame: 3,
            correctFrames: {
                frames: [1, 2, 4]
            }
        };

        var isCorrect = this.presenter.isCurrentFrameCorrectlySelected();

        assertFalse(isCorrect);
    }
});

TestCase("Score calculation", {
    setUp: function () {
        this.presenter = AddonImage_Viewer_Public_create();
        this.presenter.configuration = {
            shouldCalcScore: true
        };
    },

    'test score calculation when is not exercise mode': function () {
        this.presenter.configuration.correctFrames = {
            isExerciseMode: false
        };

        assertEquals(0, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount());
        assertEquals(0, this.presenter.getMaxScore());
    },

    'test positive score': function () {
        this.presenter.configuration.currentFrame = 3;
        this.presenter.configuration.correctFrames = {
            frames: [2, 3, 4],
            isExerciseMode: true
        };

        assertEquals(1, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount());
        assertEquals(1, this.presenter.getMaxScore());
    },

    'test error': function () {
        this.presenter.configuration.currentFrame = 5;
        this.presenter.configuration.correctFrames = {
            frames: [2, 3, 4],
            isExerciseMode: true
        };

        assertEquals(0, this.presenter.getScore());
        assertEquals(1, this.presenter.getErrorCount());
        assertEquals(1, this.presenter.getMaxScore());
    },

    'test no user interactions was made': function () {
        this.presenter.configuration.currentFrame = 5;
        this.presenter.configuration.correctFrames = {
            frames: [2, 3, 4],
            isExerciseMode: true
        };
        this.presenter.configuration.shouldCalcScore = false;

        assertEquals(0, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount());
        assertEquals(1, this.presenter.getMaxScore());
    }


});