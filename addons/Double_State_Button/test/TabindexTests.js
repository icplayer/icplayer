TestCase("[Double_State_Button] Tabindex adding tests", {
    setUp: function () {
        this.presenter = AddonDouble_State_Button_create();

        this.wrapper = $('<div class="doublestate-button-wrapper"> </div>');
    },

    'test should set tabindex of $view to 0': function () {
        var isTabindexEnabled = true;

        this.presenter.setTabindex( this.wrapper, isTabindexEnabled);

        assertEquals(0, this.wrapper.attr("tabindex"));
    },

    'test should set tabindex of $view to -1': function () {
        var isTabindexEnabled = false;

        this.presenter.setTabindex(this.wrapper, isTabindexEnabled);

        assertEquals(-1, this.wrapper.attr("tabindex"));
    }

});