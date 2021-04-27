const createCommonModel = function () {
    return {
        "ID": 'Table1',
        "Is Visible": "True",
        "keepOriginalOrder": "True",
        Rows: "2",
        Columns: "2",
        "Table cells": [],
        "Columns width": [
            { Width: "50%" },
            { Width: "40%" },
        ],
        "Rows height": [
            { Height: "50%" },
            { Height: "40%" }
        ],
        newWidthCalculate : 'True',
    };
}

const createModelTableCellsWith4NormalText = function () {
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

const createModelTableCellsWith4Gaps = function () {
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

const createModelTableCellsWith4FilledGaps = function () {
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

const createModelTableCellsWith4DropdownGaps = function () {
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


const createModelTableCellsWithMixed8Gaps = function () {
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

const createModelWith4NormalText = function () {
    var model = createCommonModel();
    model["Table cells"] = createModelTableCellsWith4NormalText();
    return model;
}

const createModelWith4Gaps = function () {
    var model = createCommonModel();
    model["Table cells"] = createModelTableCellsWith4Gaps();
    return model;
}

const createModelWith4FilledGaps = function () {
    var model = createCommonModel();
    model["Table cells"] = createModelTableCellsWith4FilledGaps();
    return model;
}

const createModelWith4DropdownGaps = function () {
    var model = createCommonModel();
    model["Table cells"] = createModelTableCellsWith4DropdownGaps();
    return model;
}

const createModelWithMixed8Gaps = function () {
    var model = createCommonModel();
    model["Rows"] = "4";
    model["Columns"] = "2";
    model["Table cells"] = createModelTableCellsWithMixed8Gaps();
    return model;
}

const createExpectedPrintableHTMLWith4Cells = function (
    cell1HTML, cell2HTML, cell3HTML, cell4HTML) {
    return createExpectedPrintableHTMLWithNCells(
        2, 2,
        cell1HTML, cell2HTML, cell3HTML, cell4HTML)
}

const createExpectedPrintableHTMLWith8Cells = function (
    cell1HTML, cell2HTML, cell3HTML, cell4HTML,
    cell5HTML, cell6HTML, cell7HTML, cell8HTML) {
    return createExpectedPrintableHTMLWithNCells(
        4, 2,
        cell1HTML, cell2HTML, cell3HTML, cell4HTML,
        cell5HTML, cell6HTML, cell7HTML, cell8HTML)
}

const createExpectedPrintableHTMLWithNCells = function (rows_amount, cols_amount, ...args) {
    if (rows_amount * cols_amount !== args.length)
        throw RangeError();

    var $mainStructureDiv = $('<div></div>');
    $mainStructureDiv.attr("id", "Table1");
    $mainStructureDiv.addClass("printable_addon_Table");

    var $tableAddonWrapper = $('<div></div>');
    $tableAddonWrapper.addClass("table-addon-wrapper");
    $mainStructureDiv.append($tableAddonWrapper);

    var $table = $('<table></table>');
    $tableAddonWrapper.append($table);

    var $tableTBody = $('<tbody></tbody>');
    $table.append($tableTBody);

    for (var rowIdx = 0; rowIdx < rows_amount; rowIdx++) {
        var $row = $('<tr></tr>');
        $tableTBody.append($row);

        for (var colIdx = 0; colIdx < cols_amount; colIdx++) {
            var $col = $('<td></td>');
            $col.addClass("row_" + (rowIdx + 1) + " col_" + (colIdx + 1));
            $col.attr("colspan", "1");
            $col.attr("rowspan", "1");
            $col.html(args[rowIdx * cols_amount + colIdx]);
            $row.append($col);
        }
    }
    return $mainStructureDiv[0].outerHTML;
}

const isResetPrintableStateMode = function(presenter) {
    return presenter.printableStateMode === null;
}

TestCase("[Table] GetPrintableHTML - without gaps", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.model = createModelWith4NormalText();
    },

    'test printable HTML for printable empty state mode': function () {
        const printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertTrue(isResetPrintableStateMode(this.presenter));

        const cell1 = "1"
        const cell2 = "2"
        const cell3 = "3"
        const cell4 = "4"
        const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4);
        assertEquals(expectedHTML, printableHTML);
    },

    'test printable HTML for printable show answers state mode': function () {
        const printableHTML = this.presenter.getPrintableHTML(this.model, true);

        assertTrue(isResetPrintableStateMode(this.presenter));

        const cell1 = "1"
        const cell2 = "2"
        const cell3 = "3"
        const cell4 = "4"
        const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4);
        assertEquals(expectedHTML, printableHTML);
    },
});

TestCase("[Table] GetPrintableHTML - only gaps", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.model = createModelWith4Gaps();
        this.printableState = {
            gaps: [
                { value: "1" },
                { value: "2" },
                { value: "5" },
                { value: "6" },
            ]
        }
        this.emptyPrintableState = {
            gaps: [
                { value: "" },
                { value: "" },
                { value: "" },
                { value: "" },
            ]
        }
    },

    'test printable HTML for printable empty state mode': function () {
        const printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertTrue(isResetPrintableStateMode(this.presenter));

        const cell1 = "<span class=\"printable_gap\">&nbsp;&nbsp;</span>"
        const cell2 = "<span class=\"printable_gap\">&nbsp;&nbsp;</span>"
        const cell3 = "<span class=\"printable_gap\">&nbsp;&nbsp;</span>"
        const cell4 = "<span class=\"printable_gap\">&nbsp;&nbsp;</span>"
        const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4);
        assertEquals(expectedHTML, printableHTML);
    },

    'test printable HTML for printable show answers state mode': function () {
        const printableHTML = this.presenter.getPrintableHTML(this.model, true);

        assertTrue(isResetPrintableStateMode(this.presenter));

        const cell1 = "<span class=\"printable_gap\">1</span>"
        const cell2 = "<span class=\"printable_gap\">2</span>"
        const cell3 = "<span class=\"printable_gap\">3</span>"
        const cell4 = "<span class=\"printable_gap\">4</span>"
        const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4);
        assertEquals(expectedHTML, printableHTML);
    },

    'test printable HTML for printable show user answers state mode': function () {
        this.presenter.printableState = this.printableState;
        const printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertTrue(isResetPrintableStateMode(this.presenter));

        const cell1 = "<span class=\"printable_gap\">1</span>"
        const cell2 = "<span class=\"printable_gap\">2</span>"
        const cell3 = "<span class=\"printable_gap\">5</span>"
        const cell4 = "<span class=\"printable_gap\">6</span>"
        const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4);
        assertEquals(expectedHTML, printableHTML);
    },

    'test printable HTML for printable check answers state mode': function () {
        this.presenter.printableState = this.printableState;
        const printableHTML = this.presenter.getPrintableHTML(this.model, true);

        assertTrue(isResetPrintableStateMode(this.presenter));

        const cell1 = "<span class=\"printable_gap\">1</span><span class=\"printable_gap_correct\"></span>"
        const cell2 = "<span class=\"printable_gap\">2</span><span class=\"printable_gap_correct\"></span>"
        const cell3 = "<span class=\"printable_gap\">5</span><span class=\"printable_gap_wrong\"></span>"
        const cell4 = "<span class=\"printable_gap\">6</span><span class=\"printable_gap_wrong\"></span>"
        const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4);
        assertEquals(expectedHTML, printableHTML);
    },

    'test printable HTML for printable show user answers state mode when user do not answer': function () {
        this.presenter.printableState = this.emptyPrintableState;
        const printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertTrue(isResetPrintableStateMode(this.presenter));

        const cell1 = "<span class=\"printable_gap\"></span>"
        const cell2 = "<span class=\"printable_gap\"></span>"
        const cell3 = "<span class=\"printable_gap\"></span>"
        const cell4 = "<span class=\"printable_gap\"></span>"
        const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4);
        assertEquals(expectedHTML, printableHTML);
    },

    'test printable HTML for printable check answers state mode when user do not answer': function () {
        this.presenter.printableState = this.emptyPrintableState;
        const printableHTML = this.presenter.getPrintableHTML(this.model, true);

        assertTrue(isResetPrintableStateMode(this.presenter));

        const cell1 = "<span class=\"printable_gap\"></span><span class=\"printable_gap_wrong\"></span>"
        const cell2 = "<span class=\"printable_gap\"></span><span class=\"printable_gap_wrong\"></span>"
        const cell3 = "<span class=\"printable_gap\"></span><span class=\"printable_gap_wrong\"></span>"
        const cell4 = "<span class=\"printable_gap\"></span><span class=\"printable_gap_wrong\"></span>"
        const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4);
        assertEquals(expectedHTML, printableHTML);
    },
});

TestCase("[Table] GetPrintableHTML - only filled gaps", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.model = createModelWith4FilledGaps();
        this.printableState = {
            gaps: [
                { value: "1" },
                { value: "2" },
                { value: "5" },
                { value: "6" },
            ]
        }
        this.emptyPrintableState = {
            gaps: [
                { value: "" },
                { value: "" },
                { value: "" },
                { value: "" },
            ]
        }
    },

    'test printable HTML for printable empty state mode': function () {
        const printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertTrue(isResetPrintableStateMode(this.presenter));

        const cell1 = "<span class=\"printable_gap\">null 1</span>"
        const cell2 = "<span class=\"printable_gap\">null 2</span>"
        const cell3 = "<span class=\"printable_gap\">null 3</span>"
        const cell4 = "<span class=\"printable_gap\">null 4</span>"
        const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4);
        assertEquals(expectedHTML, printableHTML);
    },

    'test printable HTML for printable show answers state mode': function () {
        const printableHTML = this.presenter.getPrintableHTML(this.model, true);

        assertTrue(isResetPrintableStateMode(this.presenter));

        const cell1 = "<span class=\"printable_gap\">1</span>"
        const cell2 = "<span class=\"printable_gap\">2</span>"
        const cell3 = "<span class=\"printable_gap\">3</span>"
        const cell4 = "<span class=\"printable_gap\">4</span>"
        const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4);
        assertEquals(expectedHTML, printableHTML);
    },

    'test printable HTML for printable show user answers state mode': function () {
        this.presenter.printableState = this.printableState;
        const printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertTrue(isResetPrintableStateMode(this.presenter));

        const cell1 = "<span class=\"printable_gap\">1</span>"
        const cell2 = "<span class=\"printable_gap\">2</span>"
        const cell3 = "<span class=\"printable_gap\">5</span>"
        const cell4 = "<span class=\"printable_gap\">6</span>"
        const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4);
        assertEquals(expectedHTML, printableHTML);
    },

    'test printable HTML for printable check answers state mode': function () {
        this.presenter.printableState = this.printableState;
        const printableHTML = this.presenter.getPrintableHTML(this.model, true);

        assertTrue(isResetPrintableStateMode(this.presenter));

        const cell1 = "<span class=\"printable_gap\">1</span><span class=\"printable_gap_correct\"></span>"
        const cell2 = "<span class=\"printable_gap\">2</span><span class=\"printable_gap_correct\"></span>"
        const cell3 = "<span class=\"printable_gap\">5</span><span class=\"printable_gap_wrong\"></span>"
        const cell4 = "<span class=\"printable_gap\">6</span><span class=\"printable_gap_wrong\"></span>"
        const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4);
        assertEquals(expectedHTML, printableHTML);
    },

    'test printable HTML for printable show user answers state mode when user do not answer': function () {
        this.presenter.printableState = this.emptyPrintableState;
        const printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertTrue(isResetPrintableStateMode(this.presenter));

        const cell1 = "<span class=\"printable_gap\"></span>"
        const cell2 = "<span class=\"printable_gap\"></span>"
        const cell3 = "<span class=\"printable_gap\"></span>"
        const cell4 = "<span class=\"printable_gap\"></span>"
        const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4);
        assertEquals(expectedHTML, printableHTML);
    },

    'test printable HTML for printable check answers state mode when user do not answer': function () {
        this.presenter.printableState = this.emptyPrintableState;
        const printableHTML = this.presenter.getPrintableHTML(this.model, true);

        assertTrue(isResetPrintableStateMode(this.presenter));

        const cell1 = "<span class=\"printable_gap\"></span><span class=\"printable_gap_wrong\"></span>"
        const cell2 = "<span class=\"printable_gap\"></span><span class=\"printable_gap_wrong\"></span>"
        const cell3 = "<span class=\"printable_gap\"></span><span class=\"printable_gap_wrong\"></span>"
        const cell4 = "<span class=\"printable_gap\"></span><span class=\"printable_gap_wrong\"></span>"
        const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4);
        assertEquals(expectedHTML, printableHTML);
    },
});

TestCase("[Table] GetPrintableHTML - only dropdown gaps", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.model = createModelWith4DropdownGaps();
        this.printableState = {
            gaps: [
                { value: "B1" },
                { value: "B2" },
                { value: "C3" },
                { value: "A4" },
            ]
        }
        this.emptyPrintableState = {
            gaps: [
                { value: "" },
                { value: "" },
                { value: "" },
                { value: "" },
            ]
        }
    },

    'test printable HTML for printable empty state mode': function () {
        const printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertTrue(isResetPrintableStateMode(this.presenter));

        const cell1 = "B1 / C1 / A1"
        const cell2 = "B2 / C2 / A2"
        const cell3 = "B3 / C3 / A3"
        const cell4 = "B4 / C4 / A4"
        const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4);
        assertEquals(expectedHTML, printableHTML);
    },

    'test printable HTML for printable show answers state mode': function () {
        const printableHTML = this.presenter.getPrintableHTML(this.model, true);

        assertTrue(isResetPrintableStateMode(this.presenter));

        const cell1 = "<span class=\"printable_gap\">B1</span> / C1 / A1"
        const cell2 = "<span class=\"printable_gap\">B2</span> / C2 / A2"
        const cell3 = "<span class=\"printable_gap\">B3</span> / C3 / A3"
        const cell4 = "<span class=\"printable_gap\">B4</span> / C4 / A4"
        const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4);
        assertEquals(expectedHTML, printableHTML);
    },

    'test printable HTML for printable show user answers state mode': function () {
        this.presenter.printableState = this.printableState;
        const printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertTrue(isResetPrintableStateMode(this.presenter));

        const cell1 = "<span class=\"printable_gap\">B1</span> / C1 / A1"
        const cell2 = "<span class=\"printable_gap\">B2</span> / C2 / A2"
        const cell3 = "B3 / <span class=\"printable_gap\">C3</span> / A3"
        const cell4 = "B4 / C4 / <span class=\"printable_gap\">A4</span>"
        const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4);
        assertEquals(expectedHTML, printableHTML);
    },

    'test printable HTML for printable check answers state mode': function () {
        this.presenter.printableState = this.printableState;
        const printableHTML = this.presenter.getPrintableHTML(this.model, true);

        assertTrue(isResetPrintableStateMode(this.presenter));

        const cell1 = "<span class=\"printable_gap\">B1</span> / C1 / A1<span class=\"printable_gap_correct\"></span>"
        const cell2 = "<span class=\"printable_gap\">B2</span> / C2 / A2<span class=\"printable_gap_correct\"></span>"
        const cell3 = "B3 / <span class=\"printable_gap\">C3</span> / A3<span class=\"printable_gap_wrong\"></span>"
        const cell4 = "B4 / C4 / <span class=\"printable_gap\">A4</span><span class=\"printable_gap_wrong\"></span>"
        const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4);
        assertEquals(expectedHTML, printableHTML);
    },

    'test printable HTML for printable show user answers state mode when user do not answer': function () {
        this.presenter.printableState = this.emptyPrintableState;
        const printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertTrue(isResetPrintableStateMode(this.presenter));

        const cell1 = "B1 / C1 / A1"
        const cell2 = "B2 / C2 / A2"
        const cell3 = "B3 / C3 / A3"
        const cell4 = "B4 / C4 / A4"
        const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4);
        assertEquals(expectedHTML, printableHTML);
    },

    'test printable HTML for printable check answers state mode when user do not answer': function () {
        this.presenter.printableState = this.emptyPrintableState;
        const printableHTML = this.presenter.getPrintableHTML(this.model, true);

        assertTrue(isResetPrintableStateMode(this.presenter));

        const cell1 = "B1 / C1 / A1</span><span class=\"printable_gap_wrong\"></span>"
        const cell2 = "B2 / C2 / A2</span><span class=\"printable_gap_wrong\"></span>"
        const cell3 = "B3 / C3 / A3</span><span class=\"printable_gap_wrong\"></span>"
        const cell4 = "B4 / C4 / A4</span><span class=\"printable_gap_wrong\"></span>"
        const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4);
        assertEquals(expectedHTML, printableHTML);
    },

    'test printable HTML for printable empty state mode when not keep original order': function () {
        this.model["keepOriginalOrder"] = "False";
        const printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertTrue(isResetPrintableStateMode(this.presenter));

        const cell1 = "A1 / B1 / C1"
        const cell2 = "A2 / B2 / C2"
        const cell3 = "A3 / B3 / C3"
        const cell4 = "A4 / B4 / C4"
        const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4);
        assertEquals(expectedHTML, printableHTML);
    },

    'test printable HTML for printable show answers state mode when not keep original order': function () {
        this.model["keepOriginalOrder"] = "False";
        const printableHTML = this.presenter.getPrintableHTML(this.model, true);

        assertTrue(isResetPrintableStateMode(this.presenter));

        const cell1 = "A1 / <span class=\"printable_gap\">B1</span> / C1"
        const cell2 = "A2 / <span class=\"printable_gap\">B2</span> / C2"
        const cell3 = "A3 / <span class=\"printable_gap\">B3</span> / C3"
        const cell4 = "A4 / <span class=\"printable_gap\">B4</span> / C4"
        const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4);
        assertEquals(expectedHTML, printableHTML);
    },

    'test printable HTML for printable show user answers state mode when not keep original order': function () {
        this.model["keepOriginalOrder"] = "False";
        this.presenter.printableState = this.printableState;
        const printableHTML = this.presenter.getPrintableHTML(this.model, false);

        assertTrue(isResetPrintableStateMode(this.presenter));

        const cell1 = "A1 / <span class=\"printable_gap\">B1</span> / C1"
        const cell2 = "A2 / <span class=\"printable_gap\">B2</span> / C2"
        const cell3 = "A3 / B3 / <span class=\"printable_gap\">C3</span>"
        const cell4 = "<span class=\"printable_gap\">A4</span> / B4 / C4"
        const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4);
        assertEquals(expectedHTML, printableHTML);
    },

    'test printable HTML for printable check answers state mode when not keep original order': function () {
        this.model["keepOriginalOrder"] = "False";
        this.presenter.printableState = this.printableState;
        const printableHTML = this.presenter.getPrintableHTML(this.model, true);

        assertTrue(isResetPrintableStateMode(this.presenter));

        const cell1 = "A1 / <span class=\"printable_gap\">B1</span> / C1<span class=\"printable_gap_correct\"></span>"
        const cell2 = "A2 / <span class=\"printable_gap\">B2</span> / C2<span class=\"printable_gap_correct\"></span>"
        const cell3 = "A3 / B3 / <span class=\"printable_gap\">C3</span><span class=\"printable_gap_wrong\"></span>"
        const cell4 = "<span class=\"printable_gap\">A4</span> / B4 / C4<span class=\"printable_gap_wrong\"></span>"
        const expectedHTML = createExpectedPrintableHTMLWith4Cells(cell1, cell2, cell3, cell4);
        assertEquals(expectedHTML, printableHTML);
    },
});

TestCase("[Table] GetPrintableHTML - mixed gaps", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.model = createModelWithMixed8Gaps();
        this.printableState = {
            gaps: [
                { value: "2" },
                { value: "3" },
                { value: "some value 5" },
                { value: "some value 8" },
                { value: "4" },
                { value: "A7" },
            ]
        }
        this.emptyPrintableState = {
            gaps: [
                { value: "" },
                { value: "" },
                { value: "" },
                { value: "" },
                { value: "" },
                { value: "" },
            ]
        }
    },

    'test printable HTML for printable empty state mode': function () {
        const printableHTML = this.presenter.getPrintableHTML(this.model, false);

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
            cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8);
        assertEquals(expectedHTML, printableHTML);
    },

    'test printable HTML for printable show answers state mode': function () {
        const printableHTML = this.presenter.getPrintableHTML(this.model, true);

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
            cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8);
        assertEquals(expectedHTML, printableHTML);
    },

    'test printable HTML for printable show user answers state mode': function () {
        this.presenter.printableState = this.printableState;
        const printableHTML = this.presenter.getPrintableHTML(this.model, false);

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
            cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8);
        assertEquals(expectedHTML, printableHTML);
    },

    'test printable HTML for printable check answers state mode': function () {
        this.presenter.printableState = this.printableState;
        const printableHTML = this.presenter.getPrintableHTML(this.model, true);

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
            cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8);
        assertEquals(expectedHTML, printableHTML);
    },

    'test printable HTML for printable show user answers state mode and not equal amount of states': function () {
        const model = createModelWithMixed8Gaps();
        var wrongPrintableStates = [{
            values: []
        }, {
            gaps: [
                { value: "2" },
                { value: "3" },
                { value: "some value 5" },
                { value: "some value 8" },
                { value: "4" },
            ]
        }, {
            gaps: [
                { value: "2" },
                { value: "3" },
                { value: "some value 5" },
                { value: "some value 8" },
                { value: "4" },
                { value: "A7" },
                { value: "x" },
            ]
        }, {
            gaps: [
                { value: "2" },
                { value: "3" },
                { value: "some value 5" },
                { value: "some value 8" },
                { value: "4" },
                { value: "A7" },
                { value: "" },
            ]
        }]
        for (var i = 0; i < wrongPrintableStates.length; i++) {
            this.presenter.printableState = wrongPrintableStates[i];
            const printableHTML = this.presenter.getPrintableHTML(model, false);
            assertTrue(isResetPrintableStateMode(this.presenter));
            assertEquals(null, printableHTML);
        }
    },

    'test printable HTML for printable check answers state mode and not equal amount of states': function () {
        const model = createModelWithMixed8Gaps();
        var wrongPrintableStates = [{
            values: []
        }, {
            gaps: []
        }, {
            gaps: [
                { value: "2" },
                { value: "3" },
                { value: "some value 5" },
                { value: "some value 8" },
                { value: "4" },
            ]
        }, {
            gaps: [
                { value: "2" },
                { value: "3" },
                { value: "some value 5" },
                { value: "some value 8" },
                { value: "4" },
                { value: "A7" },
                { value: "x" },
            ]
        }, {
            gaps: [
                { value: "2" },
                { value: "3" },
                { value: "some value 5" },
                { value: "some value 8" },
                { value: "4" },
                { value: "A7" },
                { value: "" },
            ]
        }]
        for (var i = 0; i < wrongPrintableStates.length; i++) {
            this.presenter.printableState = wrongPrintableStates[i];
            const printableHTML = this.presenter.getPrintableHTML(model, true);
            assertTrue(isResetPrintableStateMode(this.presenter));
            assertEquals(null, printableHTML);
        }
    },
});
