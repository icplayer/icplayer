ModelValidationTests = TestCase("Model validation");

ModelValidationTests.prototype.setUp = function() {
    this.presenter = AddonImage_Viewer_Public_create();

    this.model = {
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
        Labels: [{
            Text: "",
            Frames: "",
            Top: "",
            Left: ""
        }],
        langAttribute: "",
        "Alternative texts": [{
            "Alternative text": "",
            frame: ""
        }],
        "Base width": "",
        "Base height": ""
    };
};

ModelValidationTests.prototype.testDefaultValues = function() {
    var validationResult = this.presenter.validateModel(this.model);

    assertFalse(validationResult.isError);

    assertEquals("/files/serve/image.png", validationResult.imageSrc);

    assertEquals(true, validationResult.sounds[0].isEmpty);
    assertEquals("", validationResult.sounds[0].AAC);
    assertEquals("", validationResult.sounds[0].MP3);
    assertEquals("", validationResult.sounds[0].OGG);

    assertEquals(6, validationResult.frames);
    assertTrue(validationResult.frameNamesEmpty);

    assertFalse(validationResult.isClickDisabled);

    assertEquals('ORIGINAL', validationResult.frameSize);
    assertEquals('NONE', validationResult.animation);

    assertEquals(0, validationResult.labels.length);

    assertEquals(1, validationResult.showFrame);

    assertFalse(validationResult.correctFrames.isExerciseMode);
    assertFalse(validationResult.showFrameCounter);
    assertFalse(validationResult.shouldCalcScore);
};

ModelValidationTests.prototype.testImageProblem = function() {
    this.model.Image = "";

    var validationResult = this.presenter.validateModel(this.model);

    assertTrue(validationResult.isError);
    assertEquals("IM_01", validationResult.errorCode);
};

ModelValidationTests.prototype.testFramesProblem = function() {
    this.model.Frames = "";

    var validationResult = this.presenter.validateModel(this.model);

    assertTrue(validationResult.isError);
    assertEquals("FN_01", validationResult.errorCode);
};

ModelValidationTests.prototype.testFrameNamesProblem = function() {
    this.model["Frame names"] = [{
        name: "ImageViewer1",
        frame: "0"
    }];

    var validationResult = this.presenter.validateModel(this.model);

    assertTrue(validationResult.isError);
    assertEquals("FN_03", validationResult.errorCode);
};

ModelValidationTests.prototype.testLabelsProblem = function() {
    this.model.Labels = [{
        Text: "",
        Frames: "2",
        Top: "",
        Left: ""
    }];

    var validationResult = this.presenter.validateModel(this.model);

    assertTrue(validationResult.isError);
    assertEquals("LA_01", validationResult.errorCode);
};

ModelValidationTests.prototype.testShowFrameWrongValue = function() {
    this.model["Show frame"] = "-5";

    var validationResult = this.presenter.validateModel(this.model);

    assertFalse(validationResult.isError);
    assertEquals(1, validationResult.showFrame);
};

ModelValidationTests.prototype.testCorrectFramesProblem = function() {
    this.model["Correct frames"] = "7";

    var validationResult = this.presenter.validateModel(this.model);

    assertEquals("CF_01", validationResult.errorCode);
};

ModelValidationTests.prototype.testInitialFrameOutOfRange = function() {
    this.model["Initial frame"] = "7";

    var validationResult = this.presenter.validateModel(this.model);

    assertEquals("IF_01", validationResult.errorCode);
};