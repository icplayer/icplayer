TestCase("[Connection] Line", {
    setUp: function () {
        debugger;
        this.presenter = AddonConnection_create();
        this.presenter.configuration = {
            initialConnections: [
                this.getInitialValue("a", "1", true),
                this.getInitialValue("b", "2", false),
                this.getInitialValue("ab", "3", false)
            ]
        };
        var fromElement = $('<div id="connection-1"></div>');
        var toElement = $('<div id="connection-a"></div>');

        this.line = new this.presenter.__internal__.Line(fromElement, toElement);
    },

    'test given initial values with disabled path when isDisabled is called then will return true': function () {
        debugger;
        var expectedValue = true;

        var isDisabled = this.line.isDisabled();

        assertEquals(expectedValue, isDisabled);
    },

    'test given initial values without disabled path when isDisabled is called then will return false': function () {
        var expectedValue = false;
        this.presenter.configuration.initialConnections[0].from = "cc";

        var isDisabled = this.line.isDisabled();

        assertEquals(expectedValue, isDisabled);
    },

    'test given initial values with defined path and with enabled connection when isDisabled is called then will return false': function () {
        var expectedValue = false;
        this.presenter.configuration.initialConnections[0].isDisabled = false;

        var isDisabled = this.line.isDisabled();

        assertEquals(expectedValue, isDisabled);
    },

    getInitialValue: function (from, to, isDisabled) {
        return {
            from: from,
            to: to,
            isDisabled: isDisabled
        };
    }
});