TestCase("[Slideshow] Validation", {
    setUp: function() {
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
            }],
            "Base width": "",
            "Base height": ""
        };
    },

    'test proper config': function() {
        var validationResult = this.presenter.validateModel(this.model);

        assertFalse(validationResult.isError);

        assertEquals("/files/serve/sound.mp3", validationResult.audio.MP3);
        assertEquals("/files/serve/sound.ogg", validationResult.audio.OGG);
        assertUndefined(validationResult.audio.AAC);
        assertFalse(validationResult.audio.wasPlayed);

        assertFalse(validationResult.slideAnimation);
        assertFalse(validationResult.textAnimation);

        assertEquals(2, validationResult.slides.count);
        assertEquals("/files/serve/slide_01.png", validationResult.slides.content[0].image);
        assertEquals(0, validationResult.slides.content[0].start);
        assertEquals("/files/serve/slide_02.png", validationResult.slides.content[1].image);
        assertEquals(10, validationResult.slides.content[1].start);

        assertEquals(3, validationResult.texts.count);
        assertEquals("Sky", validationResult.texts.content[0].text);
        assertEquals(0, validationResult.texts.content[0].start);
        assertEquals(20, validationResult.texts.content[0].end);
        assertEquals(0, validationResult.texts.content[0].top);
        assertEquals(0, validationResult.texts.content[0].left);

        assertEquals("Mountains", validationResult.texts.content[1].text);
        assertEquals(0, validationResult.texts.content[1].start);
        assertEquals(20, validationResult.texts.content[1].end);
        assertEquals(110, validationResult.texts.content[1].top);
        assertEquals(50, validationResult.texts.content[1].left);

        assertEquals("Sun", validationResult.texts.content[2].text);
        assertEquals(0, validationResult.texts.content[2].start);
        assertEquals(20, validationResult.texts.content[2].end);
        assertEquals(200, validationResult.texts.content[2].top);
        assertEquals(30, validationResult.texts.content[2].left);

        assertFalse(validationResult.hideProgressbar);
        assertFalse(validationResult.groupNextAndPrevious);

        assertEquals(1, validationResult.showSlide);
    },

    'test audio error': function() {
        this.model.Audio = [{
            MP3: "",
            OGG: ""
        }];

        var validationResult = this.presenter.validateModel(this.model);

        assertTrue(validationResult.isError);
        assertNotUndefined(validationResult.errorCode);
    },

    'test given model with no audio files and "no audio" checked when validating model then do not return error': function() {
        this.model.Audio = [{
            MP3: "",
            OGG: ""
        }];
        this.model["No audio"] = "True";
        this.model["Presentation duration"] = "12";

        var validationResult = this.presenter.validateModel(this.model);

        assertFalse(validationResult.isError);
    },

    'test given model with "no audio" checked and invalid presentation duration when validating model then do return error': function() {
        this.model.Audio = [{
            MP3: "",
            OGG: ""
        }];
        this.model["No audio"] = "True";
        this.model["Presentation duration"] = "xxx";

        var validationResult = this.presenter.validateModel(this.model);

        assertTrue(validationResult.isError);
        assertEquals(validationResult.errorCode, 'N_01');
    },

    'test slides error': function() {
        this.model.Slides = [{
            Start: "00:00"
        }];

        var validationResult = this.presenter.validateModel(this.model);

        assertTrue(validationResult.isError);
        assertNotUndefined(validationResult.errorCode);
    },

    'test texts error': function() {
        this.model.Texts = [{
            Start: "00:00",
            End: "00:20",
            Top: "0",
            Left: "0"
        }];

        var validationResult = this.presenter.validateModel(this.model);

        assertTrue(validationResult.isError);
        assertNotUndefined(validationResult.errorCode);
    },

    'test proper config with hidden progressbar': function() {
        this.model["Hide progressbar"] = "True";

        var validationResult = this.presenter.validateModel(this.model);

        assertFalse(validationResult.isError);
        assertTrue(validationResult.hideProgressbar);
    },

    'test show frame wrong value': function() {
        this.model["Show slide"] = 'slide';

        var validationResult = this.presenter.validateModel(this.model);

        assertFalse(validationResult.isError);
        assertEquals(1, validationResult.showSlide);
    },

    'test group next and previous buttons': function() {
        this.model["Group next and previous buttons"] = 'True';

        var validationResult = this.presenter.validateModel(this.model);

        assertFalse(validationResult.isError);
        assertTrue(validationResult.groupNextAndPrevious);
    }
});

TestCase("[Slideshow]  Move To params validation", {
    setUp: function () {
        this.presenter = AddonSlideshow_create();
        this.stubs = {
            getCurrentSlideIndex: sinon.stub(this.presenter, 'getCurrentSlideIndex')
        }
    },

    tearDown: function () {
        this.presenter.getCurrentSlideIndex.restore();
    },

    'test proper user input': function () {
        this.stubs.getCurrentSlideIndex.returns(3);
        this.presenter.configuration = {slides: {count: 6}};
        var validatedParams = this.presenter.validateMoveToParams(["5"]);

        assertTrue(validatedParams.isValid);
        assertEquals(4, validatedParams.number);
    },

    'test invalid user input, non digit': function () {
        this.stubs.getCurrentSlideIndex.returns(3);
        this.presenter.configuration = {slides: {count: 6}};
        var validatedParams = this.presenter.validateMoveToParams(["awsd;fklhjlawq34"]);

        assertFalse(validatedParams.isValid);
    },

    'test invalid user input, too many arguments': function () {
        this.stubs.getCurrentSlideIndex.returns(3);
        this.presenter.configuration = {slides: {count: 6}};
        var validatedParams = this.presenter.validateMoveToParams(["34", "12"]);

        assertFalse(validatedParams.isValid);
    },

    'test invalid user input, greater index than amount of slides': function () {
        this.stubs.getCurrentSlideIndex.returns(3);
        this.presenter.configuration = {slides: {count: 6}};
        var validatedParams = this.presenter.validateMoveToParams(["10"]);

        assertFalse(validatedParams.isValid);
    },

    'test invalid user input, negative number': function () {
        this.stubs.getCurrentSlideIndex.returns(3);
        this.presenter.configuration = {slides: {count: 6}};
        var validatedParams = this.presenter.validateMoveToParams(["-2"]);

        assertFalse(validatedParams.isValid);
    }
});