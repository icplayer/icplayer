TestCase("[Assessments_Navigation_Bar] Set state", {
    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();
        this.stubs = {
            initView: sinon.stub(this.presenter.NavigationManager.prototype, 'initView'),
            restartLeftSideIndex: sinon.stub(this.presenter.NavigationManager.prototype, 'restartLeftSideIndex'),
            setSections: sinon.stub(this.presenter.NavigationManager.prototype, 'setSections'),
            moveToCurrentPage: sinon.stub(this.presenter.NavigationManager.prototype, 'moveToCurrentPage'),
        };

        this.presenter.navigationManager = new this.presenter.NavigationManager();

        this.expectedPages = [
            {page: 1, description: "page1", sectionName: "section1", isBookmarkOn: false, sectionCssClass: "section_0", buttonCssClassNames: ["AClass", "BClass"]},
            {page: 4, description: "page2", sectionName: "section3", isBookmarkOn: true, sectionCssClass: "section_1", buttonCssClassNames: ["CClass"]},
            {page: 5, description: "page3", sectionName: "section4", isBookmarkOn: false, sectionCssClass: "section_2", buttonCssClassNames: ["DClass"]}
        ];

        this.presenter.sections = {
            allPages: this.expectedPages
        };
    },

    'test get state should receive all pages from sections': function () {
        this.presenter.navigationManager.actualPages = this.expectedPages;
        var state = this.presenter.getState();

        assertEquals(this.expectedPages, JSON.parse(state).pages);
    }
});

TestCase("[Assessments_Navigation_Bar] Get State", {
    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();

        this.pages = {
            pages: [
                {page: 1, description: "page1", sectionName: "section1", isBookmarkOn: false, sectionCssClass: "section_0", buttonCssClassNames: ["AClass", "BClass"]},
                {page: 4, description: "page2", sectionName: "section3", isBookmarkOn: true, sectionCssClass: "section_1", buttonCssClassNames: ["CClass"]},
                {page: 5, description: "page3", sectionName: "section4", isBookmarkOn: false, sectionCssClass: "section_2", buttonCssClassNames: ["DClass"]}
            ]
        };

        this.expectedPages = [
            new this.presenter.Page(1, "page1", "section1", "section_0", ["AClass", "BClass"]),
            new this.presenter.Page(4, "page2", "section3", "section_1", ["CClass"]),
            new this.presenter.Page(5, "page3", "section4", "section_2", ["DClass"])
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
        this.presenter.playerController = {
            getCurrentPageIndex: sinon.stub()
        };
        this.presenter.playerController.getCurrentPageIndex.returns(0);
        this.presenter.$wrapper = $('div');
    },

    tearDown: function () {
        this.presenter.NavigationManager.prototype.restartLeftSideIndex.restore();
        this.presenter.NavigationManager.prototype.initView.restore();
        this.presenter.NavigationManager.prototype.setSections.restore();
        this.presenter.NavigationManager.prototype.moveToCurrentPage.restore();
    },

    'test set state should set provided pages to sections': function () {
        this.presenter.sections.allPages = [{page: 1}, {page: 4}, {page: 5}];
        this.presenter.navigationManager.staticPages = [];
        this.presenter.setState(JSON.stringify(this.pages));

        assertEquals(this.expectedPages, this.presenter.sections.allPages);
    },

    'test set state should set navigation manager left index to 0': function () {
        this.presenter.navigationManager.staticPages = [];
        this.presenter.setState(JSON.stringify(this.pages));

        assertTrue(this.stubs.restartLeftSideIndex.calledOnce);
    },

    'test set state should set sections': function () {
        this.presenter.navigationManager.staticPages = [];
        this.presenter.setState(JSON.stringify(this.pages));

        assertTrue(this.stubs.setSections.calledOnce);
    },

    'test set state should set sections after setting left side index': function () {
        this.presenter.navigationManager.staticPages = [];
        this.presenter.setState(JSON.stringify(this.pages));

        assertTrue(this.stubs.setSections.calledAfter(this.stubs.restartLeftSideIndex));
    },

    'test set state should move to current page after setting sections': function () {
        this.presenter.navigationManager.staticPages = [];
        this.presenter.setState(JSON.stringify(this.pages));

        assertTrue(this.stubs.moveToCurrentPage.calledOnce);
        assertTrue(this.stubs.moveToCurrentPage.calledAfter(this.stubs.setSections));
    }
});

TestCase("[Assessments_Navigation_Bar] UpgradeState", {

    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();

        this.spies = {
            upgradeAttemptedPages: sinon.spy(this.presenter, 'upgradeAttemptedPages'),
            upgradePagesButtonCssClassNames: sinon.spy(this.presenter, 'upgradePagesButtonCssClassNames')
        };
    },

    tearDown: function () {
        this.presenter.upgradeAttemptedPages.restore();
        this.presenter.upgradePagesButtonCssClassNames.restore();
    },

    'test should call upgrade attempted pages': function () {
        this.presenter.upgradeState({});

        assertTrue(this.spies.upgradeAttemptedPages.calledOnce);
    },

    'test should call upgrade pages button css class names': function () {
        this.presenter.upgradeState({});

        assertTrue(this.spies.upgradePagesButtonCssClassNames.calledOnce);
    },

    'test should properly upgrade state without attempted pages': function () {
        var expectedState = {
            attemptedPages: []
        };

        var upgradedState = this.presenter.upgradeState({});

        assertEquals(expectedState, upgradedState);
    },

    'test should properly upgrade state without page button css class names': function () {
        var inputState = {
            pages: [{
                page: 1,
                description: "test description",
                sectionName: "test section name",
                sectionClassName: "test section ccs classname",
                isBookmarkOn: true
            }],
            attemptedPages: []
        }
        var expectedState = {
            pages: [{
                page: 1,
                description: "test description",
                sectionName: "test section name",
                sectionClassName: "test section ccs classname",
                buttonCssClassNames: [],
                isBookmarkOn: true,
                staticPosition: ""
            }],
            attemptedPages: []
        };

        var upgradedState = this.presenter.upgradeState(inputState);

        assertEquals(expectedState, upgradedState);
    },

    'test should not upgrade complete state': function () {
        var completedState = {
            pages: [{
                page: 1,
                description: "test description",
                sectionName: "test section name",
                sectionClassName: "test section ccs classname",
                buttonCssClassNames: ["AClass", "BClass"],
                isBookmarkOn: true
            }],
            attemptedPages: [1, 2, 3]
        };

        var expectedState = {
            pages: [{
                page: 1,
                description: "test description",
                sectionName: "test section name",
                sectionClassName: "test section ccs classname",
                buttonCssClassNames: ["AClass", "BClass"],
                isBookmarkOn: true,
                staticPosition: ""
            }],
            attemptedPages: [1, 2, 3]
        };

        var upgradedState = this.presenter.upgradeState(completedState);

        assertEquals(expectedState, upgradedState);
    }
});

TestCase("[Assessments_Navigation_Bar] UpgradeAttemptedPages", {
    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();
    },

    'test should upgrade missing attempted pages with empty array': function () {
        var expectedState = {
            attemptedPages: []
        };

        var upgradedState = this.presenter.upgradeAttemptedPages({});

        assertEquals(expectedState, upgradedState);
    },

    'test shouldnt upgrade attempted pages if they exists in state': function () {
        var expectedState = {
            attemptedPages: [1, 2, 3, 4, 5]
        };

        var upgradedState = this.presenter.upgradeAttemptedPages(expectedState);

        assertEquals(expectedState, upgradedState);
    }
});

TestCase("[Assessments_Navigation_Bar] UpgradePagesButtonCssClassNames", {
    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();
    },

    'test should upgrade missing button css class names with empty array': function () {
        var inputState = {
            pages: [{
                page: 1,
                description: "test description",
                sectionName: "test section name",
                sectionClassName: "test section ccs classname",
                isBookmarkOn: true
            }],
            attemptedPages: [1, 2, 3, 4, 5]
        };
        var expectedState = {
            pages: [{
                page: 1,
                description: "test description",
                sectionName: "test section name",
                sectionClassName: "test section ccs classname",
                buttonCssClassNames: [],
                isBookmarkOn: true
            }],
            attemptedPages: [1, 2, 3, 4, 5]
        };

        var upgradedState = this.presenter.upgradePagesButtonCssClassNames(inputState);

        assertEquals(expectedState, upgradedState);
    },

    'test should not upgrade attempted pages if they exists in state': function () {
        var expectedState = {
            pages: [{
                page: 1,
                description: "test description",
                sectionName: "test section name",
                sectionClassName: "test section ccs classname",
                buttonCssClassNames: ["AClass", "BClass"],
                isBookmarkOn: true
            }],
            attemptedPages: [1, 2, 3, 4, 5]
        };

        var upgradedState = this.presenter.upgradePagesButtonCssClassNames(expectedState);

        assertEquals(expectedState, upgradedState);
    }
});
