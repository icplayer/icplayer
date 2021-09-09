TestCase("[MathText] Changing inner state tests", {
    setUp: function () {
        // Initally state is "normal" - enabled, visible, not in check/show answers mode

        this.presenter = AddonMathText_create();

         // stubs
        this.stubs = {
            getMathMLStub: sinon.stub(),
            setMathMLStub: sinon.stub(),
            setToolbarHiddenStub: sinon.stub(),
            getScoreStub: sinon.stub(),
            findStub: sinon.stub(),
            attrStub: sinon.stub(),
            removeAttrStub: sinon.stub(),
            removeStub: sinon.stub(),
            addStub: sinon.stub(),
            getCorrectAnswerStub: sinon.stub(),
            isWirisEnableStub: sinon.stub(this.presenter, 'isWirisEnabled')
        };

        this.stubs.isWirisEnableStub.returns(true);
        this.stubs.getScoreStub.returns(1);
        this.stubs.getMathMLStub.returns('MathML');
        this.stubs.findStub.returns({
            attr: this.stubs.attrStub,
            removeAttr: this.stubs.removeAttrStub
        });

        // inner states
        this.presenter.state = {
            isShowAnswers: false,
            isCheckAnswers: false,
            currentAnswer: 'current',
            hasUserInteracted: false,
            isDisabled: false
        };

        this.presenter.configuration = {
            isActivity: true,
            showEditor: true,
            initialText: 'initial',
            correctAnswer: 'correct'
        };

        // presenter mocking
        this.presenter.editor = {
            setToolbarHidden: this.stubs.setToolbarHiddenStub,
            getMathML: this.stubs.getMathMLStub,
            setMathML: this.stubs.setMathMLStub
        };

        this.presenter.answerObject = {
            getCorrectAnswer: this.stubs.getCorrectAnswerStub
        };

        this.presenter.$view = {
            find: this.stubs.findStub
        };

        this.presenter.wrapper = {
            classList: {
                remove: this.stubs.removeStub,
                add: this.stubs.addStub
            }
        };

        this.presenter.getScore = this.stubs.getScoreStub;
    },

    'test should change state to disabled': function(){
        this.presenter.disable();

        assertTrue(this.presenter.state.isDisabled);
    },

    'test when addon is disabled, calling enable should enable it': function () {
        this.presenter.disable();
        this.presenter.enable();

        assertFalse(this.presenter.state.isDisabled);
    },

    'test when addon is enabled, calling showAnswers should change state to enabled, isShowAnswers': function () {
        this.presenter.showAnswers();

        assertFalse(this.presenter.state.isDisabled);
        assertTrue(this.presenter.state.isShowAnswers);
    },

    'test when addon is disabled, calling show answers should change state to disabled, isShowAnswers': function () {
        this.presenter.disable();
        this.presenter.showAnswers();

        assertTrue(this.presenter.state.isDisabled);
        assertTrue(this.presenter.state.isShowAnswers);
    },

    'test when addon is showing answers, calling disable should change state to disabled, isShowAnswers': function () {
        this.presenter.showAnswers();
        this.presenter.disable();

        assertTrue(this.presenter.state.isDisabled);
        assertTrue(this.presenter.state.isShowAnswers);
    },

    'test when addon is enabled, calling checkAnswers should change state to enabled, isCheckAnswers': function () {
        this.presenter.setShowErrorsMode();

        assertFalse(this.presenter.state.isDisabled);
        assertTrue(this.presenter.state.isCheckAnswers);
    },

    'test when addon is disabled, calling checkAnswers should change state to disabled, isCheckAnswers': function () {
        this.presenter.disable();
        this.presenter.setShowErrorsMode();

        assertTrue(this.presenter.state.isDisabled);
        assertTrue(this.presenter.state.isCheckAnswers);
    },

    'test when addon is disabled and isCheckAnswers, calling unCheckAnswers should change state to disabled': function () {
        this.presenter.disable();
        this.presenter.setShowErrorsMode();
        this.presenter.setWorkMode();

        assertTrue(this.presenter.state.isDisabled);
        assertFalse(this.presenter.state.isCheckAnswers);
    },

    'test when addon is in check mode, calling disable should change state to disabled, isCheckAnswers': function () {
        this.presenter.setShowErrorsMode();
        this.presenter.disable();

        assertTrue(this.presenter.state.isDisabled);
        assertTrue(this.presenter.state.isCheckAnswers);
    },

     'test when addon is in check mode, calling disable should change state to disabled, isCheckAnswers': function () {
        this.presenter.setShowErrorsMode();
        this.presenter.disable();

        assertTrue(this.presenter.state.isDisabled);
        assertTrue(this.presenter.state.isCheckAnswers);
    },

    'test when addon is in check mode, calling showAnswers should change state to isShowAnswers': function () {
        this.presenter.setShowErrorsMode();
        this.presenter.showAnswers();

        assertFalse(this.presenter.state.isCheckAnswers);
        assertTrue(this.presenter.state.isShowAnswers);
    },

    'test when addon is in showAnswers, calling checkAnswers should change state to isCheckAnswers': function () {
        this.presenter.showAnswers();
        this.presenter.setShowErrorsMode();

        assertFalse(this.presenter.state.isShowAnswers);
        assertTrue(this.presenter.state.isCheckAnswers);
    }



});