TestCase('[Hierarchical_Lesson_Report] Visibility tests', {
    setUp: function () {
        this.presenter = AddonHierarchical_Lesson_Report_create();

        this.stubs = {
            validateModelStub: sinon.stub(),
            setVisibilityStub: sinon.stub(),
            upgradeModelStub: sinon.stub(),
            createPreviewTreeStub: sinon.stub(),
            createTreeStub: sinon.stub(),
            checkIfChapterHasChildrenStub: sinon.stub(),
            getPresentationStub: sinon.stub(),
            getTableOfContentsStub: sinon.stub(),
            sizeStub: sinon.stub(),
            getCommandsStub: sinon.stub()
        };

        this.tableOfContents = {
            size: this.stubs.sizeStub
        };

        this.presentation = {
            getTableOfContents: this.stubs.getTableOfContentsStub
        };

        this.stubs.getPresentationStub.returns(this.presentation);
        this.stubs.getTableOfContentsStub.returns(this.tableOfContents);

        this.presenter.setPlayerController({
            'getPresentation': this.stubs.getPresentationStub,
            'getCommands':  this.stubs.getCommandsStub
        });

        this.presenter.validateModel = this.stubs.validateModelStub;
        this.presenter.setVisibility = this.stubs.setVisibilityStub;
        this.presenter.upgradeModel = this.stubs.upgradeModelStub;
        this.presenter.createPreviewTree = this.stubs.createPreviewTreeStub;
        this.presenter.createTree = this.stubs.createTreeStub;
        this.presenter.checkIfChapterHasChildren = this.stubs.checkIfChapterHasChildrenStub;

        this.view = document.createElement('div');
    },

    'test when in preview mode, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns({
            isValid: true,
            isVisible: true,
            height: 100,
            ID: "ID",
            labels: {}
        });
        this.presenter.initialize(this.view, {}, true);

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when in preview mode and addon is not visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns({
            isValid: true,
            isVisible: false,
            height: 100,
            ID: "ID",
            labels: {}
        });
        this.presenter.initialize(this.view, {}, true);

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        this.stubs.validateModelStub.returns({
            isValid: true,
            isVisible: true,
            height: 100,
            ID: "ID",
            labels: {}
        });
        this.presenter.initialize(this.view, {}, false);

        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        this.stubs.validateModelStub.returns({
            isValid: true,
            isVisible: false,
            height: 100,
            ID: "ID",
            labels: {}
        });
        this.presenter.initialize(this.view, {}, false);

        assertTrue(this.stubs.setVisibilityStub.calledWith(false));
    }
});