TestCase("[multiplegap] Adding and removing tabindex attribute", {
    setUp: function () {
        this.presenter = Addonmultiplegap_create();

        this.stubs = {
            setElementsStub: sinon.stub(),
            performRemoveDraggableStub: sinon.stub(),
            performAcceptDraggableStub: sinon.stub(),
            getElementsStub: sinon.stub()
        };

        this.presenter.showErrorsMode = false;
        this.presenter.isShowAnswersActive = false;
        this.presenter.isItemChecked = true;


        this.presenter.keyboardControllerObject = {
            setElements: this.stubs.setElementsStub
        };

        this.presenter.getElementsForKeyboardNavigation = this.stubs.getElementsStub;
        this.presenter.performRemoveDraggable = this.stubs.performRemoveDraggableStub;
        this.presenter.performAcceptDraggable = this.stubs.performAcceptDraggableStub;

        this.presenter.configuration = {
            isTabindexEnabled: true
        };

        this.presenter.container = $('<div class="multiplegap_container multiplegap_horizontal multiplegap_texts ui-droppable"> </div>')
        this.presenter.$view = this.presenter.container;

        this.event = {
            target: "",
            stopPropagation: function () {},
            preventDefault: function () {}
        }
    },

    'test should add tabindex 0 to container if there is no placeholder item in view': function () {
        this.presenter.removeDraggable(this.event);
        assertEquals("0", $(this.presenter.container).attr("tabindex"));
    },

    'test should not add tabindex 0 to container if there are placeholders item in view': function () {
        $(this.presenter.$view).append($('<div class="placeholder"></div>'));
        $(this.presenter.$view).append($('<div class="placeholder"></div>'));

        this.presenter.removeDraggable(this.event);
        assertEquals(undefined, $(this.presenter.container).attr("tabindex"));
    },

    'test should not add tabindex 0 to container if isTabindexEnabled is false': function () {
        this.presenter.configuration.isTabindexEnabled = false;

        this.presenter.removeDraggable(this.event);
        assertEquals(undefined, $(this.presenter.container).attr("tabindex"));
    },

    'test should remove tabindex from container when isTabindex is true': function () {
        this.presenter.container.attr("tabindex", "0");
        this.presenter.acceptDraggable(this.event);

        assertEquals(undefined, $(this.presenter.container).attr("tabindex"));
    }
});