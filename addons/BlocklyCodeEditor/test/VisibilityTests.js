TestCase('[Blockly_Code_Editor] Visibility tests', {
    setUp: function () {
        this.presenter = AddonBlocklyCodeEditor_create();

        this.stubs = {
            validateModelStub: sinon.stub(),
            setRunButtonStub: sinon.stub(),
            setEditorCssStub: sinon.stub(),
            createWorkspaceStub: sinon.stub(),
            addUserBlocksStub: sinon.stub(),
            setVisibilityStub: sinon.stub(),
            connectHandlersStub: sinon.stub(),
            updateToolboxStub: sinon.stub(),
            setConfigurationStub: sinon.stub(),
            addEventListenerStub: sinon.stub()
        };

        this.presenter.validateModel = this.stubs.validateModelStub;
        this.presenter.setRunButton = this.stubs.setRunButtonStub;
        this.presenter.setEditorCss = this.stubs.setEditorCssStub;
        this.presenter.createWorkspace = this.stubs.createWorkspaceStub;
        this.presenter.addUserBlocks = this.stubs.addUserBlocksStub;
        this.presenter.setVisibility = this.stubs.setVisibilityStub;
        this.presenter.connectHandlers = this.stubs.connectHandlersStub;
        this.presenter.updateToolbox = this.stubs.updateToolboxStub;
        this.presenter.setConfiguration = this.stubs.setConfigurationStub;
        this.presenter.addEventListener = this.stubs.addEventListenerStub;
        this.view = document.createElement('div');
    },

    'test when in preview mode, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns({
            visibleByDefault: true,
            isValid: true
        });

        this.presenter.createPreview(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when in preview mode and addon is not visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns({
            visibleByDefault: false,
            isValid: true
        });
        this.presenter.createPreview(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns({
            visibleByDefault: true,
            isValid: true
        });
        this.presenter.run(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        this.stubs.validateModelStub.returns({
            visibleByDefault: false,
            isValid: true
        });

        this.presenter.run(this.view, {});

        assertTrue(this.stubs.setVisibilityStub.calledWith(false));
    }
});