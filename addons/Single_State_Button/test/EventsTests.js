TestCase("Events creation", {
	setUp : function() {
		this.presenter = AddonSingle_State_Button_create();
		this.presenter.addonID = 'SSB1';
	},
	
	'test event has been created' : function() {
		var eventData = this.presenter.createEventData();

		assertEquals('SSB1', eventData.source);
		assertEquals('', eventData.item);
		assertEquals('1', eventData.value);
		assertEquals('', eventData.score);
	}
});

TestCase("Events triggering", {
    setUp : function() {
        this.presenter = AddonSingle_State_Button_create();
        this.presenter.addonID = 'SSB1';
        this.presenter.configuration = {
            onClickEvent: {
                isEmpty: true
            }
        };

        sinon.stub(this.presenter, 'triggerButtonClickedEvent');
    },

    tearDown: function() {
        this.presenter.triggerButtonClickedEvent.restore();
    },

    'test event has been created' : function() {
        this.presenter.executeUserEventCode();

        assertTrue(this.presenter.triggerButtonClickedEvent.calledOnce);
    }
});