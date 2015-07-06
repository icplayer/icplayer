TestCase("[Commons - Draggable Droppable Object] Css Classes", {
    setUp: function () {
        this.testCssClass = "as;kldjk;htap837u34a;klfds";

        this.configuration = {
            addonID: "addonID",
            objectID: "htmlID",
            eventBus: function () {},
            getSelectedItem: function () {}
        };

        this.templateObject = new DraggableDroppableObject(this.configuration, {});

        this.stubs = {
            $addClass: sinon.stub(this.templateObject.$view, 'addClass'),
            $removeClass: sinon.stub(this.templateObject.$view, 'removeClass')
        };

        this.spies = {
            addCssClass: sinon.spy(this.templateObject, 'addCssClass'),
            removeCssClass: sinon.spy(this.templateObject, 'removeCssClass')
        };
    },

    tearDown: function () {
        this.templateObject.$view.addClass.restore();
        this.templateObject.$view.removeClass.restore();
        this.templateObject.addCssClass.restore();
        this.templateObject.removeCssClass.restore();
    },

    'test add class function should add provided value to css classes': function () {
        this.templateObject.addCssClass(this.testCssClass);

        assertTrue(this.stubs.$addClass.calledOnce);
        assertTrue(this.stubs.$addClass.calledWith(this.testCssClass));
    },

    'test remove class should remove from classes provided value': function () {
        this.templateObject.removeCssClass(this.testCssClass);

        assertTrue(this.stubs.$removeClass.calledOnce);
        assertTrue(this.stubs.$removeClass.calledWith(this.testCssClass));
    }
});