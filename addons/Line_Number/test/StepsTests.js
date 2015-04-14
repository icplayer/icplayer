TestCase("[Line_number] Create steps", {
    setUp: function () {
        this.presenter = AddonLine_Number_create();
        this.presenter.configuration = {
            max: 10,
            min: -10,
            step: 3,
            isActivity: true,
            showAxisXValues: true,
            axisXFieldValues: [-10, -7, -4, -1, 0, 2, 5, 8]
        };

        this.stubs = {
            setStepWidthInConfiguration: sinon.stub(this.presenter, 'setStepWidthInConfiguration'),
            getAxisConfigurationForCreatingSteps: sinon.stub(this.presenter, 'getAxisConfigurationForCreatingSteps'),
            createStep: sinon.stub(this.presenter, 'createStep'),
            setOnClickAreaListeners: sinon.stub(this.presenter, 'setOnClickAreaListeners')
        }
    },

    tearDown: function () {
        this.presenter.setStepWidthInConfiguration.restore();
        this.presenter.getAxisConfigurationForCreatingSteps.restore();
        this.presenter.createStep.restore();
    },

    'test creating steps should set in configuration max value from field': function () {
        this.presenter.createSteps();

        assertEquals(8, this.presenter.configuration.max);
    }
});