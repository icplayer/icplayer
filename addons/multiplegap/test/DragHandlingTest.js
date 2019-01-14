TestCase("[Multiple Gap] Draggable", {
    setUp: function () {
        this.presenter = Addonmultiplegap_create();
        this.presenter.configuration = {};
        this.presenter.items = [''];

        this.presenter.$view = $(
            '<div class="multiplegap_Images_HORIZONTAL" id="multiplegap2" style="width: 498px; height: 195px; position: absolute; left: 100px; top: 310px;">' +
                '<div class="multiplegap_container multiplegap_horizontal multiplegap_images ui-droppable" style="width: 498px; height: 195px;">' +
                    '<div class="multiplegap_placeholders">' +
                        '<div class="placeholder ui-draggable" draggablevalue="/file/serve/5954688688062464" draggableitem="500_2" draggabletype="image" style="width: 140px; height: 70px; top: 0px; left: 0px;">' +
                            '<img class="contents" alt="" lang="" src="/file/serve/5954688688062464" style="width: 140px; height: 70px; position: absolute; left: -4px; top: -4px;">' +
                            '<div class="handler" style="color: rgba(0, 0, 0, 0); font-size: 1px; display: block;"></div>' +
                        '</div>' +
                        '<div class="placeholder ui-draggable" draggablevalue="/file/serve/5391738734641152" draggableitem="200_2" draggabletype="image" style="width: 140px; height: 70px; top: 0px; left: 166px;">' +
                            '<img class="contents" alt="" lang="" src="/file/serve/5391738734641152" style="width: 140px; height: 70px; position: absolute; left: -4px; top: -4px;">' +
                            '<div class="handler" style="color: rgba(0,0,0,0.0); font-size:1px"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>');

        var self = this;
        this.presenter.$view.find('.placeholder').each(function(){
           self.presenter.makePlaceholderDraggable($(this));
        });

    },

    'test correct events sent on drag stop': function() {
        var placeholder = $(this.presenter.$view.find('.placeholder')[0]);
        
        var stubs = {};
        stubs.sendEvent = sinon.spy();
        stubs.movePlaceholdersAfterRemove = sinon.stub( this.presenter, 'movePlaceholdersAfterRemove');
        this.presenter.eventBus = {sendEvent: stubs.sendEvent};
        this.presenter.$view.find('div[draggableitem="200_2"]').addClass('dragging');

        this.presenter.itemStopped(placeholder);

        assertTrue(stubs.sendEvent.calledOnce);
        assertEquals('itemStopped', stubs.sendEvent.getCall(0).args[0]);
    },

    'test dragging class added on helper creation': function() {
        var placeholder = $(this.presenter.$view.find('.placeholder')[0]);
        var stubs = {};

        stubs.sendEvent = sinon.spy();
        stubs.movePlaceholdersAfterRemove = sinon.stub( this.presenter, 'movePlaceholdersAfterRemove');
        this.presenter.eventBus = {sendEvent: stubs.sendEvent};

        assertFalse(placeholder.hasClass('dragging'));
        placeholder.draggable('option', 'helper').call(placeholder);
        assertTrue(placeholder.hasClass('dragging'));
    }
});