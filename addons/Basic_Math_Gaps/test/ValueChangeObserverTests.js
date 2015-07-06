TestCase("[Basic Math Gaps] [Value Change Observer] Notify", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();
        this.presenter.gapsContainer = new this.presenter.GapsContainerObject();
        this.observer = new this.presenter.ValueChangeObserver();

        this.presenter.eventBus = {
            sendEvent: function () {}
        };

        this.presenter.configuration = {
            isEquation: false
        };

        this.stubs = {
            canSendEvent: sinon.stub(this.presenter.GapsContainerObject.prototype, 'canSendEvent'),
            createEventData: sinon.stub(this.presenter, 'createEventData'),
            sendEvent: sinon.stub(this.presenter.eventBus, 'sendEvent'),
            isAllOK: sinon.stub(this.presenter, 'isAllOK'),
            sendAllOKEvent: sinon.stub(this.presenter, 'sendAllOKEvent'),
            getGapIndexByID: sinon.stub(this.presenter.GapsContainerObject.prototype, 'getGapIndexByID')
        };
    },

    tearDown: function () {
        this.presenter.GapsContainerObject.prototype.canSendEvent.restore();
        this.presenter.GapsContainerObject.prototype.getGapIndexByID.restore();

        this.presenter.createEventData.restore();
        this.presenter.eventBus.sendEvent.restore();
        this.presenter.isAllOK.restore();
        this.presenter.sendAllOKEvent.restore();
    },

    'test when addon cant send data it shouldnt do it': function () {
        this.stubs.canSendEvent.returns(false);

        this.observer.notify({});

        assertFalse(this.stubs.sendEvent.called);
    },

    'test when addon can send data it should do it': function () {
        this.stubs.canSendEvent.returns(true);
        this.stubs.isAllOK.returns(false);

        this.observer.notify({});

        assertTrue(this.stubs.sendEvent.called);
    },

    'test addon shouldnt send all ok event if not all is ok': function () {
        this.stubs.canSendEvent.returns(true);
        this.stubs.isAllOK.returns(false);

        this.observer.notify({});

        assertFalse(this.stubs.sendAllOKEvent.called);
    },

    'test when addon is all ok it should sent all ok event': function () {
        this.stubs.canSendEvent.returns(true);
        this.stubs.isAllOK.returns(true);

        this.observer.notify({});

        assertTrue(this.stubs.sendAllOKEvent.calledOnce);
    },

    'test when addon isEquation it shouldnt send all ok event by presenter function': function () {
        this.stubs.canSendEvent.returns(true);
        this.stubs.isAllOK.returns(true);
        this.presenter.configuration.isEquation = true;

        this.observer.notify({});

        assertFalse(this.stubs.sendAllOKEvent.calledOnce);
    }
});