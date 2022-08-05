TestCase("[Gap Binder] Event tests", {
    setUp: function () {
        this.presenter = AddonGap_Binder_create();
        this.presenter.addonID = "Gap_Binder1";
        this.presenter.currentPageIndex = "1111111";

        this.model = createMixedModelForGapBinderTests();
        this.presenter.readModelItems(this.model.Items);

        this.textModule = createTextModuleForGapBinderTests();
        this.tableModule = createTableModuleForGapBinderTests();

        this.stubs = {
            getModuleStub: sinon.stub(),
            showAnswersStub: sinon.stub(),
            hideAnswersStub: sinon.stub(),
            sendEventStub: sinon.stub(),
        }
        this.presenter.showAnswers = this.stubs.showAnswersStub;
        this.presenter.hideAnswers = this.stubs.hideAnswersStub;
        this.stubs.getModuleStub.callsFake((moduleID) => this.getModuleFake(moduleID));
        this.presenter.playerController = {
            getModule: this.stubs.getModuleStub
        };
        this.presenter.eventBus = {
            sendEvent: this.stubs.sendEventStub
        };
    },

    getModuleFake: function (moduleID) {
        return moduleID === "Text1"
            ? this.textModule
            : this.tableModule;
    },

    setGapValue: function (module, gapIndex, newValue) {
        const $view = module.getView();
        const gaps = $view.find(".ic_gap").toArray();
        gaps[gapIndex].value = newValue;
    },

    getGapValue: function (module, gapIndex) {
        const $view = module.getView();
        const gaps = $view.find(".ic_gap").toArray();
        return gaps[gapIndex].value;
    },

    'test createEventData': function () {
        const item = "item1";
        const value = 14;
        const score = 1;

        const result = this.presenter.createEventData(item, value, score);

        const expectedEventData = {
            'source': "" + this.presenter.addonID,
            'item': "" + item,
            'value': "" + value,
            'score': "" + score
        }
        assertEquals(expectedEventData, result);
    },

    'test sendAllOKEvent': function () {
        this.presenter.sendAllOKEvent();

        const expectedEventData = {
            'source': "" + this.presenter.addonID,
            'item': "all",
            'value': "",
            'score': ""
        }
        assertEquals(1, this.stubs.sendEventStub.callCount);
        assertTrue(this.stubs.sendEventStub.calledWith("ValueChanged", expectedEventData));
    },

    'test given addon when ShowAnswers event received then call showAnswers': function () {
        const eventName = "ShowAnswers"

        this.presenter.onEventReceived(eventName);

        assertTrue(this.presenter.showAnswers.calledOnce);
    },

    'test given addon when HideAnswers event received then call hideAnswers': function () {
        const eventName = "HideAnswers"

        this.presenter.onEventReceived(eventName);

        assertTrue(this.presenter.hideAnswers.calledOnce);
    },

    'test given addon when ValueChanged event received from connected Table1 module then send ValueChanged event': function () {
        const eventName = "ValueChanged"
        const eventData = {
            moduleType: "table",
            source: "Table1",
            item: "1",
            value: "Some value",
            score: "0"
        };

        this.presenter.onEventReceived(eventName, eventData);

        assertTrue(this.stubs.sendEventStub.calledOnce);
    },

    'test given addon when ValueChanged event received from connected Text1 module then send ValueChanged event': function () {
        const eventName = "ValueChanged"
        const eventData = {
            moduleType: "Text",
            source: "Text1",
            item: "1",
            value: "Some value",
            score: "0"
        };

        this.presenter.onEventReceived(eventName, eventData);

        assertTrue(this.stubs.sendEventStub.calledOnce);
    },

    'test given addon when ValueChanged event received from not connected Text2 module then do not send ValueChanged event': function () {
        const eventName = "ValueChanged"
        const eventData = {
            moduleType: "Text",
            source: "Text2",
            item: "1",
            value: "Some value",
            score: "0"
        };

        this.presenter.onEventReceived(eventName, eventData);

        assertFalse(this.stubs.sendEventStub.called);
    },

    'test given addon when ValueChanged event received from module with name of connected module but wrong moduleType then do not send ValueChanged event': function () {
        const eventName = "ValueChanged"
        const eventData = {
            moduleType: "crossword",
            source: "Text1",
            item: "1",
            value: "Some value",
            score: "0"
        };

        this.presenter.onEventReceived(eventName, eventData);

        assertFalse(this.stubs.sendEventStub.called);
    },

    'test given addon when ValueChanged event received from connected module but not exising item then do not send ValueChanged event': function () {
        const eventName = "ValueChanged"
        const eventData = {
            moduleType: "Text",
            source: "Text1",
            item: "99",
            value: "Some value",
            score: "0"
        };

        this.presenter.onEventReceived(eventName, eventData);

        assertFalse(this.stubs.sendEventStub.called);
    },

    'test given addon when ValueChanged isAllOK event received from connected module then do not send ValueChanged event': function () {
        const eventName = "ValueChanged"
        const eventData = {
            moduleType: "Text",
            source: "Text1",
            item: "all",
            value: "",
            score: ""
        };

        this.presenter.onEventReceived(eventName, eventData);

        assertFalse(this.stubs.sendEventStub.called);
    },

    'test given addon when ValueChanged event received from connected module with correct value for gap binder then send ValueChanged event with score 1': function () {
        const eventName = "ValueChanged"
        const eventData = {
            moduleType: "table",
            source: "Table1",
            item: "2",
            value: "ans6",
            score: "0"
        }

        this.setGapValue(this.tableModule, 1, "ans6");
        this.presenter.onEventReceived(eventName, eventData);

        const expectedEventData = {
            source: this.presenter.addonID,
            item: "5",
            value: "ans6",
            score: "1",
        };
        assertEquals(1, this.stubs.sendEventStub.callCount);
        assertTrue(this.stubs.sendEventStub.calledWith(eventName, expectedEventData));
    },

    'test given addon when ValueChanged event received from connected module with wrong value for gap binder then send ValueChanged event with score 0': function () {
        const eventName = "ValueChanged"
        const eventData = {
            moduleType: "table",
            source: "Table1",
            item: "2",
            value: "good answer for text",
            score: "1"
        }

        this.setGapValue(this.tableModule, 1, "good answer for text");
        this.presenter.onEventReceived(eventName, eventData);

        const expectedEventData = {
            source: this.presenter.addonID,
            item: "5",
            value: "good answer for text",
            score: "0",
        };
        assertEquals(1, this.stubs.sendEventStub.callCount);
        assertTrue(this.stubs.sendEventStub.calledWith(eventName, expectedEventData));
    },

    'test given addon with 5/6 correct answers when ValueChanged event received with information of last correct filled in gap from connected module then send ValueChanged event with score 1 and ValueChanged isAllOk event': function () {
        this.setGapValue(this.textModule, 0, "ans1");
        this.setGapValue(this.textModule, 1, "ans2");
        this.setGapValue(this.textModule, 2, "ans3");
        this.setGapValue(this.tableModule, 0, "ans4");
        this.setGapValue(this.tableModule, 1, "ans5");
        this.setGapValue(this.tableModule, 2, "wrong answer");
        const eventName = "ValueChanged"
        const eventData = {
            moduleType: "table",
            source: "Table1",
            item: "3",
            value: "ans6",
            score: "0"
        }

        this.setGapValue(this.tableModule, 2, "ans6");
        this.presenter.onEventReceived(eventName, eventData);

        const expectedValueChangedEventData = {
            source: this.presenter.addonID,
            item: "6",
            value: "ans6",
            score: "1",
        };
        const expectedIsAllOKEventData = {
            source: this.presenter.addonID,
            item: "all",
            value: "",
            score: "",
        };
        assertEquals(2, this.stubs.sendEventStub.callCount);
        assertTrue(this.stubs.sendEventStub.getCall(0).calledWith(eventName, expectedValueChangedEventData));
        assertTrue(this.stubs.sendEventStub.getCall(1).calledWith(eventName, expectedIsAllOKEventData));
    },

    'test given addon when ValueChanged event received from connected module with given value then send ValueChanged event with this same value': function () {
        const eventName = "ValueChanged"
        const eventData = {
            moduleType: "table",
            source: "Table1",
            item: "2",
            value: "given value",
            score: "1"
        }

        this.setGapValue(this.tableModule, 1, "true value in gap");
        this.presenter.onEventReceived(eventName, eventData);

        const expectedEventData = {
            source: this.presenter.addonID,
            item: "5",
            value: "given value",
            score: "0",
        };
        assertEquals(1, this.stubs.sendEventStub.callCount);
        assertTrue(this.stubs.sendEventStub.calledWith(eventName, expectedEventData));
        assertEquals("true value in gap", this.getGapValue(this.tableModule, 1));
    },
});
