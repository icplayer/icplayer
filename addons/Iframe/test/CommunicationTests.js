TestCase("[Iframe] sendMessage", {

    setUp: function () {
        this.presenter = AddonIframe_create();
        this.presenter.configuration = {
            communicationID : "test"
        };

        this.presenter.iframeContent = {
            postMessage : function () {}
        };

        this.spies = {
            postMessage:sinon.spy(this.presenter.iframeContent, 'postMessage')
        }
    },

    tearDown: function () {
        this.spies.postMessage.restore();
    },

    'test there should be well postMessage call' : function () {
        var firstParam = { id: "test", actionID: "STATE_ACTUALIZATION", params: {iframeState: "something",  iframeScore: "sth"}};
        var secondParam = "*";

        this.presenter.sendMessage("STATE_ACTUALIZATION", {iframeState: "something",  iframeScore: "sth"});
        sinon.assert.calledWith(this.spies.postMessage, firstParam, secondParam);
    },

    'test if there is no params there should be params autofill' : function () {
        var firstParam = { id: "test", actionID: "STATE_ACTUALIZATION", params: {}};
        var secondParam = "*";

        this.presenter.sendMessage("STATE_ACTUALIZATION");
        sinon.assert.calledWith(this.spies.postMessage, firstParam, secondParam);
    }
});
TestCase("[Iframe] validateMessage", {
    setUp: function () {
        this.presenter = AddonIframe_create();
        this.presenter.configuration = {
            communicationID : "test"
        };

        this.validMessage = {
            id : "test",
            actionID : "someID"
        };

        this.noActionIDMessage = {
            id : "test"
        };
        this.invalidMessage = {
            id : "something",
            actionID: "someAction"
        }
    },

    'test if there is valid id and actionID there should be true': function () {
        var result = this.presenter.validateMessage(this.validMessage);
        assertTrue(result);
    },

    'test if there is no actionID there should be false' : function () {
        var result = this.presenter.validateMessage(this.noActionIDMessage);
        assertFalse(result);
    },

    'test if there is wrong id there should be false' : function () {
        var result = this.presenter.validateMessage(this.invalidMessage);
        assertFalse(result);
    }
});
TestCase("[Iframe] getMessage", {

    setUp: function () {
        this.presenter = AddonIframe_create();
        this.presenter.configuration = {
            communicationID : "test"
        };
        this.presenter.iframeContent = {
            postMessage : function () {}
        };

        this.presenter.eventBus = {
            sendEvent: sinon.spy()
        };

        this.validStateRequestMessage = {
            data: {
                id: "test",
                actionID: "STATE_REQUEST"
            }
        };

        this.validStateActualizationMessage = {
            data: {
                id: "test",
                actionID: "STATE_ACTUALIZATION"
            }
        };

        this.validFileDictionaryRequest = {
            data: {
                id: "test",
                actionID: "FILE_DICTIONARY_REQUEST"
            }
        };

        this.validCustomEventRequest = {
            data: {
                id: "test",
                actionID: "CUSTOM_EVENT"
            }
        };

        this.spys = {
            sendMessage : sinon.spy(this.presenter, 'sendMessage')
        };

        this.stubs = {
            setStateActualization : sinon.stub(this.presenter,'setStateActualization').callsFake(function () {})
        };

    },

    tearDown : function () {
        this.spys.sendMessage.restore();
        this.stubs.setStateActualization.restore();
    },

    'test if there is STATE_REQUEST there should be sendMessage once called' : function () {
        this.presenter.getMessage(this.validStateRequestMessage);
        sinon.assert.calledWith(this.spys.sendMessage, "STATE_ACTUALIZATION");
        sinon.assert.calledOnce(this.spys.sendMessage);
    },

    'test if there is STATE_ACTUZALIZATION there should be setStateActualization once called' : function () {
        this.presenter.getMessage(this.validStateActualizationMessage);
        sinon.assert.calledOnce(this.stubs.setStateActualization);
    },

    'test if there is FILE_DICTIONARY_REQUEST there should be sendMessage once called' : function () {
        this.presenter.getMessage(this.validFileDictionaryRequest);
        sinon.assert.calledWith(this.spys.sendMessage, "FILE_DICTIONARY_ACTUALIZATION");
        sinon.assert.calledOnce(this.spys.sendMessage);
    },

    'test if addon received custom event then will send ValueChanged with custom event value': function () {
        this.presenter.getMessage(this.validCustomEventRequest);

        sinon.assert.calledOnce(this.presenter.eventBus.sendEvent);
    }
});