TestCase("[CSS] Validate css insertion", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.$wrapper = function(){};
        this.presenter.$wrapper.html = function () {};
        this.contentModel = {
            "ID": 'Table1',
            "Is Visible": "True",
            Rows: "2",
            Columns: "2",
            "Table cells": [
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
            ],
            "Columns width": [
                { Width: "50%" },
                { Width: "40%" },
            ],
            "Rows height": [
                { Height: "50%" },
                { Height: "40%" }
            ],
            newWidthCalculate : 'True'
        };
        this.expectedResult = '<tbody><tr><td class=\"row_1 col_1 table_cell\" style=\"width: 50%; height: 50%;\" rowspan=\"1\" colspan=\"1\">1</td><td class=\"row_1 col_2 table_cell\" style=\"width: 40%; height: 50%;\" rowspan=\"1\" colspan=\"1\">2</td></tr><tr><td class=\"row_2 col_1 table_cell\" style=\"width: 50%; height: 40%;\" rowspan=\"1\" colspan=\"1\">3</td><td class=\"row_2 col_2 table_cell\" style=\"width: 40%; height: 40%;\" rowspan=\"1\" colspan=\"1\">4</td></tr></tbody>'.split('').sort().join('');
    },

    'test all cells have valid width' : function () {
        var model = this.presenter.validateModel(this.contentModel);
        this.presenter.configuration = model;
        var $table = this.presenter.generateTable(model.contents, true);
        this.presenter.setColumnWidth($table, model.columnsWidths, model.rowsHeights);
        this.presenter.setRowHeight($table, model.rowsHeights);

        assertEquals(this.expectedResult, $table.html().split('').sort().join(''));

    }


});
