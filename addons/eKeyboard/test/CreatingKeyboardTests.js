TestCase("[eKeyboard] Creating keyboard tests", {
   setUp: function () {
       this.presenter = AddoneKeyboard_create();

       var position = {
           value: 0
       };

       this.presenter.keyboardWrapper = document.createElement("div");

       this.presenter.configuration = {
           positionMy: position,
           positionAt: position,
           offset: position,
           lockInput: true,
           openOnFocus: false
       };

       this.element = document.createElement("input");
   },

    "test should set stayOpen to true": function () {
        this.presenter.createEKeyboard(this.element, null);

        var keyboard = $(this.element).data('keyboard');

        assertTrue(keyboard.options.stayOpen);
    },

    "test should append keyboard to wrapper": function () {
        this.presenter.createEKeyboard(this.element, null);

        var keyboard = $(this.element).data('keyboard');
        keyboard.reveal();
        var isAppended = $(this.presenter.keyboardWrapper).find(keyboard.$keyboard).length;

        assertEquals(1, isAppended);
    },
});