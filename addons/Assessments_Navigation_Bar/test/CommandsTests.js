TestCase("[Assessments_Navigation_Bar] add / remove Bookmark", {
    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();
        this.sections = [
            {
                sectionName: "",
                pages: [0, 1, 2],
                pagesDescriptions: ["0", "1", "2"]
            }
        ];

        this.presenter.sections = new this.presenter.Sections(this.sections);
        this.presenter.navigationManager = {
            bookmarkCurrentButton: function () {},
            removeBookmarkFromCurrentButton: function () {}
        };

        this.stubs = {
            isActualPage1: sinon.stub(this.presenter.sections.allPages[0], 'isActualPage'),
            isActualPage2: sinon.stub(this.presenter.sections.allPages[1], 'isActualPage'),
            isActualPage3: sinon.stub(this.presenter.sections.allPages[2], 'isActualPage'),
            bookmarkCurrentButton: sinon.stub(this.presenter.navigationManager, 'bookmarkCurrentButton'),
            removeBookmarkFromCurrentButton: sinon.stub(this.presenter.navigationManager, 'removeBookmarkFromCurrentButton')
        };
    },

    tearDown: function () {
        this.presenter.sections.allPages[0].isActualPage.restore();
        this.presenter.sections.allPages[1].isActualPage.restore();
        this.presenter.sections.allPages[2].isActualPage.restore();

        this.presenter.navigationManager.bookmarkCurrentButton.restore();
        this.presenter.navigationManager.removeBookmarkFromCurrentButton.restore();
    },

    'test bookmarking current page should for current page isBookmarkOn flag to true': function () {
        this.stubs.isActualPage1.returns(false);
        this.stubs.isActualPage2.returns(true);
        this.stubs.isActualPage3.returns(false);

        this.presenter.bookmarkCurrentPage();

        assertTrue(this.presenter.sections.allPages[1].isBookmarkOn);
    },

    'test bookmarking current page should call add bookmark class to button': function () {
        this.stubs.isActualPage1.returns(false);
        this.stubs.isActualPage2.returns(true);
        this.stubs.isActualPage3.returns(false);

        this.presenter.bookmarkCurrentPage();

        assertTrue(this.stubs.bookmarkCurrentButton.calledOnce);
        assertFalse(this.stubs.removeBookmarkFromCurrentButton.called);
    },

    'test removing bookmark from current page should set current page isBookmarkOn flag to false': function () {
        this.presenter.sections.allPages[1].isBookmarkOn = false;

        this.stubs.isActualPage1.returns(false);
        this.stubs.isActualPage2.returns(true);
        this.stubs.isActualPage3.returns(false);

        this.presenter.removeBookmark();

        assertFalse(this.presenter.sections.allPages[1].isBookmarkOn);
    },

    'test removing bookmark from current page should call remove bookmark class from button': function () {
        this.stubs.isActualPage1.returns(false);
        this.stubs.isActualPage2.returns(true);
        this.stubs.isActualPage3.returns(false);

        this.presenter.removeBookmark();

        assertFalse(this.stubs.bookmarkCurrentButton.calledOnce);
        assertTrue(this.stubs.removeBookmarkFromCurrentButton.called);
    }
});

TestCase("[Assessments_Navigation_Bar] add / remove Bookmark from not visible button", {
    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();
        this.sections = [
            {
                sectionName: "",
                pages: [0, 1, 2],
                pagesDescriptions: ["0", "1", "2"]
            }
        ];
        this.presenter.sections = new this.presenter.Sections(this.sections);

        this.presenter.buttons = [];

        this.stubs = {
            initView: sinon.stub(this.presenter.NavigationManager.prototype, 'initView'),
            isActualPage1: sinon.stub(this.presenter.sections.allPages[0], 'isActualPage'),
            isActualPage2: sinon.stub(this.presenter.sections.allPages[1], 'isActualPage'),
            isActualPage3: sinon.stub(this.presenter.sections.allPages[2], 'isActualPage'),
        };

        this.stubs.isActualPage1.returns(false);
        this.stubs.isActualPage2.returns(true);
        this.stubs.isActualPage3.returns(false);

        this.presenter.navigationManager = new this.presenter.NavigationManager(0);
    },

    tearDown: function () {
        this.presenter.NavigationManager.prototype.initView.restore();
        this.presenter.sections.allPages[0].isActualPage.restore();
        this.presenter.sections.allPages[1].isActualPage.restore();
        this.presenter.sections.allPages[2].isActualPage.restore();
    },

    'test bookmarking current page that is not visible should not raise error': function () {
        this.presenter.bookmarkCurrentPage();
    },

    'test removing bookmark from current page that is not visible should not raise error': function () {
        this.presenter.removeBookmark();
    },
});

TestCase("[Assessments_Navigation_Bar] Move to page", {
    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();
        this.stubs = {
            changeToPage: sinon.stub(this.presenter, 'changeToPage'),
            getPageByIndex: sinon.stub(),
            validatePageIndex: sinon.stub(this.presenter, 'validatePageIndex')
        };

        this.mockSections = {
            getPageByIndex: this.stubs.getPageByIndex
        };

        this.presenter.sections = this.mockSections;
    },

    tearDown: function () {
        this.presenter.changeToPage.restore();
        this.presenter.validatePageIndex.restore();
    },

    'test should call change to page with page of provided index if index is valid': function () {
        this.stubs.validatePageIndex.returns({isValid: true, index: 1});
        this.stubs.getPageByIndex.returns({page: 1});
        this.presenter.moveToPage(2);

        assertTrue(this.stubs.changeToPage.calledOnce);
        assertTrue(this.stubs.changeToPage.calledWith(1));
    },

    'test should do nothing when page index is invalid': function () {
        this.stubs.validatePageIndex.returns({isValid: false});
        this.presenter.moveToPage(2);

        assertFalse(this.stubs.getPageByIndex.called);
        assertFalse(this.stubs.changeToPage.called);
    }
});

TestCase("[Assessments_Navigation_Bar] Page index validation", {
    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();
        this.presenter.configuration = {
            numberOfPages: 5
        };
    },

    'test should return 1-based changed to 0-based': function () {
        var validationResult = this.presenter.validatePageIndex(3);

        assertTrue(validationResult.isValid);
        assertEquals(2, validationResult.index);
    },

    'test should return invalid when index is higher than number of pages': function () {
        var validationResult = this.presenter.validatePageIndex(6);

        assertFalse(validationResult.isValid);
    },

    'test should return invalid when index is lower than 1': function () {
        var validationResult = this.presenter.validatePageIndex(0);

        assertFalse(validationResult.isValid);
    },

    'test should return invalid argument is a string': function () {
        var validationResult = this.presenter.validatePageIndex("fdsa;lfjkdas");

        assertFalse(validationResult.isValid);
    },

    'test should return invalid argument is a float': function () {
        var validationResult = this.presenter.validatePageIndex(12.5);

        assertFalse(validationResult.isValid);
    }
});