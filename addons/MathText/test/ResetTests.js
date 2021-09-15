TestCase("[MathText] Reset tests", {
    setUp: function () {
        this.presenter = AddonMathText_create();

        this.stubs = {
            setVisibilityStub: sinon.stub(),
            removeStub: sinon.stub(),
            setMathMLStub: sinon.stub(),
            findStub: sinon.stub(),
            attrStub: sinon.stub(),
            removeAttrStub: sinon.stub(),
            setToolbarHiddenStub: sinon.stub(),
            setDisabledStub: sinon.stub(),
            isWirisEnableStub: sinon.stub(this.presenter, 'isWirisEnabled')
        };

        this.stubs.findStub.returns({
            attr: this.stubs.attrStub,
            removeAttr: this.stubs.removeAttrStub
        });
        this.stubs.isWirisEnableStub.returns(true);

        this.presenter.wrapper = {
            classList: {
                remove: this.stubs.removeStub
            }
        };

        this.presenter.$view = {
            find: this.stubs.findStub
        };

        this.presenter.editor = {
            setMathML: this.stubs.setMathMLStub,
            setToolbarHidden: this.stubs.setToolbarHiddenStub
        };

        this.presenter.state = {
            isCheckAnswers: false,
            isShowAnswers: false,
            isDisabled: false
        };

        this.presenter.configuration = {
            isVisible: true,
            showEditor: true,
            isActivity: true,
            isDisabled: false,
            initialText: 'initial'
        };

        this.presenter.setVisibility = this.stubs.setVisibilityStub;
    },

    'test set isCheckAnswers ans isShowAnswers state to false': function(){
        this.presenter.reset();

        assertFalse(this.presenter.state.isCheckAnswers);
        assertFalse(this.presenter.state.isShowAnswers);
    },

    'test reset visibility of addon to one set in config': function(){
        this.presenter.reset();

        assertTrue(this.stubs.setVisibilityStub.calledWith(this.presenter.configuration.isVisible));
    },

    'test reset should remove wrong and right classes from classlist': function(){
        this.presenter.reset();

        assertTrue(this.stubs.removeStub.calledTwice);
        assertTrue(this.stubs.removeStub.calledWith('wrong'));
        assertTrue(this.stubs.removeStub.calledWith('correct'));
    },

    'test reset should reset current text to initial text': function(){
        this.presenter.reset();

        assertTrue(this.stubs.setMathMLStub.called);
        assertTrue(this.stubs.setMathMLStub.calledWith('initial'));
    },

    'test reset should restore visibility of toolbar': function(){
        this.presenter.reset();

        assertTrue(this.stubs.setToolbarHiddenStub.called);
        assertTrue(this.stubs.setToolbarHiddenStub.calledWith(false));
    },

    'test should not try to call functions on editor, when not activity': function () {
        this.presenter.configuration.isActivity = false;
        this.presenter.configuration.showEditor = false;
        this.presenter.reset();

        assertFalse(this.stubs.setToolbarHiddenStub.called);
        assertFalse(this.stubs.setMathMLStub.called);
    },

    'test reset should call setDisabled with parameter from config': function () {
        this.presenter.configuration.isDisabled = true;
        this.presenter.reset();

        assertTrue(this.stubs.attrStub.called);
        assertTrue(this.stubs.attrStub.calledWith("disabled", true));
    }
});