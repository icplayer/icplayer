var setUpUtils = function () {
    this.presenter = AddonTable_create();
    this.presenter.configuration = {
        isCaseSensitive: false,
        isPunctuationIgnored: false
    };

    var mockConfig = {
        eventBus: function () {},
        getSelectedItem: function () {},
        addonID: "addonID",
        objectID: "htmlID",
        showAnswersValue: ["1", "2", "3"],

        gapScore: 1
    };

    this.stubs = {
        connectEvents: sinon.stub(DraggableDroppableObject._internal, 'connectEvents'),
        createView: sinon.stub(DraggableDroppableObject.prototype, 'createView')
    };

    this.gap = new this.presenter.GapUtils(mockConfig);
};

var tearDownUtils = function () {
    DraggableDroppableObject.prototype.createView.restore();
    DraggableDroppableObject._internal.connectEvents.restore();
};

TestCase("[Table] [Gap Utils] isCorrect", {
    setUp: setUpUtils,
    tearDown: tearDownUtils,

    'test empty gap not filled': function () {
        this.gap.showAnswersValue = [""];
        this.gap.setValue("");

        assertTrue(this.gap.isCorrect());
    },

    'test empty gap filled': function () {
        this.gap.showAnswersValue = [""];
        this.gap.setValue("some value");

        assertFalse(this.gap.isCorrect());
    },

    'test gap not filled': function () {
        this.gap.showAnswersValue = ["answer"];
        this.gap.setValue("");

        assertFalse(this.gap.isCorrect());
    },

    'test gap filled correctly': function () {
        this.gap.showAnswersValue = ["answer"];
        this.gap.setValue("answer");

        assertTrue(this.gap.isCorrect());
    },

    'test gap filled incorrectly': function () {
        this.gap.showAnswersValue = ["answer"];
        this.gap.setValue("answer to question");

        assertFalse(this.gap.isCorrect());
    },

    'test gap with multiple answers not filled': function () {
        this.gap.showAnswersValue = ["answer", "another"];
        this.gap.setValue("");

        assertFalse(this.gap.isCorrect());
    },

    'test gap with multiple answers filled correctly': function () {
        this.gap.showAnswersValue = ["answer", "another"];
        this.gap.setValue("Another");

        assertTrue(this.gap.isCorrect());
    },

    'test gap with multiple answers filled incorrectly': function () {
        this.gap.showAnswersValue = ["answer", "another"];
        this.gap.setValue("answer to question");

        assertFalse(this.gap.isCorrect());
    },

    'test gap with single answer with value containing only whitespaces': function () {
        this.gap.showAnswersValue = ["answer"];
        this.gap.setValue("  ");

        assertFalse(this.gap.isCorrect());

    },

    'test gap with multiple answers with value containing only whitespaces': function () {
        this.gap.showAnswersValue = ["answer", "another"];
        this.gap.setValue("  ");

        assertFalse(this.gap.isCorrect());
    },

    'test gap filled incorrectly - case sensitive': function () {
        this.presenter.configuration.isCaseSensitive = true;

        this.gap.showAnswersValue = ["answer"];
        this.gap.setValue("Answer");
        assertFalse(this.gap.isCorrect());
    },

    'test gap with multiple answers filled incorrectly - case sensitive': function () {
        this.presenter.configuration.isCaseSensitive = true;

        this.gap.showAnswersValue = ["answer", "another"];
        this.gap.setValue("Another");
        assertFalse(this.gap.isCorrect());
    },

    'test gap with punctuation in answer - not ignored': function () {
        this.gap.showAnswersValue = ["1.000"];
        this.gap.setValue("1000");

        assertFalse(this.gap.isCorrect());
    },

    'test gap with punctuation in answer - ignored': function () {
        this.presenter.configuration.isPunctuationIgnored = true;

        this.gap.showAnswersValue = ["1.000"];
        this.gap.setValue("1000");

        assertTrue(this.gap.isCorrect());
    },

    'test when gap is empty should return false': function () {
        assertFalse(this.gap.isCorrect());
    },

    'test when gap is not empty and its value is not in show answers should be false': function () {
        this.gap.setValue("as;ldkfj");
        assertFalse(this.gap.isCorrect());
    },

    'test when gap current value is one of show answers should be true': function () {
        this.gap.setValue("3");
        assertTrue(this.gap.isCorrect());
    },

    'test when addon is case sensitive answer have to match case sensivity': function () {
        this.gap.showAnswersValue = ["asdf", "iop"];

        this.presenter.configuration.isCaseSensitive = true;

        this.gap.setValue("IOP");
        assertFalse(this.gap.isCorrect());
    },

    'test when addon ignores punctuation it should remove from user answers non word characters': function () {
        this.gap.showAnswersValue = ["asdf", "iop"];

        this.presenter.configuration.isCaseSensitive = false;
        this.presenter.configuration.isPunctuationIgnored = true;

        this.gap.setValue("I  O  , P");
        assertTrue(this.gap.isCorrect());
    }
});

TestCase("[Table] [Gap Utils] getScore / getErrorCount", {
    setUp: function () {
        setUpUtils.call(this);

        this.stubs.isCorrect = sinon.stub(this.presenter.GapUtils.prototype, 'isCorrect');
    },

    tearDown: function () {
        tearDownUtils.call(this);
        this.presenter.GapUtils.prototype.isCorrect.restore();
    },

    'test getScore should return 1 when gap is correct': function () {
        this.stubs.isCorrect.returns(true);

        assertEquals(1, this.gap.getScore());
    },

    'test getScore should return 0 when gap is not correct': function () {
        this.stubs.isCorrect.returns(false);

        assertEquals(0, this.gap.getScore());
    },

    'test getErrorCount should return 1 when gap is not correct': function () {
        this.gap.setValue("asdfa");
        this.stubs.isCorrect.returns(false);

        assertEquals(1, this.gap.getErrorCount());
    },

    'test getErrorCount should return 0 when gap is correct': function () {
        this.gap.setValue("asdf;.jkfasf");
        this.stubs.isCorrect.returns(true);

        assertEquals(0, this.gap.getErrorCount());
    },

    'test getErrorCount should return 0 when gap is empty': function () {
        this.stubs.isCorrect.returns(false);
        this.gap.setValue("");

        assertEquals(0, this.gap.getErrorCount());
    }
});


TestCase("[Table] [Gap Utils] Remove all classess", {
    setUp: function () {
        this.presenter = AddonTable_create();

        var mockConfig = {
            eventBus: function () {},
            getSelectedItem: function () {},
            addonID: "addonID",
            objectID: "htmlID",
            showAnswersValue: ["1", "2", "3"],

            gapScore: 1
        };

        this.stubs = {
            connectEvents: sinon.stub(DraggableDroppableObject._internal, 'connectEvents'),
            createView: sinon.stub(DraggableDroppableObject.prototype, 'createView'),
            removeCssClass: sinon.stub(DraggableDroppableObject.prototype, 'removeCssClass')
        };

        this.gap = new this.presenter.GapUtils(mockConfig);
    },

    tearDown: function () {
        DraggableDroppableObject._internal.connectEvents.restore();
        DraggableDroppableObject.prototype.createView.restore();
        DraggableDroppableObject.prototype.removeCssClass.restore();
    },

    'test should remove ic_gap-correct': function () {
        this.gap.removeAllClasses();

        assertTrue(this.stubs.removeCssClass.calledWith("ic_gap-correct"));
    },

    'test should remove ic_gap-wrong': function () {
        this.gap.removeAllClasses();

        assertTrue(this.stubs.removeCssClass.calledWith("ic_gap-wrong"));
    },

    'test should remove ic_gap-empty': function () {
        this.gap.removeAllClasses();

        assertTrue(this.stubs.removeCssClass.calledWith("ic_gap-empty"));
    }
});

TestCase("[Table] [Gap Utils] GetValueChangedData", {
    setUp: function () {
        this.presenter = AddonTable_create();

        this.stubs = {
            createView: sinon.stub(DraggableDroppableObject.prototype, 'createView'),
            connectEvents: sinon.stub(DraggableDroppableObject._internal, 'connectEvents'),
            validateConfiguration: sinon.stub(DraggableDroppableObject._internal, 'validateConfiguration'),
            getValue: sinon.stub(DraggableDroppableObject.prototype, 'getValue'),
            getObjectID: sinon.stub(DraggableDroppableObject.prototype, 'getObjectID'),
            isCorrect: sinon.stub(this.presenter.GapUtils.prototype, 'isCorrect')
        };

        this.gap = new this.presenter.GapUtils({});
    },

    tearDown: function () {
        DraggableDroppableObject.prototype.createView.restore();
        DraggableDroppableObject._internal.connectEvents.restore();
        DraggableDroppableObject._internal.validateConfiguration.restore();
        DraggableDroppableObject.prototype.getValue.restore();
        DraggableDroppableObject.prototype.getObjectID.restore();
        this.presenter.GapUtils.prototype.isCorrect.restore();
    },

    'test should return objectID of gap objectID': function () {
        var expectedID = "asl;fdjhsafdsaf";

        this.stubs.getObjectID.returns(expectedID);

        var result = this.gap.getValueChangeEventData();

        assertEquals(expectedID, result.objectID);
    },

    'test should return gap value': function () {
        var expectedValue = "aw8y.34.,sdgfjvsza";

        this.stubs.getValue.returns(expectedValue);

        var result = this.gap.getValueChangeEventData();

        assertEquals(expectedValue, result.value);
    },

    'test should return that gap is not correct when gap is incorrect': function () {
        this.stubs.isCorrect.returns(false);

        var result = this.gap.getValueChangeEventData();

        assertFalse(result.isCorrect);
    },

    'test should return that gap is correct when gap is correct': function () {
        this.stubs.isCorrect.returns(true);

        var result = this.gap.getValueChangeEventData();

        assertTrue(result.isCorrect);
    }
});

TestCase("[Table] [Gap Utils] GetGapState", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.stubs = {
            connectEvents: sinon.stub(DraggableDroppableObject._internal, 'connectEvents'),
            validateConfiguration: sinon.stub(DraggableDroppableObject._internal, 'validateConfiguration')
        };

        this.expectedValue = 5;
        this.expectedIsEnabled = false;

        this.gap = new this.presenter.GapUtils({});
        this.gap.setValue(this.expectedValue);
        this.gap.isEnabled = this.expectedIsEnabled;
    },

    tearDown: function () {
        DraggableDroppableObject._internal.connectEvents.restore();
        DraggableDroppableObject._internal.validateConfiguration.restore();
    },

    'test should return object': function () {
        var testedState = this.gap.getGapState();

        assertObject(testedState);
    },

    'test should return actual gap value': function () {
        var testedState = this.gap.getGapState();

        assertEquals(this.expectedValue, testedState.value);
    },

    'test should return isEnabled value': function () {
        var testedState = this.gap.getGapState();

        assertEquals(this.expectedIsEnabled, testedState.isEnabled);
    }
});

TestCase("[Table] [Gap Utils] SetState", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {
            gapType: "draggable"
        };
        this.stubs = {
            connectEvents: sinon.stub(DraggableDroppableObject._internal, 'connectEvents'),
            validateConfiguration: sinon.stub(DraggableDroppableObject._internal, 'validateConfiguration'),
            parseAltTexts: sinon.stub()
        };

        this.expectedValue = 5;
        this.expectedIsEnabled = false;
        this.expectedSource = "testSource";

        this.gap = new this.presenter.GapUtils({});

        this.stubs.setViewValue = sinon.stub(this.gap, 'setViewValue');
        this.stubs.setValue = sinon.stub(this.gap, 'setValue');
        this.stubs.setSource = sinon.stub(this.gap, 'setSource');
        this.stubs.setIsEnabled = sinon.stub(this.gap, 'setIsEnabled');

        this.presenter.textParser = {
            parseAltTexts: this.stubs.parseAltTexts
        };
        this.stubs.parseAltTexts.returnsArg(0);
    },

    tearDown: function () {
        DraggableDroppableObject._internal.connectEvents.restore();
        DraggableDroppableObject._internal.validateConfiguration.restore();
        this.gap.setViewValue.restore();
        this.gap.setValue.restore();
        this.gap.setSource.restore();
        this.gap.setIsEnabled.restore();
    },

    'test should set value of gap with provided value': function () {

        this.gap.setState({
            value: this.expectedValue,
            source: this.expectedSource,
            isEnabled: this.expectedIsEnabled
        });

        assertTrue(this.stubs.setValue.calledOnce);
        assertTrue(this.stubs.setValue.calledWith(this.expectedValue));
    },

    'test should set view value of gap with provided value': function () {
         this.gap.setState({
            value: this.expectedValue,
            source: this.expectedSource,
            isEnabled: this.expectedIsEnabled
        });

        assertTrue(this.stubs.setViewValue.calledOnce);
        assertTrue(this.stubs.setViewValue.calledWith(this.expectedValue));
    },

    'test should setIsEnabled of gap with provided value isEnabled': function () {
         this.gap.setState({
            value: this.expectedValue,
            source: this.expectedSource,
            isEnabled: this.expectedIsEnabled
        });

        assertTrue(this.stubs.setIsEnabled.calledOnce);
        assertTrue(this.stubs.setIsEnabled.calledWith(this.expectedIsEnabled));
    },

    'test shouldnt setIsEnabled of gap if isEnabled arg is undefined': function () {
         this.gap.setState({
            value: this.expectedValue,
            source: this.expectedSource,
        });


        assertFalse(this.stubs.setIsEnabled.called);
    },

    'test setSpanState should set Source of gap with provided value': function () {
        this.gap.setState({
            value: this.expectedValue,
            source: this.expectedSource,
            isEnabled: this.expectedIsEnabled
        });

        assertTrue(this.stubs.setSource.calledOnce);
        assertTrue(this.stubs.setSource.calledWith(this.expectedSource));
    }
});

TestCase("[Table] [Gap Utils] SetState of not draggable gaps", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {
            gapType: "editable"
        };
        this.stubs = {
            connectEvents: sinon.stub(DraggableDroppableObject._internal, 'connectEvents'),
            validateConfiguration: sinon.stub(DraggableDroppableObject._internal, 'validateConfiguration'),
            valStub: sinon.stub()
        };

        this.expectedValue = 5;
        this.expectedIsEnabled = false;
        this.expectedSource = "testSource";

        this.gap = new this.presenter.GapUtils({});
        this.stubs.setIsEnabled = sinon.stub(this.gap, 'setIsEnabled');
        this.gap.$view = {
            html: this.stubs.valStub
        };

    },

    tearDown: function () {
        DraggableDroppableObject._internal.connectEvents.restore();
        DraggableDroppableObject._internal.validateConfiguration.restore();
    },

    'test should set value of gap with provided value': function () {
        this.gap.setState({
            value: this.expectedValue,
            source: this.expectedSource,
            isEnabled: this.expectedIsEnabled
        });

        assertTrue(this.stubs.valStub.calledOnce);
        assertTrue(this.stubs.valStub.calledWith(this.expectedValue));
    }
});

TestCase("[Table] [Gap Utils] GetState", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.stubs = {
            connectEvents: sinon.stub(DraggableDroppableObject._internal, 'connectEvents'),
            validateConfiguration: sinon.stub(DraggableDroppableObject._internal, 'validateConfiguration')
        };

        this.expectedValue = "expectedTestValue";
        this.expectedSource = "expectedTestSource";


        this.gap = new this.presenter.GapUtils({});

        this.stubs.getValue = sinon.stub(this.gap, 'getValue');
        this.stubs.getSource = sinon.stub(this.gap, 'getSource');

        this.stubs.getValue.returns(this.expectedValue);
        this.stubs.getSource.returns(this.expectedSource);
    },

    tearDown: function () {
        DraggableDroppableObject._internal.connectEvents.restore();
        DraggableDroppableObject._internal.validateConfiguration.restore();
        this.gap.getValue.restore();
        this.gap.getSource.restore();
    },

    'test should return object': function () {
        var testedState = this.gap.getState();

        assertObject(testedState);
    },

    'test should return value attribute with actual gap value': function () {
        var testedState = this.gap.getState();

        assertEquals(this.expectedValue, testedState.value);
    },

    'test should return item attribute with actual gap source': function () {
        var testedState = this.gap.getState();

        assertEquals(this.expectedSource, testedState.item);
    }
});

TestCase("[Table] [Gap Utils] setIsEnabled", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.stubs = {
            connectEvents: sinon.stub(DraggableDroppableObject._internal, 'connectEvents'),
            validateConfiguration: sinon.stub(DraggableDroppableObject._internal, 'validateConfiguration')
        };

        this.gap = new this.presenter.GapUtils({});

        this.stubs.lock = sinon.stub(this.gap, 'lock');
        this.stubs.unlock = sinon.stub(this.gap, 'unlock');
    },

    tearDown: function () {
        DraggableDroppableObject._internal.connectEvents.restore();
        DraggableDroppableObject._internal.validateConfiguration.restore();
        this.gap.lock.restore();
        this.gap.unlock.restore();
    },
    
    'test should unlock gap when is disabled and isEnabled is true': function () {
        this.gap.isDisabled = true;
        this.gap.setIsEnabled(true);
        
        assertTrue(this.stubs.unlock.calledOnce);
        assertFalse(this.stubs.lock.called);
    },
    
    'test should lock gap when is not disabled and is enabled is false': function () {
        this.gap.isDisabled = false;
        this.gap.setIsEnabled(false);

        assertFalse(this.stubs.unlock.called);
        assertTrue(this.stubs.lock.calledOnce);
    },

    'test should do nothing when gap is disabled and is enabled is false': function () {
        this.gap.isDisabled = true;
        this.gap.setIsEnabled(false);

        assertFalse(this.stubs.unlock.called);
        assertFalse(this.stubs.lock.called);
    },

    'test should do nothing when gap is not disabled and is enabled is true': function () {
        this.gap.isDisabled = false;
        this.gap.setIsEnabled(true);

        assertFalse(this.stubs.unlock.called);
        assertFalse(this.stubs.lock.called);
    }
});