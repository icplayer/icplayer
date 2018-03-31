TestCase('[Text Selection] WCAG', {
    setUp : function() {
        this.presenter = AddonText_Selection_create();
        this.presenter.$view = $('<div><div class="text_selection"></div></div>');

        this.firstElement = $('<span number="4" class="selectable">a</span>');
        this.secondElement = $('<span number="5" class="selectable">b</span>');
        this.thirdElement = $('<span number="6" class="selectable">c</span>');

        this.presenter.$view.find('.text_selection')
            .append(this.firstElement)
            .append(this.secondElement)
            .append(this.thirdElement);

        this.presenter.configuration = {
            isActivity: true
        };
    },

    'test build controller set correctly values to controller': function () {
        this.presenter.buildKeyboardController();

        assertEquals(3, this.presenter._keyboardController.keyboardNavigationElements.length);
        assertEquals(this.firstElement[0], this.presenter._keyboardController.keyboardNavigationElements[0][0]);
        assertEquals(this.secondElement[0], this.presenter._keyboardController.keyboardNavigationElements[1][0]);
        assertEquals(this.thirdElement[0], this.presenter._keyboardController.keyboardNavigationElements[2][0]);
    }

});