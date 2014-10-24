TestCase("Events creation", {
    setUp : function() {
        this.presenter = AddonPage_Rating_create();
        this.presenter.addonID = 'Page_Rating1';
    },

    'test selected rate': function () {
        var eventData = this.presenter.createRatingEventData({'index' : 2, 'selected' : true});

        assertEquals('Page_Rating1', eventData.source);
        assertEquals('2', eventData.item);
        assertEquals('1', eventData.value);
    },

    'test unselected rate': function () {
        var eventData = this.presenter.createRatingEventData({'index' : 3, 'selected' : false});

        assertEquals('Page_Rating1', eventData.source);
        assertEquals('3', eventData.item);
        assertEquals('0', eventData.value);
    }
});