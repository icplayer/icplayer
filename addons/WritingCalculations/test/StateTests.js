TestCase("[Writing Calculations] getState method tests", {
    'setUp' : function() {
        this.presenter = AddonWritingCalculations_create();
        this.presenter.correctAnswersList = [
            {"rowIndex" : 1, "cellIndex" : 1, "value" : "3"},
            {"rowIndex" : 2, "cellIndex" : 2, "value" : "5"}
        ];
        this.presenter.isVisible = true;
    },

    createView: function (elements) {
        const view = document.createElement("div");

        elements.forEach((element) => {
            view.append(element);
        });

        return $(view);
    },

    createHelpBoxContainer: function (row, cell, value) {
        return this.createContainer(row, cell, value,"container-helpBox");
    },

    createEmptyBoxContainer: function (row, cell, value) {
        return this.createContainer(row, cell, value, "container-emptyBox");
    },

    createContainer: function (row, cell, value, className) {
        const container = document.createElement("div");
        container.classList.add(className);

        const input = document.createElement("input");
        input.classList.add("writing-calculations-input");
        input.setAttribute("row", row);
        input.setAttribute("cell", cell);
        input.setAttribute("value", value);

        container.append(input);
        return container;
    },

    'test getState method when all answers are correct': function() {
        this.presenter.$view = this.createView([
            this.createEmptyBoxContainer("1", "1", "3"),
            this.createHelpBoxContainer("1", "2", "4"),
            this.createEmptyBoxContainer("2", "2", "5"),
            this.createHelpBoxContainer("2", "2", "19"),
        ]);
        const expectedState = JSON.stringify({
            "inputsData": {
                "values": [
                    "3",
                    "5"
                ],
                "correctAnswersCount": 2,
                "incorrectAnswersCount": 0
            },
            "helpBoxesInputsData": {
                "values": [
                    "4",
                    "19",
                ]
            },
            "isVisible": true
        });

        const resultState = this.presenter.getState();

        assertEquals(expectedState, resultState);
    },

    'test getState method when one answer is correct': function() {
        this.presenter.$view = this.createView([
            this.createEmptyBoxContainer("1", "1", "3"),
            this.createHelpBoxContainer("1", "2", "4"),
            this.createEmptyBoxContainer("2", "2", "4"),
            this.createHelpBoxContainer("2", "2", "19"),
        ]);
        const expectedState = JSON.stringify({
            "inputsData": {
                "values": [
                    "3",
                    "4"
                ],
                "correctAnswersCount": 1,
                "incorrectAnswersCount": 1
            },
            "helpBoxesInputsData": {
                "values": [
                    "4",
                    "19",
                ]
            },
            "isVisible": true
        });

        const resultState = this.presenter.getState();

        assertEquals(expectedState, resultState);
    },

    'test getState method when all answers are incorrect': function() {
        this.presenter.$view = this.createView([
            this.createEmptyBoxContainer("1", "1", "7"),
            this.createHelpBoxContainer("1", "2", "4"),
            this.createEmptyBoxContainer("2", "2", "4"),
            this.createHelpBoxContainer("2", "2", "19"),
        ]);
        const expectedState = JSON.stringify({
            "inputsData": {
                "values": [
                    "7",
                    "4"
                ],
                "correctAnswersCount": 0,
                "incorrectAnswersCount": 2
            },
            "helpBoxesInputsData": {
                "values": [
                    "4",
                    "19",
                ]
            },
            "isVisible": true
        });

        const resultState = this.presenter.getState();

        assertEquals(expectedState, resultState);
    },

    'test getState method when addon is not visible': function() {
        this.presenter.$view = this.createView([
            this.createEmptyBoxContainer("1", "1", "3"),
            this.createHelpBoxContainer("1", "2", "4"),
            this.createEmptyBoxContainer("2", "2", "4"),
            this.createHelpBoxContainer("2", "2", "19"),
        ]);
        this.presenter.isVisible = false;
        const expectedState = JSON.stringify({
            "inputsData": {
                "values": [
                    "3",
                    "4"
                ],
                "correctAnswersCount": 1,
                "incorrectAnswersCount": 1
            },
            "helpBoxesInputsData": {
                "values": [
                    "4",
                    "19",
                ]
            },
            "isVisible": false
        });

        const resultState = this.presenter.getState();

        assertEquals(expectedState, resultState);
    }
});

TestCase("[Writing Calculations] setState method tests", {
    'setUp' : function() {
        this.presenter = AddonWritingCalculations_create();
        this.presenter.isVisible = true;
        this.emptyBox1 = this.createEmptyBoxContainer("1", "1", "");
        this.emptyBox2 = this.createEmptyBoxContainer("2", "1", "");
        this.helpBox1 = this.createHelpBoxContainer("1", "2", "");
        this.helpBox2 = this.createHelpBoxContainer("2", "2", "");

        this.presenter.$view = this.createView([
            this.emptyBox1, this.helpBox1, this.emptyBox2, this.helpBox2
        ]);
        sinon.stub(this.presenter, "setVisibility");
    },

    tearDown: function () {
        this.presenter.setVisibility.restore();
    },

    createView: function (elements) {
        const view = document.createElement("div");

        elements.forEach((element) => {
            view.append(element);
        });

        return $(view);
    },

    createHelpBoxContainer: function (row, cell, value) {
        return this.createContainer(row, cell, value,"container-helpBox");
    },

    createEmptyBoxContainer: function (row, cell, value) {
        return this.createContainer(row, cell, value, "container-emptyBox");
    },

    createContainer: function (row, cell, value, className) {
        const container = document.createElement("div");
        container.classList.add(className);

        const input = document.createElement("input");
        input.classList.add("writing-calculations-input");
        input.setAttribute("row", row);
        input.setAttribute("cell", cell);
        input.setAttribute("value", value);

        container.append(input);
        return container;
    },

    validateElementValue: function (expectedValue, element) {
        assertEquals(expectedValue, $(element.firstChild).val());
    },

    'test setState method when all answers are correct': function() {
        const inputState = JSON.stringify({
            "inputsData": {
                "values": [
                    "3",
                    "5"
                ],
                "correctAnswersCount": 2,
                "incorrectAnswersCount": 0
            },
            "helpBoxesInputsData": {
                "values": [
                    "4",
                    "19",
                ]
            },
            "isVisible": true
        });

        this.presenter.setState(inputState);

        assertTrue(this.presenter.setVisibility.calledWith(true));
        assertTrue(this.presenter.isVisible);
        this.validateElementValue("3", this.emptyBox1);
        this.validateElementValue("5", this.emptyBox2);
        this.validateElementValue("4", this.helpBox1);
        this.validateElementValue("19", this.helpBox2);
    },

    'test setState method without helpBoxesInputsData ': function() {
        const inputState = JSON.stringify({
            "inputsData": {
                "values": [
                    "3",
                    "5"
                ],
                "correctAnswersCount": 2,
                "incorrectAnswersCount": 0
            },
            "isVisible": true
        });

        this.presenter.setState(inputState);

        assertTrue(this.presenter.setVisibility.calledWith(true));
        assertTrue(this.presenter.isVisible);
        this.validateElementValue("3", this.emptyBox1);
        this.validateElementValue("5", this.emptyBox2);
        this.validateElementValue("", this.helpBox1);
        this.validateElementValue("", this.helpBox2);
    },

    'test setState method without inputsData ': function() {
        const inputState = JSON.stringify({
            "helpBoxesInputsData": {
                "values": [
                    "4",
                    "19",
                ]
            },
            "isVisible": true
        });

        this.presenter.setState(inputState);

        assertTrue(this.presenter.setVisibility.calledWith(true));
        assertTrue(this.presenter.isVisible);
        this.validateElementValue("", this.emptyBox1);
        this.validateElementValue("", this.emptyBox2);
        this.validateElementValue("4", this.helpBox1);
        this.validateElementValue("19", this.helpBox2);
    },

    'test setState method without inputsData and helpBoxesInputsData': function() {
        const inputState = JSON.stringify({
            "isVisible": false
        });

        this.presenter.setState(inputState);

        assertTrue(this.presenter.setVisibility.calledWith(false));
        assertFalse(this.presenter.isVisible);
        this.validateElementValue("", this.emptyBox1);
        this.validateElementValue("", this.emptyBox2);
        this.validateElementValue("", this.helpBox1);
        this.validateElementValue("", this.helpBox2);
    },
});
