MatchingTasksFindingTests = TestCase("Event execution");

MatchingTasksFindingTests.prototype.setUp = function() {
    this.presenter = AddonConnector_create();
};

MatchingTasksFindingTests.prototype.testMatchForValue = function() {
    var tasks = [{
        source: "TrueFalse1",
        tasks: [
            { item: "1-1", value: "1", score: "*", script: "ImageViewer1.moveToFrame(0);" },
            { item: "1-1", value: "1", score: "", script: "ImageViewer1.moveToFrame(1);" },
            { item: "1-2", value: "1", score: "", script: "ImageViewer1.moveToFrame(2);" },
            { item: "1-3", value: "1", score: "", script: "ImageViewer1.moveToFrame(3);" },
            { item: "1-2", value: "0", score: "", script: "Feedback.change(TF-02)" },
            { item: "", value: "1", score: "", script: "ImageViewer1.moveToFrame(4);" },
            { item: "", value: "1", score: "*", script: "ImageViewer1.moveToFrame(5);" },
            { item: "*", value: "1", score: "", script: "ImageViewer1.moveToFrame(6);" },
            { item: "*", value: "1", score: "*", script: "ImageViewer1.moveToFrame(7);" }
        ]
    }, {
        source: "TrueFalse2",
        tasks: [
            { item: "", value: "", score: "1", script: "Audio1.play();" },
            { item: "", value: "", score: "0", script: "Audio2.play();" }
        ]
    }];
    var eventData = {
        source: "TrueFalse1",
        item: "1-1",
        value: "1",
        score: "1"
    };
    var expectedMatchingTasks = [
        "ImageViewer1.moveToFrame(0);",
        "ImageViewer1.moveToFrame(7);"
    ];

    var matchingTasks = this.presenter.findMatchingTasks(tasks, eventData);

    assertEquals(expectedMatchingTasks, matchingTasks);
};

MatchingTasksFindingTests.prototype.testWildcard = function() {
    var tasks = [{
        source: "TrueFalse1",
        tasks: [
            { item: "*-1", value: "*1", score: "*", script: "ImageViewer1.moveToFrame(1);" },
            { item: "*", value: "1*", score: "*", script: "ImageViewer1.moveToFrame(2);" },
            { item: "1-*", value: "*", score: "*", script: "ImageViewer1.moveToFrame(3);" },
            { item: "2-1", value: "", score: "", script: "ImageViewer1.moveToFrame(4);" }
        ]
    }];
    var eventData = {
        source: "TrueFalse1",
        item: "1-1",
        value: "1",
        score: "1"
    };
    var expectedMatchingTasks = [
        "ImageViewer1.moveToFrame(1);",
        "ImageViewer1.moveToFrame(2);",
        "ImageViewer1.moveToFrame(3);"
    ];

    var matchingTasks = this.presenter.findMatchingTasks(tasks, eventData);

    assertEquals(expectedMatchingTasks, matchingTasks);
};

MatchingTasksFindingTests.prototype.testCloseExpressions = function() {
    var tasks = [{
        source: "Text2",
        tasks: [
            { item: "1", value: "quietly", score: "*", script: 'feedback1.change("TEXT-GOOD-1");' },
            { item: "1", value: "quiet", score: "*", script: 'feedback1.change("TEXT-BAD-1");' },
            { item: "2", value: "late", score: "*", script: 'feedback1.change("TEXT-GOOD-2");' },
            { item: "2", value: "lately", score: "*", script: 'feedback1.change("TEXT-BAD-2");' },
            { item: "3", value: "hard", score: "*", script: 'feedback1.change("TEXT-GOOD-3");' },
            { item: "3", value: "hardly", score: "*", script: 'feedback1.change("TEXT-BAD-3");' },
            { item: "4", value: "highly", score: "*", script: 'feedback1.change("TEXT-BAD-4");' },
            { item: "4", value: "high", score: "*", script: 'feedback1.change("TEXT-GOOD-4");' },
            { item: "5", value: "hard", score: "*", script: 'feedback1.change("TEXT-BAD-5");' },
            { item: "5", value: "hardly", score: "*", script: 'feedback1.change("TEXT-GOOD-5");' },
            { item: "*", value: "---", score: "*", script: 'feedback1.change("TEXT-EMPTY");' }
        ]
    }];
    var eventData = {
        source: "Text2",
        item: "1",
        value: "quietly",
        score: "2"
    };
    var expectedMatchingTasks = [
        'feedback1.change("TEXT-GOOD-1");'
    ];

    var matchingTasks = this.presenter.findMatchingTasks(tasks, eventData);
    assertEquals(expectedMatchingTasks, matchingTasks);
};