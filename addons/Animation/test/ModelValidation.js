TestCase("Model validation", {
    setUp: function () {
        this.presenter = AddonAnimation_create();
        this.PREVIEW_IMAGE_URL = "http://lorepo.com/resources/preview.png";
        this.ANIMATION_IMAGE_URL = "http://lorepo.com/resources/animation.png";
        this.model = {
            'ID': 'Animation1',
            "Is Visible": "True",
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
                Text: "Label no 2",
                Top: "110",
                Left: "50",
                Frames: "0"
            }, {
                Text: "Label no 3",
                Top: "200",
                Left: "30",
                Frames: "0"
            }],
            "Watermark color": "",
            "Watermark opacity": "",
            "Watermark size": "",
            "langAttribute": "pl",
            "Alternative Text": "test alt text",
            "Preview Alternative Text": "test prev alt text",
            speechTexts: {
                Stop: {
                    Stop: "test stop"
                }
            },
            "Base width": "",
            "Base height": ""
        };
    },

    'test proper model': function () {
        var validationResult = this.presenter.validateModel(this.model);

        assertFalse(validationResult.isError);

        assertEquals('Animation1', validationResult.queueName);

        assertEquals(this.PREVIEW_IMAGE_URL, validationResult.image);
        assertEquals(this.ANIMATION_IMAGE_URL, validationResult.animation);
        assertEquals(6, validationResult.framesCount);
        assertEquals(200, validationResult.frameDuration);
        assertEquals(false, validationResult.loop);

        assertEquals(3, validationResult.labels.count);
        assertEquals("Label no 1", validationResult.labels.content[0].text);
        assertEquals(0, validationResult.labels.content[0].top);
        assertEquals(0, validationResult.labels.content[0].left);
        assertEquals([0], validationResult.labels.content[0].frames);
        assertEquals("Label no 2", validationResult.labels.content[1].text);
        assertEquals(110, validationResult.labels.content[1].top);
        assertEquals(50, validationResult.labels.content[1].left);
        assertEquals([0], validationResult.labels.content[1].frames);
        assertEquals("Label no 3", validationResult.labels.content[2].text);
        assertEquals(200, validationResult.labels.content[2].top);
        assertEquals(30, validationResult.labels.content[2].left);
        assertEquals([0], validationResult.labels.content[2].frames);

        assertEquals(this.presenter.FRAME_SIZE.ORIGINAL, validationResult.frameSize);

        assertTrue(validationResult.resetOnEnd);
        assertFalse(validationResult.isClickDisabled);

        assertTrue(validationResult.isVisible);
        assertTrue(validationResult.isVisibleByDefault);

        assertFalse(validationResult.watermarkOptions.show);
        assertFalse(validationResult.watermarkOptions.clicked);

        assertEquals("pl", validationResult.lang);
        assertEquals("test alt text", validationResult.altText);
        assertEquals("test prev alt text", validationResult.altTextPreview);
        assertEquals({stop: "test stop"}, validationResult.speechTexts)
    },

    'test do not reset on end': function () {
        this.model["Don't reset on end"] = "True";

        var validationResult = this.presenter.validateModel(this.model);

        assertFalse(validationResult.isError);
        assertFalse(validationResult.resetOnEnd);
    },

    'test preview image error': function () {
        delete this.model["Preview image"];

        var validationResult = this.presenter.validateModel(this.model);

        assertTrue(validationResult.isError);
        assertEquals("PI_01", validationResult.errorCode);
    },

    'test animation error': function () {
        delete this.model.Animation;

        var validationResult = this.presenter.validateModel(this.model);

        assertTrue(validationResult.isError);
        assertEquals("AI_01", validationResult.errorCode);
    },

    'test frame count error': function () {
        this.model["Frames count"] = "kaka";

        var validationResult = this.presenter.validateModel(this.model);

        assertTrue(validationResult.isError);
        assertEquals("FC_01", validationResult.errorCode);
    },

    'test frame duration error': function () {
        this.model["Frame duration"] = "-10";

        var validationResult = this.presenter.validateModel(this.model);

        assertTrue(validationResult.isError);
        assertEquals("FD_01", validationResult.errorCode);
    },

    'test label error': function () {
        this.model.Labels = [{
            Text: "Label no 1",
            Top: "0",
            Left: "0",
            Frames: "0"
        }, {
            Text: "",
            Top: "110",
            Left: "50",
            Frames: "0"
        }, {
            Text: "Label no 3",
            Top: "200",
            Left: "30",
            Frames: "0"
        }];

        var validationResult = this.presenter.validateModel(this.model);

        assertTrue(validationResult.isError);
        assertEquals("L_01", validationResult.errorCode);
    }
});