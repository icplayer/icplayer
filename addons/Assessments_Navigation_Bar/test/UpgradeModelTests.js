TestCase("[Assessments_Navigation_Bar] Upgrade Model", {

    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();
        this.stubs = {
            upgradeNumberAndWithOfButtons: sinon.stub(this.presenter, 'upgradeNumberAndWidthOfButtons'),
            upgradeDefaultOrder: sinon.stub(this.presenter, 'upgradeDefaultOrder')
        };
    },

    tearDown: function () {
        this.presenter.upgradeNumberAndWidthOfButtons.restore();
        this.presenter.upgradeDefaultOrder.restore();
    },

    "test given model without properties when upgrading model then calls upgrade functions": function () {
        this.presenter.upgradeModel({});

        assertTrue(this.stubs.upgradeNumberAndWithOfButtons.calledOnce);
        assertTrue(this.stubs.upgradeDefaultOrder.calledOnce);
    }
});

TestCase("[Assessments_Navigation_Bar] Upgrade number and width of buttons", {

    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();
        this.expectedResult = {
            userButtonsNumber: "",
            userButtonsWidth: ""
        };
    },

    "test should set number of buttons to empty string if there is none": function () {
        var upgradedModel = this.presenter.upgradeModel({});

        assertNotUndefined(upgradedModel.userButtonsNumber);
        assertEquals(upgradedModel.userButtonsNumber, "");
    },

    "test should set width of buttons to empty string if there is none": function () {
        var upgradedModel = this.presenter.upgradeModel({});

        assertNotUndefined(upgradedModel.userButtonsWidth);
        assertEquals(upgradedModel.userButtonsWidth, "");
    },

    'test should not change existing property number of buttons': function () {
        var validModel = {
            userButtonsNumber: "5"
        };

        var upgradedModel = this.presenter.upgradeModel(validModel);

        assertNotUndefined(upgradedModel.userButtonsNumber);
        assertEquals(validModel.userButtonsNumber, upgradedModel.userButtonsNumber);
    },

    'test should not change existing property buttons width': function () {
        var validModel = {
            userButtonsWidth: "5"
        };

        var upgradedModel = this.presenter.upgradeModel(validModel);

        assertNotUndefined(upgradedModel.userButtonsWidth);
        assertEquals(validModel.userButtonsWidth, upgradedModel.userButtonsWidth);
    }
});


TestCase("[Assessments_Navigation_Bar] Upgrade default order", {

    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();
    },

    "test given empty model when upgrading model then sets default order property to False": function () {
        var upgradedModel = this.presenter.upgradeModel({});

        assertNotUndefined(upgradedModel.defaultOrder);
        assertEquals(upgradedModel.defaultOrder, "False");
    },

    "test given not empty model when upgrading model then sets default order property to False and does not change other poperty": function () {
        var upgradedModel = this.presenter.upgradeModel({
            someProp: 123
        });

        assertNotUndefined(upgradedModel.defaultOrder);
        assertEquals(upgradedModel.defaultOrder, "False");
        assertEquals(upgradedModel.someProp, 123);
    },

    'test given model with defaultOrder property when upgrading model then does not set that property': function () {
        var validModel = {
            defaultOrder: "5"
        };

        var upgradedModel = this.presenter.upgradeModel(validModel);

        assertNotUndefined(upgradedModel.defaultOrder);
        assertEquals(validModel.defaultOrder, upgradedModel.defaultOrder);
    }

});

TestCase("[Assessments Navigation Bar] runLogic flow for upgrade model", {

    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();

        this.stubs = {
            upgradeModel: sinon.stub(this.presenter, 'upgradeModel'),
            validateModel: sinon.stub(this.presenter, 'validateModel'),
            utils: sinon.stub(DOMOperationsUtils, 'setReducedSize'),
            calculateNumberOfPages: sinon.stub(this.presenter, 'calculateNumberOfPages'),
            calculateObjectsSizes: sinon.stub(this.presenter, 'calculateObjectsSizes'),
            initializeAddon: sinon.stub(this.presenter, 'initializeAddon'),
        };

        this.stubs.validateModel.returns({
            isValid: true
        });

        this.presenter.isPreview = true;
        this.presenter.navigationManager = {};
        this.presenter.navigationManager.buttons = [{
            setAsCurrent: function () {}
        }];
    },

    tearDown: function () {
        this.presenter.upgradeModel.restore();
        this.presenter.validateModel.restore();
        DOMOperationsUtils.setReducedSize.restore();
        this.presenter.calculateNumberOfPages.restore();
        this.presenter.calculateObjectsSizes.restore();
        this.presenter.initializeAddon.restore();
    },

    'test upgrade model should be done before validate model': function () {
        this.presenter.runLogic($("<div>"), {});

        assertTrue(this.presenter.upgradeModel.calledOnce);
        assertTrue(this.presenter.validateModel.calledOnce);

        assertTrue(this.presenter.upgradeModel.calledBefore(this.presenter.validateModel));
    },

    'test validate model should be called with upgraded model': function () {
        var upgradedModel = "Asdfjas;3 fvdsav czx";
        this.stubs.upgradeModel.returns(upgradedModel);

        this.presenter.runLogic($("<div>"), {});

        assertTrue(this.presenter.upgradeModel.calledOnce);
        assertTrue(this.presenter.validateModel.calledOnce);
        assertTrue(this.presenter.validateModel.calledWith(upgradedModel));
    }
});