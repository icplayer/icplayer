TestCase("[Video] formatTime", {

    setUp: function () {
        this.presenter = new Addonvideo_create();
    },

    'test should return 00:00 for zero seconds': function () {
        var result = this.presenter.formatTime(0);

        assertEquals("00:00", result);
    },

    'test should return number of minutes in seconds in format MM:SS': function () {
        var result = this.presenter.formatTime(70);

        assertEquals("01:10", result);
    },

    'test should return 00:00 for negative number': function () {
        var result = this.presenter.formatTime(-1);

        assertEquals("00:00", result);
    },

    'test should return 00:00 for not a number': function () {
        var result = this.presenter.formatTime("Test");

        assertEquals("00:00", result);
    }
});