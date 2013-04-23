TestCase("Gap content parsing", {
    setUp: function () {
        this.presenter = AddonTable_create();
    },

    'test gap with no content - empty curly braces': function () {
        var parsedGap = this.presenter.parseGapContent("");

        assertTrue(parsedGap.isValid);
        assertUndefined(parsedGap.errorCode);
        assertEquals([""], parsedGap.answers);
    },

    'test empty gap': function () {
        var parsedGap = this.presenter.parseGapContent(" \t ");

        assertTrue(parsedGap.isValid);
        assertEquals([" \t "], parsedGap.answers);
    },

    'test missing word after score separator': function () {
        var parsedGap = this.presenter.parseGapContent("3: ");

        assertTrue(parsedGap.isValid);
        assertEquals(["3: "], parsedGap.answers);
    },

    'test gap answer contains score separator': function () {
        var parsedGap = this.presenter.parseGapContent("1:answer1");

        assertTrue(parsedGap.isValid);
        assertEquals(["1:answer1"], parsedGap.answers);
    },

    'test gap with one answer (including space and score separator)': function () {
        var parsedGap = this.presenter.parseGapContent("1: answer1");

        assertTrue(parsedGap.isValid);
        assertEquals(["1: answer1"], parsedGap.answers);
    },

    'test gap with multiple answers (first one contains score separator': function () {
        var parsedGap = this.presenter.parseGapContent('1:answer1|answer2');

        assertTrue(parsedGap.isValid);
        assertEquals(["1:answer1", "answer2"], parsedGap.answers);
    },

    'test gap with multiple answers (including spaces and score separator)': function () {
        var parsedGap = this.presenter.parseGapContent('1: answer1|answer2 ');

        assertTrue(parsedGap.isValid);
        assertEquals(["1: answer1", "answer2 "], parsedGap.answers);
    },

    'test single answers but with score separator': function () {
        var parsedGap = this.presenter.parseGapContent(":answer1");

        assertTrue(parsedGap.isValid);
        assertEquals([":answer1"], parsedGap.answers);
    },

    'test missing answer after separator': function () {
        var parsedGap = this.presenter.parseGapContent('2:answer1|');

        assertTrue(parsedGap.isValid);
        assertEquals(["2:answer1"], parsedGap.answers);
    },

    'test score separator inside answer': function () {
        var parsedGap = this.presenter.parseGapContent('nan:answer1');

        assertTrue(parsedGap.isValid);
        assertEquals(["nan:answer1"], parsedGap.answers);
    },

    'test second answer is empty': function () {
        var parsedGap = this.presenter.parseGapContent("answer1|");

        assertTrue(parsedGap.isValid);
        assertEquals(["answer1"], parsedGap.answers);
    },

    'test gap definition inside another one': function () {
        var parsedGap = this.presenter.parseGapContent("\\gap{ bla bla bla");

        assertFalse(parsedGap.isValid);
    },

    'test score separator in first answer': function () {
        var parsedGap = this.presenter.parseGapContent(":answer1|answer2");

        assertFalse(parsedGap.isValid);
    },

    'test score separator in second answer': function () {
        var parsedGap = this.presenter.parseGapContent("answer1|:answer2");

        assertFalse(parsedGap.isValid);
    }
});

TestCase("Single cell gap parsing", {
    setUp: function () {
        this.presenter = AddonTable_create();
    },

    'test no gap definition': function () {
        var cellContent = "There is no gap here";

        var parsedCell = this.presenter.parseSingleCell(cellContent, 0, 'Table1', false);

        assertEquals(0, parsedCell.count);
        assertEquals(cellContent, parsedCell.content);
        assertEquals([], parsedCell.descriptions);
    },

    'test not valid gap definition': function () {
        var cellContent = "Here is the gap \\gap[:answer1}";

        var parsedCell = this.presenter.parseSingleCell(cellContent, 0, 'Table1', false);

        assertEquals(0, parsedCell.count);
        assertEquals(cellContent, parsedCell.content);
        assertEquals([], parsedCell.descriptions);
    },

    'test valid gap content': function () {
        var cellContent = "Here is the gap \\gap{3:answer1|answer2} and this is text after",
            expectedDescriptions = [
                { answers: ["3:answer1", "answer2"], id: "Table1-1", value: "", isEnabled: true }
            ];

        var parsedCell = this.presenter.parseSingleCell(cellContent, 0, 'Table1', false);

        assertEquals(1, parsedCell.count);
        assertEquals('Here is the gap <input id="Table1-1" class="ic_gap" /> and this is text after', parsedCell.content);
        assertEquals(expectedDescriptions, parsedCell.descriptions);
    },

    'test not first gap in table': function () {
        var cellContent = "Here is the gap \\gap{3:answer1|answer2} and this is text after",
            expectedDescriptions = [
                { answers: ["3:answer1", "answer2"], id: "Table1-3", value: "", isEnabled: true }
            ];

        var parsedCell = this.presenter.parseSingleCell(cellContent, 2, 'Table1', false);

        assertEquals(1, parsedCell.count);
        assertEquals('Here is the gap <input id="Table1-3" class="ic_gap" /> and this is text after', parsedCell.content);
        assertEquals(expectedDescriptions, parsedCell.descriptions);
    },

    'test multiple gaps': function () {
        var cellContent = "Here is the gap \\gap{3:answer1|answer2} and \\gap{2: answer20}",
            expectedDescriptions = [
            { answers: ["3:answer1", "answer2"], id: "Table1-1", value: "", isEnabled: true },
            { answers: ["2: answer20"], id: "Table1-2", value: "", isEnabled: true }
        ];

        var parsedCell = this.presenter.parseSingleCell(cellContent, 0, 'Table1', false);

        assertEquals(2, parsedCell.count);
        assertEquals('Here is the gap <input id="Table1-1" class="ic_gap" /> and <input id="Table1-2" class="ic_gap" />', parsedCell.content);
        assertEquals(expectedDescriptions, parsedCell.descriptions);
    },

    'test missing closing curly brace': function () {
        var cellContent = "Here is the gap \\gap{2:answer1";

        var parsedCell = this.presenter.parseSingleCell(cellContent, 0, 'Table1', false);

        assertEquals(0, parsedCell.count);
        assertEquals(cellContent, parsedCell.content);
        assertEquals([], parsedCell.descriptions);
    },

    'test error occurred during gap content parsing': function () {
        var cellContent = "Here is the gap \\gap{3:answer1|:some} and this is text after";

        var parsedCell = this.presenter.parseSingleCell(cellContent, 0, 'Table1', false);

        assertEquals(0, parsedCell.count);
        assertEquals(cellContent, parsedCell.content);
        assertEquals([], parsedCell.descriptions);
    },

    'test single valid gap with disable property selected': function () {
        var cellContent = "Here is the gap \\gap{3:answer1|answer2} and this is text after",
            expectedDescriptions = [
                { answers: ["3:answer1", "answer2"], id: "Table1-1", value: "", isEnabled: false }
            ];

        var parsedCell = this.presenter.parseSingleCell(cellContent, 0, 'Table1', true);

        assertEquals(1, parsedCell.count);
        assertEquals('Here is the gap <input id="Table1-1" class="ic_gap" disabled /> and this is text after', parsedCell.content);
        assertEquals(expectedDescriptions, parsedCell.descriptions);
    },

    'test multiple gaps with disable property selected': function () {
        var cellContent = "Here is the gap \\gap{3:answer1|answer2} and \\gap{2: answer20}",
            expectedDescriptions = [
                { answers: ["3:answer1", "answer2"], id: "Table1-1", value: "", isEnabled: false },
                { answers: ["2: answer20"], id: "Table1-2", value: "", isEnabled: false }
            ];

        var parsedCell = this.presenter.parseSingleCell(cellContent, 0, 'Table1', true);

        assertEquals(2, parsedCell.count);
        assertEquals('Here is the gap <input id="Table1-1" class="ic_gap" disabled /> and <input id="Table1-2" class="ic_gap" disabled />', parsedCell.content);
        assertEquals(expectedDescriptions, parsedCell.descriptions);
    }
});

TestCase("Table cells parsing", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.configuration = {
            addonID: 'Table1',
            isDisabled: false
        };

        sinon.stub(this.presenter, 'getCellContents');
    },

    tearDown: function () {
        this.presenter.getCellContents.restore();
    },

    'test no gaps present': function () {
        var cellContents = ["Content 1-1", "<img src=\"/file/serve/5282\">", "\\def{glos}", "Content 2-1", "<div>Content 2-3</div>", "Some text here also and later.."];

        this.presenter.getCellContents.returns(cellContents);

        var parseResult = this.presenter.parseGaps();

        assertEquals(cellContents, parseResult.content);
        assertEquals([], parseResult.descriptions);
    },

    'test single gap in table': function () {
        var cellContents = ["Content 1-1", "<img src=\"/file/serve/5282\">", "\\def{glos}", "Content 2-1", "<div>Content 2-3</div>", "Some text \\gap{} and later.."],
            expectedParseResult = ["Content 1-1", "<img src=\"/file/serve/5282\">", "\\def{glos}", "Content 2-1", "<div>Content 2-3</div>", "Some text <input id=\"Table1-1\" class=\"ic_gap\" /> and later.."],
            expectedDescriptions = [{ answers: [""], id: "Table1-1", value: "", isEnabled: true }];

        this.presenter.getCellContents.returns(cellContents);

        var parseResult = this.presenter.parseGaps();

        assertEquals(expectedParseResult, parseResult.content);
        assertEquals(expectedDescriptions, parseResult.descriptions);
    },

    'test multiple gaps in table': function () {
        var cellContents = [
                "Content 1-1", "<img src=\"/file/serve/5282\">", "\\def{glos}",
                "Content 2-1", "<div>Content 2-3</div>", "Some text \\gap{} and later..",
                "ERR \\gap{4:answ1|answ2|answ3", "\\gap{2:ans1}", "Cell with \\gap{} number of gaps \\gap{4:answ1|answ2|answ3}"],
            expectedParseResult = [
                "Content 1-1", "<img src=\"/file/serve/5282\">", "\\def{glos}",
                "Content 2-1", "<div>Content 2-3</div>", "Some text <input id=\"Table1-1\" class=\"ic_gap\" /> and later..",
                "ERR \\gap{4:answ1|answ2|answ3", "<input id=\"Table1-2\" class=\"ic_gap\" />", "Cell with <input id=\"Table1-3\" class=\"ic_gap\" /> number of gaps <input id=\"Table1-4\" class=\"ic_gap\" />"],
            expectedDescriptions = [
                { answers: [""], id: "Table1-1", value: "", isEnabled: true },
                { answers: ["2:ans1"], id: "Table1-2", value: "", isEnabled: true },
                { answers: [""], id: "Table1-3", value: "", isEnabled: true },
                { answers: ["4:answ1", "answ2", "answ3"], id: "Table1-4", value: "", isEnabled: true }
            ];

        this.presenter.getCellContents.returns(cellContents);

        var parseResult = this.presenter.parseGaps();

        assertEquals(expectedParseResult, parseResult.content);
        assertEquals(expectedDescriptions, parseResult.descriptions);
    },

    'test multiple gaps in table with disable property selected': function () {
        this.presenter.configuration.isDisabled = true;

        var cellContents = [
                "Content 1-1", "<img src=\"/file/serve/5282\">", "\\def{glos}",
                "Content 2-1", "<div>Content 2-3</div>", "Some text \\gap{} and later..",
                "ERR \\gap{4:answ1|answ2|answ3", "\\gap{2:ans1}", "Cell with \\gap{} number of gaps \\gap{4:answ1|answ2|answ3}"],
            expectedParseResult = [
                "Content 1-1", "<img src=\"/file/serve/5282\">", "\\def{glos}",
                "Content 2-1", "<div>Content 2-3</div>", "Some text <input id=\"Table1-1\" class=\"ic_gap\" disabled /> and later..",
                "ERR \\gap{4:answ1|answ2|answ3", "<input id=\"Table1-2\" class=\"ic_gap\" disabled />", "Cell with <input id=\"Table1-3\" class=\"ic_gap\" disabled /> number of gaps <input id=\"Table1-4\" class=\"ic_gap\" disabled />"],
            expectedDescriptions = [
                { answers: [""], id: "Table1-1", value: "", isEnabled: false },
                { answers: ["2:ans1"], id: "Table1-2", value: "", isEnabled: false },
                { answers: [""], id: "Table1-3", value: "", isEnabled: false },
                { answers: ["4:answ1", "answ2", "answ3"], id: "Table1-4", value: "", isEnabled: false }
            ];

        this.presenter.getCellContents.returns(cellContents);

        var parseResult = this.presenter.parseGaps();

        assertEquals(expectedParseResult, parseResult.content);
        assertEquals(expectedDescriptions, parseResult.descriptions);
    }
});