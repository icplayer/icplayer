TestCase("EVENTEND keyword finding", {
    setUp: function() {
        this.presenter = AddonVisual_Feedback_Creator_create();
    },

    'test keyword at the bottom of script': function() {
        var script =
            [
                'EVENTSTART',
                'Source:Slider.+',
                'Value:1',
                'Feedback1.change("Slider-New-Step");',
                'SCRIPTEND',
                'EVENTEND'
            ];

        var keywordIndex = this.presenter.findKeywordIndex(script, "EVENTEND", 1);

        assertEquals(5, keywordIndex);
    },

    'test keyword in the middle of script': function() {
        var script =
            [
                'EVENTSTART',
                'Source:Slider.+',
                'Value:1',
                'EVENTEND',
                'Feedback1.change("Slider-New-Step");',
                'SCRIPTEND'
            ];

        var keywordIndex = this.presenter.findKeywordIndex(script, "EVENTEND", 1);

        assertEquals(3, keywordIndex);
    },

    'test keyword missing': function() {
        var script =
            [
                'EVENTSTART',
                'Source:Slider.+',
                'Value:1',
                'Feedback1.change("Slider-New-Step");',
                'SCRIPTEND'
            ];

        var keywordIndex = this.presenter.findKeywordIndex(script, "EVENTEND", 1);

        assertEquals(-1, keywordIndex);
    }
});