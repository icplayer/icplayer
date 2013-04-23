TestCase("Events - data creation", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {
            addonID: 'Table1'
        };
    },

    'test create event data': function () {
        var eventData = this.presenter.createEventData(2, "val", 1);

        assertEquals("Table1", eventData.source);
        assertEquals("2", eventData.item);
        assertEquals("val", eventData.value);
        assertEquals("1", eventData.score);
    }
});

TestCase("Events - event sending", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {
            addonID: 'Table1',
            isCaseSensitive: false,
            isPunctuationIgnored: false,
            gaps: {
                descriptions: [
                    { answers: [""], id: "Table1-1", value: "" },
                    { answers: ["ans1"], id: "Table1-2", value: "" },
                    { answers: [""], id: "Table1-3", value: "" },
                    { answers: ["answ1", "answ2", "answ3"], id: "Table1-4", value: "" }
                ]
            }
        };


        this.presenter.eventBus = {
            sendEvent: function () {}
        };
        sinon.stub(this.presenter.eventBus, 'sendEvent');
    },

    'test proper value in gap': function () {
        this.presenter.configuration.gaps.descriptions[1].value = "ans1";
        var expectedEventData = {
            source: "Table1",
            item: "2",
            value: "ans1",
            score: "1"
        };

        this.presenter.sendValueChangeEvent(1);

        assertEquals('ValueChanged', this.presenter.eventBus.sendEvent.getCall(0).args[0]);
        assertEquals(expectedEventData, this.presenter.eventBus.sendEvent.getCall(0).args[1]);
    },

    'test wrong value in gap': function () {
        this.presenter.configuration.gaps.descriptions[1].value = "ans2";
        var expectedEventData = {
            source: "Table1",
            item: "2",
            value: "ans2",
            score: "0"
        };

        this.presenter.sendValueChangeEvent(1);

        assertEquals('ValueChanged', this.presenter.eventBus.sendEvent.getCall(0).args[0]);
        assertEquals(expectedEventData, this.presenter.eventBus.sendEvent.getCall(0).args[1]);
    }
});