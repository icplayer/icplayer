TestCase('[MultiAudio] Event handling tests', {
    setUp: function () {
        this.presenter = AddonMultiAudio_create();

        this.presenter.addonID = "MultiAudio1";
        this.stubs = {
            applySelectedClass: sinon.stub()
        };
        this.presenter.applySelectedClass = this.stubs.applySelectedClass;
    },

    'test given ItemSelected event with item set to null when handling event then does not call applySelectedClass': function () {
        var eventName = "ItemSelected";
        var eventData = {
            item: null
        };
        this.presenter.onEventReceived(eventName, eventData);

        assertEquals(0, this.stubs.applySelectedClass.callCount);
    },

    'test given ItemSelected event with item name begining with addonID when handling event then does call applySelectedClass': function () {
        var expectedArg = "Expected";
        var eventName = "ItemSelected";
        var eventData = {
            item: this.presenter.addonID + "-" + expectedArg
        };
        this.presenter.onEventReceived(eventName, eventData);

        assertEquals(1, this.stubs.applySelectedClass.callCount);
        assertTrue(this.stubs.applySelectedClass.calledWith(expectedArg));
    },

    'test given ItemSelected event with name not begining with addonID when handling event then does call applySelectedClass with null': function () {
        var expectedArg = "Expected";
        var eventName = "ItemSelected";
        var eventData = {
            item: "-" + expectedArg
        };
        this.presenter.onEventReceived(eventName, eventData);

        assertEquals(1, this.stubs.applySelectedClass.callCount);
        assertTrue(this.stubs.applySelectedClass.calledWith(null));
    }
});