TestCase("Runtime exceptions catching", {
    setUp: function () {
        this.presenter = AddonVisual_Feedback_Creator_create();

        sinon.stub(Helpers, 'alertErrorMessage');
    },

    tearDown: function () {
        Helpers.alertErrorMessage.restore();
    },

    'test exception occurred while filtering events': function () {
        var eventData = {
            source: 'ImageViewer1',
            item: '2',
            value: '1',
            score: ''
        };

        this.presenter.filterEvents([{ Source: '?<={index:)\d+(?=}', Code: '' }], eventData, 'ValueChanged');

        assertTrue(Helpers.alertErrorMessage.calledOnce);
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

        assertTrue(Helpers.alertErrorMessage.calledOnce);
    }
});