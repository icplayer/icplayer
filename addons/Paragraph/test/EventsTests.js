TestCase("[Paragraph] Event tests", {
    setUp: function () {
        this.presenter = AddonParagraph_create();
        this.presenter.configuration = {
            ID: "Placeholder1"
        };

        this.stubs = {
            isAttempted: sinon.stub(),
            addEventListener: sinon.stub(),
            sendEvent: sinon.stub(),
            sendEmptyEvent: sinon.stub(),
            sendModifiedEvent: sinon.stub(),
            sendOnBlurEvent: sinon.stub(),
        };

        this.presenter.eventBus = {
            addEventListener: this.stubs.addEventListener,
            sendEvent: this.stubs.sendEvent
        };
        this.presenter.setEventBus(this.presenter.eventBus);
        this.presenter.isAttempted = this.stubs.isAttempted;
    },

    'test given attempted module when blur then send blur event': function () {
        this.stubs.isAttempted.returns(true);
        this.presenter.sendModifiedEvent = this.stubs.sendModifiedEvent;

        this.presenter.onEditorBlur();

        assertTrue(this.stubs.sendEvent.calledWith("ValueChanged", {
            'source': "Placeholder1",
            'item': '',
            'value': 'blur',
            'score': ''
        }));
    },

    'test given not attempted module when blur then send blur event': function () {
        this.stubs.isAttempted.returns(false);
        this.presenter.sendEmptyEvent = this.stubs.sendEmptyEvent;

        this.presenter.onEditorBlur();

        assertTrue(this.stubs.sendEvent.calledWith("ValueChanged", {
            'source': "Placeholder1",
            'item': '',
            'value': 'blur',
            'score': ''
        }));
    },

    'test given attempted module when blur then send modified event': function () {
        this.stubs.isAttempted.returns(true);
        this.presenter.sendOnBlurEvent = this.stubs.sendOnBlurEvent;

        this.presenter.onEditorBlur();

        assertTrue(this.stubs.sendEvent.calledWith("ValueChanged", {
            'source': "Placeholder1",
            'item': '',
            'value': 'modified',
            'score': ''
        }));
    },

    'test given not attempted module when blur then send empty event': function () {
        this.stubs.isAttempted.returns(false);
        this.presenter.sendOnBlurEvent = this.stubs.sendOnBlurEvent;

        this.presenter.onEditorBlur();

        assertTrue(this.stubs.sendEvent.calledWith("ValueChanged", {
            'source': "Placeholder1",
            'item': '',
            'value': 'empty',
            'score': ''
        }));
    },

    'test given attempted module when preDestroy executed then do not send any event': function () {
        this.stubs.isAttempted.returns(true);

        this.presenter.preDestroy();

        assertEquals(0, this.stubs.sendEvent.callCount);
    },

    'test given not attempted module when preDestroy executed then send empty event': function () {
        this.stubs.isAttempted.returns(false);

        this.presenter.preDestroy();

        assertTrue(this.stubs.sendEvent.calledWith("ValueChanged", {
            'source': "Placeholder1",
            'item': '',
            'value': 'empty',
            'score': ''
        }));
    }
});
