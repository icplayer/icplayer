TestCase('[Blockly_Code_Editor] workspace code tests', {
    setUp: function () {
        this.presenter = AddonBlocklyCodeEditor_create();
        this.presenter.configuration.maxBlocks = 10;
        this.presenter.configuration.workspace = {
            'toolbox': '<xml></xml>',
            'sounds': false,
            'maxBlocks': this.presenter.configuration.maxBlocks
        };

        Blockly.JavaScript = {
            workspaceToCode: sinon.mock()
        };
        Blockly.JavaScript.workspaceToCode.returns('<xml sounds="false" maxBlocks="10"></xml>');
    },

    tearDown: function () {
        sinon.mock.restore();
    },

    'test given workspace when getWorkspaceCode was called then should return code of workspace': function () {
        var workspace = this.presenter.getWorkspaceCode();
        var mockArg = {
            'toolbox': '<xml></xml>',
            'sounds': false,
            'maxBlocks': 10
        };

        assertEquals(workspace, '<xml sounds="false" maxBlocks="10"></xml>');
        assertTrue(Blockly.JavaScript.workspaceToCode.calledWith(mockArg));
    }

});
