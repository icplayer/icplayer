TestCase("[Assessments_Navigation_Bar] [Sections] Get pages indexes", {
    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();

        this.pages = [
            {page: 1},
            {page: 3},
            {page: 5}
        ];

        this.expectedResult = [1, 3, 5];
    },

    'test should return array with pages indexes': function () {
        var result = this.presenter.Sections.prototype.getPagesIndexes(this.pages);

        assertEquals(this.expectedResult, result);
    }
});

TestCase("[Assessments_Navigation_Bar] [Sections] Get all pages in order", {
    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();

        this.sections = [
            {pages: [1, 2]},
            {pages: [3, 5]},
            {pages: [4, 7]}
        ];

        this.expectedResult = [1, 2, 3, 5, 4, 7];
    },

    'test should return array with pages indexes': function () {
        var result = this.presenter.Sections.prototype.getAllPagesInOrder(this.sections);

        assertEquals(this.expectedResult, result);
    }
});

TestCase("[Assessments_Navigation_Bar] [Sections] Get actual Page Index", {
    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();

        this.stubs = {
            isActualPage1: sinon.stub(),
            isActualPage2: sinon.stub(),
            isActualPage3: sinon.stub()
        };

        this.allPages = [
            {isActualPage: this.stubs.isActualPage1},
            {isActualPage: this.stubs.isActualPage2},
            {isActualPage: this.stubs.isActualPage3}
        ];

        this.mockSections = {
            allPages: this.allPages
        };
    },

    'test should return index in array of page which is actual page': function () {
        this.stubs.isActualPage1.returns(false);
        this.stubs.isActualPage2.returns(false);
        this.stubs.isActualPage3.returns(true);

        var index = this.presenter.Sections.prototype.getActualPageIndex.call(this.mockSections);

        assertEquals(2, index);
    },

    'test should return undefined if no page is actual': function () {
        this.stubs.isActualPage1.returns(false);
        this.stubs.isActualPage2.returns(false);
        this.stubs.isActualPage3.returns(false);

        var index = this.presenter.Sections.prototype.getActualPageIndex.call(this.mockSections);

        assertUndefined(index);
    }
});

TestCase("[Assessments_Navigation_Bar] [Sections] Get next/previous page to current", {
    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();

        this.presenter.configuration = {
            numberOfPages: 10
        };

        this.stubs = {
            getActualPageIndex: sinon.stub(),
            getPageByIndex: sinon.stub()
        };

        this.sectionsMock = {
            getActualPageIndex: this.stubs.getActualPageIndex,
            getPageByIndex: this.stubs.getPageByIndex
        };

        this.expectedPage = {
            test: "testPOagdaljk;yrtu3waolfdva"
        };
    },

    'test get next page should return next page depending on actual page index': function () {
        this.stubs.getActualPageIndex.returns(5);
        this.stubs.getPageByIndex.returns(this.expectedPage);

        var result = this.presenter.Sections.prototype.getNextPageToCurrent.call(this.sectionsMock);

        assertTrue(this.stubs.getPageByIndex.calledOnce);
        assertTrue(this.stubs.getPageByIndex.calledWith(6));
        assertEquals(this.expectedPage, result);
    },

    'test get next page should return undefined if actual page index is equal to number of pages': function () {
        this.stubs.getActualPageIndex.returns(this.presenter.configuration.numberOfPages);

        var result = this.presenter.Sections.prototype.getNextPageToCurrent.call(this.sectionsMock);

        assertFalse(this.stubs.getPageByIndex.called);
        assertUndefined(result);
    },

    'test get next page should return undefined if actual page dont exists': function () {
        this.stubs.getActualPageIndex.returns(undefined);

        var result = this.presenter.Sections.prototype.getNextPageToCurrent.call(this.sectionsMock);

        assertFalse(this.stubs.getPageByIndex.called);
        assertUndefined(result);
    },

    'test get previous page should return page according to actual page index decreased by one': function () {
        this.stubs.getActualPageIndex.returns(4);
        this.stubs.getPageByIndex.returns(this.expectedPage);

        var result = this.presenter.Sections.prototype.getPreviousPageToCurrent.call(this.sectionsMock);

        assertTrue(this.stubs.getPageByIndex.calledOnce);
        assertTrue(this.stubs.getPageByIndex.calledWith(3));
        assertEquals(this.expectedPage, result);
    },

    'test get previous page should return undefined if actual page index is equal 0': function () {
        this.stubs.getActualPageIndex.returns(0);

        var result = this.presenter.Sections.prototype.getPreviousPageToCurrent.call(this.sectionsMock);

        assertFalse(this.stubs.getPageByIndex.called);
        assertUndefined(result);
    },

    'test get previous page should return undefined if actual page dont exists': function () {
        this.stubs.getActualPageIndex.returns(undefined);

        var result = this.presenter.Sections.prototype.getPreviousPageToCurrent.call(this.sectionsMock);

        assertFalse(this.stubs.getPageByIndex.called);
        assertUndefined(result);
    }
});

TestCase("[Assessments_Navigation_Bar] Get Pages", {
    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();
        this.allPages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        this.sections = {
            allPages: this.allPages
        };

    },

    'test should return specified number of pages from provided index': function () {
        var result = this.presenter.Sections.prototype.getPages.call(this.sections, 0, 6);

        assertEquals([1, 2, 3, 4, 5, 6], result);
    },

    'test if number of pages combined with index is higher than number of all pages than should return last pages': function () {
        var result = this.presenter.Sections.prototype.getPages.call(this.sections, 6, 6);

        assertEquals([5, 6, 7, 8, 9, 10], result);
    }
});

TestCase("[Assessments_Navigation_Bar] Filtering sections tests", {
    createSections: function(sectionPages) {
        var pageIndex = 0;
        var sections = sectionPages.map(function (sectionPagesCount) {
            var pagesArray = [];
            for (var i = 0; i < sectionPagesCount; i++) {
                pagesArray.push(pageIndex + i);
                pageIndex++;
            }
            return {
                pages: pagesArray,
                sectionName: "",
                pagesDescription: pagesArray
            }
        });

        return {
            pageCount: pageIndex,
            sections: sections
        };
    },

    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();
        this.stubs = {
            getPageCount: sinon.stub(),
            getPresentation: sinon.stub(),
            getPagesMapping: sinon.stub()
        };

        this.presentationStub = {
            getPageCount: this.stubs.getPageCount
        };
        this.playerControllerStub = {
            getPresentation: this.stubs.getPresentation,
            getPagesMapping: this.stubs.getPagesMapping
        };

        this.stubs.getPresentation.returns(this.presentationStub);
        this.presenter.playerController = this.playerControllerStub;
    },

    'test given sections with same amount of pages as presentation when filtering section then returns all sections': function () {
        var sectionPages = [1, 1, 1, 1];
        var sections = this.createSections(sectionPages);
        this.stubs.getPageCount.returns(sections.pageCount);
        this.stubs.getPagesMapping.returns([0, 1, 2, 3]);
        var filtered = this.presenter.filterSectionsWithTooManyPages(sections.sections);

        assertEquals(sections.sections.length, filtered.length);
    },

    'test given sections with same amount of pages as presentation and more than one page in section when filtering section then returns all sections': function () {
        var sectionPages = [5, 1, 1, 1];
        var sections = this.createSections(sectionPages);
        this.stubs.getPageCount.returns(sections.pageCount);
        this.stubs.getPagesMapping.returns([0, 1, 2, 3, 4, 5, 6, 7, 8]);
        var filtered = this.presenter.filterSectionsWithTooManyPages(sections.sections);

        assertEquals(sections.sections.length, filtered.length);
    },

    'test given sections with more pages than presentation when filtering section then returns 2 sections': function () {
        var sectionPages = [5, 1, 1, 1];
        var sections = this.createSections(sectionPages);
        this.stubs.getPageCount.returns(5 + 1);
        this.stubs.getPagesMapping.returns([0, 1, 2, 3, 4, 5, undefined, undefined, undefined]);
        var filtered = this.presenter.filterSectionsWithTooManyPages(sections.sections);

        assertEquals(2, filtered.length);
    },

    'test given sections for which second section has more pages then needed when filtering section then returns 2 sections and second section pages are have correct length': function () {
        var sectionPages = [5, 10, 1, 1];
        var sections = this.createSections(sectionPages);
        this.stubs.getPageCount.returns(5 + 2);
        this.stubs.getPagesMapping.returns([0, 1, 2, 3, 4, 5, undefined, undefined, undefined, undefined, undefined, undefined]);

        var filtered = this.presenter.filterSectionsWithTooManyPages(sections.sections);

        assertEquals(2, filtered.length);
        assertEquals(1, filtered[1].pages.length);
    },

    'test given sections which have less pages than lesson when filtering then returns original sections': function () {
        var sectionPages = [1, 1, 1, 1];
        var sections = this.createSections(sectionPages);
        this.stubs.getPageCount.returns(199);
        this.stubs.getPagesMapping.returns([0, 1, 2, 3]);
        var filtered = this.presenter.filterSectionsWithTooManyPages(sections.sections);

        assertEquals(sections.sections.length, filtered.length);
    }
});