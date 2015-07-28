TestCase("[Table] Cells dimensions conversion", {
    setUp: function () {
        this.presenter = AddonTable_create();
    },

    'test empty list of columns width': function () {
        var columnWidth = [ { Width: "" }],
            expected = [ "auto", "auto", "auto", "auto", "auto", "auto" ];

        var convertedColumnWidth = this.presenter.convertDimensionsArray(columnWidth, 6, 'Width');

        assertTrue(convertedColumnWidth.isValid);
        assertEquals(expected, convertedColumnWidth.dimensions);
    },

    'test only first two columns filled': function () {
        var columnWidth = [ { Width: "150px" } , { Width: "20" }],
            expected = [ "150px", "20", "auto", "auto", "auto", "auto" ];

        var convertedColumnWidth = this.presenter.convertDimensionsArray(columnWidth, 6, 'Width');

        assertTrue(convertedColumnWidth.isValid);
        assertEquals(expected, convertedColumnWidth.dimensions);
    },

    'test some columns omitted': function () {
        var columnWidth = [ { Width: "150px" } , { Width: "" } , { Width: "130" } , { Width: "150px" } , { Width: "" } , { Width: "150px" }],
            expected = [ "150px", "auto", "130", "150px", "auto", "150px" ];

        var convertedColumnWidth = this.presenter.convertDimensionsArray(columnWidth, 6, 'Width');

        assertTrue(convertedColumnWidth.isValid);
        assertEquals(expected, convertedColumnWidth.dimensions);
    },

    'test too many columns specified': function () {
        var columnWidth = [ { Width: "150px" } , { Width: "" } , { Width: "130" } , { Width: "150px" } , { Width: "" } , { Width: "150px" } , { Width: "210px" }];

        var convertedColumnWidth = this.presenter.convertDimensionsArray(columnWidth, 6, 'Width');

        assertFalse(convertedColumnWidth.isValid);
    },

    'test empty list of rows height': function () {
        var rowsHeight = [ { Height: "" }],
            expected = [ "auto", "auto", "auto", "auto", "auto", "auto" ];


        var convertedRowHeights = this.presenter.convertDimensionsArray(rowsHeight, 6, 'Height');

        assertTrue(convertedRowHeights.isValid);
        assertEquals(expected, convertedRowHeights.dimensions);
    },

    'test only first two rows filled': function () {
        var rowsHeight = [ { Height: "150px" } , { Height: "20" }],
            expected = [ "150px", "20", "auto", "auto", "auto", "auto" ];

        var convertedRowHeights = this.presenter.convertDimensionsArray(rowsHeight, 6, 'Height');

        assertTrue(convertedRowHeights.isValid);
        assertEquals(expected, convertedRowHeights.dimensions);
    },

    'test some rows omitted': function () {
        var rowsHeight = [ { Height: "150px" } , { Height: "" } , { Height: "130" } , { Height: "150px" } , { Height: "" } , { Height: "150px" }],
            expected = [ "150px", "auto", "130", "150px", "auto", "150px" ];

        var convertedRowHeights = this.presenter.convertDimensionsArray(rowsHeight, 6, 'Height');

        assertTrue(convertedRowHeights.isValid);
        assertEquals(expected, convertedRowHeights.dimensions);
    },

    'test too many rows specified': function () {
        var rowsHeight = [ { Height: "150px" } , { Height: "" } , { Height: "130" } , { Height: "150px" } , { Height: "" } , { Height: "150px" } , { Height: "210px" }];

        var convertedRowHeights = this.presenter.convertDimensionsArray(rowsHeight, 6, 'Height');

        assertFalse(convertedRowHeights.isValid);
    }
});