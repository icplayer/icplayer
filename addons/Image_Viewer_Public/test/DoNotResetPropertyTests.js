TestCase("Do Not Reset Property and Methods Tests", {
    'test reset when do not reset is set to true': function() {
        var presenter = AddonImage_Viewer_Public_create();
        presenter.configuration = {
            defaultVisibility: true,
            currentVisibility: false,
            $view: null,
            isDoNotReset: true,
            currentFrame: 15
        };

        presenter.reset();

        assertEquals(15, presenter.configuration.currentFrame);
        assertFalse(presenter.configuration.currentVisibility);
    }
});