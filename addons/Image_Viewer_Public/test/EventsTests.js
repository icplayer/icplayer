TestCase("Events tests", {
	setUp : function() {
		this.presenter = AddonImage_Viewer_Public_create();
		this.presenter.addonId = 'IV_1'
	},
	
	tearDown : function() {
		
	},
	
	'test event has been created' : function() {
		var eventData = this.presenter.createEventData(4, 1);
		assertEquals('IV_1', eventData.source);
		assertEquals('4', eventData.item);
		assertEquals('', eventData.value);
		assertEquals(1, eventData.score);
	}
});

