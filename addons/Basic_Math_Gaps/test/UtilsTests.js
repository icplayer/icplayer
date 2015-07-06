TestCase("[Basic Math Gaps] Create gaps", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();
        this.presenter.gapsContainer = new this.presenter.GapsContainerObject();
        this.presenter.widgetsFactory = new this.presenter.ObjectFactory();

        this.presenter.configuration = {
            gapsDefinition: "testDefs",
            isDisabled: false
        };

        this.stubs = {
            produce: sinon.stub(this.presenter.widgetsFactory, 'produce')
        };
    },

    tearDown: function () {
        this.presenter.widgetsFactory.produce.restore();
    },

    'test create gaps should dispatch task of producing gap container': function () {
        this.presenter.createGaps();

        assertTrue(this.stubs.produce.calledWith(this.presenter.ObjectFactory.PRODUCTION_TYPE.GAP_CONTAINER,
        this.presenter.configuration.gapsDefinition));
    },

    'test create gaps should set last dragged item as empty object': function () {
        this.presenter.createGaps();

        assertEquals({}, this.presenter.lastDraggedItem);
    },

    'test create gaps should dispatch only one producing tasks': function () {
        this.presenter.createGaps();

        assertTrue(this.stubs.produce.calledOnce);
    }
});

TestCase("[Basic Math Gaps] Get error object", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();
    },

    'test should return object with isError set on true and provided errorCode': function () {
        var testErrorCode = "alk;sdjfla;8374;jfadnd";
        var expectedErrorObject = {
            isError: true,
            errorCode: testErrorCode
        };

        assertEquals(expectedErrorObject, this.presenter.getErrorObject(testErrorCode));
    }
});

TestCase("[Basic Math Gaps] Are Values in Equation", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();
    },

    'test should be valid if user answers are in equation': function () {
        assertTrue(this.presenter.areValuesInEquation(["1", "2", "3"], ["1", "2", "3"]));
    },

    'test should be valid if user answers are in equation even if in other order': function () {
        assertTrue(this.presenter.areValuesInEquation(["2", "1", "3"], ["1", "2", "3"]));
    },

    'test should be invalid if user answers are not in equation': function () {
        assertFalse(this.presenter.areValuesInEquation(["1", "9", "10"], ["6", "4", "10"]));
    }
});

TestCase("[Basic Math Gaps] removeEmptyStringsFromArray", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();
        this.expectedArray = ["[3]", "+", "[2]", "+", "[2]", "=", "[7]"];
    },

    'test should remove only empty strings from array': function () {
        var validatedArray = this.presenter.removeEmptyStringsFromArray(["[3]", "+", "[2]", "+", "[2]", "", "=", "[7]"]);

        assertEquals(this.expectedArray, validatedArray);
    },

    'test should remove all empty strings and dont change order': function () {
        var validatedArray = this.presenter.removeEmptyStringsFromArray(["", "[3]", "+", "[2]", "+", "[2]", "", "=", "", "[7]"]);

        assertEquals(this.expectedArray, validatedArray);
    }
});

TestCase("[Basic Math Gaps] setDisabledInSetState", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();
        this.presenter.gapsContainer = new this.presenter.GapsContainerObject();

        this.stubs = {
            lock: sinon.stub(this.presenter.GapsContainerObject.prototype, 'lock'),
            unlock: sinon.stub(this.presenter.GapsContainerObject.prototype, 'unlock')
        };

        this.presenter.configuration = {
            isDisabledByDefault: true,
            isDisabled : "asdsa"
        };
    },

    tearDown: function () {
        this.presenter.GapsContainerObject.prototype.lock.restore();
        this.presenter.GapsContainerObject.prototype.unlock.restore();
    },

    'test when state is disabled and gaps are disabled by default there should lock': function () {
        this.presenter.setDisabledInSetState(true);

        assertFalse(this.stubs.unlock.called);
        assertTrue(this.stubs.lock.calledOnce);
    },

    'test when state is not disabled and gaps are disabled by default there should be unlock': function () {
        this.presenter.setDisabledInSetState(false);

        assertFalse(this.stubs.lock.called);
        assertTrue(this.stubs.unlock.calledOnce);
    },

    'test when state is disabled and gaps arent disabled by default there should be lock': function () {
        this.presenter.configuration.isDisabledByDefault = false;
        this.presenter.setDisabledInSetState(true);

        assertFalse(this.stubs.unlock.called);
        assertTrue(this.stubs.lock.calledOnce);
    },

    'test when state is not disabled and gaps arent disabled by default there should be no action': function () {
        this.presenter.configuration.isDisabledByDefault = false;
        this.presenter.setDisabledInSetState(false);

        assertFalse(this.stubs.unlock.called);
        assertFalse(this.stubs.lock.called);
    },

    'test setDisabledInSetState should set isDisabled in configuration with value provided': function () {
        this.presenter.setDisabledInSetState(true);

        assertTrue(this.presenter.configuration.isDisabled);

        this.presenter.setDisabledInSetState(false);

        assertFalse(this.presenter.configuration.isDisabled);
    }
});