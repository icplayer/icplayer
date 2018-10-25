function getValidModel(isVisible) {
    return {
        isVisible: isVisible,
        isValid: true
    }
}

TestCase('[Page_Progress_Panel] Visibility tests', {
    setUp: function () {
        this.presenter = AddonPage_Progress_Panel_create();

        this.stubs = {
            validateModelStub: sinon.stub(),
            showStub: sinon.stub(),
            hideStub: sinon.stub(),
            displayScoreStub: sinon.stub(),
            displayTextStub: sinon.stub(),
            getPresentationStub: sinon.stub(),
            getScoreStub: sinon.stub(),
            getPageStub: sinon.stub(),
            getPageScoreByIdStub: sinon.stub(),
            getEventBusStub: sinon.stub()
        };

        this.presenter.validateModel = this.stubs.validateModelStub;
        this.presenter.show = this.stubs.showStub;
        this.presenter.hide = this.stubs.hideStub;
        this.presenter.displayScore = this.stubs.displayScoreStub;
        this.presenter.displayText = this.stubs.displayTextStub;

        this.stubs.getPageStub.returns({
            getId: function(){return 'a'}
        });

        this.stubs.getPresentationStub.returns({
            getPage: this.stubs.getPageStub
        });

        this.stubs.getPageScoreByIdStub.returns({
            'maxScore': 10
        });

        this.stubs.getScoreStub.returns({
           getPageScoreById: this.stubs.getPageScoreByIdStub
        });

        this.stubs.getEventBusStub.returns({
            addEventListener: function () {}
        });

        this.presenter.setPlayerController({
            getPresentation: this.stubs.getPresentationStub,
            getScore: this.stubs.getScoreStub,
            getEventBus: this.stubs.getEventBusStub,
            getCurrentPageIndex: function () {}
        });

		this.view = document.createElement('div');
    },

    'test when in preview mode, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns(getValidModel(true));

        this.presenter.createPreview(this.view, {});

        assertFalse(this.stubs.showStub.called);
        assertFalse(this.stubs.hideStub.called);
    },

    'test when in preview mode and addon is not visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns(getValidModel(false));
        this.presenter.createPreview(this.view, {});

        assertFalse(this.stubs.showStub.called);
        assertFalse(this.stubs.hideStub.called);
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns(getValidModel(true));
        this.presenter.run(this.view, {});

        assertTrue(this.stubs.showStub.called);
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        this.stubs.validateModelStub.returns(getValidModel(false));

        this.presenter.run(this.view, {});

        assertTrue(this.stubs.hideStub.called);
    }
});