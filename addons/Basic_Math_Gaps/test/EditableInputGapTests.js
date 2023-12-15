TestCase("[Basic Math Gaps] EditableInputGap", {
    setUp: function () {
        this.presenter = AddonBasic_Math_Gaps_create();
        this.presenter.configuration = {
            'isActivity' : false,
            'isDisabled' : false,
            'gapsValues' : ['1', '2'],
            'addonID': 'Super hiper addon ID',
            'useNumericKeyboard': false
        };
        this.presenter.$view = $(
            '<div class="basic-math-gaps-wrapper">' +
                '<div class="basic-math-gaps-container">' +
                '<input value="1" id="some_addon_id-0" />' +
                '<span class="element">+</span>' +
                '<input value="" id="input2" />' +
                '<span class="element">=</span>' +
                '<span class="element">3</span>' +
                '</div>' +
            '</div>'
        );

        this.sendEventStub = sinon.stub(this.presenter, 'sendEvent');
        this.presenter.eventBus = function () {};
        this.presenter.playerController = {
            getEventBus: function() {
                // fake
            }
        };

        this.gap = new this.presenter.EditableInputGap("some_addon_id-0", "2");

        this.presenter._addSendEventHandler();
    },

    'test given input and disabled user actions when edit is called then event is not called': function () {
        this.presenter.configuration.userActionsEventsEnabled = false;

        this.gap.onEdit(null);

        assertFalse(this.sendEventStub.called);
    },

    'test given input and enabled user actions when edit is called then event is called': function () {
        this.presenter.configuration.userActionsEventsEnabled = true;

        this.gap.onEdit(null);

        assert(this.sendEventStub.calledWith(0, "1", true));
    },

    'test given input and not using numeric keyboard when creating gap view then gap type is text': function () {

        var inputType = this.gap.createView().attr('type');

        assertEquals("text", inputType.toLowerCase());
    },

    'test given input and using numeric keyboard when creating gap view then gap type is number': function () {
        this.presenter.configuration.useNumericKeyboard = true;

        var inputType = this.gap.createView().attr('type');

        assertEquals("tel", inputType.toLowerCase());
    },

    'test given input when creating gap view then gap autocomplete is off': function () {
        const autocomplete = this.gap.createView().attr('autocomplete');

        assertEquals("off", autocomplete.toLowerCase());
    }
});
