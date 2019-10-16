TestCase("[Slideshow] Model", {
    setUp: function () {
        this.presenter = AddonSlideshow_create();
        this.model = {
            Audio: [{
                MP3: "/files/serve/sound.mp3",
                OGG: "/files/serve/sound.ogg"
            }],
            Slides: [{
                Image: "/files/serve/slide_01.png",
                Start: "00:00"
            }, {
                Image: "/files/serve/slide_02.png",
                Start: "00:10"
            }],
            Texts: [{
                Text: "Sky",
                Start: "00:00",
                End: "00:20",
                Top: "0",
                Left: "0"
            }, {
                Text: "Mountains",
                Start: "00:00",
                End: "00:20",
                Top: "110",
                Left: "50"
            }, {
                Text: "Sun",
                Start: "00:00",
                End: "00:20",
                Top: "200",
                Left: "30"
            }]
        };
    },

    'test given model without audiodescription when upgrading model then audiodescriptions are added to the model': function() {
        var upgradedModel = this.presenter.upgradeModel(this.model);

        assertEquals(2, upgradedModel.Slides.length);
        assertFalse(upgradedModel.Slides[0]['Audiodescription'] === undefined);
        assertFalse(upgradedModel.Slides[1]['Audiodescription'] === undefined);
        assertEquals('', upgradedModel.Slides[0]['Audiodescription']);
        assertEquals('', upgradedModel.Slides[1]['Audiodescription']);
        assertFalse(upgradedModel['langAttribute'] === undefined);
        assertEquals('', upgradedModel['langAttribute']);
    }

});