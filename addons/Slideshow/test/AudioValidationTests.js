AudioValidationTests = TestCase("[Slideshow] Audio Configuration");

AudioValidationTests.prototype.testProperConfig = function() {
    var presenter = AddonSlideshow_create();
    var audio = [{
        MP3: "/files/serve/sound.mp3",
        OGG: "/files/serve/sound.ogg"
    }];

    var validationResult = presenter.validateAudio(audio[0]);
    
    assertFalse(validationResult.isError);
    assertEquals("/files/serve/sound.mp3", validationResult.audio.MP3);
    assertEquals("/files/serve/sound.ogg", validationResult.audio.OGG);
    assertUndefined(validationResult.audio.AAC);
};

AudioValidationTests.prototype.testEmptyAudio = function() {
    var presenter = AddonSlideshow_create();
    var audio = [{
        MP3: "",
        OGG: ""
    }];

    var validationResult = presenter.validateAudio(audio[0]);
    
    assertTrue(validationResult.isError);
    assertEquals("A_01", validationResult.errorCode)
};