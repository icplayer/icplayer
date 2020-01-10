TestCase('[TextAudio] IsEnabledDecorator', {
    setUp: function () {
        this.presenter = AddonTextAudio_create();
        this.presenter.configuration = {
            isEnabled: false
        }
    },

    'test given some function call parameters when original function is called then will pass these parameters': function () {
        this.presenter.configuration.isEnabled = true;
        var stub = sinon.stub();
        var parameters = ["a", 1, {}];

        this.presenter.__internalElements.isEnabledDecorator(true)(stub).apply(this, parameters);

        assertTrue(stub.calledOnce);
        assertTrue(stub.calledWith.apply(stub, parameters))
    },

    'test given enabled module when expected enabled module then will call original function': function () {
        this.presenter.configuration.isEnabled = true;
        var stub = sinon.stub();

        this.presenter.__internalElements.isEnabledDecorator(true)(stub)();

        assertTrue(stub.calledOnce);
    },

    'test given enabled module when expected disabled module then wont call original function': function () {
        this.presenter.configuration.isEnabled = true;
        var stub = sinon.stub();

        this.presenter.__internalElements.isEnabledDecorator(false)(stub)();

        assertTrue(stub.notCalled);
    },

    'test given disabled module when expected enabled then wont call original function': function () {
        this.presenter.configuration.isEnabled = false;
        var stub = sinon.stub();

        this.presenter.__internalElements.isEnabledDecorator(true)(stub)();

        assertTrue(stub.notCalled);
    },

    'test given disabled module when expected disabled then will call original function': function () {
        this.presenter.configuration.isEnabled = false;
        var stub = sinon.stub();

        this.presenter.__internalElements.isEnabledDecorator(false)(stub)();

        assertTrue(stub.calledOnce);
    }
});

