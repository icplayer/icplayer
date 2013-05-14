TestCase("Runtime exceptions catching", {
    setUp: function () {
        this.presenter = AddonAdvanced_Connector_create();

        sinon.stub(this.presenter, 'alertErrorMessage');
    },

    tearDown: function () {
        this.presenter.alertErrorMessage.restore();
    },

    'test exception occurred while filtering events': function () {
        var eventData = {
            source: 'ImageViewer1',
            item: '2',
            value: '1',
            score: ''
        };

        this.presenter.filterEvents([{ Source: '?<={index:)\d+(?=}', Code: '' }], eventData, 'ValueChanged');

        assertTrue(this.presenter.alertErrorMessage.calledOnce);
    },

    'test exception occurred while running scripts': function () {
        var eventData = {
            source: 'Connection',
            item: '2',
            value: '1',
            score: ''
        };

        this.presenter.events = [{
            Source: 'Connection',
            Item: '.*',
            Value: '.*',
            Score: '.*',
            Code: 'throw "this is test runtime error"'
        }];

        this.presenter.onEventReceived('ValueChanged', eventData);

        assertTrue(this.presenter.alertErrorMessage.calledOnce);
    }
});

TestCase("Runtime exceptions notification", {
    setUp: function () {
        this.presenter = AddonAdvanced_Connector_create();

        sinon.stub(window, 'alert');
    },

    tearDown: function () {
        window.alert.restore();
    },

    'test exception is just a string': function () {
        var error = "exception";

        this.presenter.alertErrorMessage(error, "Advanced Connector - some message");

        assertTrue(window.alert.calledWith("Advanced Connector - some message\n\nexception"));
    },

    'test exception is Error object but without name': function () {
        var error = { message: "message" };

        this.presenter.alertErrorMessage(error, "Advanced Connector - some message");

        assertTrue(window.alert.calledWith("Advanced Connector - some message\n\nmessage"));
    },

    'test exception is full Error object (with name and message)': function () {
        var error = new TypeError("type error");

        this.presenter.alertErrorMessage(error, "Advanced Connector - some message");

        assertTrue(window.alert.calledWith("Advanced Connector - some message\n\n[TypeError] type error"));
    }
});