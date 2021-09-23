TestCase("[IWB Toolbar] State Stack", {
    setUp: function () {
        this.getTestStateString = function(funcString, contentString) {
            return JSON.stringify({activeFunction: funcString, drawings: contentString});
        }
        this.presenter = AddonIWB_Toolbar_create();
        this.stateStack = this.presenter.getStateStack();
        this.base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gAAAQaCAYAAADQXlJ4AAAP/klEQâ€¦AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN8AHhoAAc55+7cAAAAASUVORK5CYII=";
        this.presenter.config = {
            'addonID': 'IWB Tooltip',
            'isValid': true,
            'enableUndoRedo': true
        };

        this.getStateStub = sinon.stub(this.presenter, 'getState');
        this.setStateStub = sinon.stub(this.presenter, 'setState');
        this.resetDrawingModeStub = sinon.stub(this.presenter, 'resetDrawingMode');
        this.resetStub = sinon.stub(this.presenter, 'reset');
        this.updateGlobalHistoryStub = sinon.stub(this.stateStack, 'updateGlobalHistory');
    },

    'test given different states when pushStateToStack is called states are saved correctly to stack': function () {
        this.getStateStub.onCall(0).returns(this.getTestStateString('f', '0'));
        this.getStateStub.onCall(1).returns(this.getTestStateString('f', '1'));
        this.getStateStub.onCall(2).returns(this.getTestStateString('f', '2'));

        this.stateStack.pushStateToStack();
        this.stateStack.pushStateToStack();
        this.stateStack.pushStateToStack();

        assertEquals(2, this.stateStack.prevStateStack.length);
        assertEquals(this.getTestStateString('f', '0'), this.stateStack.prevStateStack[0]);
        assertEquals(this.getTestStateString('f', '1'), this.stateStack.prevStateStack[1]);
        assertEquals(this.getTestStateString('f', '2'), this.stateStack.currentState);
    },

    'test given identical states when pushStateToStack is called states are not duplicated': function () {
        this.getStateStub.onCall(0).returns(this.getTestStateString('f', '0'));
        this.getStateStub.onCall(1).returns(this.getTestStateString('f', '0'));
        this.getStateStub.onCall(2).returns(this.getTestStateString('f', '0'));

        this.stateStack.pushStateToStack();
        this.stateStack.pushStateToStack();
        this.stateStack.pushStateToStack();

        assertEquals(0, this.stateStack.prevStateStack.length);
        assertEquals(this.getTestStateString('f', '0'), this.stateStack.currentState);
    },

    'test given states that only differ on activeFunction when pushStateToStack is called states are not duplicated': function () {
        this.getStateStub.onCall(0).returns(this.getTestStateString('f1', '0'));
        this.getStateStub.onCall(1).returns(this.getTestStateString('f2', '0'));
        this.getStateStub.onCall(2).returns(this.getTestStateString('f3', '0'));

        this.stateStack.pushStateToStack();
        this.stateStack.pushStateToStack();
        this.stateStack.pushStateToStack();

        assertEquals(0, this.stateStack.prevStateStack.length);
        assertEquals(this.getTestStateString('f1', '0'), this.stateStack.currentState);
    },

    'test given different states when restoreLastState is called state is restored correctly': function () {
        this.getStateStub.onCall(0).returns(this.getTestStateString('f', '0'));
        this.getStateStub.onCall(1).returns(this.getTestStateString('f', '1'));
        this.getStateStub.onCall(2).returns(this.getTestStateString('f', '2'));

        this.stateStack.pushStateToStack();
        this.stateStack.pushStateToStack();
        this.stateStack.pushStateToStack();

        this.stateStack.restoreLastState();

        assertEquals(1, this.stateStack.prevStateStack.length);
        assertEquals(this.getTestStateString('f', '0'), this.stateStack.prevStateStack[0]);
        assertEquals(1, this.stateStack.nextStateStack.length);
        assertEquals(this.getTestStateString('f', '2'), this.stateStack.nextStateStack[0]);
        assertEquals(this.getTestStateString('f', '1'), this.stateStack.currentState);
        assertTrue(this.setStateStub.called);
        assertEquals(this.getTestStateString('f', '1'), this.setStateStub.getCall(0).args[0]);
    },

    'test given different states when pushStateToStack is called after restoreLastState nextStateStack is cleared': function () {
        this.getStateStub.onCall(0).returns(this.getTestStateString('f', '0'));
        this.getStateStub.onCall(1).returns(this.getTestStateString('f', '1'));
        this.getStateStub.onCall(2).returns(this.getTestStateString('f', '2'));
        this.getStateStub.onCall(3).returns(this.getTestStateString('f', '3'));

        this.stateStack.pushStateToStack();
        this.stateStack.pushStateToStack();
        this.stateStack.pushStateToStack();

        this.stateStack.restoreLastState();

        this.stateStack.pushStateToStack();

        assertEquals(2, this.stateStack.prevStateStack.length);
        assertEquals(this.getTestStateString('f', '0'), this.stateStack.prevStateStack[0]);
        assertEquals(this.getTestStateString('f', '1'), this.stateStack.prevStateStack[1]);
        assertEquals(this.getTestStateString('f', '3'), this.stateStack.currentState);
        assertTrue(this.setStateStub.called);
        assertEquals(this.getTestStateString('f', '1'), this.setStateStub.getCall(0).args[0]);
        assertEquals(0, this.stateStack.nextStateStack.length);
    },

    'test given one state when restoreLastState is called reset is called': function () {
        this.getStateStub.onCall(0).returns(this.getTestStateString('f', '0'));

        this.stateStack.pushStateToStack();
        this.stateStack.restoreLastState();

        assertEquals(0, this.stateStack.prevStateStack.length);
        assertEquals(1, this.stateStack.nextStateStack.length);
        assertEquals(this.getTestStateString('f', '0'), this.stateStack.nextStateStack[0]);
        assertEquals("", this.stateStack.currentState);
        assertTrue(this.resetStub.called);
    },

    'test given different states when pushStatetoStack is called 7 times then only last 6 states are stored, latest in currentState and rest on stack': function () {
        this.getStateStub.onCall(0).returns(this.getTestStateString('f', '0'));
        this.getStateStub.onCall(1).returns(this.getTestStateString('f', '1'));
        this.getStateStub.onCall(2).returns(this.getTestStateString('f', '2'));
        this.getStateStub.onCall(3).returns(this.getTestStateString('f', '3'));
        this.getStateStub.onCall(4).returns(this.getTestStateString('f', '4'));
        this.getStateStub.onCall(5).returns(this.getTestStateString('f', '5'));
        this.getStateStub.onCall(6).returns(this.getTestStateString('f', '6'));

        this.stateStack.pushStateToStack();
        this.stateStack.pushStateToStack();
        this.stateStack.pushStateToStack();
        this.stateStack.pushStateToStack();
        this.stateStack.pushStateToStack();
        this.stateStack.pushStateToStack();
        this.stateStack.pushStateToStack();

        assertEquals(5, this.stateStack.prevStateStack.length);
        assertEquals(this.getTestStateString('f', '1'), this.stateStack.prevStateStack[0]);
        assertEquals(this.getTestStateString('f', '2'), this.stateStack.prevStateStack[1]);
        assertEquals(this.getTestStateString('f', '3'), this.stateStack.prevStateStack[2]);
        assertEquals(this.getTestStateString('f', '4'), this.stateStack.prevStateStack[3]);
        assertEquals(this.getTestStateString('f', '5'), this.stateStack.prevStateStack[4]);
        assertEquals(this.getTestStateString('f', '6'), this.stateStack.currentState);
    },

});