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

    'test upgrade model with tabindex enabled': function () {
        var oldModel = {
            ID: "Double_State_Button1",
            "Is Visible": "True",
            Text: "Deselected text",
            Image: "/file/server/123456",
            onSelected: "feedback1.change('SELECTED');",
            "Text selected": "Selected text",
            "Image selected": "/file/server/654321",
            onDeselected: "feedback1.change('DESELECTED');"
        };

        var upgradedModel = this.presenter.upgradeModel(oldModel);

        assertEquals(upgradedModel["enableTabindex"], "False");
    },

    'test should not upgrade model with tabindex when it already exists': function () {
        var oldModel = {
            ID: "Double_State_Button1",
            "Is Visible": "True",
            Text: "Deselected text",
            Image: "/file/server/123456",
            onSelected: "feedback1.change('SELECTED');",
            "Text selected": "Selected text",
            "Image selected": "/file/server/654321",
            onDeselected: "feedback1.change('DESELECTED');",
            tabindexEnabled: "True"
        };

        var upgradedModel = this.presenter.upgradeModel(oldModel);

        assertEquals(upgradedModel["tabindexEnabled"], "True");
    }
});