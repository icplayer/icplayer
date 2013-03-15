ImageListValidationTests = TestCase("Image list validation");

ImageListValidationTests.prototype.testProperImageList = function() {
    var presenter = AddonLayered_Image_create();
    var IMAGE_URL = "http://lorepo.com/resources/image-0";
    var list = [
        {Image: IMAGE_URL + "1.png"},
        {Image: IMAGE_URL + "2.png"},
        {Image: IMAGE_URL + "3.png"}
    ];

    var validationResult = presenter.validateImageList(list);
    
    assertFalse(validationResult.isError);
    assertArray(validationResult.list);
    assertEquals(IMAGE_URL + "1.png", validationResult.list[0].image);
    assertFalse(validationResult.list[0].showAtStart);
    assertEquals(IMAGE_URL + "2.png", validationResult.list[1].image);
    assertFalse(validationResult.list[1].showAtStart);
    assertEquals(IMAGE_URL + "3.png", validationResult.list[2].image);
    assertFalse(validationResult.list[2].showAtStart);
};

ImageListValidationTests.prototype.testProperImageList = function() {
    var presenter = AddonLayered_Image_create();
    var IMAGE_URL = "http://lorepo.com/resources/image-0";
    var list = [
        {
            Image: IMAGE_URL + "1.png",
            "Show at start": "True"
        },
        {
            Image: IMAGE_URL + "2.png",
            "Show at start": "True"
        },
        {
            Image: IMAGE_URL + "3.png",
            "Show at start": "True"
        }
    ];

    var validationResult = presenter.validateImageList(list);

    assertFalse(validationResult.isError);
    assertArray(validationResult.list);
    assertEquals(IMAGE_URL + "1.png", validationResult.list[0].image);
    assertTrue(validationResult.list[0].showAtStart);
    assertEquals(IMAGE_URL + "2.png", validationResult.list[1].image);
    assertTrue(validationResult.list[1].showAtStart);
    assertEquals(IMAGE_URL + "3.png", validationResult.list[2].image);
    assertTrue(validationResult.list[2].showAtStart);
};

ImageListValidationTests.prototype.testProperImageListWithNumericValues = function() {
    var presenter = AddonLayered_Image_create();
    var IMAGE_URL = "http://lorepo.com/resources/image-0";
    var list = [{
        Image: IMAGE_URL + "1.png",
        "Show at start": "0"
    }, {
        Image: IMAGE_URL + "2.png",
        "Show at start": "1"
    }, {
        Image: IMAGE_URL + "3.png",
        "Show at start": "True"
    }];

    var validationResult = presenter.validateImageList(list);

    assertFalse(validationResult.isError);
    assertArray(validationResult.list);
    assertEquals(IMAGE_URL + "1.png", validationResult.list[0].image);
    assertFalse(validationResult.list[0].showAtStart);
    assertEquals(IMAGE_URL + "2.png", validationResult.list[1].image);
    assertTrue(validationResult.list[1].showAtStart);
    assertEquals(IMAGE_URL + "3.png", validationResult.list[2].image);
    assertTrue(validationResult.list[2].showAtStart);
};

ImageListValidationTests.prototype.testListEmpty = function() {
    var presenter = AddonLayered_Image_create();
    var list = [
        {Image: ""}
    ];

    var validationResult = presenter.validateImageList(list);

    assertTrue(validationResult.isError);
    assertEquals("IL_01", validationResult.errorCode);
};