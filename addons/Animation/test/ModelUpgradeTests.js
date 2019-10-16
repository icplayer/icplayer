TestCase("Model upgrade", {
    setUp: function () {
        this.presenter = AddonAnimation_create();
    },

    'test model consists Frames property': function () {
        var model = {
            "Preview image": this.PREVIEW_IMAGE_URL,
            Animation: this.ANIMATION_IMAGE_URL,
            "Frames count": "6",
            "Frame duration": "200",
            Labels : [{
                Text: "Label no 1",
                Top: "0",
                Left: "0",
                Frames: "0"
            }, {
                Text: "Label no 3",
                Top: "200",
                Left: "30",
                Frames: "0"
            }],
            "Watermark color": "",
            "Watermark opacity": "",
            "Watermark size": ""
        };

        var upgradedModel = this.presenter.addFramesToLabels(model);

        assertEquals(model["Labels"], upgradedModel["Labels"]);
    },

    'test model consists empty Frames property': function () {
        var model = {
            "Preview image": this.PREVIEW_IMAGE_URL,
            Animation: this.ANIMATION_IMAGE_URL,
            "Frames count": "6",
            "Frame duration": "200",
            Labels : [{
                Text: "Label no 1",
                Top: "0",
                Left: "0",
                Frames: ""
            }, {
                Text: "Label no 3",
                Top: "200",
                Left: "30",
                Frames: ""
            }],
            "Watermark color": "",
            "Watermark opacity": "",
            "Watermark size": ""
        }, expectedModelFragment = [{
            Text: "Label no 1",
            Top: "0",
            Left: "0",
            Frames: ""
        }, {
            Text: "Label no 3",
            Top: "200",
            Left: "30",
            Frames: ""
        }];

        var upgradedModel = this.presenter.addFramesToLabels(model);

        assertEquals(expectedModelFragment, upgradedModel["Labels"]);
    },

    'test model does not consist Frames property': function () {
        var model = {
            "Preview image": this.PREVIEW_IMAGE_URL,
            Animation: this.ANIMATION_IMAGE_URL,
            "Frames count": "6",
            "Frame duration": "200",
            Labels : [{
                Text: "Label no 1",
                Top: "0",
                Left: "0"
            }, {
                Text: "Label no 3",
                Top: "200",
                Left: "30"
            }],
            "Watermark color": "",
            "Watermark opacity": "",
            "Watermark size": ""
        }, expectedModelFragment = [{
            Text: "Label no 1",
            Top: "0",
            Left: "0",
            Frames: ""
        }, {
            Text: "Label no 3",
            Top: "200",
            Left: "30",
            Frames: ""
        }];

        var upgradedModel = this.presenter.addFramesToLabels(model);

        assertEquals(expectedModelFragment, upgradedModel["Labels"]);
    },

     'test given model without tts properties when upgrading model then tts properties will be added': function () {
        var expectedSpeechText = {Stop: {Stop: "stopped"}};

        var upgradedModel = this.presenter.upgradeTextToSpeech({});

        assertEquals(expectedSpeechText, upgradedModel["speechTexts"]);
        assertTrue(upgradedModel["Alternative Text"] !== undefined);
        assertEquals('', upgradedModel["Alternative Text"]);
        assertTrue(upgradedModel["Preview Alternative Text"] !== undefined);
        assertEquals('', upgradedModel["Preview Alternative Text"]);
        assertTrue(upgradedModel["langAttribute"] !== undefined);
        assertEquals('', upgradedModel["langAttribute"]);
    }
});