TestCase('[Audio] Time update event data creation', {
    setUp : function() {
        this.presenter = AddonAudio_create();
        this.presenter.addonID = 'Audio1';
    },

    'test proper data' : function() {
        var expectedEventData = { source : 'Audio1', item : '', value : '00:12', score : ''};

        var eventData = this.presenter.createTimeUpdateEventData({ 'currentTime' : '00:12' });

        assertEquals(expectedEventData, eventData);
    }
});

TestCase("[Audio] On end event data creation", {
    setUp: function () {
        this.presenter = AddonAudio_create();
        this.presenter.addonID = 'Audio1';
    },

    'test proper data' : function() {
        var expectedEventData = { source : 'Audio1', item : 'end', value : '', score : ''};

        var eventData = this.presenter.createOnEndEventData();

        assertEquals(expectedEventData, eventData);
    }
});