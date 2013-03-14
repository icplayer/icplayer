TestCase("Frame number validation", {
    setUp: function() {
        this.presenter = AddonImage_Viewer_Public_create();
    },

    tearDown: function() {
    },

    'test frame number is valid' : function() {
        assertTrue(this.presenter.isValidFrameNumber('3', 6));
    },

    'test validate first frame number' : function() {
        assertTrue(this.presenter.isValidFrameNumber('1', 6));
    },

    'test validate last frame number' : function() {
        assertTrue(this.presenter.isValidFrameNumber('6', 6));
    },

    'test frame number is NaN' : function() {
        assertFalse(this.presenter.isValidFrameNumber('frame', 6));
    },

    'test frame number undefined' : function() {
        assertFalse(this.presenter.isValidFrameNumber(undefined, 6));
    },

    'test frame number empty string' : function() {
        assertFalse(this.presenter.isValidFrameNumber('', 6));
    },

    'test frame number out of bounds - too low' : function() {
        assertFalse(this.presenter.isValidFrameNumber('0', 6));
    },

    'test frame number out of bounds - too high' : function() {
        assertFalse(this.presenter.isValidFrameNumber('7', 6));
    }
});