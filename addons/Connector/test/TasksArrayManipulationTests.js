TasksArrayManipulationTests = TestCase("Task array validation");

TasksArrayManipulationTests.prototype.testAddTaskToEmptyArray = function() {
    var presenter = AddonConnector_create();
    var tasks = [];
    var task = {
        source: "TrueFalse1",
        tasks: [{
            item: "1-1",
            value: "1",
            score: "",
            script: "ImageViewer1.moveToFrame(1);"
        }]
    };
    var expectedTasks = [{
        source: "TrueFalse1",
        tasks: [{
            item: "1-1",
            value: "1",
            score: "",
            script: "ImageViewer1.moveToFrame(1);"
        }]
    }];

    presenter.addTask(tasks, task);

    assertEquals(expectedTasks, tasks);
};

TasksArrayManipulationTests.prototype.testAddTaskWithSameSource = function() {
    var presenter = AddonConnector_create();
    var tasks = [{
        source: "TrueFalse1",
        tasks: [{
            item: "1-1",
            value: "1",
            score: "",
            script: "ImageViewer1.moveToFrame(1);"
        }]
    }];
    var task = {
        source: "TrueFalse1",
        tasks: [{
            item: "1-2",
            value: "1",
            score: "",
            script: "ImageViewer1.moveToFrame(2);"
        }]
    };
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
    }];

    presenter.addTask(tasks, task);

    assertEquals(expectedTasks, tasks);
};

TasksArrayManipulationTests.prototype.testGetExistingTask = function() {
    var presenter = AddonConnector_create();
    var tasks = [{
        source: "TrueFalse1",
        tasks: [{
            item: "1-1",
            value: "1",
            score: "",
            script: "ImageViewer1.moveToFrame(1);"
        }]
    }, {
        source: "TrueFalse2",
        tasks: [{
            item: "1-1",
            value: "1",
            score: "",
            script: "ImageViewer1.moveToFrame(1);"
        }]
    }, {
        source: "TrueFalse3",
        tasks: [{
            item: "1-1",
            value: "1",
            score: "",
            script: "ImageViewer1.moveToFrame(1);"
        }]
    }];
    var expectedTasks = [{
        item: "1-1",
        value: "1",
        score: "",
        script: "ImageViewer1.moveToFrame(1);"
    }];

    var tasksWithGivenSource = presenter.getTaskWithSource(tasks, "TrueFalse3");

    assertEquals(2, tasksWithGivenSource.index);
    assertEquals(expectedTasks, tasksWithGivenSource.tasks);
};

TasksArrayManipulationTests.prototype.testGetNotExistingTask = function() {
    var presenter = AddonConnector_create();
    var tasks = [{
        source: "TrueFalse1",
        tasks: [{
            item: "1-1",
            value: "1",
            score: "",
            script: "ImageViewer1.moveToFrame(1);"
        }]
    }, {
        source: "TrueFalse2",
        tasks: [{
            item: "1-1",
            value: "1",
            score: "",
            script: "ImageViewer1.moveToFrame(1);"
        }]
    }];

    var taskIndex = presenter.getTaskWithSource(tasks, "TrueFalse3");

    assertEquals(-1, taskIndex.index);
};