TasksFilteringTests = TestCase("Tasks filtering");

TasksFilteringTests.prototype.setUp = function() {
    this.presenter = AddonConnector_create();
};

TasksFilteringTests.prototype.testFilterByItem = function() {
    var tasks = [
        { item: "1-1", value: "1", score: "1", script: "ImageViewer1.moveToFrame(1);" },
        { item: "1-2", value: "2", score: "1", script: "ImageViewer1.moveToFrame(2);" },
        { item: "1-3", value: "1", score: "0", script: "ImageViewer1.moveToFrame(3);" },
        { item: "",    value: "1", score: "0", script: "ImageViewer1.moveToFrame(4);" },
        { item: "1-2", value: "0", score: "0", script: "Feedback.change(TF-02)" }
    ];
    var expectedTasks = [
        { item: "1-2", value: "2", score: "1", script: "ImageViewer1.moveToFrame(2);" },
        { item: "1-2", value: "0", score: "0", script: "Feedback.change(TF-02)" }
    ];

    var filteredTasks = this.presenter.filterTasks(tasks, "1-2", this.presenter.FILTER_FIELD.ITEM);

    assertEquals(expectedTasks, filteredTasks)
};

TasksFilteringTests.prototype.testFilterByEmptyItem = function() {
    var tasks = [
        { item: "1-1", value: "1", score: "1", script: "ImageViewer1.moveToFrame(1);" },
        { item: "", value: "2", score: "1", script: "ImageViewer1.moveToFrame(2);" },
        { item: "", value: "1", score: "0", script: "ImageViewer1.moveToFrame(3);" },
        { item: "", value: "0", score: "0", script: "Feedback.change(TF-02)" }
    ];

    var expectedTasks = [
        { item: "", value: "2", score: "1", script: "ImageViewer1.moveToFrame(2);" },
        { item: "", value: "1", score: "0", script: "ImageViewer1.moveToFrame(3);" },
        { item: "", value: "0", score: "0", script: "Feedback.change(TF-02)" }
    ];
    var filteredTasks = this.presenter.filterTasks(tasks, "", this.presenter.FILTER_FIELD.ITEM);

    assertEquals(expectedTasks, filteredTasks);
};

TasksFilteringTests.prototype.testFilterByItemWildcard = function() {
    var tasks = [
        { item: "1-*", value: "1", score: "1", script: "ImageViewer1.moveToFrame(1);" },
        { item: "3-*", value: "1", score: "0", script: "ImageViewer1.moveToFrame(3);" },
        { item: "*", value: "1", score: "0", script: "ImageViewer1.moveToFrame(5);" },
        { item: "2-2", value: "0", score: "0", script: "Feedback.change(TF-02)" }
    ];
    var expectedTasks = [
        { item: "1-*", value: "1", score: "1", script: "ImageViewer1.moveToFrame(1);" },
        { item: "*", value: "1", score: "0", script: "ImageViewer1.moveToFrame(5);" }
    ];

    var filteredTasks = this.presenter.filterTasks(tasks, "1-1", this.presenter.FILTER_FIELD.ITEM);

    assertEquals(expectedTasks, filteredTasks);
};

TasksFilteringTests.prototype.testFilterByItemNoMatch = function() {
    var tasks = [
        { item: "1-1", value: "1", score: "1", script: "ImageViewer1.moveToFrame(1);" },
        { item: "1-2", value: "2", score: "1", script: "ImageViewer1.moveToFrame(2);" },
        { item: "1-3", value: "1", score: "0", script: "ImageViewer1.moveToFrame(3);" },
        { item: "1-4", value: "0", score: "0", script: "Feedback.change(TF-02)" }
    ];
    var filteredTasks = this.presenter.filterTasks(tasks, "1-5", this.presenter.FILTER_FIELD.ITEM);

    assertEquals([], filteredTasks);
};

TasksFilteringTests.prototype.testFilterByValue = function() {
    var tasks = [
        { item: "1-1", value: "1", score: "1", script: "ImageViewer1.moveToFrame(1);" },
        { item: "1-2", value: "2", score: "1", script: "ImageViewer1.moveToFrame(2);" },
        { item: "1-3", value: "1", score: "0", script: "ImageViewer1.moveToFrame(3);" },
        { item: "1-2", value: "0", score: "0", script: "Feedback.change(TF-02)" }
    ];
    var expectedTasks = [
        { item: "1-1", value: "1", score: "1", script: "ImageViewer1.moveToFrame(1);" },
        { item: "1-3", value: "1", score: "0", script: "ImageViewer1.moveToFrame(3);" }
    ];

    var filteredTasks = this.presenter.filterTasks(tasks, "1", this.presenter.FILTER_FIELD.VALUE);

    assertEquals(expectedTasks, filteredTasks)
};

TasksFilteringTests.prototype.testFilterByEmptyValue = function() {
    var tasks = [
        { item: "1-1", value: "1", score: "1", script: "ImageViewer1.moveToFrame(1);" },
        { item: "1-2", value: "2", score: "1", script: "ImageViewer1.moveToFrame(2);" },
        { item: "1-3", value: "", score: "0", script: "ImageViewer1.moveToFrame(3);" },
        { item: "1-2", value: "", score: "0", script: "Feedback.change(TF-02)" }
    ];

    var expectedTasks = [
        { item: "1-3", value: "", score: "0", script: "ImageViewer1.moveToFrame(3);" },
        { item: "1-2", value: "", score: "0", script: "Feedback.change(TF-02)" }
    ];

    var filteredTasks = this.presenter.filterTasks(tasks, "", this.presenter.FILTER_FIELD.VALUE);

    assertEquals(expectedTasks, filteredTasks);
};

TasksFilteringTests.prototype.testFilterByValueWildcard = function() {
    var tasks = [
        { item: "1-1", value: "1", score: "1", script: "ImageViewer1.moveToFrame(1);" },
        { item: "1-3", value: "2", score: "0", script: "ImageViewer1.moveToFrame(3);" },
        { item: "1-2", value: "*", score: "0", script: "Feedback.change(TF-02)" }
    ];
    var expectedTasks = [
        { item: "1-1", value: "1", score: "1", script: "ImageViewer1.moveToFrame(1);" },
        { item: "1-2", value: "*", score: "0", script: "Feedback.change(TF-02)" }
    ];

    var filteredTasks = this.presenter.filterTasks(tasks, "1", this.presenter.FILTER_FIELD.VALUE);

    assertEquals(expectedTasks, filteredTasks);
};

TasksFilteringTests.prototype.testFilterByValueNoMatch = function() {
    var tasks = [
        { item: "1-1", value: "1", score: "1", script: "ImageViewer1.moveToFrame(1);" },
        { item: "1-2", value: "2", score: "1", script: "ImageViewer1.moveToFrame(2);" },
        { item: "1-3", value: "0", score: "0", script: "ImageViewer1.moveToFrame(3);" },
        { item: "1-2", value: "1", score: "0", script: "Feedback.change(TF-02)" }
    ];

    var filteredTasks = this.presenter.filterTasks(tasks, "3", this.presenter.FILTER_FIELD.VALUE);

    assertEquals([], filteredTasks);
};

TasksFilteringTests.prototype.testFilterByScore = function() {
    var tasks = [
        { item: "1-1", value: "1", score: "1", script: "ImageViewer1.moveToFrame(1);" },
        { item: "1-2", value: "2", score: "1", script: "ImageViewer1.moveToFrame(2);" },
        { item: "1-3", value: "1", score: "0", script: "ImageViewer1.moveToFrame(3);" },
        { item: "1-2", value: "0", score: "0", script: "Feedback.change(TF-02)" }
    ];
    var expectedTasks = [
        { item: "1-1", value: "1", score: "1", script: "ImageViewer1.moveToFrame(1);" },
        { item: "1-2", value: "2", score: "1", script: "ImageViewer1.moveToFrame(2);" }
    ];

    var filteredTasks = this.presenter.filterTasks(tasks, "1", this.presenter.FILTER_FIELD.SCORE);

    assertEquals(expectedTasks, filteredTasks)
};

TasksFilteringTests.prototype.testFilterByEmptyScore = function() {
    var tasks = [
        { item: "1-1", value: "1", score: "0", script: "ImageViewer1.moveToFrame(1);" },
        { item: "1-2", value: "2", score: "1", script: "ImageViewer1.moveToFrame(2);" },
        { item: "1-3", value: "1", score: "", script: "ImageViewer1.moveToFrame(3);" },
        { item: "1-2", value: "0", score: "", script: "Feedback.change(TF-02)" }
    ];

    var tasks = [
        { item: "1-3", value: "1", score: "", script: "ImageViewer1.moveToFrame(3);" },
        { item: "1-2", value: "0", score: "", script: "Feedback.change(TF-02)" }
    ];

    var filteredTasks = this.presenter.filterTasks(tasks, "", this.presenter.FILTER_FIELD.SCORE);

    assertEquals(tasks, filteredTasks);
};

TasksFilteringTests.prototype.testFilterByScoreWildcard = function() {
    var tasks = [
        { item: "1-1", value: "1", score: "1", script: "ImageViewer1.moveToFrame(1);" },
        { item: "1-2", value: "2", score: "2", script: "ImageViewer1.moveToFrame(2);" },
        { item: "1-3", value: "1", score: "3", script: "ImageViewer1.moveToFrame(3);" },
        { item: "1-2", value: "0", score: "*", script: "Feedback.change(TF-02)" }
    ];
    var expectedTasks = [
        { item: "1-1", value: "1", score: "1", script: "ImageViewer1.moveToFrame(1);" },
        { item: "1-2", value: "0", score: "*", script: "Feedback.change(TF-02)" }
    ];

    var filteredTasks = this.presenter.filterTasks(tasks, "1", this.presenter.FILTER_FIELD.SCORE);

    assertEquals(expectedTasks, filteredTasks);
};

TasksFilteringTests.prototype.testFilterByScoreNoMatch = function() {
    var tasks = [
        { item: "1-1", value: "1", score: "1", script: "ImageViewer1.moveToFrame(1);" },
        { item: "1-2", value: "2", score: "1", script: "ImageViewer1.moveToFrame(2);" },
        { item: "1-3", value: "1", score: "0", script: "ImageViewer1.moveToFrame(3);" },
        { item: "1-2", value: "0", score: "0", script: "Feedback.change(TF-02)" }
    ];

    var filteredTasks = this.presenter.filterTasks(tasks, "2", this.presenter.FILTER_FIELD.SCORE);

    assertEquals([], filteredTasks);
};

TasksFilteringTests.prototype.testMultipleWildcards = function() {
    var tasks = [
        { item: "Text-*-11-*", value: "1", score: "1", script: "ImageViewer1.moveToFrame(1);" },
        { item: "1-2", value: "0", score: "0", script: "Feedback.change(TF-02)" }
    ];
    var expectedTasks = [
        { item: "Text-*-11-*", value: "1", score: "1", script: "ImageViewer1.moveToFrame(1);" }
    ];

    var filteredTasks = this.presenter.filterTasks(tasks, "Text-2-11-33", this.presenter.FILTER_FIELD.ITEM);

    assertEquals(expectedTasks, filteredTasks);
};

TasksFilteringTests.prototype.testWildcardAtTheBeginning = function() {
    var tasks = [
        { item: "*-1", value: "1", score: "1", script: "ImageViewer1.moveToFrame(1);" },
        { item: "1-1", value: "0", score: "0", script: "Feedback.change(TF-02)" }
    ];
    var expectedTasks = [
        { item: "*-1", value: "1", score: "1", script: "ImageViewer1.moveToFrame(1);" },
        { item: "1-1", value: "0", score: "0", script: "Feedback.change(TF-02)" }
    ];

    var filteredTasks = this.presenter.filterTasks(tasks, "1-1", this.presenter.FILTER_FIELD.ITEM);

    assertEquals(expectedTasks, filteredTasks);
};

TasksFilteringTests.prototype.testWildcardAtTheEnd = function() {
    var tasks = [
        { item: "2-*", value: "1", score: "1", script: "ImageViewer1.moveToFrame(1);" },
        { item: "2-3", value: "0", score: "0", script: "Feedback.change(TF-02)" }
    ];
    var expectedTasks = [
        { item: "2-*", value: "1", score: "1", script: "ImageViewer1.moveToFrame(1);" }
    ];

    var filteredTasks = this.presenter.filterTasks(tasks, "2-2", this.presenter.FILTER_FIELD.ITEM);

    assertEquals(expectedTasks, filteredTasks);
};

TasksFilteringTests.prototype.testWildcardAtBothEnds = function() {
    var tasks = [
        { item: "*-*", value: "1", score: "1", script: "ImageViewer1.moveToFrame(1);" },
        { item: "2-3", value: "0", score: "0", script: "Feedback.change(TF-02)" }
    ];
    var expectedTasks = [
        { item: "*-*", value: "1", score: "1", script: "ImageViewer1.moveToFrame(1);" },
        { item: "2-3", value: "0", score: "0", script: "Feedback.change(TF-02)" }
    ];

    var filteredTasks = this.presenter.filterTasks(tasks, "2-3", this.presenter.FILTER_FIELD.ITEM);

    assertEquals(expectedTasks, filteredTasks);
};