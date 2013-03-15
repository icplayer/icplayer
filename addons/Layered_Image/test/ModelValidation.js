ModelValidationTests = TestCase("Model validation");

ModelValidationTests.prototype.testProperModel = function() {
    var presenter = AddonLayered_Image_create();
    var BASE_IMAGE_URL = "http://lorepo.com/resources/preview.png";
    var LAYER_IMAGE_URL = "http://lorepo.com/resources/layer";
    var model = {
        "Base image": BASE_IMAGE_URL,
        Layers : [
            {Image: LAYER_IMAGE_URL + "01.png"},
            {Image: LAYER_IMAGE_URL + "02.png"},
            {Image: LAYER_IMAGE_URL + "03.png"}
        ],
        "Is Visible": "True"
    };

    var validationResult = presenter.validateModel(model);
    
    assertFalse(validationResult.isError);
    assertEquals(BASE_IMAGE_URL, validationResult.baseImage);
    assertEquals(LAYER_IMAGE_URL + "01.png", validationResult.layers[0].image);
    assertFalse(validationResult.layers[0].showAtStart);
    assertEquals(LAYER_IMAGE_URL + "02.png", validationResult.layers[1].image);
    assertFalse(validationResult.layers[1].showAtStart);
    assertEquals(LAYER_IMAGE_URL + "03.png", validationResult.layers[2].image);
    assertFalse(validationResult.layers[2].showAtStart);

    assertEquals(presenter.IMAGE_SIZE.ORIGINAL, validationResult.imageSize);

    assertTrue(validationResult.isVisible);
    assertTrue(validationResult.isVisibleByDefault);
};

ModelValidationTests.prototype.testProperModelWithSomeLayersShown = function() {
    var presenter = AddonLayered_Image_create();
    var BASE_IMAGE_URL = "http://lorepo.com/resources/preview.png";
    var LAYER_IMAGE_URL = "http://lorepo.com/resources/layer";
    var model = {
        "Base image": BASE_IMAGE_URL,
        Layers : [{
            Image: LAYER_IMAGE_URL + "01.png",
            "Show at start": "True"
        }, {
            Image: LAYER_IMAGE_URL + "02.png"
        }, {
            Image: LAYER_IMAGE_URL + "03.png",
            "Show at start": "True"
        }],
        "Is Visible": "True"
    };

    var validationResult = presenter.validateModel(model);

    assertFalse(validationResult.isError);
    assertEquals(BASE_IMAGE_URL, validationResult.baseImage);
    assertEquals(LAYER_IMAGE_URL + "01.png", validationResult.layers[0].image);
    assertTrue(validationResult.layers[0].showAtStart);
    assertEquals(LAYER_IMAGE_URL + "02.png", validationResult.layers[1].image);
    assertFalse(validationResult.layers[1].showAtStart);
    assertEquals(LAYER_IMAGE_URL + "03.png", validationResult.layers[2].image);
    assertTrue(validationResult.layers[2].showAtStart);

    assertEquals(presenter.IMAGE_SIZE.ORIGINAL, validationResult.imageSize);

    assertTrue(validationResult.isVisible);
    assertTrue(validationResult.isVisibleByDefault);
};

ModelValidationTests.prototype.testBaseImageError = function() {
    var presenter = AddonLayered_Image_create();
    var LAYER_IMAGE_URL = "http://lorepo.com/resources/layer";
    var model = {
        "Base image": "",
        Layers : [
            {Image: LAYER_IMAGE_URL + "01.png"},
            {Image: LAYER_IMAGE_URL + "02.png"},
            {Image: LAYER_IMAGE_URL + "03.png"}
        ],
        "Is Visible": "True"
    };

    var validationResult = presenter.validateModel(model);

    assertTrue(validationResult.isError);
    assertEquals("BI_01", validationResult.errorCode);
};

ModelValidationTests.prototype.testLayersError = function() {
    var presenter = AddonLayered_Image_create();
    var BASE_IMAGE_URL = "http://lorepo.com/resources/preview.png";
    var LAYER_IMAGE_URL = "http://lorepo.com/resources/layer";
    var model = {
        "Base image": BASE_IMAGE_URL,
        Layers : [
            {Image: LAYER_IMAGE_URL + "01.png"},
            {Image: ""},
            {Image: LAYER_IMAGE_URL + "03.png"}
        ],
        "Is Visible": "True"
    };

    var validationResult = presenter.validateModel(model);

    assertTrue(validationResult.isError);
    assertEquals("L_01", validationResult.errorCode);
};