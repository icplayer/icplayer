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