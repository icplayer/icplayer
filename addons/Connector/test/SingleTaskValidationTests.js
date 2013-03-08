SingleTaskValidationTests = TestCase("Task validation");

SingleTaskValidationTests.prototype.testValidateEmptyTask = function() {
    var presenter = AddonConnector_create();
    var task = {
        Source: "",
        Item: "",
        Value: "",
        Score: "",
        Script: ""
    };


    var validatedTask = presenter.validateTask(task);

    assertFalse(validatedTask.isError);
    assertTrue(validatedTask.isEmpty);
};

SingleTaskValidationTests.prototype.testMissingSource = function() {
    var presenter = AddonConnector_create();
    var task = {
        Source: "",
        Item: "1-1",
        Value: "1",
        Score: "",
        Script: "ImageViewer1.moveToFrame(1);"
    };


    var validatedTask = presenter.validateTask(task);

    assertTrue(validatedTask.isError);
    assertEquals("VT_01", validatedTask.errorCode);
};

SingleTaskValidationTests.prototype.testMissingScript = function() {
    var presenter = AddonConnector_create();
    var task = {
        Source: "TrueFalse1",
        Item: "1-1",
        Value: "1",
        Score: "",
        Script: ""
    };


    var validatedTask = presenter.validateTask(task);

    assertTrue(validatedTask.isError);
    assertEquals("VT_02", validatedTask.errorCode);
};

SingleTaskValidationTests.prototype.testValidateNotEmptyTask = function() {
    var presenter = AddonConnector_create();
    var task = {
        Source: "TrueFalse1",
        Item: "1-1",
        Value: "1",
        Score: "",
        Script: "ImageViewer1.moveToFrame(1);"
    };
    var expectedTask = {
        source: "TrueFalse1",
        tasks: [{
            item: "1-1",
            value: "1",
            score: "",
            script: "ImageViewer1.moveToFrame(1);"
        }]
    };


    var validatedTask = presenter.validateTask(task);

    assertFalse(validatedTask.isError);
    assertFalse(validatedTask.isEmpty);
    assertEquals(expectedTask, validatedTask.task);
};