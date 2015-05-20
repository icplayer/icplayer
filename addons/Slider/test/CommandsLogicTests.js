CommandsLogicTestsUtils = {
    setUp: function() {
        this.presenter = AddonSlider_create();
        this.presenter.configuration = {
            stepsCount: 10,
            currentStep: 5,
            initialStep: 3
        };

        var elements = {
            addonContainer: undefined,
            imageElement: undefined
        };
        sinon.stub(this.presenter, 'moveToStep');
        this.elementsGetterStub = sinon.stub(this.presenter, 'getContainerAndImageElements');
        this.elementsGetterStub.returns(elements);

        sinon.stub(this.presenter, 'triggerStepChangeEvent');
        sinon.stub(this.presenter, 'triggerOnStepChangeUserEvent');

        sinon.stub(this.presenter, 'show');
        sinon.stub(this.presenter, 'hide');
        sinon.stub(this.presenter, 'setVisibility');
        sinon.stub(this.presenter, 'removeDisabledClass');
    },

    tearDown: function() {
        this.presenter.moveToStep.restore();
        this.presenter.getContainerAndImageElements.restore();
        this.presenter.triggerStepChangeEvent.restore();
        this.presenter.triggerOnStepChangeUserEvent.restore();
        this.presenter.show.restore();
        this.presenter.hide.restore();
        this.presenter.setVisibility.restore();
        this.presenter.removeDisabledClass.restore();
    }
};

TestCase("[Slider] moveTo command logic", {
    setUp: CommandsLogicTestsUtils.setUp,
    tearDown: CommandsLogicTestsUtils.tearDown,

    'test invalid step': function() {
        this.presenter.moveToCommand(['number']);

        assertEquals(0, this.presenter.moveToStep.callCount);
        assertEquals(0, this.presenter.triggerStepChangeEvent.callCount);
        assertEquals(0, this.presenter.triggerOnStepChangeUserEvent.callCount);
    },

    'test step out of bounds': function() {
        this.presenter.moveToCommand(['12']);

        assertEquals(0, this.presenter.moveToStep.callCount);
        assertEquals(0, this.presenter.triggerStepChangeEvent.callCount);
        assertEquals(0, this.presenter.triggerOnStepChangeUserEvent.callCount);
    },

    'test step too low': function() {
        this.presenter.moveToCommand(['0']);

        assertEquals(0, this.presenter.moveToStep.callCount);
        assertEquals(0, this.presenter.triggerStepChangeEvent.callCount);
        assertEquals(0, this.presenter.triggerOnStepChangeUserEvent.callCount);
    },

    'test params array empty': function() {
        this.presenter.moveToCommand([]);

        assertEquals(0, this.presenter.moveToStep.callCount);
        assertEquals(5, this.presenter.configuration.currentStep);
        assertEquals(0, this.presenter.triggerStepChangeEvent.callCount);
        assertEquals(0, this.presenter.triggerOnStepChangeUserEvent.callCount);
    },

    'test proper step value': function() {
        this.presenter.moveToCommand(['4']);

        assertEquals(1, this.presenter.moveToStep.callCount);
        assertEquals(4, this.presenter.configuration.currentStep);
        assertEquals(2, this.presenter.triggerStepChangeEvent.callCount);
        assertEquals(1, this.presenter.triggerOnStepChangeUserEvent.callCount);
    },

    'test proper step value without triggering events': function() {
        this.presenter.moveToCommand(['4', 'false']);

        assertEquals(1, this.presenter.moveToStep.callCount);
        assertEquals(4, this.presenter.configuration.currentStep);
        assertEquals(0, this.presenter.triggerStepChangeEvent.callCount);
        assertEquals(1, this.presenter.triggerOnStepChangeUserEvent.callCount);
    }
});

TestCase("[Slider] moveToInitialStep command logic", {
    setUp: CommandsLogicTestsUtils.setUp,
    tearDown: CommandsLogicTestsUtils.tearDown,

    'test current step is different than initial': function() {
        this.presenter.moveToInitialStepCommand([]);

        assertEquals(1, this.presenter.moveToStep.callCount);
        assertEquals(this.presenter.configuration.initialStep, this.presenter.configuration.currentStep);
        assertEquals(2, this.presenter.triggerStepChangeEvent.callCount);
        assertEquals(1, this.presenter.triggerOnStepChangeUserEvent.callCount);
    },

    'test current step equals initial step': function() {
        this.presenter.configuration.currentStep = 3;

        this.presenter.moveToInitialStepCommand([]);

        assertEquals(0, this.presenter.moveToStep.callCount);
        assertEquals(0, this.presenter.triggerStepChangeEvent.callCount);
        assertEquals(0, this.presenter.triggerOnStepChangeUserEvent.callCount);
    },

    'test current step is different than initial without triggering events': function() {
        this.presenter.moveToInitialStepCommand(['false']);

        assertEquals(1, this.presenter.moveToStep.callCount);
        assertEquals(this.presenter.configuration.initialStep, this.presenter.configuration.currentStep);
        assertEquals(0, this.presenter.triggerStepChangeEvent.callCount);
        assertEquals(1, this.presenter.triggerOnStepChangeUserEvent.callCount);
    }
});

TestCase("[Slider] moveToLast command logic", {
    setUp: CommandsLogicTestsUtils.setUp,
    tearDown: CommandsLogicTestsUtils.tearDown,

    'test current step is different than last': function() {
        this.presenter.moveToLastCommand([]);

        assertEquals(1, this.presenter.moveToStep.callCount);
        assertEquals(10, this.presenter.configuration.currentStep);
        assertEquals(2, this.presenter.triggerStepChangeEvent.callCount);
        assertEquals(1, this.presenter.triggerOnStepChangeUserEvent.callCount);
    },

    'test current step equals steps count': function() {
        this.presenter.configuration.currentStep = 10;

        this.presenter.moveToLastCommand([]);

        assertEquals(0, this.presenter.moveToStep.callCount);
        assertEquals(0, this.presenter.triggerStepChangeEvent.callCount);
        assertEquals(0, this.presenter.triggerOnStepChangeUserEvent.callCount);
    },

    'test current step is different than last without triggering events': function() {
        this.presenter.moveToLastCommand(['false']);

        assertEquals(1, this.presenter.moveToStep.callCount);
        assertEquals(10, this.presenter.configuration.currentStep);
        assertEquals(0, this.presenter.triggerStepChangeEvent.callCount);
        assertEquals(1, this.presenter.triggerOnStepChangeUserEvent.callCount);
    }
});

TestCase("[Slider] moveToFirst command logic", {
    setUp: CommandsLogicTestsUtils.setUp,
    tearDown: CommandsLogicTestsUtils.tearDown,

    'test current step is different than 1': function() {
        this.presenter.moveToFirstCommand([]);

        assertEquals(1, this.presenter.moveToStep.callCount);
        assertEquals(1, this.presenter.configuration.currentStep);
        assertEquals(2, this.presenter.triggerStepChangeEvent.callCount);
        assertEquals(1, this.presenter.triggerOnStepChangeUserEvent.callCount);
    },

    'test current step equals 1': function() {
        this.presenter.configuration.currentStep = 1;

        this.presenter.moveToFirstCommand([]);

        assertEquals(0, this.presenter.moveToStep.callCount);
        assertEquals(0, this.presenter.triggerStepChangeEvent.callCount);
        assertEquals(0, this.presenter.triggerOnStepChangeUserEvent.callCount);
    },

    'test current step is different than 1 without triggering events': function() {
        this.presenter.moveToFirstCommand(['false']);

        assertEquals(1, this.presenter.moveToStep.callCount);
        assertEquals(1, this.presenter.configuration.currentStep);
        assertEquals(0, this.presenter.triggerStepChangeEvent.callCount);
        assertEquals(1, this.presenter.triggerOnStepChangeUserEvent.callCount);
    }
});

TestCase("[Slider] nextStep command logic", {
    setUp: CommandsLogicTestsUtils.setUp,
    tearDown: CommandsLogicTestsUtils.tearDown,

    'test current step is different than last': function() {
        this.presenter.nextStepCommand([]);

        assertEquals(1, this.presenter.moveToStep.callCount);
        assertEquals(6, this.presenter.configuration.currentStep);
        assertEquals(2, this.presenter.triggerStepChangeEvent.callCount);
        assertEquals(1, this.presenter.triggerOnStepChangeUserEvent.callCount);
    },

    'test current step equals steps count': function() {
        this.presenter.configuration.currentStep = 10;

        this.presenter.nextStepCommand([]);

        assertEquals(0, this.presenter.moveToStep.callCount);
        assertEquals(10, this.presenter.configuration.currentStep);
        assertEquals(0, this.presenter.triggerStepChangeEvent.callCount);
        assertEquals(0, this.presenter.triggerOnStepChangeUserEvent.callCount);
    },

    'test current step is different than last without triggering events': function() {
        this.presenter.nextStepCommand(['false']);

        assertEquals(1, this.presenter.moveToStep.callCount);
        assertEquals(6, this.presenter.configuration.currentStep);
        assertEquals(0, this.presenter.triggerStepChangeEvent.callCount);
        assertEquals(1, this.presenter.triggerOnStepChangeUserEvent.callCount);
    }
});

TestCase("[Slider] previousStep command logic", {
    setUp: CommandsLogicTestsUtils.setUp,
    tearDown: CommandsLogicTestsUtils.tearDown,

    'test current step is different than 1': function() {
        this.presenter.previousStepCommand([]);

        assertEquals(1, this.presenter.moveToStep.callCount);
        assertEquals(4, this.presenter.configuration.currentStep);
        assertEquals(2, this.presenter.triggerStepChangeEvent.callCount);
        assertEquals(1, this.presenter.triggerOnStepChangeUserEvent.callCount);
    },

    'test current step equals 1': function() {
        this.presenter.configuration.currentStep = 1;

        this.presenter.previousStepCommand([]);

        assertEquals(0, this.presenter.moveToStep.callCount);
        assertEquals(1, this.presenter.configuration.currentStep);
        assertEquals(0, this.presenter.triggerStepChangeEvent.callCount);
        assertEquals(0, this.presenter.triggerOnStepChangeUserEvent.callCount);
    },

    'test current step is different than 1 without triggering events': function() {
        this.presenter.previousStepCommand(['false']);

        assertEquals(1, this.presenter.moveToStep.callCount);
        assertEquals(4, this.presenter.configuration.currentStep);
        assertEquals(0, this.presenter.triggerStepChangeEvent.callCount);
        assertEquals(1, this.presenter.triggerOnStepChangeUserEvent.callCount);
    }
});

TestCase("[Slider] getCurrentStep command logic", {
    'test current step equals 5': function() {
        var presenter = AddonSlider_create();
        presenter.configuration = {
            currentStep: 5
        };
        var currentStep  = presenter.getCurrentStep();

        assertEquals('5', currentStep);
        assertEquals('string', typeof currentStep);
    },

    'test current step method return value ': function() {
        var presenter = AddonSlider_create();
        presenter.configuration = {
            currentStep: 5
        };
        var currentStep  = presenter.executeCommand('getcurrentstep', []);

        assertEquals('5', currentStep);
        assertEquals('string', typeof currentStep);
    }
});

TestCase("[Slider] Reset command logic", {
    setUp: CommandsLogicTestsUtils.setUp,
    tearDown: CommandsLogicTestsUtils.tearDown,

    'test reset command moves slider to initial position': function() {
        this.presenter.configuration.initialStep = 2;
        this.presenter.configuration.isVisibleByDefault = true;
        this.presenter.configuration.isVisible = true;

        this.presenter.reset();

        assertEquals(2, this.presenter.configuration.currentStep);

        assertTrue(this.presenter.moveToStep.calledOnce);
        assertFalse(this.presenter.triggerStepChangeEvent.called);
        assertFalse(this.presenter.triggerOnStepChangeUserEvent.called);
        assertTrue(this.presenter.setVisibility.calledWith(true));
        assertTrue(this.presenter.removeDisabledClass.calledOnce);
        assertTrue(this.presenter.configuration.isVisible);
    },

    'test reset command on visible element while default visibility is false': function() {
        this.presenter.configuration.initialStep = 2;
        this.presenter.configuration.isVisibleByDefault = false;
        this.presenter.configuration.isVisible = true;

        this.presenter.reset();

        assertEquals(2, this.presenter.configuration.currentStep);

        assertTrue(this.presenter.moveToStep.calledOnce);
        assertFalse(this.presenter.triggerStepChangeEvent.called);
        assertFalse(this.presenter.triggerOnStepChangeUserEvent.called);
        assertTrue(this.presenter.setVisibility.calledWith(false));
        assertTrue(this.presenter.removeDisabledClass.calledOnce);
        assertFalse(this.presenter.configuration.isVisible);
    }
});

TestCase("[Slider] Command params helper method", {
    setUp: function () {
        this.presenter = AddonSlider_create();
    },

    'test function has no default parameters and additional param is false': function () {
        var params = ['false'];

        var parsedParam = this.presenter.parseAdditionalTriggerEventParam(params, 0);

        assertFalse(parsedParam);
    },

    'test function has no default parameters and additional param is true': function () {
        var params = ['true'];

        var parsedParam = this.presenter.parseAdditionalTriggerEventParam(params, 0);

        assertTrue(parsedParam);
    },

    'test function has no default parameters and additional param is undefined': function () {
        var params = [];

        var parsedParam = this.presenter.parseAdditionalTriggerEventParam(params, 0);

        assertTrue(parsedParam);
    },

    'test function has one default parameter and additional param is false': function () {
        var params = ['3', 'false'];

        var parsedParam = this.presenter.parseAdditionalTriggerEventParam(params, 1);

        assertFalse(parsedParam);
    },

    'test function has one default parameter and additional param is true': function () {
        var params = ['3', 'true'];

        var parsedParam = this.presenter.parseAdditionalTriggerEventParam(params, 1);

        assertTrue(parsedParam);
    },

    'test function has one default parameter and additional param is undefined': function () {
        var params = ['3'];

        var parsedParam = this.presenter.parseAdditionalTriggerEventParam(params, 1);

        assertTrue(parsedParam);
    },

    'test function has one default parameter and additional param is false with capital letter': function () {
        var params = ['3', 'False'];

        var parsedParam = this.presenter.parseAdditionalTriggerEventParam(params, 1);

        assertFalse(parsedParam);
    }
});