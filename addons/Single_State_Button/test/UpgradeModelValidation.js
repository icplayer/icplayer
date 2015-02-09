TestCase("[Single State Button] Upgrade model validation", {
    setUp: function () {
        this.presenter = AddonSingle_State_Button_create();
    },

    'test upgrade disable': function () {
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
    }
});