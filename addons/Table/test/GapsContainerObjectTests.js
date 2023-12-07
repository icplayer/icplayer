var helperFunctions = {
    getStubsToCreateGapUtilsObjects: function getStubsToCreateGapUtilsObjects () {
        return {
            createView: sinon.stub(DraggableDroppableObject.prototype, 'createView'),
            connectEvents: sinon.stub(DraggableDroppableObject._internal, 'connectEvents'),
            validateConfiguration: sinon.stub(DraggableDroppableObject._internal, 'validateConfiguration')
        };
    },

    restoreStubsToCreateGapUtilsObjects: function restoreStubsToCreateGapUtilsObjects () {
        DraggableDroppableObject.prototype.createView.restore();
        DraggableDroppableObject._internal.connectEvents.restore();
        DraggableDroppableObject._internal.validateConfiguration.restore();
    }
};

TestCase("[Table] [Gaps Container Object] Add Gap", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.container = new this.presenter.GapsContainerObject();

        this.expectedGap1 = {test: "asdfafsda"};
        this.expectedGap2 = {name: "sdf;ajd;safad"};
        this.expectedGap3 = {qwe: 12398213};

        this.expectedArray = [];

        this.expectedArray.push(this.expectedGap1);
        this.expectedArray.push(this.expectedGap2);
        this.expectedArray.push(this.expectedGap3);
    },

    'test should add provided objects': function () {
        this.container.addGap(this.expectedGap1);
        this.container.addGap(this.expectedGap2);
        this.container.addGap(this.expectedGap3);

        assertEquals(this.expectedArray, this.container.gaps);
    }
});

TestCase("[Table] [Gaps Container Object] replaceDOMViewWithGap / replaceGapsDOMWithView", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {
            addonID: "addonID",
            gapWidth: {isSet: false},
            gapMaxLength: {value: 12}
        };

        this.presenter.$view = $('<div></div>');

        this.stubs = {
            connectEventsEditableGap: sinon.stub(this.presenter.EditableInputGap.prototype, 'connectEvents'),
            connectEventsSelectGap: sinon.stub(this.presenter.SelectGap.prototype, 'connectEvents'),
            validateConfig: sinon.stub(DraggableDroppableObject._internal, 'validateConfiguration'),
            getView: sinon.stub(DraggableDroppableObject.prototype, 'getView'),
            createView: sinon.stub(DraggableDroppableObject.prototype, 'createView'),
            createViewEditable: sinon.stub(this.presenter.EditableInputGap.prototype, 'createView'),
            replaceWith: sinon.stub(),
            attr: sinon.stub(),
            find: sinon.stub(this.presenter.$view, 'find')
        };

        this.mockFoundElement = {
            replaceWith: this.stubs.replaceWith,
            attr: this.stubs.attr
        };

        this.expectedReplacingElement = {
            test: "12p9437uad;fdlka",
            gaptype: 12312331
        };

        this.container = new this.presenter.GapsContainerObject();
        this.gapID1 = "asdffdzxvcz";
        this.gapID2 = ";aw3o948vcxz";
        this.gapID3 = ";lvmcaszhij;";
        this.correctAnswer = ["test"];

        this.gap1 = new this.presenter.EditableInputGap(this.gapID1, this.correctAnswer);
        this.gap2 = new this.presenter.EditableInputGap(this.gapID2, this.correctAnswer);
        this.gap3 = new this.presenter.SelectGap(this.gapID3, this.correctAnswer);

        this.expectedID1 = "#" + this.gapID1;
        this.expectedID2 = "#" + this.gapID2;
        this.expectedID3 = "#" + this.gapID3;

        this.container.addGap(this.gap1);
        this.container.addGap(this.gap2);
        this.container.addGap(this.gap3);
    },

    tearDown: function () {
        DraggableDroppableObject._internal.validateConfiguration.restore();
        DraggableDroppableObject.prototype.getView.restore();
        DraggableDroppableObject.prototype.createView.restore();
        this.presenter.EditableInputGap.prototype.connectEvents.restore();
        this.presenter.SelectGap.prototype.connectEvents.restore();
        this.presenter.EditableInputGap.prototype.createView.restore();
        this.presenter.$view.find.restore();
    },

    'test replaceDOMViewWithGap should filter only gaps which arent select type': function () {
        this.stubs.find.returns(this.mockFoundElement);
        this.stubs.getView.returns(this.expectedReplacingElement);

        this.container.replaceDOMViewWithGap();

        assertEquals(4, this.stubs.find.callCount);
    },

    'test replaceDOMViewWithGap should find html doms element of gaps IDs': function () {
        this.stubs.find.returns(this.mockFoundElement);
        this.stubs.getView.returns(this.expectedReplacingElement);

        this.container.replaceDOMViewWithGap();

        assertEquals(this.expectedID1, this.stubs.find.getCall(0).args[0]);
        assertFalse(this.stubs.find.calledWith(this.expectedID3));
    },

    'test replaceDOMViewWithGap should replace html doms element with gapView': function () {
        this.stubs.find.returns(this.mockFoundElement);
        this.stubs.getView.returns(this.expectedReplacingElement);

        this.container.replaceDOMViewWithGap();

        assertTrue(this.stubs.replaceWith.calledWith(this.expectedReplacingElement));
        assertTrue(this.stubs.replaceWith.calledTwice);
    },

    'test replaceGapsDOMWithView should find view to replace for all gaps': function () {
        this.stubs.find.returns(this.mockFoundElement);

        this.container.replaceGapsDOMWithView();

        assertEquals(3, this.stubs.find.callCount);

        assertEquals(this.expectedID1, this.stubs.find.getCall(0).args[0]);
        assertEquals(this.expectedID2, this.stubs.find.getCall(1).args[0]);
        assertEquals(this.expectedID3, this.stubs.find.getCall(2).args[0]);
    },

    'test replaceGapsDOMWithView should replace all gaps view': function () {
        this.stubs.find.returns(this.mockFoundElement);

        this.container.replaceGapsDOMWithView();

        assertEquals(this.mockFoundElement, this.gap1.$view);
        assertEquals(this.mockFoundElement, this.gap2.$view);
        assertEquals(this.mockFoundElement, this.gap3.$view);
    }
});

TestCase("[Table] [Gaps Container Object] getErrorCount / getScore /getMaxScore", {
    setUp: function () {
        this.presenter = AddonTable_create();

        this.container = new this.presenter.GapsContainerObject();

        this.stubs = {
            createView: sinon.stub(DraggableDroppableObject.prototype, 'createView'),
            connectEvents: sinon.stub(DraggableDroppableObject._internal, 'connectEvents')
        };

        var mockConfig = {
            eventBus: function () {},
            getSelectedItem: function () {},
            addonID: "addonID",
            objectID: "htmlID",
            showAnswersValue: ["1", "2", "3"],

            gapScore: 1
        };


        this.gap1 = new this.presenter.GapUtils(mockConfig);
        this.gap2 = new this.presenter.GapUtils(mockConfig);
        this.gap3 = new this.presenter.GapUtils(mockConfig);
        this.gap1.value = "as.ldjhkfasfdsa";
        this.gap2.value = "as.ldjhkfasfdsa";
        this.gap3.value = "as.ldjhkfasfdsa";

        this.stubs.isCorrectGap1 = sinon.stub(this.gap1, 'isCorrect');
        this.stubs.isCorrectGap2 = sinon.stub(this.gap2, 'isCorrect');
        this.stubs.isCorrectGap3 = sinon.stub(this.gap3, 'isCorrect');

        this.container.addGap(this.gap1);
        this.container.addGap(this.gap2);
        this.container.addGap(this.gap3);
    },
    
    tearDown: function () {
        DraggableDroppableObject.prototype.createView.restore();
        DraggableDroppableObject._internal.connectEvents.restore();
        this.gap1.isCorrect.restore();
        this.gap2.isCorrect.restore();
        this.gap3.isCorrect.restore();
    },

    'test error count should return total number of invalid gaps': function () {
        this.stubs.isCorrectGap1.returns(true);
        this.stubs.isCorrectGap2.returns(false);
        this.stubs.isCorrectGap3.returns(false);


        assertEquals(2, this.container.getErrorCount());
    },

    'test get score should return total number of valid gaps': function () {
        this.stubs.isCorrectGap1.returns(true);
        this.stubs.isCorrectGap2.returns(false);
        this.stubs.isCorrectGap3.returns(false);

        assertEquals(1, this.container.getScore());
    },

    'test get max score should return sum of gap scores': function () {
        this.container.gaps[0].gapScore = 2;

        assertEquals(4, this.container.getMaxScore());
    }
});

TestCase("[Table] [Gaps Container Object] MarkGapByIndexAsCorrect / MarkGapByIndexAsWrong / MarkGapByIndexAsEmpty", {
    setUp: function () {
        this.presenter = AddonTable_create();

        this.stubs = helperFunctions.getStubsToCreateGapUtilsObjects();

        this.gap1 = new this.presenter.GapUtils({});
        this.gap2 = new this.presenter.GapUtils({});
        this.gap3 = new this.presenter.GapUtils({});

        this.container = new this.presenter.GapsContainerObject();

        this.container.addGap(this.gap1);
        this.container.addGap(this.gap2);
        this.container.addGap(this.gap3);

        this.stubs.addClassGap1 = sinon.stub(this.gap1, 'addCssClass');
        this.stubs.removeAllClassessGap1 = sinon.stub(this.gap1, 'removeAllClasses');
        this.stubs.notifyEdit1 = sinon.stub(this.gap1, 'notifyEdit');

        this.stubs.addClassGap2 = sinon.stub(this.gap2, 'addCssClass');
        this.stubs.removeAllClassessGap2 = sinon.stub(this.gap2, 'removeAllClasses');
        this.stubs.notifyEdit2 = sinon.stub(this.gap2, 'notifyEdit');

        this.stubs.addClassGap3 = sinon.stub(this.gap3, 'addCssClass');
        this.stubs.removeAllClassessGap3 = sinon.stub(this.gap3, 'removeAllClasses');
        this.stubs.notifyEdit3 = sinon.stub(this.gap3, 'notifyEdit');
    },

    tearDown : function () {
        helperFunctions.restoreStubsToCreateGapUtilsObjects();
        this.gap1.removeAllClasses.restore();
        this.gap2.removeAllClasses.restore();
        this.gap3.removeAllClasses.restore();

        this.gap1.addCssClass.restore();
        this.gap2.addCssClass.restore();
        this.gap3.addCssClass.restore();

        this.gap1.notifyEdit.restore();
        this.gap2.notifyEdit.restore();
        this.gap3.notifyEdit.restore();
    },

    'test MarkGapByIndexAsCorrect should mark gap by provided index with ic_gap-correct': function () {
        this.container.markGapByIndexAsCorrect(0);

        assertTrue(this.stubs.addClassGap1.calledOnce);
        assertTrue(this.stubs.addClassGap1.calledWith('ic_gap-correct'));

        assertFalse(this.stubs.addClassGap2.called);
        assertFalse(this.stubs.addClassGap3.called);
    },

    'test MarkGapByIndexAsCorrect should remove from gap all other classes': function () {
        this.container.markGapByIndexAsCorrect(0);

        assertTrue(this.stubs.removeAllClassessGap1.calledOnce);
        assertFalse(this.stubs.removeAllClassessGap2.calledOnce);
        assertFalse(this.stubs.removeAllClassessGap3.calledOnce);
    },

    'test MarkGapByIndexAsCorrect should first remove from gap all other classes than add correct': function () {
        this.container.markGapByIndexAsCorrect(0);

        assertTrue(this.stubs.removeAllClassessGap1.calledBefore(this.stubs.addClassGap1));
    },

    'test MarkGapByIndexAsCorrect should call notifyEdit of gap for stateMachine so reset logic will trigger': function () {
        this.container.markGapByIndexAsCorrect(0);
        this.container.markGapByIndexAsCorrect(1);
        this.container.markGapByIndexAsCorrect(2);

        assertTrue(this.stubs.notifyEdit1.calledOnce);
        assertTrue(this.stubs.notifyEdit2.calledOnce);
        assertTrue(this.stubs.notifyEdit3.calledOnce);
    },

    'test MarkGapByIndexAsWrong should mark gap by provided index with ic_gap-wrong': function () {
        this.container.markGapByIndexAsWrong(2);

        assertTrue(this.stubs.addClassGap3.calledOnce);
        assertTrue(this.stubs.addClassGap3.calledWith('ic_gap-wrong'));

        assertFalse(this.stubs.addClassGap2.called);
        assertFalse(this.stubs.addClassGap1.called);
    },

    'test MarkGapByIndexAsWrong should remove from gap all other classes': function () {
        this.container.markGapByIndexAsWrong(2);

        assertTrue(this.stubs.removeAllClassessGap3.calledOnce);
        assertFalse(this.stubs.removeAllClassessGap2.calledOnce);
        assertFalse(this.stubs.removeAllClassessGap1.calledOnce);
    },

    'test MarkGapByIndexAsWrong should first remove from gap all other classes than add correct': function () {
        this.container.markGapByIndexAsWrong(2);

        assertTrue(this.stubs.removeAllClassessGap3.calledBefore(this.stubs.addClassGap3));
    },

    'test MarkGapByIndexAsWrong should call notifyEdit of gap for stateMachine so reset logic will trigger': function () {
        this.container.markGapByIndexAsWrong(0);
        this.container.markGapByIndexAsWrong(1);
        this.container.markGapByIndexAsWrong(2);

        assertTrue(this.stubs.notifyEdit1.calledOnce);
        assertTrue(this.stubs.notifyEdit2.calledOnce);
        assertTrue(this.stubs.notifyEdit3.calledOnce);
    },

    'test MarkGapByIndexAsEmpty should mark gap by provided index with ic_gap-empty': function () {
        this.container.markGapByIndexAsEmpty(1);

        assertTrue(this.stubs.addClassGap2.calledOnce);
        assertTrue(this.stubs.addClassGap2.calledWith('ic_gap-empty'));

        assertFalse(this.stubs.addClassGap1.called);
        assertFalse(this.stubs.addClassGap3.called);
    },

    'test MarkGapByIndexAsEmpty should remove from gap all other classes': function () {
        this.container.markGapByIndexAsEmpty(1);

        assertTrue(this.stubs.removeAllClassessGap2.calledOnce);
        assertFalse(this.stubs.removeAllClassessGap1.calledOnce);
        assertFalse(this.stubs.removeAllClassessGap3.calledOnce);
    },

    'test MarkGapByIndexAsEmpty should first remove from gap all other classes than add correct': function () {
        this.container.markGapByIndexAsEmpty(1);

        assertTrue(this.stubs.removeAllClassessGap2.calledBefore(this.stubs.addClassGap2));
    },

    'test MarkGapByIndexAsEmpty should call notifyEdit of gap for stateMachine so reset logic will trigger': function () {
        this.container.markGapByIndexAsEmpty(0);
        this.container.markGapByIndexAsEmpty(1);
        this.container.markGapByIndexAsEmpty(2);

        assertTrue(this.stubs.notifyEdit1.calledOnce);
        assertTrue(this.stubs.notifyEdit2.calledOnce);
        assertTrue(this.stubs.notifyEdit3.calledOnce);
    }
});

TestCase("[Table] [Gaps Container Object] Get Length", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.container = new this.presenter.GapsContainerObject();
    },

    'test should return number of added gaps': function () {
        this.container.addGap({});
        this.container.addGap({});
        this.container.addGap({});
        this.container.addGap({});

        assertEquals(4, this.container.getLength());
    },

    'test should return 0 when no gaps added': function () {
        assertEquals(0, this.container.getLength());
    }
});

TestCase("[Table] [Gaps Container Object] Get Value By Gap Index", {
    setUp: function () {
        this.presenter = AddonTable_create();

        this.stubs = helperFunctions.getStubsToCreateGapUtilsObjects();

        this.expectedValue1 = 5;
        this.expectedValue2 = 1;
        this.expectedValue3 = 10;

        this.gap1 = new this.presenter.GapUtils({});
        this.gap1.setValue(this.expectedValue1);

        this.gap2 = new this.presenter.GapUtils({});
        this.gap2.setValue(this.expectedValue2);

        this.gap3 = new this.presenter.GapUtils({});
        this.gap3.setValue(this.expectedValue3);

        this.container = new this.presenter.GapsContainerObject();

        this.container.addGap(this.gap1);
        this.container.addGap(this.gap2);
        this.container.addGap(this.gap3);
    },

    tearDown: function () {
        helperFunctions.restoreStubsToCreateGapUtilsObjects();
    },

    'test should get value of gap by provided index': function () {
        assertEquals(this.expectedValue1, this.container.getGapValueByIndex(0));
        assertEquals(this.expectedValue2, this.container.getGapValueByIndex(1));
        assertEquals(this.expectedValue3, this.container.getGapValueByIndex(2));
    }
});

TestCase("[Table] [Gaps Container Object] Enable/Disable Gap By Index", {
    setUp: function () {
        this.presenter = AddonTable_create();

        this.stubs = helperFunctions.getStubsToCreateGapUtilsObjects();

        this.gap1 = new this.presenter.GapUtils({});
        this.stubs.gap1Lock = sinon.stub(this.gap1, 'lock');
        this.stubs.gap1Unlock = sinon.stub(this.gap1, 'unlock');
        this.stubs.notifyEdit1 = sinon.stub(this.gap1, 'notifyEdit');

        this.gap2 = new this.presenter.GapUtils({});
        this.stubs.gap2Lock = sinon.stub(this.gap2, 'lock');
        this.stubs.gap2Unlock = sinon.stub(this.gap2, 'unlock');
        this.stubs.notifyEdit2 = sinon.stub(this.gap2, 'notifyEdit');

        this.gap3 = new this.presenter.GapUtils({});
        this.stubs.gap3Lock = sinon.stub(this.gap3, 'lock');
        this.stubs.gap3Unlock = sinon.stub(this.gap3, 'unlock');
        this.stubs.notifyEdit3 = sinon.stub(this.gap3, 'notifyEdit');

        this.container = new this.presenter.GapsContainerObject();

        this.container.addGap(this.gap1);
        this.container.addGap(this.gap2);
        this.container.addGap(this.gap3);
    },

    tearDown: function () {
        helperFunctions.restoreStubsToCreateGapUtilsObjects();
        this.gap1.lock.restore();
        this.gap2.lock.restore();
        this.gap3.lock.restore();

        this.gap1.unlock.restore();
        this.gap2.unlock.restore();
        this.gap3.unlock.restore();

        this.gap1.notifyEdit.restore();
        this.gap2.notifyEdit.restore();
        this.gap3.notifyEdit.restore();
    },

    'test should lock gap of provided index if is not disabled': function () {
        this.container.disableGapByIndex(0);

        assertTrue(this.stubs.gap1Lock.calledOnce);
        assertFalse(this.stubs.gap2Lock.called);
        assertFalse(this.stubs.gap3Lock.called);
    },

    'test should unlock gap of provided index is is disabled': function () {
        this.gap2.isDisabled = true;

        this.container.enableGapByIndex(1);

        assertTrue(this.stubs.gap2Unlock.calledOnce);
        assertFalse(this.stubs.gap1Unlock.called);
        assertFalse(this.stubs.gap3Unlock.called);
    },

    'test shouldnt lock gap if its disabled': function () {
        this.gap3.isDisabled = true;

        this.container.disableGapByIndex(2);

        assertFalse(this.stubs.gap3Lock.called);
        assertFalse(this.stubs.gap1Lock.called);
        assertFalse(this.stubs.gap2Lock.called);
    },

    'test shouldnt unlock gap if it isnt disabled': function () {
        this.gap2.isDisabled = false;

        this.container.enableGapByIndex(1);

        assertFalse(this.stubs.gap2Unlock.called);
        assertFalse(this.stubs.gap1Unlock.called);
        assertFalse(this.stubs.gap3Unlock.called);
    },

    'test unlocking should notifyEdit of gap for stateMachine to work correctly': function () {
        this.container.enableGapByIndex(0);
        this.container.enableGapByIndex(1);
        this.container.enableGapByIndex(2);

        assertTrue(this.stubs.notifyEdit1.calledOnce);
        assertTrue(this.stubs.notifyEdit2.calledOnce);
        assertTrue(this.stubs.notifyEdit3.calledOnce);
    },

    'test locking should notifyEdit of gap for stateMachine to work correctly': function () {
        this.container.disableGapByIndex(0);
        this.container.disableGapByIndex(1);
        this.container.disableGapByIndex(2);

        assertTrue(this.stubs.notifyEdit1.calledOnce);
        assertTrue(this.stubs.notifyEdit2.calledOnce);
        assertTrue(this.stubs.notifyEdit3.calledOnce);
    }
});

TestCase("[Table] [Gaps Container Object] GetGapIndexByObjectID", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {
            addonID: "asgsdfa"
        };

        this.stubs = helperFunctions.getStubsToCreateGapUtilsObjects();

        this.gap1 = new this.presenter.GapUtils({});
        this.gap1.objectID = "gap1";

        this.gap2 = new this.presenter.GapUtils({});
        this.gap2.objectID = "gap2";

        this.gap3 = new this.presenter.GapUtils({});
        this.gap3.objectID = "gap3";

        this.container = new this.presenter.GapsContainerObject();

        this.container.addGap(this.gap1);
        this.container.addGap(this.gap2);
        this.container.addGap(this.gap3);
    },

    tearDown: function () {
        helperFunctions.restoreStubsToCreateGapUtilsObjects();
    },

    'test should return index 1-based depending on gap object id': function () {
        assertEquals(1, this.container.getGapIndexByObjectID("gap1"));
        assertEquals(2, this.container.getGapIndexByObjectID("gap2"));
        assertEquals(3, this.container.getGapIndexByObjectID("gap3"));
    }
});

TestCase("[Table] [Gaps Container Object] SetGapsState / SetSpansState", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.container = new this.presenter.GapsContainerObject();

        this.stubs = {
            connectEvents: sinon.stub(DraggableDroppableObject._internal, 'connectEvents'),
            validateConfiguration: sinon.stub(DraggableDroppableObject._internal, 'validateConfiguration')
        };


        this.gap1 = new this.presenter.GapUtils({});
        this.gap2 = new this.presenter.GapUtils({});
        this.gap3 = new this.presenter.GapUtils({});

        this.container.addGap(this.gap1);
        this.container.addGap(this.gap2);
        this.container.addGap(this.gap3);

        this.gapsStubs = {
            setState1: sinon.stub(this.gap1, 'setState'),
            setState2: sinon.stub(this.gap2, 'setState'),
            setState3: sinon.stub(this.gap3, 'setState')
        };

        this.expectedValue1 = 5;
        this.expectedValue2 = "asfd.hf";
        this.expectedValue3 = "awl;3o784afsd";

        this.expectedSource1 = "source1";
        this.expectedSource2 = "source2";
        this.expectedSource3 = "source3";

        this.expectedIsEnabled1 = "enable1";
        this.expectedIsEnabled2 = "enable2";
        this.expectedIsEnabled3 = "enable3";

        this.state = [
            {value: this.expectedValue1, item: this.expectedSource1, isEnabled: this.expectedIsEnabled1},
            {value: this.expectedValue2, item: this.expectedSource2, isEnabled: this.expectedIsEnabled2},
            {value: this.expectedValue3, item: this.expectedSource3, isEnabled: this.expectedIsEnabled3}
        ]
    },

    tearDown: function () {
        DraggableDroppableObject._internal.connectEvents.restore();
        DraggableDroppableObject._internal.validateConfiguration.restore();
        this.gap1.setState.restore();
        this.gap2.setState.restore();
        this.gap3.setState.restore();
    },

    'test setGapsState should setState to all gaps': function () {
        this.container.setGapsState(this.state);

        assertTrue(this.gapsStubs.setState1.calledOnce);
        assertTrue(this.gapsStubs.setState2.calledOnce);
        assertTrue(this.gapsStubs.setState3.calledOnce);
    },

    'test setGapsState should setState with value and isEnabled from state and empty source': function () {
        this.container.setGapsState(this.state);

        assertTrue(this.gapsStubs.setState1.calledWith({
            value: this.expectedValue1, source: "", isAttempted: false, isEnabled: this.expectedIsEnabled1, droppedElement: undefined
        }));
        assertTrue(this.gapsStubs.setState2.calledWith({
            value: this.expectedValue2, source: "", isAttempted: false, isEnabled: this.expectedIsEnabled2, droppedElement: undefined
        }));
        assertTrue(this.gapsStubs.setState3.calledWith({
            value: this.expectedValue3, source: "", isAttempted: false, isEnabled: this.expectedIsEnabled3, droppedElement: undefined
        }));
    },

    'test setSpansState should setState to all gaps': function () {
        this.container.setSpansState(this.state);

        assertTrue(this.gapsStubs.setState1.calledOnce);
        assertTrue(this.gapsStubs.setState2.calledOnce);
        assertTrue(this.gapsStubs.setState3.calledOnce);
    },

    'test setSpansState should setState with value and source from state': function () {
        this.container.setSpansState(this.state);

        assertTrue(this.gapsStubs.setState1.calledWith({
            value: this.expectedValue1,
            source: this.expectedSource1,
            isEnabled: undefined,
            droppedElement: undefined
        }));
        assertTrue(this.gapsStubs.setState2.calledWith({
            value: this.expectedValue2,
            source: this.expectedSource2,
            isEnabled: undefined,
            droppedElement: undefined
        }));
        assertTrue(this.gapsStubs.setState3.calledWith({
            value: this.expectedValue3,
            source: this.expectedSource3,
            isEnabled: undefined,
            droppedElement: undefined
        }));
    }
});
