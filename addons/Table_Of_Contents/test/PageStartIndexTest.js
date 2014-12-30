TestCase("[Table Of Contents] Display Page Pagination", {
    setUp: function () {
        this.presenter = AddonTable_Of_Contents_create();
        this.presenter.pagination = {
            pages: [[]],
            size: 0
        };
    },

    'test page start index': function() {
        this.presenter.pagination.pages = [
            [0,1,2,3],
            [4],
            [5,6,7,8,9,10,11,12],
            [13]
        ];

        assertEquals(1, this.presenter.pageStartIndex(0));
        assertEquals(5, this.presenter.pageStartIndex(1));
        assertEquals(6, this.presenter.pageStartIndex(2));
        assertEquals(14, this.presenter.pageStartIndex(3));
    }
});