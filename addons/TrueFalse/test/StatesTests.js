TestCase("Get and Set State Tests", {
    setUp: function () {
        this.presenter = AddonTrueFalse_create();
        this.presenter.type = 'radio';
        this.presenter.$view = $('<div><div class="tf_radio_image down"></div>' +
                               '<div class="tf_radio_image up"></div>' +
                               '<div class="tf_radio_image down"></div></div>');
    },

    'test get state function create correct data' : function() {
        var state = this.presenter.getState();
        var expectedState = '{\"selectedElements\":[true,false,true]}';

        assertEquals('', expectedState, state);
    },

    'test get state in active show answers mode' : function() {
        this.presenter.isShowAnswersActive = true;
        this.presenter.currentState = [false, true, false];

        var state = this.presenter.getState();

        assertEquals('{\"selectedElements\":[false,true,false]}', state);
        assertEquals(true, this.presenter.isShowAnswersActive);
    },

    'test set state function sets data properly' : function() {
        var stateString = '[true,false,true]';

        // remove class down to see if set state function sets data properly
        this.presenter.$view.find('.down').removeClass('down');
        assertEquals('', 0, this.presenter.$view.find('.down').length);

        this.presenter.setState(stateString);

        assertEquals('', 2, this.presenter.$view.find('.down').length);
    }

});
