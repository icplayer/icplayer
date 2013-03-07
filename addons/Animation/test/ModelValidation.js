ModelValidationTests = TestCase("Model validation");

ModelValidationTests.prototype.setUp = function() {
    this.presenter = AddonAnimation_create();
    this.PREVIEW_IMAGE_URL = "http://lorepo.com/resources/preview.png";
    this.ANIMATION_IMAGE_URL = "http://lorepo.com/resources/animation.png";
    this.model = {
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
        "Watermark size": ""
    };
};

ModelValidationTests.prototype.testProperModel = function() {
    var validationResult = this.presenter.validateModel(this.model);
    
    assertFalse(validationResult.isError);
    
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

    assertTrue(validationResult.currentVisibility);
    assertTrue(validationResult.defaultVisibility);

    assertFalse(validationResult.watermarkOptions.show);
    assertFalse(validationResult.watermarkOptions.clicked);
};

ModelValidationTests.prototype.testDoNotResetOnEnd = function() {
    this.model["Don't reset on end"] = "True";

    var validationResult = this.presenter.validateModel(this.model);

    assertFalse(validationResult.isError);
    assertFalse(validationResult.resetOnEnd);
};

ModelValidationTests.prototype.testPreviewImageError = function() {
    delete this.model["Preview image"];
    
    var validationResult = this.presenter.validateModel(this.model);
    
    assertTrue(validationResult.isError);
    assertEquals("PI_01", validationResult.errorCode);
};

ModelValidationTests.prototype.testAnimationError = function() {
    delete this.model.Animation;
    
    var validationResult = this.presenter.validateModel(this.model);
    
    assertTrue(validationResult.isError);
    assertEquals("AI_01", validationResult.errorCode);
};

ModelValidationTests.prototype.testFramesCountError = function() {
    this.model["Frames count"] = "kaka";
    
    var validationResult = this.presenter.validateModel(this.model);
    
    assertTrue(validationResult.isError);
    assertEquals("FC_01", validationResult.errorCode);
};

ModelValidationTests.prototype.testFrameDurationError = function() {
    this.model["Frame duration"] = "-10";

    var validationResult = this.presenter.validateModel(this.model);
    
    assertTrue(validationResult.isError);
    assertEquals("FD_01", validationResult.errorCode);
};

ModelValidationTests.prototype.testLabelsError = function() {
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
};