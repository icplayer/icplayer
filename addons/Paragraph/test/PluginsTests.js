TestCase("[Paragraph] Get plugins", {
    setUp: function () {
        this.presenter = AddonParagraph_create();
        this.presenter.configuration = {
            toolbar: "",
            isPlaceholderSet: false
        };
    },

    'test no plugins': function () {
        assertEquals("", this.presenter.getPlugins());
    },

    'test text color should be added only if is set': function () {
        this.presenter.configuration.toolbar = "forecolor backcolor";

        assertEquals("textcolor", this.presenter.getPlugins());
    },

    'test place holder should be added only if is set': function () {
        this.presenter.configuration.isPlaceholderSet = true;

        assertEquals("placeholder", this.presenter.getPlugins());
    },

    'test all plugins are set': function () {
        this.presenter.configuration.isPlaceholderSet = true;
        this.presenter.configuration.toolbar = "forecolor backcolor";

        assertEquals("textcolor placeholder", this.presenter.getPlugins());
    }
});