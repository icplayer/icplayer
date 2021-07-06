function createCommonModel() {
    return {
        "ID": 'Table1',
        "Is Visible": "True",
        "keepOriginalOrder": "True",
        Rows: "2",
        Columns: "2",
        "Table cells": [],
        "Columns width": [
            {Width: "50%"},
            {Width: "40%"},
        ],
        "Rows height": [
            {Height: "50%"},
            {Height: "40%"}
        ],
        newWidthCalculate: 'True',
    };
}

function createModelTableCellsWith4NormalText() {
    return [
        {
            Row: "1",
            Column: "1",
            Content: "1"
        },
        {
            Row: "1",
            Column: "2",
            Content: "2"
        },
        {
            Row: "2",
            Column: "1",
            Content: "3"
        },
        {
            Row: "2",
            Column: "2",
            Content: "4"
        }
    ]
}

function createModelTableCellsWith4Gaps() {
    return [
        {
            Row: "1",
            Column: "1",
            Content: "\\gap{1}"
        },
        {
            Row: "1",
            Column: "2",
            Content: "\\gap{2}"
        },
        {
            Row: "2",
            Column: "1",
            Content: "\\gap{3}"
        },
        {
            Row: "2",
            Column: "2",
            Content: "\\gap{4}"
        }
    ]
}

function createModelTableCellsWith4FilledGaps() {
    return [
        {
            Row: "1",
            Column: "1",
            Content: "\\filledGap{null 1|1}"
        },
        {
            Row: "1",
            Column: "2",
            Content: "\\filledGap{null 2|2}"
        },
        {
            Row: "2",
            Column: "1",
            Content: "\\filledGap{null 3|3}"
        },
        {
            Row: "2",
            Column: "2",
            Content: "\\filledGap{null 4|4}"
        }
    ]
}

function createModelTableCellsWith4DropdownGaps() {
    return [
        {
            Row: "1",
            Column: "1",
            Content: "{{1:B1|C1|A1}}"
        },
        {
            Row: "1",
            Column: "2",
            Content: "{{1:B2|C2|A2}}"
        },
        {
            Row: "2",
            Column: "1",
            Content: "{{1:B3|C3|A3}}"
        },
        {
            Row: "2",
            Column: "2",
            Content: "{{1:B4|C4|A4}}"
        }
    ]
}


function createModelTableCellsWithMixed8Gaps() {
    return [
        {
            Row: "1",
            Column: "1",
            Content: "1"
        },
        {
            Row: "1",
            Column: "2",
            Content: "\\filledGap{null 2|2}"
        },
        {
            Row: "2",
            Column: "1",
            Content: "\\gap{3}"
        },
        {
            Row: "2",
            Column: "2",
            Content: "{{1:4|A4|B4}}"
        },
        {
            Row: "3",
            Column: "1",
            Content: "\\filledGap{null 5|5}"
        },
        {
            Row: "3",
            Column: "2",
            Content: "6"
        },
        {
            Row: "4",
            Column: "1",
            Content: "{{1:7|A7|B7}}"
        },
        {
            Row: "4",
            Column: "2",
            Content: "\\gap{8}"
        },
    ]
}

function createModelWith4NormalText() {
    const model = createCommonModel();
    model["Table cells"] = createModelTableCellsWith4NormalText();
    return model;
}

function createModelWith4Gaps() {
    const model = createCommonModel();
    model["Table cells"] = createModelTableCellsWith4Gaps();
    return model;
}

function createModelWith4FilledGaps() {
    const model = createCommonModel();
    model["Table cells"] = createModelTableCellsWith4FilledGaps();
    return model;
}

function createModelWith4DropdownGaps() {
    const model = createCommonModel();
    model["Table cells"] = createModelTableCellsWith4DropdownGaps();
    return model;
}

function createModelWithMixed8Gaps() {
    const model = createCommonModel();
    model["Rows"] = "4";
    model["Columns"] = "2";
    model["Table cells"] = createModelTableCellsWithMixed8Gaps();
    return model;
}

function createExpectedPrintableHTMLWith4Cells(
    cell1HTML, cell2HTML, cell3HTML, cell4HTML, mode) {
    return createExpectedPrintableHTMLWithNCells(
        mode, 2, 2,
        cell1HTML, cell2HTML, cell3HTML, cell4HTML
    )
}

function createExpectedPrintableHTMLWith8Cells(
    mode, cell1HTML, cell2HTML, cell3HTML, cell4HTML,
    cell5HTML, cell6HTML, cell7HTML, cell8HTML) {
    return createExpectedPrintableHTMLWithNCells(
        mode, 4, 2,
        cell1HTML, cell2HTML, cell3HTML, cell4HTML,
        cell5HTML, cell6HTML, cell7HTML, cell8HTML)
}

function getClassBasedOnMode(mode) {
    const PRINTABLE_STATE_MODE = {
        EMPTY: 0,
        SHOW_ANSWERS: 1,
        SHOW_USER_ANSWERS: 2,
        CHECK_ANSWERS: 3
    };
    switch (mode) {
        case PRINTABLE_STATE_MODE.EMPTY: {
            return "printable_addon_Table-empty-mode";
        }
        case PRINTABLE_STATE_MODE.SHOW_ANSWERS: {
            return "printable_addon_Table-show-answers";
        }
        case PRINTABLE_STATE_MODE.SHOW_USER_ANSWERS: {
            return "printable_addon_Table-show-user-answers";
        }
        case PRINTABLE_STATE_MODE.CHECK_ANSWERS: {
            return "printable_addon_Table-check-answers";
        }
    }

}

function createExpectedPrintableHTMLWithNCells(mode, rows_amount, cols_amount, ...args) {
    if (rows_amount * cols_amount !== args.length) {
        throw RangeError(`Expected ${rows_amount * cols_amount} args, got ${args.length}`);
    }

    const $mainStructureDiv = $('<div></div>');
    $mainStructureDiv.attr("id", "Table1");
    $mainStructureDiv.addClass("printable_addon_Table");
    $mainStructureDiv.addClass(getClassBasedOnMode(mode));
    $mainStructureDiv.addClass("printable_module");

    const $tableAddonWrapper = $('<div></div>');
    $tableAddonWrapper.addClass("table-addon-wrapper");
    $mainStructureDiv.append($tableAddonWrapper);

    const $table = $('<table></table>');
    $tableAddonWrapper.append($table);

    const $tableTBody = $('<tbody></tbody>');
    $table.append($tableTBody);

    for (let rowIdx = 0; rowIdx < rows_amount; rowIdx++) {
        const $row = $('<tr></tr>');
        $tableTBody.append($row);

        for (let colIdx = 0; colIdx < cols_amount; colIdx++) {
            const $col = $('<td></td>');
            $col.addClass("table_cell");
            $col.addClass("row_" + (rowIdx + 1) + " col_" + (colIdx + 1));
            $col.attr("colspan", "1");
            $col.attr("rowspan", "1");
            $col.html(args[rowIdx * cols_amount + colIdx]);
            $row.append($col);
        }
    }
    return $mainStructureDiv[0].outerHTML;
}

function isResetPrintableStateMode(presenter) {
    return presenter.printableStateMode === null;
}

function stubTextParser(presenter) {
    presenter.textParser = {
        parseAltTexts: sinon.stub(),
        findClosingBracket: (str) => str.indexOf("}") // this is a simplification for tests
    };
    presenter.textParser.parseAltTexts.returnsArg(0);
}

AsyncTestCase("[Table] GetPrintableHTML - without gaps", {
    setUp: function () {
        this.presenter = AddonTable_create();

        stubTextParser(this.presenter);

        this.model = createModelWith4NormalText();
        this.presenter.printableParserID = this.model['ID'];
    },

    setCallbacks: function (callbacks) {
        const callback = callbacks.add(function (result) {
            this.printableHTML = result;
        });
        this.presenter.setPrintableAsyncCallback(this.model['ID'], callback);
    },

    whenGettingPrintableHTML: function (showAnswers) {
        this.presenter.getPrintableHTML(this.model, showAnswers);
    },

    'test printable HTML for printable empty state mode': function (queue) {
        this.printableHTML = null;

        queue.call('Given callbacks set when getting printable html', function (callbacks) {
            this.setCallbacks(callbacks);
            this.whenGettingPrintableHTML(false);
        });

        queue.call('Then state is reset and proper html generated', function () {

            assertTrue(isResetPrintableStateMode(this.presenter));

            const cell1 = "1"
            const cell2 = "2"
            const cell3 = "3"
            const cell4 = "4"
            const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4, this.presenter.PRINTABLE_STATE_MODE.EMPTY);
            assertEquals(expectedHTML, this.printableHTML);
        });
    },

    'test printable HTML for printable show answers state mode': function (queue) {
        this.printableHTML = null;

        queue.call('Given callbacks set when getting printable html', function (callbacks) {
            this.setCallbacks(callbacks);
            this.whenGettingPrintableHTML(true);
        });

        queue.call('Then state is reset and proper html generated', function () {
            assertTrue(isResetPrintableStateMode(this.presenter));

            const cell1 = "1"
            const cell2 = "2"
            const cell3 = "3"
            const cell4 = "4"
            const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4, this.presenter.PRINTABLE_STATE_MODE.SHOW_ANSWERS);
            assertEquals(expectedHTML, this.printableHTML);
        });
    },
});

AsyncTestCase("[Table] GetPrintableHTML - only gaps", {
    setUp: function () {
        this.presenter = AddonTable_create();
        stubTextParser(this.presenter);

        this.model = createModelWith4Gaps();
        this.presenter.printableParserID = this.model['ID'];

        this.printableState = {
            gaps: [
                {value: "1"},
                {value: "2"},
                {value: "5"},
                {value: "6"},
            ]
        }
        this.emptyPrintableState = {
            gaps: [
                {value: ""},
                {value: ""},
                {value: ""},
                {value: ""},
            ]
        }
    },

        setCallbacks: function (callbacks) {
        const callback = callbacks.add(function (result) {
            this.printableHTML = result;
        });
        this.presenter.setPrintableAsyncCallback(this.model['ID'], callback);
    },

    whenGettingPrintableHTML: function (showAnswers) {
        this.presenter.getPrintableHTML(this.model, showAnswers);
    },

    'test printable HTML for printable empty state mode': function (queue) {
        this.printableHTML = null;

        queue.call('Given callbacks set when getting printable html', function (callbacks) {
            this.setCallbacks(callbacks);
            this.whenGettingPrintableHTML(false);
        });
        queue.call('Then state is reset and proper html generated', function () {

            assertTrue(isResetPrintableStateMode(this.presenter));

            const cell1 = "<span class=\"printable_gap\">&nbsp;&nbsp;</span>"
            const cell2 = "<span class=\"printable_gap\">&nbsp;&nbsp;</span>"
            const cell3 = "<span class=\"printable_gap\">&nbsp;&nbsp;</span>"
            const cell4 = "<span class=\"printable_gap\">&nbsp;&nbsp;</span>"
            const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4, this.presenter.PRINTABLE_STATE_MODE.EMPTY);
            assertEquals(expectedHTML, this.printableHTML);
        });
    },

    'test printable HTML for printable show answers state mode': function (queue) {
        this.printableHTML = null;

        queue.call('Given callbacks set when getting printable html', function (callbacks) {
            this.setCallbacks(callbacks);
            this.whenGettingPrintableHTML(true);
        });

        queue.call('Then state is reset and proper html generated', function () {

            assertTrue(isResetPrintableStateMode(this.presenter));

            const cell1 = "<span class=\"printable_gap\">1</span>"
            const cell2 = "<span class=\"printable_gap\">2</span>"
            const cell3 = "<span class=\"printable_gap\">3</span>"
            const cell4 = "<span class=\"printable_gap\">4</span>"
            const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4, this.presenter.PRINTABLE_STATE_MODE.SHOW_ANSWERS);
            assertEquals(expectedHTML, this.printableHTML);
        })
    },

    'test printable HTML for printable show user answers state mode': function (queue) {
        this.presenter.printableState = this.printableState;
        this.printableHTML = null;

        queue.call('Given callbacks set when getting printable html', function (callbacks) {
            this.setCallbacks(callbacks);
            this.whenGettingPrintableHTML(false);
        });
        queue.call('Then state is reset and proper html generated', function () {

            assertTrue(isResetPrintableStateMode(this.presenter));

            const cell1 = "<span class=\"printable_gap\">1</span>"
            const cell2 = "<span class=\"printable_gap\">2</span>"
            const cell3 = "<span class=\"printable_gap\">5</span>"
            const cell4 = "<span class=\"printable_gap\">6</span>"
            const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4, this.presenter.PRINTABLE_STATE_MODE.SHOW_USER_ANSWERS);
            assertEquals(expectedHTML, this.printableHTML);
        });
    },

    'test printable HTML for printable check answers state mode': function (queue) {
        this.presenter.printableState = this.printableState;
        this.printableHTML = null;

        queue.call('Given callbacks set when getting printable html', function (callbacks) {
            this.setCallbacks(callbacks);
            this.whenGettingPrintableHTML(true);
        });
        queue.call('Then state is reset and proper html generated', function () {

            assertTrue(isResetPrintableStateMode(this.presenter));

            const cell1 = "<span class=\"printable_gap\">1</span><span class=\"printable_gap_correct\"></span>"
            const cell2 = "<span class=\"printable_gap\">2</span><span class=\"printable_gap_correct\"></span>"
            const cell3 = "<span class=\"printable_gap\">5</span><span class=\"printable_gap_wrong\"></span>"
            const cell4 = "<span class=\"printable_gap\">6</span><span class=\"printable_gap_wrong\"></span>"
            const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4, this.presenter.PRINTABLE_STATE_MODE.CHECK_ANSWERS);
            assertEquals(expectedHTML, this.printableHTML);
        });
    },

    'test printable HTML for printable show user answers state mode when user do not answer': function (queue) {
        this.presenter.printableState = this.emptyPrintableState;
        this.printableHTML = null;

        queue.call('Given callbacks set when getting printable html', function (callbacks) {
            this.setCallbacks(callbacks);
            this.whenGettingPrintableHTML(false);
        });
        queue.call('Then state is reset and proper html generated', function () {

            assertTrue(isResetPrintableStateMode(this.presenter));

            const cell1 = "<span class=\"printable_gap\">&nbsp;&nbsp;</span>"
            const cell2 = "<span class=\"printable_gap\">&nbsp;&nbsp;</span>"
            const cell3 = "<span class=\"printable_gap\">&nbsp;&nbsp;</span>"
            const cell4 = "<span class=\"printable_gap\">&nbsp;&nbsp;</span>"
            const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4, this.presenter.PRINTABLE_STATE_MODE.SHOW_USER_ANSWERS);
            assertEquals(expectedHTML, this.printableHTML);
        });
    },

    'test printable HTML for printable check answers state mode when user do not answer': function (queue) {
        this.presenter.printableState = this.emptyPrintableState;
        this.printableHTML = null;

        queue.call('Given callbacks set when getting printable html', function (callbacks) {
            this.setCallbacks(callbacks);
            this.whenGettingPrintableHTML(true);
        });
        queue.call('Then state is reset and proper html generated', function () {

            assertTrue(isResetPrintableStateMode(this.presenter));

            const cell1 = "<span class=\"printable_gap\">&nbsp;&nbsp;</span>"
            const cell2 = "<span class=\"printable_gap\">&nbsp;&nbsp;</span>"
            const cell3 = "<span class=\"printable_gap\">&nbsp;&nbsp;</span>"
            const cell4 = "<span class=\"printable_gap\">&nbsp;&nbsp;</span>"
            const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4, this.presenter.PRINTABLE_STATE_MODE.CHECK_ANSWERS);
            assertEquals(expectedHTML, this.printableHTML);
        });
    },
});

AsyncTestCase("[Table] GetPrintableHTML - only filled gaps", {
    setUp: function () {
        this.presenter = AddonTable_create();
        stubTextParser(this.presenter);

        this.model = createModelWith4FilledGaps();
        this.presenter.printableParserID = this.model['ID'];

        this.printableState = {
            gaps: [
                {value: "1"},
                {value: "2"},
                {value: "5"},
                {value: "6"},
            ]
        }
        this.emptyPrintableState = {
            gaps: [
                {value: ""},
                {value: ""},
                {value: ""},
                {value: ""},
            ]
        }
    },

        setCallbacks: function (callbacks) {
        const callback = callbacks.add(function (result) {
            this.printableHTML = result;
        });
        this.presenter.setPrintableAsyncCallback(this.model['ID'], callback);
    },

    whenGettingPrintableHTML: function (showAnswers) {
        this.presenter.getPrintableHTML(this.model, showAnswers);
    },

    'test printable HTML for printable empty state mode': function (queue) {
        this.printableHTML = null;

        queue.call('Given callbacks set when getting printable html', function (callbacks) {
            this.setCallbacks(callbacks);
            this.whenGettingPrintableHTML(false);
        });
        queue.call('Then state is reset and proper html generated', function () {

            assertTrue(isResetPrintableStateMode(this.presenter));

            const cell1 = "<span class=\"printable_gap\">null 1</span>"
            const cell2 = "<span class=\"printable_gap\">null 2</span>"
            const cell3 = "<span class=\"printable_gap\">null 3</span>"
            const cell4 = "<span class=\"printable_gap\">null 4</span>"
            const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4, this.presenter.PRINTABLE_STATE_MODE.EMPTY);
            assertEquals(expectedHTML, this.printableHTML);
        });
    },

    'test printable HTML for printable show answers state mode': function (queue) {
        this.printableHTML = null;

        queue.call('Given callbacks set when getting printable html', function (callbacks) {
            this.setCallbacks(callbacks);
            this.whenGettingPrintableHTML(true);
        });
        queue.call('Then state is reset and proper html generated', function () {

            assertTrue(isResetPrintableStateMode(this.presenter));

            const cell1 = "<span class=\"printable_gap\">1</span>"
            const cell2 = "<span class=\"printable_gap\">2</span>"
            const cell3 = "<span class=\"printable_gap\">3</span>"
            const cell4 = "<span class=\"printable_gap\">4</span>"
            const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4, this.presenter.PRINTABLE_STATE_MODE.SHOW_ANSWERS);
            assertEquals(expectedHTML, this.printableHTML);
        });
    },

    'test printable HTML for printable show user answers state mode': function (queue) {
        this.presenter.printableState = this.printableState;
        this.printableHTML = null;

        queue.call('Given callbacks set when getting printable html', function (callbacks) {
            this.setCallbacks(callbacks);
            this.whenGettingPrintableHTML(false);
        });
        queue.call('Then state is reset and proper html generated', function () {

            assertTrue(isResetPrintableStateMode(this.presenter));

            const cell1 = "<span class=\"printable_gap\">1</span>"
            const cell2 = "<span class=\"printable_gap\">2</span>"
            const cell3 = "<span class=\"printable_gap\">5</span>"
            const cell4 = "<span class=\"printable_gap\">6</span>"
            const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4, this.presenter.PRINTABLE_STATE_MODE.SHOW_USER_ANSWERS);
            assertEquals(expectedHTML, this.printableHTML);
        });
    },

    'test printable HTML for printable check answers state mode': function (queue) {
        this.presenter.printableState = this.printableState;
        this.printableHTML = null;

        queue.call('Given callbacks set when getting printable html', function (callbacks) {
            this.setCallbacks(callbacks);
            this.whenGettingPrintableHTML(true);
        });
        queue.call('Then state is reset and proper html generated', function () {

            assertTrue(isResetPrintableStateMode(this.presenter));

            const cell1 = "<span class=\"printable_gap\">1</span><span class=\"printable_gap_correct\"></span>"
            const cell2 = "<span class=\"printable_gap\">2</span><span class=\"printable_gap_correct\"></span>"
            const cell3 = "<span class=\"printable_gap\">5</span><span class=\"printable_gap_wrong\"></span>"
            const cell4 = "<span class=\"printable_gap\">6</span><span class=\"printable_gap_wrong\"></span>"
            const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4, this.presenter.PRINTABLE_STATE_MODE.CHECK_ANSWERS);
            assertEquals(expectedHTML, this.printableHTML);
        });
    },

    'test printable HTML for printable show user answers state mode when user do not answer': function (queue) {
        this.presenter.printableState = this.emptyPrintableState;
        this.printableHTML = null;

        queue.call('Given callbacks set when getting printable html', function (callbacks) {
            this.setCallbacks(callbacks);
            this.whenGettingPrintableHTML(false);
        });
        queue.call('Then state is reset and proper html generated', function () {

            assertTrue(isResetPrintableStateMode(this.presenter));

            const cell1 = "<span class=\"printable_gap\">null 1</span>"
            const cell2 = "<span class=\"printable_gap\">null 2</span>"
            const cell3 = "<span class=\"printable_gap\">null 3</span>"
            const cell4 = "<span class=\"printable_gap\">null 4</span>"
            const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4, this.presenter.PRINTABLE_STATE_MODE.SHOW_USER_ANSWERS);
            assertEquals(expectedHTML, this.printableHTML);
        });
    },

    'test printable HTML for printable check answers state mode when user do not answer': function (queue) {
        this.presenter.printableState = this.emptyPrintableState;
        this.printableHTML = null;

        queue.call('Given callbacks set when getting printable html', function (callbacks) {
            this.setCallbacks(callbacks);
            this.whenGettingPrintableHTML(true);
        });
        queue.call('Then state is reset and proper html generated', function () {

            assertTrue(isResetPrintableStateMode(this.presenter));

            const cell1 = "<span class=\"printable_gap\">null 1</span>"
            const cell2 = "<span class=\"printable_gap\">null 2</span>"
            const cell3 = "<span class=\"printable_gap\">null 3</span>"
            const cell4 = "<span class=\"printable_gap\">null 4</span>"
            const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4, this.presenter.PRINTABLE_STATE_MODE.CHECK_ANSWERS);
            assertEquals(expectedHTML, this.printableHTML);
        });
    },
});

AsyncTestCase("[Table] GetPrintableHTML - only dropdown gaps", {
    setUp: function () {
        this.presenter = AddonTable_create();
        stubTextParser(this.presenter);
        this.model = createModelWith4DropdownGaps();
        this.presenter.printableParserID = this.model['ID'];

        this.printableState = {
            gaps: [
                {value: "B1"},
                {value: "B2"},
                {value: "C3"},
                {value: "A4"},
            ]
        }
        this.emptyPrintableState = {
            gaps: [
                {value: ""},
                {value: ""},
                {value: ""},
                {value: ""},
            ]
        }
    },

        setCallbacks: function (callbacks) {
        const callback = callbacks.add(function (result) {
            this.printableHTML = result;
        });
        this.presenter.setPrintableAsyncCallback(this.model['ID'], callback);
    },

    whenGettingPrintableHTML: function (showAnswers) {
        this.presenter.getPrintableHTML(this.model, showAnswers);
    },

    'test printable HTML for printable empty state mode': function (queue) {
        this.printableHTML = null;

        queue.call('Given callbacks set when getting printable html', function (callbacks) {
            this.setCallbacks(callbacks);
            this.whenGettingPrintableHTML(false);
        });
        queue.call('Then state is reset and proper html generated', function () {

            assertTrue(isResetPrintableStateMode(this.presenter));

            const cell1 = "B1 / C1 / A1"
            const cell2 = "B2 / C2 / A2"
            const cell3 = "B3 / C3 / A3"
            const cell4 = "B4 / C4 / A4"
            const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4, this.presenter.PRINTABLE_STATE_MODE.EMPTY);
            assertEquals(expectedHTML, this.printableHTML);
        });
    },

    'test printable HTML for printable show answers state mode': function (queue) {
        this.printableHTML = null;

        queue.call('Given callbacks set when getting printable html', function (callbacks) {
            this.setCallbacks(callbacks);
            this.whenGettingPrintableHTML(true);
        });
        queue.call('Then state is reset and proper html generated', function () {

            assertTrue(isResetPrintableStateMode(this.presenter));

            const cell1 = "<span class=\"printable_gap\">B1</span> / C1 / A1"
            const cell2 = "<span class=\"printable_gap\">B2</span> / C2 / A2"
            const cell3 = "<span class=\"printable_gap\">B3</span> / C3 / A3"
            const cell4 = "<span class=\"printable_gap\">B4</span> / C4 / A4"
            const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4, this.presenter.PRINTABLE_STATE_MODE.SHOW_ANSWERS);
            assertEquals(expectedHTML, this.printableHTML);
        });
    },

    'test printable HTML for printable show user answers state mode': function (queue) {
        this.presenter.printableState = this.printableState;
        this.printableHTML = null;

        queue.call('Given callbacks set when getting printable html', function (callbacks) {
            this.setCallbacks(callbacks);
            this.whenGettingPrintableHTML(false);
        });
        queue.call('Then state is reset and proper html generated', function () {

            assertTrue(isResetPrintableStateMode(this.presenter));

            const cell1 = "<span class=\"printable_gap\">B1</span> / C1 / A1"
            const cell2 = "<span class=\"printable_gap\">B2</span> / C2 / A2"
            const cell3 = "B3 / <span class=\"printable_gap\">C3</span> / A3"
            const cell4 = "B4 / C4 / <span class=\"printable_gap\">A4</span>"
            const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4, this.presenter.PRINTABLE_STATE_MODE.SHOW_USER_ANSWERS);
            assertEquals(expectedHTML, this.printableHTML);
        });
    },

    'test printable HTML for printable check answers state mode': function (queue) {
        this.presenter.printableState = this.printableState;
        this.printableHTML = null;

        queue.call('Given callbacks set when getting printable html', function (callbacks) {
            this.setCallbacks(callbacks);
            this.whenGettingPrintableHTML(true);
        });
        queue.call('Then state is reset and proper html generated', function () {

            assertTrue(isResetPrintableStateMode(this.presenter));

            const cell1 = "<span class=\"printable_gap\">B1</span> / C1 / A1<span class=\"printable_gap_correct\"></span>"
            const cell2 = "<span class=\"printable_gap\">B2</span> / C2 / A2<span class=\"printable_gap_correct\"></span>"
            const cell3 = "B3 / <span class=\"printable_gap\">C3</span> / A3<span class=\"printable_gap_wrong\"></span>"
            const cell4 = "B4 / C4 / <span class=\"printable_gap\">A4</span><span class=\"printable_gap_wrong\"></span>"
            const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4, this.presenter.PRINTABLE_STATE_MODE.CHECK_ANSWERS);
            assertEquals(expectedHTML, this.printableHTML);
        });
    },

    'test printable HTML for printable show user answers state mode when user do not answer': function (queue) {
        this.presenter.printableState = this.emptyPrintableState;
        this.printableHTML = null;

        queue.call('Given callbacks set when getting printable html', function (callbacks) {
            this.setCallbacks(callbacks);
            this.whenGettingPrintableHTML(false);
        });
        queue.call('Then state is reset and proper html generated', function () {

            assertTrue(isResetPrintableStateMode(this.presenter));

            const cell1 = "B1 / C1 / A1"
            const cell2 = "B2 / C2 / A2"
            const cell3 = "B3 / C3 / A3"
            const cell4 = "B4 / C4 / A4"
            const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4, this.presenter.PRINTABLE_STATE_MODE.SHOW_USER_ANSWERS);
            assertEquals(expectedHTML, this.printableHTML);
        });
    },

    'test printable HTML for printable check answers state mode when user do not answer': function (queue) {
        this.presenter.printableState = this.emptyPrintableState;
        this.printableHTML = null;

        queue.call('Given callbacks set when getting printable html', function (callbacks) {
            this.setCallbacks(callbacks);
            this.whenGettingPrintableHTML(true);
        });
        queue.call('Then state is reset and proper html generated', function () {

            assertTrue(isResetPrintableStateMode(this.presenter));

            const cell1 = "B1 / C1 / A1</span>"
            const cell2 = "B2 / C2 / A2</span>"
            const cell3 = "B3 / C3 / A3</span>"
            const cell4 = "B4 / C4 / A4</span>"
            const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4, this.presenter.PRINTABLE_STATE_MODE.CHECK_ANSWERS);
            assertEquals(expectedHTML, this.printableHTML);
        });
    },

    'test printable HTML for printable empty state mode when not keep original order': function (queue) {
        this.model["keepOriginalOrder"] = "False";
        this.printableHTML = null;

        queue.call('Given callbacks set when getting printable html', function (callbacks) {
            this.setCallbacks(callbacks);
            this.whenGettingPrintableHTML(false);
        });
        queue.call('Then state is reset and proper html generated', function () {

            assertTrue(isResetPrintableStateMode(this.presenter));

            const cell1 = "A1 / B1 / C1"
            const cell2 = "A2 / B2 / C2"
            const cell3 = "A3 / B3 / C3"
            const cell4 = "A4 / B4 / C4"
            const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4, this.presenter.PRINTABLE_STATE_MODE.EMPTY);
            assertEquals(expectedHTML, this.printableHTML);
        });
    },

    'test printable HTML for printable show answers state mode when not keep original order': function (queue) {
        this.model["keepOriginalOrder"] = "False";
        this.printableHTML = null;

        queue.call('Given callbacks set when getting printable html', function (callbacks) {
            this.setCallbacks(callbacks);
            this.whenGettingPrintableHTML(true);
        });
        queue.call('Then state is reset and proper html generated', function () {

            assertTrue(isResetPrintableStateMode(this.presenter));

            const cell1 = "A1 / <span class=\"printable_gap\">B1</span> / C1"
            const cell2 = "A2 / <span class=\"printable_gap\">B2</span> / C2"
            const cell3 = "A3 / <span class=\"printable_gap\">B3</span> / C3"
            const cell4 = "A4 / <span class=\"printable_gap\">B4</span> / C4"
            const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4, this.presenter.PRINTABLE_STATE_MODE.SHOW_ANSWERS);
            assertEquals(expectedHTML, this.printableHTML);
        });
    },

    'test printable HTML for printable show user answers state mode when not keep original order': function (queue) {
        this.model["keepOriginalOrder"] = "False";
        this.presenter.printableState = this.printableState;
        this.printableHTML = null;

        queue.call('Given callbacks set when getting printable html', function (callbacks) {
            this.setCallbacks(callbacks);
            this.whenGettingPrintableHTML(false);
        });
        queue.call('Then state is reset and proper html generated', function () {

            assertTrue(isResetPrintableStateMode(this.presenter));

            const cell1 = "A1 / <span class=\"printable_gap\">B1</span> / C1"
            const cell2 = "A2 / <span class=\"printable_gap\">B2</span> / C2"
            const cell3 = "A3 / B3 / <span class=\"printable_gap\">C3</span>"
            const cell4 = "<span class=\"printable_gap\">A4</span> / B4 / C4"
            const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4, this.presenter.PRINTABLE_STATE_MODE.SHOW_USER_ANSWERS);
            assertEquals(expectedHTML, this.printableHTML);
        });
    },

    'test printable HTML for printable check answers state mode when not keep original order': function (queue) {
        this.model["keepOriginalOrder"] = "False";
        this.presenter.printableState = this.printableState;
        this.printableHTML = null;

        queue.call('Given callbacks set when getting printable html', function (callbacks) {
            this.setCallbacks(callbacks);
            this.whenGettingPrintableHTML(true);
        });
        queue.call('Then state is reset and proper html generated', function () {

            assertTrue(isResetPrintableStateMode(this.presenter));

            const cell1 = "A1 / <span class=\"printable_gap\">B1</span> / C1<span class=\"printable_gap_correct\"></span>"
            const cell2 = "A2 / <span class=\"printable_gap\">B2</span> / C2<span class=\"printable_gap_correct\"></span>"
            const cell3 = "A3 / B3 / <span class=\"printable_gap\">C3</span><span class=\"printable_gap_wrong\"></span>"
            const cell4 = "<span class=\"printable_gap\">A4</span> / B4 / C4<span class=\"printable_gap_wrong\"></span>"
            const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4, this.presenter.PRINTABLE_STATE_MODE.CHECK_ANSWERS);
            assertEquals(expectedHTML, this.printableHTML);
        })
    },
});

AsyncTestCase("[Table] GetPrintableHTML - mixed gaps", {
    setUp: function () {
        this.presenter = AddonTable_create();
        stubTextParser(this.presenter);

        this.model = createModelWithMixed8Gaps();
        this.presenter.printableParserID = this.model['ID'];
        this.printableState = {
            gaps: [
                {value: "2"},
                {value: "3"},
                {value: "some value 5"},
                {value: "some value 8"},
                {value: "4"},
                {value: "A7"},
            ]
        }
        this.emptyPrintableState = {
            gaps: [
                {value: ""},
                {value: ""},
                {value: ""},
                {value: ""},
                {value: ""},
                {value: ""},
            ]
        }
    },

    setCallbacks: function (callbacks) {
        const callback = callbacks.add(function (result) {
            this.printableHTML = result;
        });
        this.presenter.setPrintableAsyncCallback(this.model['ID'], callback);
    },

    whenGettingPrintableHTML: function (showAnswers) {
        this.presenter.getPrintableHTML(this.model, showAnswers);
    },

    'test printable HTML for printable empty state mode': function (queue) {
        this.printableHTML = null;

        queue.call('Given callbacks set when getting printable html', function (callbacks) {
            this.setCallbacks(callbacks);
            this.whenGettingPrintableHTML(false);
        });

        queue.call('Then state is reset and proper html generated', function () {
            assertTrue(isResetPrintableStateMode(this.presenter));

            const cell1 = "1"
            const cell2 = "<span class=\"printable_gap\">null 2</span>"
            const cell3 = "<span class=\"printable_gap\">&nbsp;&nbsp;</span>"
            const cell4 = "4 / A4 / B4"
            const cell5 = "<span class=\"printable_gap\">null 5</span>"
            const cell6 = "6"
            const cell7 = "7 / A7 / B7"
            const cell8 = "<span class=\"printable_gap\">&nbsp;&nbsp;</span>"
            const expectedHTML = createExpectedPrintableHTMLWith8Cells(
                this.presenter.PRINTABLE_STATE_MODE.EMPTY, cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8);
            assertEquals(expectedHTML, this.printableHTML);
        });
    },

    'test printable HTML for printable show answers state mode': function (queue) {
        this.printableHTML = null;

        queue.call('Given callbacks set when getting printable html', function (callbacks) {
            this.setCallbacks(callbacks);
            this.whenGettingPrintableHTML(true);
        });
        queue.call('Then state is reset and proper html generated', function () {

            assertTrue(isResetPrintableStateMode(this.presenter));

            const cell1 = "1"
            const cell2 = "<span class=\"printable_gap\">2</span>"
            const cell3 = "<span class=\"printable_gap\">3</span>"
            const cell4 = "<span class=\"printable_gap\">4</span> / A4 / B4"
            const cell5 = "<span class=\"printable_gap\">5</span>"
            const cell6 = "6"
            const cell7 = "<span class=\"printable_gap\">7</span> / A7 / B7"
            const cell8 = "<span class=\"printable_gap\">8</span>"
            const expectedHTML = createExpectedPrintableHTMLWith8Cells(
                this.presenter.PRINTABLE_STATE_MODE.SHOW_ANSWERS, cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8
            );

            assertEquals(expectedHTML, this.printableHTML);
        });
    },

    'test printable HTML for printable show user answers state mode': function (queue) {
        this.printableHTML = null;
        this.presenter.printableState = this.printableState;

        queue.call('Given callbacks set when getting printable html', function (callbacks) {
            this.setCallbacks(callbacks);
            this.whenGettingPrintableHTML(false);
        });
        queue.call('Then state is reset and proper html generated', function () {

            assertTrue(isResetPrintableStateMode(this.presenter));

            const cell1 = "1"
            const cell2 = "<span class=\"printable_gap\">2</span>"
            const cell3 = "<span class=\"printable_gap\">3</span>"
            const cell4 = "<span class=\"printable_gap\">4</span> / A4 / B4"
            const cell5 = "<span class=\"printable_gap\">some value 5</span>"
            const cell6 = "6"
            const cell7 = "7 / <span class=\"printable_gap\">A7</span> / B7"
            const cell8 = "<span class=\"printable_gap\">some value 8</span>"
            const expectedHTML = createExpectedPrintableHTMLWith8Cells(
                this.presenter.PRINTABLE_STATE_MODE.SHOW_USER_ANSWERS, cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8);
            assertEquals(expectedHTML, this.printableHTML);
        });
    },

    'test printable HTML for printable check answers state mode': function (queue) {
        this.printableHTML = null;

        this.presenter.printableState = this.printableState;
        queue.call('Given callbacks set when getting printable html', function (callbacks) {
            this.setCallbacks(callbacks);
            this.whenGettingPrintableHTML(true);
        });

        queue.call('Then state is reset and proper html generated', function () {

            assertTrue(isResetPrintableStateMode(this.presenter));

            const cell1 = "1"
            const cell2 = "<span class=\"printable_gap\">2</span><span class=\"printable_gap_correct\"></span>"
            const cell3 = "<span class=\"printable_gap\">3</span><span class=\"printable_gap_correct\"></span>"
            const cell4 = "<span class=\"printable_gap\">4</span> / A4 / B4<span class=\"printable_gap_correct\"></span>"
            const cell5 = "<span class=\"printable_gap\">some value 5</span><span class=\"printable_gap_wrong\"></span>"
            const cell6 = "6"
            const cell7 = "7 / <span class=\"printable_gap\">A7</span> / B7<span class=\"printable_gap_wrong\"></span>"
            const cell8 = "<span class=\"printable_gap\">some value 8</span><span class=\"printable_gap_wrong\"></span>"
            const expectedHTML = createExpectedPrintableHTMLWith8Cells(
                this.presenter.PRINTABLE_STATE_MODE.CHECK_ANSWERS, cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8
            );
            assertEquals(expectedHTML, this.printableHTML);
        });
    }


});
