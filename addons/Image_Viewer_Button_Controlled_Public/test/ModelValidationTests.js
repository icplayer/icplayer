ModelValidationTests = TestCase("Model validation");

ModelValidationTests.prototype.testProperConfig = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    var model = {
        Image : "/files/serve/image.png",
        Frames : "6",
        Sounds : [{
            'AAC sound': "/files/serve/sound.aac",
            'MP3 sound': "/files/serve/sound.mp3",
            'OGG sound': "/files/serve/sound.ogg"
        }],
        "Frame names" : [{
            name: "",
            frame: ""
        }],
        Labels: [{
            Text: "",
            Frames: "",
            Top: "",
            Left: ""
        }]
    };

    var validationResult = presenter.validateModel(model);

    assertFalse(validationResult.isError);

    assertEquals("/files/serve/image.png", validationResult.imageSrc);
    assertEquals("/files/serve/sound.aac", validationResult.sounds[0].AAC);
    assertEquals("/files/serve/sound.mp3", validationResult.sounds[0].MP3);
    assertEquals("/files/serve/sound.ogg", validationResult.sounds[0].OGG);
    assertEquals(false, validationResult.sounds[0].isEmpty);

    assertEquals(6, validationResult.frames);
    assertTrue(validationResult.frameNamesEmpty);

    assertFalse(validationResult.isClickDisabled);

    assertEquals(presenter.FRAME_SIZE.ORIGINAL, validationResult.frameSize);

    assertEquals(0, validationResult.labels.length);

    assertEquals(1, validationResult.showFrame);
};

ModelValidationTests.prototype.testProperConfigWithClickDisabled = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    var model = {
        Image : "/files/serve/image.png",
        Frames : "6",
        Sounds : [{
            'AAC sound': "",
            'MP3 sound': "",
            'OGG sound': ""
        }],
        "Frame names" : [{
            name: "",
            frame: ""
        }],
        isClickDisabled: 'True',
        Labels: [{
            Text: "",
            Frames: "",
            Top: "",
            Left: ""
        }]
    };

    var validationResult = presenter.validateModel(model);

    assertFalse(validationResult.isError);

    assertEquals("/files/serve/image.png", validationResult.imageSrc);

    assertEquals("", validationResult.sounds[0].AAC);
    assertEquals("", validationResult.sounds[0].MP3);
    assertEquals("", validationResult.sounds[0].OGG);
    assertEquals(true, validationResult.sounds[0].isEmpty);

    assertEquals(6, validationResult.frames);

    assertTrue(validationResult.frameNamesEmpty);

    assertTrue(validationResult.isClickDisabled);

    assertEquals(presenter.FRAME_SIZE.ORIGINAL, validationResult.frameSize);
};

ModelValidationTests.prototype.testProperConfigWithFrameNames = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    var model = {
        Image : "/files/serve/image.png",
        Frames : "6",
        Sounds : [{
            'AAC sound': "",
            'MP3 sound': "",
            'OGG sound': ""
        }],
        "Frame names" : [{
            name: "ImageViewer1",
            frame: "1"
        }],
        Labels: [{
            Text: "",
            Frames: "",
            Top: "",
            Left: ""
        }]
    };

    var validationResult = presenter.validateModel(model);

    assertFalse(validationResult.isError);

    assertEquals("/files/serve/image.png", validationResult.imageSrc);

    assertEquals("", validationResult.sounds[0].AAC);
    assertEquals("", validationResult.sounds[0].MP3);
    assertEquals("", validationResult.sounds[0].OGG);
    assertEquals(true, validationResult.sounds[0].isEmpty);

    assertEquals(6, validationResult.frames);

    assertFalse(validationResult.frameNamesEmpty);
    assertEquals("ImageViewer1", validationResult.frameNames[0].name);
    assertEquals(1, validationResult.frameNames[0].frame);

    assertEquals(presenter.FRAME_SIZE.ORIGINAL, validationResult.frameSize);
};

ModelValidationTests.prototype.testImageProblem = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    var model = {
        Image : "",
        Frames : "6",
        Sounds : [{
            'AAC sound': "/files/serve/sound.aac",
            'MP3 sound': "/files/serve/sound.mp3",
            'OGG sound': "/files/serve/sound.ogg"
        }],
        "Frame names" : [{
            name: "",
            frame: ""
        }],
        Labels: [{
            Text: "",
            Frames: "",
            Top: "",
            Left: ""
        }]
    };

    var validationResult = presenter.validateModel(model);

    assertTrue(validationResult.isError);
    assertEquals("I_01", validationResult.errorCode);
};

ModelValidationTests.prototype.testFramesProblem = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    var model = {
        Image : "/files/serve/image.png",
        Frames : "",
        Sounds : [{
            'AAC sound': "",
            'MP3 sound': "",
            'OGG sound': ""
        }],
        "Frame names" : [{
            name: "ImageViewer1",
            frame: "1"
        }],
        Labels: [{
            Text: "",
            Frames: "",
            Top: "",
            Left: ""
        }]
    };

    var validationResult = presenter.validateModel(model);

    assertTrue(validationResult.isError);
    assertEquals("FN_02", validationResult.errorCode);
};

ModelValidationTests.prototype.testFrameNamesProblem = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    var model = {
        Image : "/files/serve/image.png",
        Frames : "6",
        Sounds : [{
            'AAC sound': "",
            'MP3 sound': "",
            'OGG sound': ""
        }],
        "Frame names" : [{
            name: "ImageViewer1",
            frame: "0"
        }],
        Labels: [{
            Text: "",
            Frames: "",
            Top: "",
            Left: ""
        }]
    };

    var validationResult = presenter.validateModel(model);

    assertTrue(validationResult.isError);
    assertEquals("FN_04", validationResult.errorCode);
};

ModelValidationTests.prototype.testLabelsProblem = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    var model = {
        Image : "/files/serve/image.png",
        Frames : "6",
        Sounds : [{
            'AAC sound': "/files/serve/sound.aac",
            'MP3 sound': "/files/serve/sound.mp3",
            'OGG sound': "/files/serve/sound.ogg"
        }],
        "Frame names" : [{
            name: "",
            frame: ""
        }],
        Labels: [{
            Text: "",
            Frames: "2",
            Top: "",
            Left: ""
        }]
    };

    var validationResult = presenter.validateModel(model);

    assertTrue(validationResult.isError);
    assertEquals("L_01", validationResult.errorCode);
};

ModelValidationTests.prototype.testLabelsUndefined = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    var model = {
        Image : "/files/serve/image.png",
        Frames : "6",
        Sounds : [{
            'AAC sound': "/files/serve/sound.aac",
            'MP3 sound': "/files/serve/sound.mp3",
            'OGG sound': "/files/serve/sound.ogg"
        }],
        "Frame names" : [{
            name: "",
            frame: ""
        }]
    };

    var validationResult = presenter.validateModel(model);

    assertFalse(validationResult.isError);

    assertEquals("/files/serve/image.png", validationResult.imageSrc);
    assertEquals("/files/serve/sound.aac", validationResult.sounds[0].AAC);
    assertEquals("/files/serve/sound.mp3", validationResult.sounds[0].MP3);
    assertEquals("/files/serve/sound.ogg", validationResult.sounds[0].OGG);
    assertEquals(false, validationResult.sounds[0].isEmpty);

    assertEquals(6, validationResult.frames);
    assertTrue(validationResult.frameNamesEmpty);

    assertFalse(validationResult.isClickDisabled);

    assertEquals(presenter.FRAME_SIZE.ORIGINAL, validationResult.frameSize);

    assertEquals(0, validationResult.labels.length);
};

ModelValidationTests.prototype.testShowFrameWrongValue = function() {
    var presenter = AddonImage_Viewer_Button_Controlled_Public_create();
    var model = {
        Image : "/files/serve/image.png",
        Frames : "6",
        Sounds : [{
            'AAC sound': "/files/serve/sound.aac",
            'MP3 sound': "/files/serve/sound.mp3",
            'OGG sound': "/files/serve/sound.ogg"
        }],
        "Frame names" : [{
            name: "",
            frame: ""
        }],
        Labels: [{
            Text: "",
            Frames: "",
            Top: "",
            Left: ""
        }],
        "Show frame": "-5"
    };

    var validationResult = presenter.validateModel(model);

    assertFalse(validationResult.isError);

    assertEquals("/files/serve/image.png", validationResult.imageSrc);
    assertEquals("/files/serve/sound.aac", validationResult.sounds[0].AAC);
    assertEquals("/files/serve/sound.mp3", validationResult.sounds[0].MP3);
    assertEquals("/files/serve/sound.ogg", validationResult.sounds[0].OGG);
    assertEquals(false, validationResult.sounds[0].isEmpty);

    assertEquals(6, validationResult.frames);
    assertTrue(validationResult.frameNamesEmpty);

    assertFalse(validationResult.isClickDisabled);

    assertEquals(presenter.FRAME_SIZE.ORIGINAL, validationResult.frameSize);

    assertEquals(0, validationResult.labels.length);

    assertEquals(1, validationResult.showFrame);
};