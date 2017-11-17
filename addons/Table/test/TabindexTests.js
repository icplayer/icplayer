TestCase('[Table] Tabindex adding tests', {
    setUp: function () {
        this.presenter = AddonTable_create();

        this.rowNumber = 0;
        this.rowContent = [{ content: 'First element', rowSpan: 1, colSpan: 1 }
                        , { content: 'Second element', rowSpan: 1, colSpan: 1 }
                        , { content: 'Third element', rowSpan: 1, colSpan: 1 }];
        this.isPreview = false;

        this.presenter.configuration = {
            isTabindexEnabled: true
        }
    },

    'test should set tabindex for table data in row to 0': function () {
        var tableRow = this.presenter.generateRow(this.rowNumber, this.rowContent, this.isPreview);
        var tableData = tableRow.find('td');

        assertEquals(this.rowContent.length, tableData.length);
        assertEquals(0, $(tableData[0]).attr("tabindex"));
        assertEquals(0, $(tableData[1]).attr("tabindex"));
        assertEquals(0, $(tableData[2]).attr("tabindex"));
    },

    'test should not set tabindex for table data when isTabindexEnabled is false': function () {
        this.presenter.configuration.isTabindexEnabled = false;

        var tableRow = this.presenter.generateRow(this.rowNumber, this.rowContent, this.isPreview);
        var tableData = tableRow.find('td');

        assertEquals(this.rowContent.length, tableData.length);
        assertEquals(undefined, $(tableData[0]).attr("tabindex"));
        assertEquals(undefined, $(tableData[1]).attr("tabindex"));
        assertEquals(undefined, $(tableData[2]).attr("tabindex"));
    }
});