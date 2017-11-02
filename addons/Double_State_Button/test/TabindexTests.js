TestCase("[Double_State_Button] Tabindex adding tests", {
    setUp: function () {
        this.presenter = AddonDouble_State_Button_create();

        this.presenter.$view = $('<div class="doublestate-button-wrapper"> </div>');
    },

    'test should set tabindex of $view to 0': function () {
        var isTabindexEnabled = true;

        this.presenter.setTabindex(isTabindexEnabled);

        assertEquals(0, this.presenter.$view.attr("tabindex"));
    },

    'test should set tabindex of $view to -1': function () {
        var isTabindexEnabled = false;

        this.presenter.setTabindex(isTabindexEnabled);

        assertEquals(-1, this.presenter.$view.attr("tabindex"));
    }

});