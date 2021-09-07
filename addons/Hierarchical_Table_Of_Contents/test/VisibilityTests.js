TestCase('[Hierarchical_Table_Of_Content] Visibility tests', {
    setUp: function () {
        this.presenter = AddonHierarchical_Table_Of_Contents_create();

        this.stubs = {
            validateModelStub: sinon.stub(),
            setVisibilityStub: sinon.stub(),
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
        this.presenter.createPreviewTree = this.stubs.createPreviewTreeStub;
        this.presenter.createTree = this.stubs.createTreeStub;
        this.presenter.checkIfChapterHasChildren = this.stubs.checkIfChapterHasChildrenStub;

        this.presenter.configuration = {};

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
    },

    'test given isVisible to false when show() then setVisibility called with true': function () {
        //given
        this.presenter.isVisible = false;
        //when
        this.presenter.show();
        //then
        assertTrue(this.stubs.setVisibilityStub.calledWith(true));
    },

    'test given isVisible to true when show() then setVisibility not called': function () {
        //given
        this.presenter.isVisible = true;
        //when
        this.presenter.show();
        //then
        assertEquals(this.stubs.setVisibilityStub.callCount, 0);
    },

    'test given isVisible to true when hide() then setVisibility called with false': function () {
        //given
        this.presenter.isVisible = true;
        //when
        this.presenter.hide();
        //then
        assertTrue(this.stubs.setVisibilityStub.calledWith(false));
    },

    'test given isVisible to false when hide() then setVisibility not called': function () {
        //given
        this.presenter.isVisible = false;
        //when
        this.presenter.hide();
        //then
        assertEquals(this.stubs.setVisibilityStub.callCount, 0);
    }
});