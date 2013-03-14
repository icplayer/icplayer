TestCase("Correct frame validation", {
    setUp: function() {
        this.presenter = AddonImage_Viewer_Public_create();
    },

    'test undefined': function() {
        var validationResult = this.presenter.validateCorrectFrame(undefined, 6);

        assertUndefined(validationResult.frames);
        assertFalse(validationResult.isExerciseMode);
        assertUndefined(validationResult.errorCode);
    },

    'test empty string': function() {
        var validationResult = this.presenter.validateCorrectFrame("", 6);

        assertUndefined(validationResult.frames);
        assertFalse(validationResult.isExerciseMode);
        assertUndefined(validationResult.errorCode);
    },

    'test single answer': function() {
        var validationResult = this.presenter.validateCorrectFrame("1", 6);

        assertEquals([0], validationResult.frames);
        assertTrue(validationResult.isExerciseMode);
        assertUndefined(validationResult.errorCode);
    },

    'test multiple answers': function() {
        var validationResult = this.presenter.validateCorrectFrame("1, 3, 6", 6);

        assertEquals([0, 2, 5], validationResult.frames);
        assertTrue(validationResult.isExerciseMode);
        assertUndefined(validationResult.errorCode);
    },

    'test not a number': function() {
        var validationResult = this.presenter.validateCorrectFrame("1, number, 5", 6);

        assertEquals("FN_02", validationResult.errorCode);
        assertUndefined(validationResult.frames);
        assertUndefined(validationResult.isExerciseMode);
    },

    'test out of bounds - frame number too low': function() {
        var validationResult = this.presenter.validateCorrectFrame("1, 0", 6);

        assertEquals("CF_01", validationResult.errorCode);
        assertUndefined(validationResult.frames);
        assertUndefined(validationResult.isExerciseMode);
    },

    'test out of bounds - frame number too high': function() {
        var validationResult = this.presenter.validateCorrectFrame("1, 7", 6);

        assertEquals("CF_01", validationResult.errorCode);
        assertUndefined(validationResult.frames);
        assertUndefined(validationResult.isExerciseMode);
    }
});