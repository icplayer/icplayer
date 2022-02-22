TestCase("[EditableWindow] setPositionRelative function test", {
   setUp: function () {
     this.presenter = AddonEditableWindow_create();

     this.elementSize = 100;

     this.elementUnderTest = document.createElement("div");
     this.elementUnderTest.style.width = this.elementSize + 'px';
     this.elementUnderTest.style.height = this.elementSize + 'px';

     this.presenter.jQueryElementsCache = {
            $container: $(this.elementUnderTest)
     };

     this.presenter.configuration.model = {
         top: "0",
         left: "0"
     };

     this.mocks = {
            updateButtonMenuPosition: sinon.stub(this.presenter, "updateButtonMenuPosition")
     };
   },

   'test given model with 0 top and 0 left when setPositiveRelative then left is 0 and top equals to heightOffset': function () {
        this.presenter.setPositionRelative();

        const top = this.presenter.jQueryElementsCache.$container.css('top');
        const left = this.presenter.jQueryElementsCache.$container.css('left');

        assertEquals(top, parseInt(this.presenter.configuration.model.top) + this.presenter.configuration.heightOffset + "px");
        assertEquals(left, this.presenter.configuration.model.left + "px");
        assertTrue(this.mocks.updateButtonMenuPosition.called);
   },

    'test given model with 100 top and 100 left when setPositiveRelative then left is 100 and top equals to 210': function () {
        this.presenter.configuration.model = {
         top: "100",
         left: "100"
        };

        this.presenter.setPositionRelative();

        const top = this.presenter.jQueryElementsCache.$container.css('top');
        const left = this.presenter.jQueryElementsCache.$container.css('left');

        assertEquals(top, parseInt(this.presenter.configuration.model.top) + this.presenter.configuration.heightOffset + "px");
        assertEquals(left, this.presenter.configuration.model.left + "px");
        assertTrue(this.mocks.updateButtonMenuPosition.called);
   },

    'test given model with -100 top and -100 left when setPositiveRelative then left is -100 and top equals to -10': function () {
        this.presenter.configuration.model = {
         top: "-100",
         left: "-100"
        };

        this.presenter.setPositionRelative();

        const top = this.presenter.jQueryElementsCache.$container.css('top');
        const left = this.presenter.jQueryElementsCache.$container.css('left');

        assertEquals(top, parseInt(this.presenter.configuration.model.top) + this.presenter.configuration.heightOffset + "px");
        assertEquals(left, this.presenter.configuration.model.left + "px");
        assertTrue(this.mocks.updateButtonMenuPosition.called);
   },
});