TestCase("[MathText] Show answers tests", {
    setUp: function () {
        this.presenter = AddonMathText_create();

        // stubs
        this.stubs = {
            getMathMLStub: sinon.stub(),
            setMathMLStub: sinon.stub(),
            setToolbarHiddenStub: sinon.stub(),
            getScoreStub: sinon.stub(),
            setWorkModeStub: sinon.stub(),
            findStub: sinon.stub(),
            attrStub: sinon.stub(),
            removeAttrStub: sinon.stub(),
            setDisabledStub: sinon.stub(),
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
        this.stubs.getCorrectAnswerStub.returns('correctAnswer');

        // inner states
        this.presenter.state = {
            isShowAnswers: false,
            isCheckAnswers: false,
            currentAnswer: 'current',
            hasUserInteracted: true
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

        this.presenter.$view = {
            find: this.stubs.findStub
        };

        this.presenter.getScore = this.stubs.getScoreStub;
        this.presenter.setWorkMode = this.stubs.setWorkModeStub;
        this.presenter.setDisabled = this.stubs.setDisabledStub;
        this.presenter.answerObject = {
           getCorrectAnswer: this.stubs.getCorrectAnswerStub
        }
    },

    // showAnswers tests

    'test setWorkMode should be called when in check answers mode and calling showAnswers': function(){
        this.presenter.state.isCheckAnswers = true;
        this.presenter.configuration.showEditor = false;

        this.presenter.showAnswers();

        assertTrue(this.stubs.setWorkModeStub.called);
    },

    'test showAnswers should change isShowAnswers to true': function(){
        this.presenter.showAnswers();

        assertTrue(this.presenter.state.isShowAnswers);
    },

    'test showAnswers should hide toolbar and disable input': function(){
        this.presenter.showAnswers();

        assertTrue(this.stubs.setToolbarHiddenStub.calledWith(true));
        assertTrue(this.stubs.attrStub.calledWith('disabled', true));
    },

    'test should set currentAnswer to MathML and set editor text to correctAnswer': function(){
        this.presenter.showAnswers();

        assertEquals('MathML', this.presenter.state.currentAnswer);
        assertTrue(this.presenter.editor.setMathML.calledWith('correctAnswer'));
    },


    // hideAnswers tests
    'test should change isShowAnswers to false': function(){
        this.presenter.state.isShowAnswers = true;
        this.presenter.hideAnswers();

        assertFalse(this.presenter.state.isShowAnswers);
    },

    'test should call setDisabled after setToolbarHidden': function(){
        this.presenter.state.isShowAnswers = true;
        this.presenter.hideAnswers();

        assertTrue(this.stubs.setDisabledStub.calledAfter(this.stubs.setToolbarHiddenStub));
    },

    'test should reset editor text to previous user answer': function(){
        this.presenter.state.isShowAnswers = true;
        this.presenter.state.currentAnswer = 'user answer';
        this.presenter.hideAnswers();

        assertTrue(this.stubs.setMathMLStub.calledWith('user answer'));
    }
});