TestCase("[Writing Calculations] Scores Methods Tests", {
    'setUp' : function() {
        this.presenter = AddonWritingCalculations_create();
        this.presenter.correctAnswersList = [
            {"rowIndex" : 1, "cellIndex" : 1, "value" : "3"},
            {"rowIndex" : 2, "cellIndex" : 2, "value" : "5"}
        ];
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

    'test getPoints method when finding all': function() {
        this.presenter.$view = this.createView([
            this.createEmptyBoxContainer("1", "1", "3"),
            this.createHelpBoxContainer("1", "2", "4"),
            this.createEmptyBoxContainer("2", "2", "4"),
        ]);

        const answersCount = this.presenter.getPoints("all");

        assertEquals(2, answersCount);
    },

    'test getPoints method when finding correct': function() {
        this.presenter.$view = this.createView([
            this.createEmptyBoxContainer("1", "1", "3"),
            this.createHelpBoxContainer("1", "2", "4"),
            this.createEmptyBoxContainer("2", "2", "4"),
        ]);

        const correct = this.presenter.getPoints("correct");

        assertEquals(1, correct);
    },

    'test getPoints method when finding incorrect': function() {
        this.presenter.$view = this.createView([
            this.createEmptyBoxContainer("1", "1", "3"),
            this.createHelpBoxContainer("1", "2", "4"),
            this.createEmptyBoxContainer("2", "2", "4"),
        ]);

        const incorrect = this.presenter.getPoints("incorrect");

        assertEquals(1, incorrect);
    },

    'test getPoints method for empty field when finding all': function() {
        this.presenter.$view = this.createView([
            this.createEmptyBoxContainer("1", "1", "3"),
            this.createHelpBoxContainer("1", "2", "4"),
            this.createEmptyBoxContainer("2", "2", ""),
        ]);

        const answersCount = this.presenter.getPoints("all");

        assertEquals(2, answersCount);
    },

    'test getPoints method for empty field when finding correct': function() {
        this.presenter.$view = this.createView([
            this.createEmptyBoxContainer("1", "1", "3"),
            this.createHelpBoxContainer("1", "2", "4"),
            this.createEmptyBoxContainer("2", "2", ""),
        ]);

        const correct = this.presenter.getPoints("correct");

        assertEquals(1, correct);
    },

    'test getPoints method for empty field when finding incorrect': function() {
        this.presenter.$view = this.createView([
            this.createEmptyBoxContainer("1", "1", "3"),
            this.createHelpBoxContainer("1", "2", "4"),
            this.createEmptyBoxContainer("2", "2", ""),
        ]);

        const incorrect = this.presenter.getPoints("incorrect");

        assertEquals(0, incorrect);
    },

    'test allAnswersCorrect positive': function() {
        this.presenter.$view = this.createView([
            this.createEmptyBoxContainer("1", "1", "3"),
            this.createHelpBoxContainer("1", "2", "4"),
            this.createEmptyBoxContainer("2", "2", "5"),
        ]);

        const allAnswersCorrect = this.presenter.allAnswersCorrect();

        assertTrue(allAnswersCorrect);
    },

    'test allAnswersCorrect negative': function() {
        this.presenter.$view = this.createView([
            this.createEmptyBoxContainer("1", "1", "2"),
            this.createHelpBoxContainer("1", "2", "4"),
            this.createEmptyBoxContainer("2", "2", "5"),
        ]);

        const allAnswersCorrect = this.presenter.allAnswersCorrect();

        assertFalse(allAnswersCorrect);
    },

    'test allAnswersCorrect negative due to empty field': function() {
        this.presenter.$view = this.createView([
            this.createEmptyBoxContainer("1", "1", "3"),
            this.createHelpBoxContainer("1", "2", "4"),
            this.createEmptyBoxContainer("2", "2", ""),
        ]);

        const allAnswersCorrect = this.presenter.allAnswersCorrect();

        assertFalse(allAnswersCorrect);
    }
});
