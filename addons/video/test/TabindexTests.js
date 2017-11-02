TestCase('[Video] Adding tabindex tests', {
   setUp: function () {
       this.presenter = Addonvideo_create();
       this.presenter.videoContainer = $('<div > </div>');
   },

    'test should set tabindex of videoContainer to 0': function () {
        var isTabindexEnabled = true;

        this.presenter.addTabindex(isTabindexEnabled);

        assertEquals(0, this.presenter.videoContainer.attr("tabindex"));
    },

    'test should set tabindex of videoContainer to -1': function () {
        var isTabindexEnabled = false;

        this.presenter.addTabindex(isTabindexEnabled);

        assertEquals(-1, this.presenter.videoContainer.attr("tabindex"));
    }
});