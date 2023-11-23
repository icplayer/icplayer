TestCase("[Drawing] Upgrade state", {

    setUp: function() {
        this.presenter = AddonDrawing_create();
    },

    'test upgrade state with opacity': function() {
        var state = {
            addonMode: "pencil",
            color: 'red',
            pencilThickness: 10,
            eraserThickness: 10,
            data: 'data',
            isVisible: true,
            opacity: 0.1
        };

        assertEquals(0.1, this.presenter.upgradeStateForOpacity(state).opacity);
    },

    'test upgrade state without opacity': function() {
        var state = {
            addonMode: "pencil",
            color: 'red',
            pencilThickness: 10,
            eraserThickness: 10,
            data: 'data',
            isVisible: true
        };

        assertEquals(0.9, this.presenter.upgradeStateForOpacity(state).opacity);
    },

    'test upgrade state with text editor result': function() {
        var textEditorResult = {
            "brokenText": [
                "333",
                "22",
                "1"
            ],
            "lineHeight": 14,
            "x": 162,
            "y": 78
        };
        var state = {
            addonMode: "pencil",
            color: 'red',
            pencilThickness: 10,
            eraserThickness: 10,
            data: 'data',
            isVisible: true,
            opacity: 0.1,
            textEditorResult: {...textEditorResult}
        };

        assertEquals(textEditorResult, this.presenter.upgradeTextEditorResult(state).textEditorResult);
    },

    'test upgrade state without text editor result': function() {
        var state = {
            addonMode: "pencil",
            color: 'red',
            pencilThickness: 10,
            eraserThickness: 10,
            data: 'data',
            isVisible: true,
            opacity: 0.1,
        };

        assertNull(this.presenter.upgradeTextEditorResult(state).textEditorResult);
    },

});

TestCase("[Drawing] Set state", {

    setUp: function() {
        this.presenter = AddonDrawing_create();

        this.stubs = {
            setColorStub: sinon.stub(),
            setVisibilityStub: sinon.stub(),
            setFontStub: sinon.stub(),
            embedTextStub: sinon.stub()
        };
        this.presenter.setColor = this.stubs.setColorStub;
        this.presenter.setVisibility = this.stubs.setVisibilityStub;
        this.presenter.setFont = this.stubs.setFontStub;
        this.presenter.embedText = this.stubs.embedTextStub;

        this.presenter.configuration = {};
        this.state = {
            addonMode: "textEdition",
            color: 'red',
            pencilThickness: 10,
            eraserThickness: 10,
            data: 'data',
            isVisible: true,
            opacity: 0.1,
            textEditorResult: {
                brokenText: [
                    "333",
                    "22",
                    "1"
                ],
                lineHeight: 14,
                x: 162,
                y: 78
            },
        };
    },

    'test upgrade state with text editor mode and text editor result': function() {
        const stringifyState = JSON.stringify(this.state);

        this.presenter.setState(stringifyState);

        assertEquals("pencil", this.presenter.configuration.addonMode);
        assertTrue(this.stubs.embedTextStub.calledOnce);
        assertTrue(this.stubs.embedTextStub.calledWith(
            this.state.textEditorResult.brokenText,
            this.state.textEditorResult.x,
            this.state.textEditorResult.y,
            this.state.textEditorResult.lineHeight
        ));
    },

    'test upgrade state with text editor mode and without text editor result': function() {
        this.state.textEditorResult = null;
        const stringifyState = JSON.stringify(this.state);

        this.presenter.setState(stringifyState);

        assertEquals("pencil", this.presenter.configuration.addonMode);
        assertFalse(this.stubs.embedTextStub.called);
    },

    'test upgrade state without text editor mode': function() {
        this.state.textEditorResult = null;
        this.state.addonMode = "pencil";
        const stringifyState = JSON.stringify(this.state);

        this.presenter.setState(stringifyState);

        assertEquals("pencil", this.presenter.configuration.addonMode);
        assertFalse(this.stubs.embedTextStub.called);
    }

});
