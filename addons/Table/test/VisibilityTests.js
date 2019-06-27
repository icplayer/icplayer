function getValidModel(isVisible) {
    return {
        isVisible: isVisible,
        isValid: true
    }
}

TestCase('[Table] Visibility tests', {
    setUp: function () {
        this.presenter = AddonTable_create();

        this.stubs = {
            generateTable: sinon.stub(),
            setVisibility: sinon.stub(),
            setColumnWidth: sinon.stub(),
            setRowHeight: sinon.stub(),
            initializeGaps: sinon.stub(),
            parseDefinitionLinks: sinon.stub(),
            setGapsClassAndWidth: sinon.stub(),
            buildKeyboardController: sinon.stub()
        };

        this.presenter.generateTable = this.stubs.generateTable;
        this.presenter.setVisibility = this.stubs.setVisibility;
        this.presenter.setColumnWidth = this.stubs.setColumnWidth;
        this.presenter.setRowHeight = this.stubs.setRowHeight;
        this.presenter.initializeGaps = this.stubs.initializeGaps;
        this.presenter.parseDefinitionLinks = this.stubs.parseDefinitionLinks;
        this.presenter.setGapsClassAndWidth = this.stubs.setGapsClassAndWidth;
        this.presenter.buildKeyboardController = this.stubs.buildKeyboardController;

        this.view = document.createElement('div');
        this.presenter.$view = $(this.view);
    },

    'test when in preview mode, setVisibility should be called with true': function () {
        this.presenter.configuration = getValidModel(true);

        this.presenter.mainLogic(true);

        assertTrue(this.stubs.setVisibility.calledWith(true));
    },

    'test when in preview mode and addon is not visible, setVisibility should be called with true': function () {
        this.presenter.configuration = getValidModel(false);

        this.presenter.mainLogic(true);

        assertTrue(this.stubs.setVisibility.calledWith(true));
    },

    'test when not in preview mode and addon is visible, setVisibility should be called with true': function () {
        this.presenter.configuration = getValidModel(true);
        this.presenter.mainLogic(false);

        assertTrue(this.stubs.setVisibility.calledWith(true));
    },

    'test when not in preview mode and addon is not visible, setVisibility should be called with false': function () {
        this.presenter.configuration = getValidModel(false);

        this.presenter.mainLogic(false);

        assertTrue(this.stubs.setVisibility.calledWith(false));
    }
});