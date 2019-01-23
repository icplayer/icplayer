function getInitialValue (from, to, isDiabled) {
    return {
        from: from,
        to: to,
        isDisabled: isDiabled
    };
}

TestCase("[Connection] Line", {
    setUp: function () {
        this.presenter = AddonConnection_create();
        this.presenter.initialValues = [
            getInitialValue("a", "1", true),
            getInitialValue("b", "2", false),
            getInitialValue("ab", "3", false)
        ];
        var fromElement = $('<div id="connection-1"></div>');
        var toElement = $('<div id="connection-a"></div>');

        this.line = new this.presenter.__internal__.Line(fromElement, toElement);
    },

    'test given initial values with disabled path when isDisabled is called then will return true': function () {
        var expectedValue = true;

        var isDisabled = this.line.isDisabled();

        assertEquals(expectedValue, isDisabled);
    },

    'test given initial values without disabled path when isDisabled is called then will return false': function () {
        var expectedValue = false;
        this.presenter.initialValues[0].from = "cc";

        var isDisabled = this.line.isDisabled();

        assertEquals(expectedValue, isDisabled);
    },

    'test given initial values with defined path and with enabled connection when isDisabled is called then will return false': function () {
        var expectedValue = false;
        this.presenter.initialValues[0].isDisabled = false;

        var isDisabled = this.line.isDisabled();

        assertEquals(expectedValue, isDisabled);
    }
});