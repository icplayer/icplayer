TestCase("Events Tests", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();
        this.presenter.configuration = {
            'isActivity' : false,
            'isDisabled' : false,
            'gapsValues' : ['1', '2']
        };
        sinon.stub(this.presenter, 'sendEvent');
        this.presenter.playerController = {
            getEventBus: function() {
                // fake
            }
        };
    },

    tearDown : function() {
        this.presenter.sendEvent.restore();
    },

    'test if event will be sent when addon is not activity' : function() {
        this.presenter.$view = $(
            '<div class="basic-math-gaps-wrapper">' +
                '<div class="basic-math-gaps-container">' +
                    '<input value="1" id="input1" />' +
                    '<span class="element">+</span>' +
                    '<input value="2" id="input2" />' +
                    '<span class="element">=</span>' +
                    '<span class="element">3</span>' +
                '</div>' +
            '</div>');

        this.presenter.addFocusOutEventListener(false);

        var input = this.presenter.$view.find('#input1');

        $(input).trigger('focusout');

        assertTrue(this.presenter.sendEvent.calledOnce);
    },

    'test if event will NOT be sent until all inputs are filled when addon is equation' : function() {
        this.presenter.configuration.isEquation = true;
        this.presenter.$view = $(
            '<div class="basic-math-gaps-wrapper">' +
                '<div class="basic-math-gaps-container">' +
                '<input value="1" id="input1" />' +
                '<span class="element">+</span>' +
                '<input value="" id="input2" />' +
                '<span class="element">=</span>' +
                '<span class="element">3</span>' +
                '</div>' +
            '</div>');

        this.presenter.addFocusOutEventListener(false);

        var input = this.presenter.$view.find('#input1');

        $(input).trigger('focusout');

        assertFalse(this.presenter.sendEvent.calledOnce);
    }
});