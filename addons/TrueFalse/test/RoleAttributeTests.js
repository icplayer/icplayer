TestCase("[TrueFalse] Role attributes tests", {
   setUp: function () {
       this.presenter = AddonTrueFalse_create();

       this.table = document.createElement("table");


   },

    'test should add table role to the table': function () {
        this.presenter.generateTableContent(this.table, this.table);
        var expected = "table";

        var result = this.table.getAttribute("role");

        assertEquals(expected, result);
    },

    'test should add row role to the table row': function () {
        this.presenter.generateTableContent(this.table, this.table);
        var expected = "row";

        var tableRow = $(this.table).find('tr').first();

        var result = tableRow.attr("role");

        assertEquals(expected, result);
    },

    'test should add gridcell role to the table data': function () {
        this.presenter.generateTableContent(this.table, this.table);
        var expected = "gridcell";

        var tableRow = $(this.table).find('tr').first();
        var tableData = tableRow.find('td');

        var result = tableData.attr("role");

        assertEquals(expected, result);
    }
});