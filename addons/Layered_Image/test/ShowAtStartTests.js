TestCase("Boolean validation", {
    setUp: function () {
        this.presenter = AddonLayered_Image_create();
    },

    'test undefined value': function () {
        var validationResult = this.presenter.showAtStart(undefined);

        assertFalse(validationResult);
    },

    'test empty string value': function () {
        var validationResult = this.presenter.showAtStart("");

        assertFalse(validationResult);
    },

    'test "True" value': function () {
        var validationResult = this.presenter.showAtStart("True");

        assertTrue(validationResult);
    },

    'test numeric "True" value': function () {
        var validationResult = this.presenter.showAtStart("1");

        assertTrue(validationResult);
    },

    'test "False" value': function () {
        var validationResult = this.presenter.showAtStart("False");

        assertFalse(validationResult);
    },

    'test numeric "False" value': function () {
        var validationResult = this.presenter.showAtStart("0");

        assertFalse(validationResult);
    }
});