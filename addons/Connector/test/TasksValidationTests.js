TasksValidationTests = TestCase("Tasks validation");

TasksValidationTests.prototype.testEmpty = function() {
    var presenter = AddonConnector_create();
    var tasks = [{
        Source: "",
        Item: "",
        Value: "",
        Score: "",
        Script: ""
    }];

    var validatedTasks = presenter.validateTasks(tasks);

    assertFalse(validatedTasks.isError);
    assertArray(validatedTasks.tasks);
    assertEquals(0, validatedTasks.tasks.length);
};

TasksValidationTests.prototype.testSingleTask = function() {
    var presenter = AddonConnector_create();
    var tasks = [{
        Source: "TrueFalse1",
        Item: "1-1",
        Value: "1",
        Score: "",
        Script: "ImageViewer1.moveToFrame(1);"
    }];
    var expectedTasks = [{
        source: "TrueFalse1",
        tasks: [{
            item: "1-1",
            value: "1",
            score: "",
            script: "ImageViewer1.moveToFrame(1);"
        }]
    }];

    var validatedTasks = presenter.validateTasks(tasks);

    assertFalse(validatedTasks.isError);

    assertArray(validatedTasks.tasks);
    assertEquals(1, validatedTasks.tasks.length);
    assertEquals(expectedTasks, validatedTasks.tasks);
};

TasksValidationTests.prototype.testMultipleTasks = function() {
    var presenter = AddonConnector_create();
    var tasks = [{
        Source: "TrueFalse1",
        Item: "1-1",
        Value: "1",
        Score: "",
        Script: "ImageViewer1.moveToFrame(1);"
    }, {
        Source: "TrueFalse1",
        Item: "1-2",
        Value: "1",
        Score: "",
        Script: "ImageViewer1.moveToFrame(2);"
    }, {
        Source: "ImageViewer1",
        Item: "3",
        Value: "",
        Score: "",
        Script: "Feedback.change(IM-03);"
    }];
    var expectedTasks = [{
        source: "TrueFalse1",
        tasks: [{
            item: "1-1",
            value: "1",
            score: "",
            script: "ImageViewer1.moveToFrame(1);"
        }, {
            item: "1-2",
            value: "1",
            score: "",
            script: "ImageViewer1.moveToFrame(2);"
        }]
    }, {
        source: "ImageViewer1",
        tasks: [{
            item: "3",
            value: "",
            score: "",
            script: "Feedback.change(IM-03);"
        }]
    }];

    var validatedTasks = presenter.validateTasks(tasks);

    assertFalse(validatedTasks.isError);
    assertArray(validatedTasks.tasks);
    assertEquals(expectedTasks, validatedTasks.tasks);
};