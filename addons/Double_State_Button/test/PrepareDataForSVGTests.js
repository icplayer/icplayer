TestCase("[Double State Button] Prepare data for SVG", {
    setUp: function () {
        this.presenter = AddonDouble_State_Button_create();

        this.presenter.configuration = {
            isSelected : false,
            selected: {image: null},
            deselected: {image: null}
        };
        this.presenter.$wrapper = $(document.createElement('div'));
    },

    'test when createMockedImages was called then mocked images are added to wrapper': function () {
        this.presenter.createMockedImages();

        const numberOfMockedImages = this.presenter.$wrapper.find('.mocked').length;
        assertEquals(numberOfMockedImages, 2);
    },

    'test given created images when createMockedImages was called then images have mocked class': function () {
        this.presenter.createMockedImages();

        const $firstChildElement = $(this.presenter.$wrapper.children()[0]);
        assertTrue($firstChildElement.hasClass('mocked'));
    },
});