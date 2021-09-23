TestCase("[Group Chat Button] Reset", {
    setUp: function () {
        this.presenter = AddonGroup_Chat_Button_create();
    },

    'test given visibility is true and default visibility is false when reset addon then set visibility to false': function () {
        var this.presenter.configuration = {
            isVisible: true,
            isVisibleByDefault: false
        };

        this.presenter.reset();

        assertEquals(false, this.presenter.configuration);
    },

    'test given visibility is false and default visibility is true when reset addon then set visibility to true': function () {
        var this.presenter.configuration = {
            isVisible: false,
            isVisibleByDefault: true
        };

        this.presenter.reset();

        assertEquals(true, this.presenter.configuration);
    },

    'test given visibility is false and default visibility is false when reset addon then set visibility to false': function () {
        var this.presenter.configuration = {
            isVisible: false,
            isVisibleByDefault: false
        };

        this.presenter.reset();

        assertEquals(false, this.presenter.configuration);
    },

    'test given visibility is true and default visibility is true when reset addon then set visibility to true': function () {
        var this.presenter.configuration = {
            isVisible: true,
            isVisibleByDefault: true
        };

        this.presenter.reset();

        assertEquals(true, this.presenter.configuration);
    }
});