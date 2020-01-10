TestCase("[Navigation_Bar] Commands", {
    setUp: function () {
        this.presenter = AddonNavigation_Bar_create();
        this.presenter.originalIndex = 0;
        this.presenter.state.bookmarks = [2,3,4];
        this.mocks = {
            refreshBookmarks: sinon.spy(this.presenter, "refreshBookmarks")
        }
    },

    'test given original index of the first page when bookmarking current page then page number is added to bookmarks': function () {
        this.presenter.bookmarkCurrentPage();

        assertEquals([2,3,4,1], this.presenter.state.bookmarks);
        assertTrue(this.mocks.refreshBookmarks.calledOnce);
    },

    'test given original index of the second page when removing current page current then page number is removed from bookmarks': function () {
        this.presenter.originalIndex = 1;

        this.presenter.removeBookmark();

        assertEquals([3,4], this.presenter.state.bookmarks);
        assertTrue(this.mocks.refreshBookmarks.calledOnce);
    }
});