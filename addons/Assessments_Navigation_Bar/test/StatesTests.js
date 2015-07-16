TestCase("[Assessments_Navigation_Bar] Set state", {
    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();

        this.expectedPages = [
            {description: "page1", page: 1, isBookmarkOn: false, sectionName: "section1", sectionCssClass: "section_0"},
            {description: "page2", page: 4, isBookmarkOn: true, sectionName: "section3", sectionCssClass: "section_1"},
            {description: "page3", page: 5, isBookmarkOn: false, sectionName: "section4", sectionCssClass: "section_2"}
        ];

        this.presenter.sections = {
            allPages: this.expectedPages
        };
    },

    'test get state should receive all pages from sections': function () {
        var state = this.presenter.getState();

        assertEquals(this.expectedPages, JSON.parse(state).pages);
    }
});

TestCase("[Assessments_Navigation_Bar] Get State", {
    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();

        this.pages = {
            pages: [
                {description: "page1", page: 1, isBookmarkOn: false, sectionName: "section1", sectionCssClass: "section_0"},
                {description: "page2", page: 4, isBookmarkOn: true, sectionName: "section3", sectionCssClass: "section_1"},
                {description: "page3", page: 5, isBookmarkOn: false, sectionName: "section4", sectionCssClass: "section_2"}
            ]
        };



        this.expectedPages = [
            new this.presenter.Page(1, "page1", "section1", "section_0"),
            new this.presenter.Page(4, "page2", "section3", "section_1"),
            new this.presenter.Page(5, "page3", "section4", "section_2")
        ];

        this.expectedPages[1].isBookmarkOn = true;

        this.presenter.sections = {
            allPages: []
        };

        this.stubs = {
            initView: sinon.stub(this.presenter.NavigationManager.prototype, 'initView'),
            restartLeftSideIndex: sinon.stub(this.presenter.NavigationManager.prototype, 'restartLeftSideIndex'),
            setSections: sinon.stub(this.presenter.NavigationManager.prototype, 'setSections'),
            moveToCurrentPage: sinon.stub(this.presenter.NavigationManager.prototype, 'moveToCurrentPage')
        };

        this.presenter.navigationManager = new this.presenter.NavigationManager(0);
    },

    tearDown: function () {
        this.presenter.NavigationManager.prototype.restartLeftSideIndex.restore();
        this.presenter.NavigationManager.prototype.initView.restore();
        this.presenter.NavigationManager.prototype.setSections.restore();
        this.presenter.NavigationManager.prototype.moveToCurrentPage.restore();
    },

    'test set state should set provided pages to sections': function () {
        this.presenter.setState(JSON.stringify(this.pages));

        assertEquals(this.expectedPages, this.presenter.sections.allPages);
    },

    'test set state should set navigation manager left index to 0': function () {
        this.presenter.setState(JSON.stringify(this.pages));

        assertTrue(this.stubs.restartLeftSideIndex.calledOnce);
    },

    'test set state should set sections': function () {
        this.presenter.setState(JSON.stringify(this.pages));

        assertTrue(this.stubs.setSections.calledOnce);
    },

    'test set state should set sections after setting left side index': function () {
        this.presenter.setState(JSON.stringify(this.pages));

        assertTrue(this.stubs.setSections.calledAfter(this.stubs.restartLeftSideIndex));
    },

    'test set state should move to current page after setting sections': function () {
        this.presenter.setState(JSON.stringify(this.pages));

        assertTrue(this.stubs.moveToCurrentPage.calledOnce);
        assertTrue(this.stubs.moveToCurrentPage.calledAfter(this.stubs.setSections));
    }
});