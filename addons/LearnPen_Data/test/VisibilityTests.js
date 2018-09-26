function getValidModel(isVisible) {
    return {
        isVisible: isVisible,
        isValid: true,
        isDisable: true,
        stepsAndColors: {
            a: [{color: ''},{color: ''},{color: ''},{color: ''},
                {color: ''},{color: ''},{color: ''},{color: ''},
                {color: ''},{color: ''},{color: ''},{color: ''}
                ],
            b: [{color: ''},{color: ''},{color: ''},{color: ''},
                {color: ''},{color: ''},{color: ''},{color: ''},
                {color: ''},{color: ''},{color: ''},{color: ''}
                ],
            c: [{color: ''},{color: ''},{color: ''},{color: ''},
                {color: ''},{color: ''},{color: ''},{color: ''},
                {color: ''},{color: ''},{color: ''},{color: ''}
                ],
            p: [{color: ''},{color: ''},{color: ''},{color: ''},
                {color: ''},{color: ''},{color: ''},{color: ''},
                {color: ''},{color: ''},{color: ''},{color: ''}
                ]
        }
    }
}

TestCase('[LearnPen_Data] Visiblity tests', {
    setUp: function () {
        this.presenter = AddonLearnPen_Data_create();

        this.stubs = {
            validateModelStub: sinon.stub(),
            setVisibilityStub: sinon.stub()
        };

        this.presenter.validateModel = this.stubs.validateModelStub;
        this.presenter.setVisibility = this.stubs.setVisibilityStub;

        this.view = document.createElement('div');
    },

    'test when in preview mode, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns(getValidModel(true));
        this.presenter.createPreview(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when in preview mode and addon is not visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns(getValidModel(false));
        this.presenter.createPreview(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns(getValidModel(true));
        this.presenter.run(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        this.stubs.validateModelStub.returns(getValidModel(false));
        this.presenter.run(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(false));
    }
});