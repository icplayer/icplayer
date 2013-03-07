TestCase("Labels validation", {
    setUp: function () {
        this.presenter = AddonAnimation_create();
    },

    'test proper labels': function () {
        var labels = [{
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
        }];

        var validationResult = this.presenter.validateLabels(labels, 3);

        assertFalse(validationResult.isError);

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
    },

    'test undefined text': function () {
        var labels = [{
            Top: "0",
            Left: "0"
        }];

        var validationResult = this.presenter.validateLabels(labels, 3);

        assertTrue(validationResult.isError);
        assertEquals("L_01", validationResult.errorCode);
    },

    'test empty text': function () {
        var labels = [{
            Text: "",
            Top: "0",
            Left: "0"
        }];

        var validationResult = this.presenter.validateLabels(labels, 3);

        assertTrue(validationResult.isError);
        assertEquals("L_01", validationResult.errorCode);
    },

    'test top value undefined': function () {
        var labels = [{
            Text: "Label",
            Left: "0"
        }];

        var validationResult = this.presenter.validateLabels(labels, 3);

        assertTrue(validationResult.isError);
        assertEquals("L_02", validationResult.errorCode);
    },

    'test invalid top value': function () {
        var labels = [{
            Text: "Label",
            Top: "kaka",
            Left: "0"
        }];

        var validationResult = this.presenter.validateLabels(labels, 3);

        assertTrue(validationResult.isError);
        assertEquals("L_02", validationResult.errorCode);
    },

    'test left value undefined': function () {
        var labels = [{
            Text: "Label",
            Top: "10"
        }];

        var validationResult = this.presenter.validateLabels(labels, 3);

        assertTrue(validationResult.isError);
        assertEquals("L_03", validationResult.errorCode);
    },

    'test invalid left value': function () {
        var labels = [{
            Text: "Label",
            Top: "19",
            Left: "kaka"
        }];

        var validationResult = this.presenter.validateLabels(labels, 3);

        assertTrue(validationResult.isError);
        assertEquals("L_03", validationResult.errorCode);
    },

    'test empty labels': function () {
        var labels = [{
            Text: "",
            Top: "",
            Left: ""
        }];

        var validationResult = this.presenter.validateLabels(labels, 3);

        assertFalse(validationResult.isError);
        assertEquals(0, validationResult.labels.count);
    },

    'test empty second label': function () {
        var labels = [{
            Text: "Label no 1",
            Top: "0",
            Left: "0",
            Frames: "0"
        }, {
            Text: "",
            Top: "",
            Left: "",
            Frames: ""
        }];

        var validationResult = this.presenter.validateLabels(labels, 3);

        assertTrue(validationResult.isError);
        assertEquals("L_04", validationResult.errorCode);
    },

    'test frames list error': function () {
        var labels = [{
            Text: "Label no 1",
            Top: "0",
            Left: "0",
            Frames: "0,3-1"
        }];

        var validationResult = this.presenter.validateLabels(labels, 3);

        assertTrue(validationResult.isError);
        assertEquals("FL05", validationResult.errorCode);
    }
});