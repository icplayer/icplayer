TestCase("[Table] [Value Change Observer] GetEventData", {
    setUp: function () {
        this.presenter = AddonTable_create();

        this.presenter.gapsContainer = new this.presenter.GapsContainerObject();

        this.stubs = {
            getGapIndexByObjectID: sinon.stub(this.presenter.gapsContainer, 'getGapIndexByObjectID')
        };

        this.expectedValue = "Asdfasfdsa";
        this.expectedAddonID = "expectedAddonID";
        this.expectedObjectID = "expectedObjectID";

        this.presenter.configuration = {
            addonID: this.expectedAddonID
        };

        this.data = {
            isCorrect: true,
            value: this.expectedValue,
            objectID: this.expectedObjectID
        };
    },

    tearDown: function () {
        this.presenter.gapsContainer.getGapIndexByObjectID.restore();
    },

    'test should return score equal 1 if isCorrect': function () {
        var result = this.presenter.ValueChangeObserver.prototype.getEventData(this.data);

        assertEquals(1, result.score);
    },

    'test should return score equal 0 if isInCorrect': function () {
        this.data.isCorrect = false;

        var result = this.presenter.ValueChangeObserver.prototype.getEventData(this.data);

        assertEquals(0, result.score);
    },

    'test should return value equal to data value': function () {
        var result = this.presenter.ValueChangeObserver.prototype.getEventData(this.data);

        assertEquals(this.expectedValue, result.value);
    },

    'test should return source equal to addonID': function () {
        var result = this.presenter.ValueChangeObserver.prototype.getEventData(this.data);

        assertEquals(this.expectedAddonID, result.source);
    },

    'test should return item equal to 1-n based gap index': function () {
        this.stubs.getGapIndexByObjectID.returns(1);

        var result = this.presenter.ValueChangeObserver.prototype.getEventData(this.data);

        assertTrue(this.stubs.getGapIndexByObjectID.calledWith(this.expectedObjectID));
        assertTrue(this.stubs.getGapIndexByObjectID.calledOnce);
        assertEquals(1, result.item);
    }
});

TestCase("[Table] [Value Change Observer] Notify", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.gapsContainer = {
            setIsAttemptedByGapId: sinon.spy()
        };

        this.stubs = {
            sendEvent: sinon.stub(),
            getEventData: sinon.stub(this.presenter.ValueChangeObserver.prototype, 'getEventData'),
            setIsAttemptedByGapId: this.presenter.gapsContainer.setIsAttemptedByGapId
        };

        this.presenter.eventBus = {
            sendEvent: this.stubs.sendEvent
        };

        this.valueChangeObserver = new this.presenter.ValueChangeObserver();
        this.expectedData = {
            test: "asl;kdfj;safa",
            argh: "v.xc,nzjada"
        };

        sinon.stub(this.presenter, 'getScore');
        sinon.stub(this.presenter, 'getMaxScore');
        sinon.stub(this.presenter, 'sendAllOKEvent');
    },
    
    tearDown: function () {
        this.presenter.ValueChangeObserver.prototype.getEventData.restore();
        this.presenter.getScore.restore();
        this.presenter.getMaxScore.restore();
        this.presenter.sendAllOKEvent.restore();
    },

    'test should send ValueChanged event by event bus with provided data by getEventData': function () {
        this.stubs.getEventData.returns(this.expectedData);
        this.presenter.configuration = {
            isVisible: true
        };

        this.valueChangeObserver.notify({});

        assertTrue(this.stubs.sendEvent.calledOnce);
        assertTrue(this.stubs.sendEvent.calledWith('ValueChanged', this.expectedData));
    }

});
