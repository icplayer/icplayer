var ModelValidationTests = AsyncTestCase('HTMLInputTests');

ModelValidationTests.prototype.setUp = function() {
    this.presenter = AddonTextAudio_create();
};

ModelValidationTests.prototype.tearDown = function() {};

ModelValidationTests.prototype.testParseHTML = function() {
    var model = {
        'mp3': '/some/file.mp3',
        'Slides': [
            {
                'Text': 'Lorem|| Ipsum|| Dolor',
                'Times': "00:00-00:02\n00:02-00:04\n00:04-00:06"
            }
        ]
    };

    var validatedModel = this.presenter.validateModel(model);

    assertTrue(validatedModel.isValid);
};