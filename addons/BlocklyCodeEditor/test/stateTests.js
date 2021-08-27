TestCase('[Blockly_Code_Editor] handling state tests', {
    setUp: function () {
        this.presenter = AddonBlocklyCodeEditor_create();
        this.presenter.$view = $(document.createElement('div'));
        Blockly.Xml = {
            textToDom: sinon.mock(),
            domToWorkspace: sinon.mock(),
            workspaceToDom: sinon.mock(),
            domToText: sinon.mock()
        };
    },

    'test given state when setState was called then should update visiblity and Blockly XML': function () {
        var mockWorkspace = {
            'body': {
                'toolbox': '<xml></xml>',
                'sounds': false,
                'maxBlocks': 0
            }
        };

        this.presenter.configuration.workspace = mockWorkspace;
        var setVisibilitySpy = sinon.spy(this.presenter, 'setVisibility');
        var newState = '{"code":"random value for code", "isVisible":true}';

        this.presenter.setState(newState);

        assertTrue(setVisibilitySpy.calledWith(true));
        assertTrue(Blockly.Xml.textToDom.calledWith('random value for code'));
        assertTrue(Blockly.Xml.domToWorkspace.called);
    },

    'test given workspace when getState was called then should return code and visibility status': function () {
        Blockly.Xml.workspaceToDom.returns('<div>fake DOM object</div>');
        Blockly.Xml.domToText.returns('fake DOM object');
        var mockWorkspace = {
            'body': {
                'toolbox': '<xml></xml>',
            }
        };
        this.presenter.configuration.workspace = mockWorkspace;
        this.presenter.configuration.isVisible = true;

        var state = this.presenter.getState();
        var mockState = '{"code":"fake DOM object","isVisible":true}';

        assertEquals(state, mockState);
        assertTrue(Blockly.Xml.workspaceToDom.calledWith(mockWorkspace));
        assertTrue(Blockly.Xml.domToText.calledWith('<div>fake DOM object</div>'));
    }
});
