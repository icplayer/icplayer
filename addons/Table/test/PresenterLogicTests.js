TestCase("[Table] Presenter logic", {
    setUp: function () {
        this.presenter = AddonTable_create();

        this.presenter.textParser = {
            parseGaps : function() {
                return {parsedText : ""}
            },
            parsedText: function() {}
        };

        sinon.stub(this.presenter, 'upgradeModel');
        sinon.stub(this.presenter, 'validateModel');

        sinon.stub(this.presenter, 'generateTable');
        this.presenter.generateTable.returns({});

        sinon.stub(this.presenter, 'setColumnWidth');
        sinon.stub(this.presenter, 'setRowHeight');
        sinon.stub(this.presenter, 'setVisibility');
        sinon.stub(this.presenter, 'parseDefinitionLinks');
        sinon.stub(this.presenter, 'initializeGaps');
        sinon.stub(this.presenter, 'setEditorGapWidth');
        sinon.stub(this.presenter, 'setGapsClassAndWidth');

        sinon.stub(DOMOperationsUtils, 'showErrorMessage');
    },

    tearDown: function () {
        this.presenter.upgradeModel.restore();
        this.presenter.validateModel.restore();
        this.presenter.generateTable.restore();
        this.presenter.setColumnWidth.restore();
        this.presenter.setRowHeight.restore();
        this.presenter.setVisibility.restore();
        this.presenter.parseDefinitionLinks.restore();
        this.presenter.initializeGaps.restore();
        this.presenter.setEditorGapWidth.restore();
        this.presenter.setGapsClassAndWidth.restore();

        DOMOperationsUtils.showErrorMessage.restore();
    },

    'test proper config in run mode': function () {
        this.presenter.validateModel.returns({ isValid: true });

        this.presenter.logic({}, {}, false);

        assertTrue(this.presenter.upgradeModel.calledOnce);
        assertTrue(this.presenter.validateModel.calledOnce);
        assertFalse(DOMOperationsUtils.showErrorMessage.called);
        assertTrue(this.presenter.setColumnWidth.calledOnce);
        assertTrue(this.presenter.setRowHeight.calledOnce);
        assertTrue(this.presenter.setVisibility.calledOnce);
        assertTrue(this.presenter.initializeGaps.calledOnce);
        assertTrue(this.presenter.parseDefinitionLinks.calledOnce);
    },

    'test errors during model validation in run mode': function () {
        this.presenter.validateModel.returns({ isValid: false, errorCode: 'ERR' });

        this.presenter.logic({}, {}, false);

        assertTrue(this.presenter.upgradeModel.calledOnce);
        assertTrue(this.presenter.validateModel.calledOnce);
        assertTrue(DOMOperationsUtils.showErrorMessage.calledOnce);
        assertFalse(this.presenter.setColumnWidth.calledOnce);
        assertFalse(this.presenter.setRowHeight.calledOnce);
        assertFalse(this.presenter.setVisibility.calledOnce);
        assertFalse(this.presenter.initializeGaps.calledOnce);
        assertFalse(this.presenter.parseDefinitionLinks.calledOnce);
    },

    'test proper config in preview mode': function () {
        this.presenter.validateModel.returns({ isValid: true });

        this.presenter.logic({}, {}, true);

        assertTrue(this.presenter.upgradeModel.calledOnce);
        assertTrue(this.presenter.validateModel.calledOnce);
        assertFalse(DOMOperationsUtils.showErrorMessage.called);
        assertTrue(this.presenter.setColumnWidth.calledOnce);
        assertTrue(this.presenter.setRowHeight.calledOnce);
        assertTrue(this.presenter.setVisibility.calledOnce);
        assertTrue(this.presenter.initializeGaps.calledOnce);
        assertFalse(this.presenter.parseDefinitionLinks.calledOnce);
    },

    'test errors during model validation in preview mode': function () {
        this.presenter.validateModel.returns({ isValid: false, errorCode: 'ERR' });

        this.presenter.logic({}, {}, true);

        assertTrue(this.presenter.upgradeModel.calledOnce);
        assertTrue(this.presenter.validateModel.calledOnce);
        assertTrue(DOMOperationsUtils.showErrorMessage.calledOnce);
        assertFalse(this.presenter.setColumnWidth.calledOnce);
        assertFalse(this.presenter.setRowHeight.calledOnce);
        assertFalse(this.presenter.setVisibility.calledOnce);
        assertFalse(this.presenter.initializeGaps.calledOnce);
        assertFalse(this.presenter.parseDefinitionLinks.calledOnce);
    }
});