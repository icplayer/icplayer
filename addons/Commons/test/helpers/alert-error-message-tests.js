TestCase("[Commons - Helpers] Alert error message", {
    setUp: function () {
        sinon.stub(window, 'alert');
    },

    tearDown: function () {
        window.alert.restore();
    },

    'test exception is just a string': function () {
        var error = "exception";

        Helpers.alertErrorMessage(error, "Advanced Connector - some message");

        assertTrue(window.alert.calledWith("Advanced Connector - some message\n\nexception"));
    },

    'test exception is Error object but without name': function () {
        var error = { message: "message" };

        Helpers.alertErrorMessage(error, "Advanced Connector - some message");

        assertTrue(window.alert.calledWith("Advanced Connector - some message\n\nmessage"));
    },

    'test exception is full Error object (with name and message)': function () {
        var error = new TypeError("type error");

        Helpers.alertErrorMessage(error, "Advanced Connector - some message");

        assertTrue(window.alert.calledWith("Advanced Connector - some message\n\n[TypeError] type error"));
    }
});