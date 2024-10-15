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

TestCase("[Assessments_Navigation_Bar] Upgrade speech texts", {
    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();

        this.expectedEmpty = {
            PreviousPage: {PreviousPage: ""},
            ShowPreviousPages: {ShowPreviousPages: ""},
            Title: {Title: ""},
            GoToPage: {GoToPage: ""},
            ShowNextPages: {ShowNextPages: ""},
            NextPage: {NextPage: ""},
        };
    },

    "test given empty model when upgrading model then sets empty object to speech text": function () {
        var upgradedModel = this.presenter.upgradeModel({});

        assertNotUndefined(upgradedModel.speechTexts);
        assertEquals(upgradedModel.speechTexts, this.expectedEmpty);
    },

    "test given valid input model when upgrading model then sets correct object to speech text": function () {
        var inputModel =
            { speechTexts:
                {
                    PreviousPage: {PreviousPage: "Go to previous page"},
                    ShowPreviousPages: {ShowPreviousPages: "Show previous pages"},
                    Title: {Title: "Page title"},
                    GoToPage: {GoToPage: "Go to page"},
                    ShowNextPages: {ShowNextPages: "Show next pages"},
                    NextPage: {NextPage: "Go to next page"},
                }
            };

        var upgradedModel = this.presenter.upgradeModel(inputModel);

        assertNotUndefined(upgradedModel.speechTexts);
        assertNotEquals(upgradedModel.speechTexts, this.expectedEmpty);
        assertEquals(upgradedModel.speechTexts, inputModel.speechTexts);
    },
});

TestCase("[Assessments_Navigation_Bar] Upgrade lang tag", {
    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();
   },

    "test given empty model when upgrading model then sets empty string to lang attribute": function () {
        var upgradedModel = this.presenter.upgradeModel({});

        assertNotUndefined(upgradedModel.langAttribute);
        assertEquals(upgradedModel.langAttribute, "");
    },

    "test given model with LangTag PL when upgrading model then sets PL string to lang attribute": function () {
        var langTag = "PL-pl";
        var upgradedModel = this.presenter.upgradeModel({langAttribute: langTag});

        assertNotUndefined(upgradedModel.langAttribute);
        assertEquals(upgradedModel.langAttribute, langTag);
    },
});

TestCase("[Assessments_Navigation_Bar] Upgrade model with Use Dynamic Pagination", {
    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();
   },

    "test given empty model when upgrading model then sets false to useDynamicPagination property": function () {
        const upgradedModel = this.presenter.upgradeModel({});

        assertNotUndefined(upgradedModel.useDynamicPagination);
        assertEquals(upgradedModel.useDynamicPagination, "False");
    },

    "test given model with useDynamicPagination when upgrading model then model should not be changed": function () {
        const value = "True";
        const upgradedModel = this.presenter.upgradeModel({useDynamicPagination: value});

        assertNotUndefined(upgradedModel.useDynamicPagination);
        assertEquals(upgradedModel.useDynamicPagination, value);
    },
});

TestCase("[Assessments_Navigation_Bar] Upgrade model with Enable dropdown pages list", {
    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();
   },

    "test given empty model when upgrading model then sets false to enableDropdownPagesList property": function () {
        const upgradedModel = this.presenter.upgradeModel({});

        assertNotUndefined(upgradedModel.enableDropdownPagesList);
        assertEquals(upgradedModel.enableDropdownPagesList, "False");
    },

    "test given model with enableDropdownPagesList when upgrading model then model should not be changed": function () {
        const value = "True";
        const upgradedModel = this.presenter.upgradeModel({enableDropdownPagesList: value});

        assertNotUndefined(upgradedModel.enableDropdownPagesList);
        assertEquals(upgradedModel.enableDropdownPagesList, value);
    },
});

TestCase("[Assessments_Navigation_Bar] Upgrade model with Enable redirect to page", {
    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();
   },

    "test given empty model when upgrading model then sets false to enableRedirectToPage property": function () {
        const upgradedModel = this.presenter.upgradeModel({});

        assertNotUndefined(upgradedModel.enableRedirectToPage);
        assertEquals(upgradedModel.enableRedirectToPage, "False");
    },

    "test given model with enableRedirectToPage when upgrading model then model should not be changed": function () {
        const value = "True";
        const upgradedModel = this.presenter.upgradeModel({enableRedirectToPage: value});

        assertNotUndefined(upgradedModel.enableRedirectToPage);
        assertEquals(upgradedModel.enableRedirectToPage, value);
    },
});