TestCase("[Table] Commands logic - validateGapIndex helper method", {
    setUp: function () {
        this.presenter = AddonTable_create();

        this.presenter.gapsContainer = new this.presenter.GapsContainerObject();
        this.presenter.gapsContainer.addGap({});
        this.presenter.gapsContainer.addGap({});
        this.presenter.gapsContainer.addGap({});
        this.presenter.gapsContainer.addGap({});
    },

    'test smallest index possible': function () {
        assertTrue(this.presenter.validateGapIndex(1).isValid);
    },

    'test largest index possible': function () {
        assertTrue(this.presenter.validateGapIndex(4).isValid);
    },

    'test index too small': function () {
        assertFalse(this.presenter.validateGapIndex(0).isValid);
    },

    'test index too high': function () {
        assertFalse(this.presenter.validateGapIndex(6).isValid);
    },

    'test index is NaN': function () {
        assertFalse(this.presenter.validateGapIndex("nan").isValid);
    },

    'test empty gap descriptions array': function () {
        this.presenter.gapsContainer = new this.presenter.GapsContainerObject();

        assertFalse(this.presenter.validateGapIndex(1).isValid);
    },
    
    'test returned index is 0-based': function () {
        assertEquals(0, this.presenter.validateGapIndex(1).index);
    },

    'test should parse float to int if gap index is valid': function () {
        assertEquals(0, this.presenter.validateGapIndex(1.5).index);
        assertEquals(1, this.presenter.validateGapIndex(2.5).index);
    }
});

TestCase("[Table] Commands logic - getGapText / getGapValue", {
    setUp: function () {
        this.presenter = AddonTable_create();

        this.stubs = {
            createView: sinon.stub(DraggableDroppableObject.prototype, 'createView'),
            connectEvents: sinon.stub(DraggableDroppableObject._internal, 'connectEvents'),
            validateConfiguration: sinon.stub(DraggableDroppableObject._internal, 'validateConfiguration')
        };

        this.presenter.gapsContainer = new this.presenter.GapsContainerObject();

        this.gap1 = new this.presenter.GapUtils({});
        this.gap1.setValue('some value');

        this.gap2 = new this.presenter.GapUtils({});
        this.gap2.setValue('');

        this.gap3 = new this.presenter.GapUtils({});
        this.gap3.setValue('');

        this.gap4 = new this.presenter.GapUtils({});
        this.gap4.setValue('another value');

        this.presenter.gapsContainer.addGap(this.gap1);
        this.presenter.gapsContainer.addGap(this.gap2);
        this.presenter.gapsContainer.addGap(this.gap3);
        this.presenter.gapsContainer.addGap(this.gap4);
    },

    tearDown: function () {
        DraggableDroppableObject.prototype.createView.restore();
        DraggableDroppableObject._internal.connectEvents.restore();
        DraggableDroppableObject._internal.validateConfiguration.restore();
    },

    'test proper gap index and gap empty': function () {
        assertEquals("", this.presenter.getGapText(2));
        assertEquals("", this.presenter.getGapValue(2));
        assertEquals("", this.presenter.getGapTextCommand("2"));
    },

    'test proper gap index and gap filled': function () {
        assertEquals("some value", this.presenter.getGapText(1));
        assertEquals("some value", this.presenter.getGapValue(1));
        assertEquals("some value", this.presenter.getGapTextCommand("1"));

        assertEquals("another value", this.presenter.getGapText(4));
        assertEquals("another value", this.presenter.getGapValue(4));
        assertEquals("another value", this.presenter.getGapTextCommand("4"));
    },

    'test invalid gap index': function () {
        assertUndefined(this.presenter.getGapText(0));
        assertUndefined(this.presenter.getGapValue(0));
        assertUndefined(this.presenter.getGapTextCommand(["0"]));

        assertUndefined(this.presenter.getGapText(5));
        assertUndefined(this.presenter.getGapValue(5));
        assertUndefined(this.presenter.getGapText(["5"]));

        assertUndefined(this.presenter.getGapText(-2));
        assertUndefined(this.presenter.getGapValue(-2));
        assertUndefined(this.presenter.getGapText(["-2"]));
    }
});

TestCase("[Table] Commands logic - setGapText / setGapTextCommand", {
    setUp: function () {
        this.presenter = AddonTable_create();

        this.stubs = {
            createView: sinon.stub(DraggableDroppableObject.prototype, 'createView'),
            connectEvents: sinon.stub(DraggableDroppableObject._internal, 'connectEvents'),
            validateConfiguration: sinon.stub(DraggableDroppableObject._internal, 'validateConfiguration')
        };

        this.presenter.gapsContainer = new this.presenter.GapsContainerObject();
        this.presenter.configuration = {
            gapType: "editable"
        };

        this.gap1 = new this.presenter.GapUtils({});
        this.gap1.setValue('some value');
        this.gap1.$view = $(document.createElement("div"));
        this.gap1.setViewValue('some value');

        this.gap2 = new this.presenter.GapUtils({});
        this.gap2.setValue('');
        this.gap2.$view = $(document.createElement("div"));
        this.gap2.setViewValue('');

        this.gap3 = new this.presenter.GapUtils({});
        this.gap3.setValue('');
        this.gap3.$view = $(document.createElement("div"));
        this.gap3.setViewValue('');

        this.gap4 = new this.presenter.GapUtils({});
        this.gap4.setValue('another value');
        this.gap4.$view = $(document.createElement("div"));
        this.gap4.setViewValue('another value');

        this.presenter.gapsContainer.addGap(this.gap1);
        this.presenter.gapsContainer.addGap(this.gap2);
        this.presenter.gapsContainer.addGap(this.gap3);
        this.presenter.gapsContainer.addGap(this.gap4);
    },

    tearDown: function () {
        DraggableDroppableObject.prototype.createView.restore();
        DraggableDroppableObject._internal.connectEvents.restore();
        DraggableDroppableObject._internal.validateConfiguration.restore();
    },

    'test given empty editable gap when executed setGapText on gap number 2 then gap number 2 will have new value': function () {
        this.presenter.setGapText(2, "New text");

        assertEquals("New text", this.presenter.getGapText(2));
    },

    'test given empty editable gaps when executed setGapTextCommand on gaps then this gaps will have new values': function () {
        this.presenter.setGapTextCommand(["2", "New text 1"]);
        this.presenter.setGapTextCommand([3, "New text 2"]);

        assertEquals("New text 1", this.presenter.getGapText(2));
        assertEquals("New text 2", this.presenter.getGapText(3));
    },

    'test given empty math gap when executed setGapText on gap number 2 then do nothing': function () {
        this.presenter.configuration.gapType = "math";

        this.presenter.setGapText(2, "New text");

        assertEquals("", this.presenter.getGapText(2));
    },

    'test given empty math gaps when executed setGapTextCommand on gaps then do nothing': function () {
        this.presenter.configuration.gapType = "math";

        this.presenter.setGapTextCommand(["2", "New text 1"]);
        this.presenter.setGapTextCommand([3, "New text 2"]);

        assertEquals("", this.presenter.getGapText(2));
        assertEquals("", this.presenter.getGapText(3));
    },

    'test given empty draggable gap when executed setGapText on gap number 2 then do nothing': function () {
        this.presenter.configuration.gapType = "draggable";

        this.presenter.setGapText(2, "New text");

        assertEquals("", this.presenter.getGapText(2));
    },

    'test given empty draggable gaps when executed setGapTextCommand on gaps then do nothing': function () {
        this.presenter.configuration.gapType = "draggable";

        this.presenter.setGapTextCommand(["2", "New text 1"]);
        this.presenter.setGapTextCommand([3, "New text 2"]);

        assertEquals("", this.presenter.getGapText(2));
        assertEquals("", this.presenter.getGapText(3));
    },

    'test given table with 4 gaps when setGapText executed then do nothing': function () {
        this.presenter.setGapTextCommand([0, "New text"]);
        this.presenter.setGapTextCommand([5, "New text"]);

        assertEquals("some value", this.presenter.getGapText(1));
        assertEquals("", this.presenter.getGapText(2));
        assertEquals("", this.presenter.getGapText(3));
        assertEquals("another value", this.presenter.getGapText(4));
    },

    'test given table with 4 gaps when setGapTextCommand executed then do nothing': function () {
        this.presenter.setGapTextCommand(["0", "New text"]);
        this.presenter.setGapTextCommand(["5", "New text"]);

        assertEquals("some value", this.presenter.getGapText(1));
        assertEquals("", this.presenter.getGapText(2));
        assertEquals("", this.presenter.getGapText(3));
        assertEquals("another value", this.presenter.getGapText(4));
    }
});

TestCase("[Table] Commands logic - markGapAsCorrect", {
    setUp: function () {
        this.presenter = AddonTable_create();

        this.presenter.gapsContainer = new this.presenter.GapsContainerObject();
        
        this.stubs = {
            validateGapIndex: sinon.stub(this.presenter, 'validateGapIndex'),
            markGapByIndexAsCorrect: sinon.stub(this.presenter.GapsContainerObject.prototype, 'markGapByIndexAsCorrect')
        };
    },
    
    tearDown: function () {
        this.presenter.validateGapIndex.restore();
        this.presenter.GapsContainerObject.prototype.markGapByIndexAsCorrect.restore();
    },
    
    'test should mark gap when index is valid': function () {
        this.stubs.validateGapIndex.returns({isValid: true, index: 1});
        
        this.presenter.markGapAsCorrect({});
        
        assertTrue(this.stubs.markGapByIndexAsCorrect.calledOnce);
    },

    'test shouldnt mark gap when index is invalid': function () {
        this.stubs.validateGapIndex.returns({isValid: false});

        this.presenter.markGapAsCorrect({});

        assertFalse(this.stubs.markGapByIndexAsCorrect.called);
    }
});

TestCase("[Table] Commands logic - markGapAsWrong", {
    setUp: function () {
        this.presenter = AddonTable_create();

        this.presenter.gapsContainer = new this.presenter.GapsContainerObject();

        this.stubs = {
            validateGapIndex: sinon.stub(this.presenter, 'validateGapIndex'),
            markGapByIndexAsWrong: sinon.stub(this.presenter.GapsContainerObject.prototype, 'markGapByIndexAsWrong')
        };
    },

    tearDown: function () {
        this.presenter.validateGapIndex.restore();
        this.presenter.GapsContainerObject.prototype.markGapByIndexAsWrong.restore();
    },

    'test should mark gap when index is valid': function () {
        this.stubs.validateGapIndex.returns({isValid: true, index: 1});

        this.presenter.markGapAsWrong({});

        assertTrue(this.stubs.markGapByIndexAsWrong.calledOnce);
    },

    'test shouldnt mark gap when index is invalid': function () {
        this.stubs.validateGapIndex.returns({isValid: false});

        this.presenter.markGapAsWrong({});

        assertFalse(this.stubs.markGapByIndexAsWrong.called);
    }
});

TestCase("[Table] Commands logic - markGapAsEmpty", {
    setUp: function () {
        this.presenter = AddonTable_create();

        this.presenter.gapsContainer = new this.presenter.GapsContainerObject();

        this.stubs = {
            validateGapIndex: sinon.stub(this.presenter, 'validateGapIndex'),
            markGapByIndexAsEmpty: sinon.stub(this.presenter.GapsContainerObject.prototype, 'markGapByIndexAsEmpty')
        };
    },

    tearDown: function () {
        this.presenter.validateGapIndex.restore();
        this.presenter.GapsContainerObject.prototype.markGapByIndexAsEmpty.restore();
    },

    'test should mark gap when index is valid': function () {
        this.stubs.validateGapIndex.returns({isValid: true, index: 1});

        this.presenter.markGapAsEmpty({});

        assertTrue(this.stubs.markGapByIndexAsEmpty.calledOnce);
    },

    'test shouldnt mark gap when index is invalid': function () {
        this.stubs.validateGapIndex.returns({isValid: false});

        this.presenter.markGapAsEmpty({});

        assertFalse(this.stubs.markGapByIndexAsEmpty.called);
    }
});

TestCase("[Table] Commands logic - enableGap", {
    setUp: function () {
        this.presenter = AddonTable_create();

        this.presenter.gapsContainer = new this.presenter.GapsContainerObject();

        this.stubs = {
            validateGapIndex: sinon.stub(this.presenter, 'validateGapIndex'),
            enableGapByIndex: sinon.stub(this.presenter.GapsContainerObject.prototype, 'enableGapByIndex')
        };
    },

    tearDown: function () {
        this.presenter.validateGapIndex.restore();
        this.presenter.GapsContainerObject.prototype.enableGapByIndex.restore();
    },

    'test should enable gap when index is valid': function () {
        this.stubs.validateGapIndex.returns({isValid: true, index: 1});

        this.presenter.enableGap({});

        assertTrue(this.stubs.enableGapByIndex.calledOnce);
    },

    'test shouldnt enable gap when index is invalid': function () {
        this.stubs.validateGapIndex.returns({isValid: false});

        this.presenter.enableGap({});

        assertFalse(this.stubs.enableGapByIndex.called);
    }
});

TestCase("[Table] Commands logic - disableGap", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.gapsContainer = new this.presenter.GapsContainerObject();

        this.stubs = {
            validateGapIndex: sinon.stub(this.presenter, 'validateGapIndex'),
            disableGapByIndex: sinon.stub(this.presenter.GapsContainerObject.prototype, 'disableGapByIndex')
        };
    },

    tearDown: function () {
        this.presenter.validateGapIndex.restore();
        this.presenter.GapsContainerObject.prototype.disableGapByIndex.restore();
    },

    'test should disable gap when index is valid': function () {
        this.stubs.validateGapIndex.returns({isValid: true, index: 1});

        this.presenter.disableGap({});

        assertTrue(this.stubs.disableGapByIndex.calledOnce);
    },

    'test shouldnt disable gap when index is invalid': function () {
        this.stubs.validateGapIndex.returns({isValid: false});

        this.presenter.disableGap({});

        assertFalse(this.stubs.disableGapByIndex.called);
    }
});

TestCase("[Table] Commands logic - disable and enable all gaps", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.gapsContainer = new this.presenter.GapsContainerObject();

        this.stubs = {
            disableAllGaps: sinon.stub(this.presenter.GapsContainerObject.prototype, 'disableAllGaps'),
            enableAllGaps: sinon.stub(this.presenter.GapsContainerObject.prototype, 'enableAllGaps')
        };
    },

    tearDown: function () {
        this.presenter.GapsContainerObject.prototype.enableAllGaps.restore();
        this.presenter.GapsContainerObject.prototype.disableAllGaps.restore();
    },

    'test should disable all gaps': function () {
        this.presenter.disableAllGaps();

        assertTrue(this.stubs.disableAllGaps.calledOnce);
    },

    'test should enable all gaps': function () {
        this.presenter.enableAllGaps();

        assertTrue(this.stubs.enableAllGaps.calledOnce);
    }
});