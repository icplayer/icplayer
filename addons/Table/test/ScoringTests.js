TestCase("[Table] GetScore / GetMaxScore / GetErrorCount", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.eventBus = function () {};

        this.presenter.configuration = {
            isActivity: true,
            isNotActivity: false,
            isCaseSensitive: false,
            isPunctuationIgnored: false,
            addonID: "Table1",
            gapMaxLength: {value: 12}
        };

        this.presenter.gapsContainer = new this.presenter.GapsContainerObject();
        this.stubs = {
            editableCreateView: sinon.stub(this.presenter.EditableInputGap.prototype, 'createView'),
            editableConnectEvents: sinon.stub(this.presenter.EditableInputGap.prototype, 'connectEvents'),
            draggableCreateView: sinon.stub(this.presenter.DraggableDroppableGap.prototype, 'createView'),
            draggableConnectEvents: sinon.stub(DraggableDroppableObject._internal, 'connectEvents'),
            setGapWidth: sinon.stub(this.presenter.GapUtils.prototype, 'setGapWidth')
        };
    },

    tearDown: function () {
        this.presenter.EditableInputGap.prototype.createView.restore();
        this.presenter.EditableInputGap.prototype.connectEvents.restore();
        this.presenter.GapUtils.prototype.setGapWidth.restore();
        this.presenter.DraggableDroppableGap.prototype.createView.restore();
        DraggableDroppableObject._internal.connectEvents.restore();
    },

    'test no gaps': function () {
        assertEquals(0, this.presenter.getMaxScore());
        assertEquals(0, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount());
    },

    'test single editable empty gap filled': function () {
        var gap = new this.presenter.EditableInputGap("Table1-1", [""], 1);
        gap.setValue("some value");

        this.presenter.gapsContainer.addGap(gap);

        assertEquals(1, this.presenter.getMaxScore());
        assertEquals(0, this.presenter.getScore());
        assertEquals(1, this.presenter.getErrorCount());
    },

    'test single draggable empty gap filled': function () {
        var gap = new this.presenter.DraggableDroppableGap("Table1-1", [""], 1);
        gap.setValue("some value");

        this.presenter.gapsContainer.addGap(gap);

        assertEquals(1, this.presenter.getMaxScore());
        assertEquals(0, this.presenter.getScore());
        assertEquals(1, this.presenter.getErrorCount());
    },

    'test single editable gap case sensitive and with punctuation ignored': function () {
        this.presenter.configuration.isCaseSensitive = true;
        this.presenter.configuration.isPunctuationIgnored = true;

        var gap = new this.presenter.EditableInputGap("Table1-1", ["aaAA 1.0000"], 1);
        gap.setValue("aaAA 10000");

        this.presenter.gapsContainer.addGap(gap);

        assertEquals(1, this.presenter.getMaxScore());
        assertEquals(1, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount());
    },

    'test single draggable gap case sensitive and with punctuation ignored': function () {
        this.presenter.configuration.isCaseSensitive = true;
        this.presenter.configuration.isPunctuationIgnored = true;

        var gap = new this.presenter.DraggableDroppableGap("Table1-1", ["aaAA 1.0000"], 1);
        gap.setValue("aaAA 10000");

        this.presenter.gapsContainer.addGap(gap);

        assertEquals(1, this.presenter.getMaxScore());
        assertEquals(1, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount());
    },

    'test single editable gap not filled': function () {
        var gap = new this.presenter.EditableInputGap("Table1-1", ["some value"], 1);
        gap.setValue("");

        this.presenter.gapsContainer.addGap(gap);

        assertEquals(1, this.presenter.getMaxScore());
        assertEquals(0, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount()); // Although gap is incorrect, it's empty, so no errors are reported
    },

    'test single draggable gap not filled': function () {
        var gap = new this.presenter.DraggableDroppableGap("Table1-1", ["some value"], 1);
        gap.setValue("");

        this.presenter.gapsContainer.addGap(gap);

        assertEquals(1, this.presenter.getMaxScore());
        assertEquals(0, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount()); // Although gap is incorrect, it's empty, so no errors are reported
    },

    'test single editable gap filled with just whitespaces': function () {
        var gap = new this.presenter.EditableInputGap("Table1-1", ["some value"], 1);
        gap.setValue(" \t ");

        this.presenter.gapsContainer.addGap(gap);

        assertEquals(1, this.presenter.getMaxScore());
        assertEquals(0, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount()); // Although gap is incorrect, it contains only white characters, so no errors are reported
    },

    'test multiple gaps - each filled correctly': function () {
        var gap1 = new this.presenter.EditableInputGap("Table1-1", [""], 1);

        var gap2 = new this.presenter.EditableInputGap("Table1-2", ["ans1"], 1);
        gap2.setValue('ans1');

        var gap3 = new this.presenter.EditableInputGap("Table1-3", ["some"], 1);
        gap3.setValue('some');

        var gap4 = new this.presenter.EditableInputGap("Table1-4", ["answ1", "answ2", "answ3"], 2);
        gap4.setValue('answ1');

        this.presenter.gapsContainer.addGap(gap1);
        this.presenter.gapsContainer.addGap(gap2);
        this.presenter.gapsContainer.addGap(gap3);
        this.presenter.gapsContainer.addGap(gap4);


        assertEquals(5, this.presenter.getMaxScore());
        assertEquals(5, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount());
    },

    'test multiple gaps - each filled incorrectly': function () {
        var gap1 = new this.presenter.EditableInputGap("Table1-1", [""], 1);
        gap1.setValue('some');

        var gap2 = new this.presenter.EditableInputGap("Table1-2", ["ans1"], 1);
        gap2.setValue('ans2');

        var gap3 = new this.presenter.EditableInputGap("Table1-3", ["some"], 1);
        gap3.setValue('some value');

        var gap4 = new this.presenter.EditableInputGap("Table1-4", ["answ1", "answ2", "answ3"], 1);
        gap4.setValue('answ4');

        this.presenter.gapsContainer.addGap(gap1);
        this.presenter.gapsContainer.addGap(gap2);
        this.presenter.gapsContainer.addGap(gap3);
        this.presenter.gapsContainer.addGap(gap4);

        assertEquals(4, this.presenter.getMaxScore());
        assertEquals(0, this.presenter.getScore());
        assertEquals(4, this.presenter.getErrorCount());
    },

    'test multiple gaps - each filled differently': function () {
        var gap1 = new this.presenter.EditableInputGap("Table1-1", [""], 4);
        gap1.setValue('');

        var gap2 = new this.presenter.EditableInputGap("Table1-2", ["ans1"], 1);
        gap2.setValue('ans1');

        var gap3 = new this.presenter.EditableInputGap("Table1-3", ["some"], 1);
        gap3.setValue('some value');

        var gap4 = new this.presenter.EditableInputGap("Table1-4", ["answ1", "answ2", "answ3"], 1);
        gap4.setValue('');

        var gap5 = new this.presenter.EditableInputGap("Table1-5", ["answ1", "answ2"], 1);
        gap5.setValue('answ2');

        this.presenter.gapsContainer.addGap(gap1);
        this.presenter.gapsContainer.addGap(gap2);
        this.presenter.gapsContainer.addGap(gap3);
        this.presenter.gapsContainer.addGap(gap4);
        this.presenter.gapsContainer.addGap(gap5);

        assertEquals(8, this.presenter.getMaxScore());
        assertEquals(6, this.presenter.getScore());
        assertEquals(1, this.presenter.getErrorCount());
    }
});
//
//TestCase("[Table] GetMaxScore / GetScore / GetErrorCount - is not activity option selected", {
//    setUp: function () {
//        this.presenter = AddonTable_create();
//        this.presenter.eventBus = function () {};
//
//        this.presenter.configuration = {
//            isActivity: true,
//            isNotActivity: false,
//            isCaseSensitive: false,
//            isPunctuationIgnored: false,
//            addonID: "Table1"
//        };
//
//        this.presenter.gapsContainer = new this.presenter.GapsContainerObject();
//        this.stubs = {
//            editableCreateView: sinon.stub(this.presenter.EditableInputGap.prototype, 'createView'),
//            editableConnectEvents: sinon.stub(this.presenter.EditableInputGap.prototype, 'connectEvents'),
//            draggableCreateView: sinon.stub(this.presenter.DraggableDroppableGap.prototype, 'createView'),
//            draggableConnectEvents: sinon.stub(DraggableDroppableObject._internal, 'connectEvents'),
//            setGapWidth: sinon.stub(this.presenter.GapUtils.prototype, 'setGapWidth')
//        };
//    },
//
//    tearDown: function () {
//        this.presenter.EditableInputGap.prototype.createView.restore();
//        this.presenter.EditableInputGap.prototype.connectEvents.restore();
//        this.presenter.GapUtils.prototype.setGapWidth.restore();
//        this.presenter.DraggableDroppableGap.prototype.createView.restore();
//        DraggableDroppableObject._internal.connectEvents.restore();
//    },
//
//    'test single empty gap filled': function () {
//        this.presenter.configuration.isActivity = false;
//        this.presenter.configuration.isNotActivity = true;
//
//        var gap = new this.presenter.DraggableDroppableGap("Table1-1", ["some value"], 1);
//        gap.setValue("");
//
//        this.presenter.gapsContainer.addGap(gap);
//
//        assertEquals(0, this.presenter.getMaxScore());
//        assertEquals(0, this.presenter.getScore());
//        assertEquals(0, this.presenter.getErrorCount());
//    },
//
//    'test multiple gaps - each filled differently': function () {
//        this.presenter.configuration.isActivity = false;
//        this.presenter.configuration.isNotActivity = true;
//
//
//        var gap1 = new this.presenter.EditableInputGap("Table1-1", [""], 1);
//        gap1.setValue('');
//
//        var gap2 = new this.presenter.EditableInputGap("Table1-2", ["ans1"], 1);
//        gap2.setValue('ans1');
//
//        var gap3 = new this.presenter.EditableInputGap("Table1-3", ["some"], 1);
//        gap3.setValue('some value');
//
//        var gap4 = new this.presenter.EditableInputGap("Table1-4", ["answ1", "answ2", "answ3"], 1);
//        gap4.setValue('');
//
//        var gap5 = new this.presenter.EditableInputGap("Table1-5", ["answ1", "answ2"], 1);
//        gap5.setValue('answ2');
//
//        this.presenter.gapsContainer.addGap(gap1);
//        this.presenter.gapsContainer.addGap(gap2);
//        this.presenter.gapsContainer.addGap(gap3);
//        this.presenter.gapsContainer.addGap(gap4);
//        this.presenter.gapsContainer.addGap(gap5);
//
//        assertEquals(0, this.presenter.getMaxScore());
//        assertEquals(0, this.presenter.getScore());
//        assertEquals(0, this.presenter.getErrorCount());
//    }
//});