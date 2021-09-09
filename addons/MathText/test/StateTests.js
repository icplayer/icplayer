TestCase("[MathText] State tests", {
    setUp: function () {
        this.presenter = AddonMathText_create();

        this.stubs = {
            setVisibilityStub: sinon.stub(),
            setMathMLStub: sinon.stub(),
            getMathMLStub: sinon.stub(),
            setDisabledStub: sinon.stub(),
            isWirisEnableStub: sinon.stub(this.presenter, 'isWirisEnabled')
        };

        this.stubs.isWirisEnableStub.returns(true);
        this.presenter.configuration = {
            isVisible: true,
            isActivity: true,
            showEditor: true,
            initialText: 'initial'
        };

        this.presenter.state = {
            isVisible: true
        };

        this.presenter.editor = {
            getMathML: this.stubs.getMathMLStub,
            setMathML: this.stubs.setMathMLStub
        };

        this.presenter.setVisibility = this.stubs.setVisibilityStub;
        this.presenter.setDisabled = this.stubs.setDisabledStub;

        this.stubs.getMathMLStub.returns('currentText');
    },

    // getState

    'test when activity addon should return current text from editor in state': function(){
        var state = this.presenter.getState();
        var parsedState = JSON.parse(state);

        assertTrue(this.stubs.getMathMLStub.called);
        assertEquals('currentText', parsedState.text);
    },

    'test when not activity addon should return initial text from config': function(){
        this.presenter.configuration.isActivity = false;
        this.presenter.configuration.showEditor = false;
        var state = this.presenter.getState();
        var parsedState = JSON.parse(state);

        assertFalse(this.stubs.getMathMLStub.called);
        assertEquals('initial', parsedState.text);
    },

    'test should get true as isVisible': function(){
        var state = this.presenter.getState();
        var parsedState = JSON.parse(state);

        assertTrue(parsedState.isVisible);
    },

    'test should get false as isVisible': function(){
        this.presenter.state.isVisible = false;
        var state = this.presenter.getState();
        var parsedState = JSON.parse(state);

        assertFalse(parsedState.isVisible);
    },

     'test should get true as hasUserInteracted': function(){
        this.presenter.state.hasUserInteracted = true;
        var state = this.presenter.getState();
        var parsedState = JSON.parse(state);

        assertTrue(parsedState.hasUserInteracted);
    },

     'test should get false as hasUserInteracted': function(){
        this.presenter.state.hasUserInteracted = false;
        var state = this.presenter.getState();
        var parsedState = JSON.parse(state);

        assertFalse(parsedState.hasUserInteracted);
    },

    // setState
    'test should set false as isVisible': function(){
        var state = '{"text": "testText", "isVisible": false}';

        this.presenter.setState(state);

        assertTrue(this.stubs.setVisibilityStub.calledWith(false));
    },

    'test should set true as isVisible': function(){
        var state = '{"text": "testText", "isVisible": true, "isDisabled": true}';

        this.presenter.setState(state);

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test should set true as isDisabled': function(){
        var state = '{"text": "testText", "isVisible": true, "isDisabled": true}';

        this.presenter.setState(state);

        assertTrue(this.stubs.setDisabledStub.calledWith(true));
    },

    'test should set text to editor when activity': function(){
        var state = '{"text": "testText", "isVisible": true}';

        this.presenter.setState(state);

        assertTrue(this.stubs.setMathMLStub.called);
        assertTrue(this.stubs.setMathMLStub.calledWith('testText'));
    },

    'test should not set text to editor when not activity': function(){
        var state = '{"text": "testText", "isVisible": true}';
        this.presenter.configuration.isActivity = false;
        this.presenter.configuration.showEditor = false;

        this.presenter.setState(state);

        assertFalse(this.stubs.setMathMLStub.called);
    },

    'test should set hasUserInteracted': function(){
        var state = '{"text": "testText", "isVisible": true, "hasUserInteracted": true}';
        this.presenter.state.hasUserInteracted = false;

        this.presenter.setState(state);

        assertTrue(this.presenter.state.hasUserInteracted);
    }

});