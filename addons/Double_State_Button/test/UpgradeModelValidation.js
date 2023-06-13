TestCase("[Double State Button] Upgrade model validation", {
    setUp: function () {
        this.presenter = AddonDouble_State_Button_create();
    },

    'test upgrade disabled': function () {
        var oldModel = {
            Title: "Some text",
            Image: "/file/server/123456",
            onClick: "Empty script"
        }, expectedModel = {
            Title: "Some text",
            Image: "/file/server/123456",
            onClick: "Empty script",
            Disable: "False"
        };

        var upgradedModel = this.presenter.upgradeDisable(oldModel);

        assertEquals(expectedModel, upgradedModel);
    },

    'test given model without renderSVGAsHTML when addRenderSVGAsHTML was called then returns model with false renderSVGAsHTML value': function () {
        const oldModel = {
            Title: "Some text",
            Image: "/file/server/123456",
            onClick: "Empty script"
        };
        const expectedModel = {
            Title: "Some text",
            Image: "/file/server/123456",
            onClick: "Empty script",
            renderSVGAsHTML: "False"
        };

        const upgradedModel = this.presenter.addRenderSVGAsHTML(oldModel);

        assertEquals(expectedModel, upgradedModel);
    },

    'test given model with renderSVGAsHTML on True when addRenderSVGAsHTML was called then returns model with not changed renderSVGAsHTML value': function () {
        const oldModel = {
            Title: "Some text",
            Image: "/file/server/123456",
            onClick: "Empty script",
            renderSVGAsHTML: "True"
        };
        const expectedModel = {
            Title: "Some text",
            Image: "/file/server/123456",
            onClick: "Empty script",
            renderSVGAsHTML: "True"
        };

        const upgradedModel = this.presenter.addRenderSVGAsHTML(oldModel);

        assertEquals(expectedModel, upgradedModel);
    }
});