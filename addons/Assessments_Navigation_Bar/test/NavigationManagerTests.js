TestCase("[Assessments_Navigation_Bar] [NavigationManager] Move to current page", {
    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();

        this.doesActualPageExistsStub = sinon.stub();
        this.presenter.sections = {
            doesActualPageExists: this.doesActualPageExistsStub
        };

        this.stubs = {
            isActualPage: sinon.stub(),
            isActualPage1: sinon.stub(),
            isActualPage2: sinon.stub(),
            rightHellipExecute: sinon.stub(),
            initView: sinon.stub(this.presenter.NavigationManager.prototype, 'initView')
        };

        this.spies = {
            moveToCurrentPage: sinon.spy(this.presenter.NavigationManager.prototype, 'moveToCurrentPage'),
            moveToCurrentPageLogic: sinon.spy(this.presenter.NavigationManager.prototype, 'moveToCurrentPageLogic')
        };

        this.actualPagesMock = [
            {isActualPage: this.stubs.isActualPage},
            {isActualPage: this.stubs.isActualPage1},
            {isActualPage: this.stubs.isActualPage2}
        ];

        this.rightHellipMock = {
            execute: this.stubs.rightHellipExecute
        };

        this.navigation = new this.presenter.NavigationManager(0);
        this.navigation.actualPages = this.actualPagesMock;
        this.navigation.rightHellip = this.rightHellipMock;
    },

    tearDown: function () {
        this.presenter.NavigationManager.prototype.initView.restore();
        this.presenter.NavigationManager.prototype.moveToCurrentPage.restore();
        this.presenter.NavigationManager.prototype.moveToCurrentPageLogic.restore();
    },

    'test move to current page should not execute right hellip when actual page found': function () {
        this.doesActualPageExistsStub.returns(true);
        this.stubs.isActualPage.returns(false);
        this.stubs.isActualPage1.returns(false);
        this.stubs.isActualPage2.returns(true);

        this.navigation.moveToCurrentPage();

        assertTrue(this.spies.moveToCurrentPageLogic.called);
        assertFalse(this.stubs.rightHellipExecute.called);
        assertTrue(this.spies.moveToCurrentPage.calledOnce);
    },

    'test when page doesnt exists it should do nothing': function () {
        this.doesActualPageExistsStub.returns(false);
        this.navigation.moveToCurrentPage();

        assertFalse(this.spies.moveToCurrentPageLogic.called);
    }
});

TestCase("[Assessments_Navigation_Bar] [NavigationManager] Set Sections", {
    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();

        this.stubs = {
            initView: sinon.stub(this.presenter.NavigationManager.prototype, 'initView'),
            clearStateAndButtons: sinon.stub(this.presenter.NavigationManager.prototype, 'clearStateAndButtons'),
            addLeftHellip: sinon.stub(this.presenter.NavigationManager.prototype, 'addLeftHellip'),
            addRightHellip: sinon.stub(this.presenter.NavigationManager.prototype, 'addRightHellip'),
            addSections: sinon.stub(this.presenter.NavigationManager.prototype, 'addSections'),
            calculateNumberOfPages: sinon.stub(this.presenter.NavigationManager.prototype, 'calculateNumberOfPages')
        };

        this.navigation = new this.presenter.NavigationManager(0);
    },

    tearDown: function () {
        this.presenter.NavigationManager.prototype.initView.restore();
        this.presenter.NavigationManager.prototype.clearStateAndButtons.restore();
        this.presenter.NavigationManager.prototype.addLeftHellip.restore();
        this.presenter.NavigationManager.prototype.addRightHellip.restore();
        this.presenter.NavigationManager.prototype.addSections.restore();
        this.presenter.NavigationManager.prototype.calculateNumberOfPages.restore();
    },

    'test should clear state and buttons at first': function () {
        this.navigation.setSections();

        assertTrue(this.stubs.clearStateAndButtons.calledOnce);
        assertTrue(this.stubs.clearStateAndButtons.calledBefore(this.stubs.addLeftHellip));
        assertTrue(this.stubs.clearStateAndButtons.calledBefore(this.stubs.addRightHellip));
        assertTrue(this.stubs.clearStateAndButtons.calledBefore(this.stubs.addSections));
    },

    'test should call addSections with calculate numberOfPages': function () {
        this.stubs.calculateNumberOfPages.returns(4);
        this.navigation.setSections();

        assertTrue(this.stubs.addSections.calledOnce);
        assertTrue(this.stubs.addSections.calledWith(4));
    }
});

TestCase("[Assessments_Navigation_Bar] [NavigationManager] Add sections", {
    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();
        this.expectedPages = [1, 2, 3];

        this.sectionsMock = {
            getPages: function () {return [1, 2, 3];},
            getStaticPages: sinon.stub(this.presenter.Sections.prototype, 'getStaticPages')
        };
        this.sectionsMock.getStaticPages.returns([]);
        this.presenter.sections = this.sectionsMock;

        this.stubs = {
            initView: sinon.stub(this.presenter.NavigationManager.prototype, 'initView'),
            getPageButton: sinon.stub(this.presenter.NavigationManager.prototype, 'getPageButton'),
            setButtonProperties: sinon.stub(this.presenter.NavigationManager.prototype, 'setButtonProperties'),
            addButtonToSection: sinon.stub(this.presenter.NavigationManager.prototype, 'addButtonToSection'),
            appendSectionsToView: sinon.stub(this.presenter.NavigationManager.prototype, 'appendSectionsToView'),
            deactivateNavigationButtons: sinon.stub(this.presenter.NavigationManager.prototype, 'deactivateNavigationButtons'),
            appendStaticPages: sinon.stub(this.presenter.NavigationManager.prototype, 'appendStaticPages'),
        };

        this.navigation = new this.presenter.NavigationManager(0);
    },

    tearDown: function () {
        this.presenter.NavigationManager.prototype.initView.restore();
        this.presenter.NavigationManager.prototype.getPageButton.restore();
        this.presenter.NavigationManager.prototype.setButtonProperties.restore();
        this.presenter.NavigationManager.prototype.addButtonToSection.restore();
        this.presenter.NavigationManager.prototype.appendSectionsToView.restore();
        this.presenter.NavigationManager.prototype.deactivateNavigationButtons.restore();
        this.presenter.NavigationManager.prototype.appendStaticPages.restore();
    },

    'test should set actualPages attribute to pages received from getPages': function () {
        this.navigation.addSections(1);

        assertEquals(this.expectedPages, this.navigation.actualPages);
    },

    'test should get buttons equal to number of pages': function () {
        this.navigation.addSections(1);

        assertEquals(3, this.stubs.getPageButton.callCount);
    },

    'test should append sections to view': function () {
        this.navigation.addSections(1);

        assertTrue(this.stubs.appendSectionsToView.calledOnce);
    },

    'test should deactivate navigation buttons': function () {
        this.navigation.addSections(1);

        assertTrue(this.stubs.deactivateNavigationButtons.calledOnce);
    }
});

TestCase("[Assessments_Navigation_Bar] [Navigation Manager] Go Right/Left", {
    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();

        this.stubs = {
            getNextPageToCurrent: sinon.stub(),
            getPreviousPageToCurrent: sinon.stub(),
            changeToPage: sinon.stub(this.presenter, 'changeToPage')
        };

        this.expectedIndex = 5;
        this.mockPage = {
            page: this.expectedIndex
        };

        this.presenter.sections = {
            getNextPageToCurrent: this.stubs.getNextPageToCurrent,
            getPreviousPageToCurrent: this.stubs.getPreviousPageToCurrent
        };
    },

    tearDown: function () {
        this.presenter.changeToPage.restore();
    },

    'test go right should should call getNextPageToCurrent': function () {
        this.presenter.NavigationManager.prototype.goRight();

        assertTrue(this.stubs.getNextPageToCurrent.calledOnce);
        assertFalse(this.stubs.getPreviousPageToCurrent.called);
    },

    'test go right should change to page index from retrieved page': function () {
        this.stubs.getNextPageToCurrent.returns(this.mockPage);

        this.presenter.NavigationManager.prototype.goRight();

        assertTrue(this.stubs.changeToPage.calledOnce);
        assertTrue(this.stubs.changeToPage.calledWith(this.expectedIndex));
    },

    'test go right shouldnt change page if page retrieved from get next page is undefined': function () {
        this.stubs.getNextPageToCurrent.returns(undefined);

        this.presenter.NavigationManager.prototype.goRight();

        assertFalse(this.stubs.changeToPage.called);
    },

    'test go left should should call getPreviousPageToCurrent': function () {
        this.presenter.NavigationManager.prototype.goLeft();

        assertTrue(this.stubs.getPreviousPageToCurrent.calledOnce);
        assertFalse(this.stubs.getNextPageToCurrent.called);
    },

    'test go left should change to page index from retrieved page': function () {
        this.stubs.getPreviousPageToCurrent.returns(this.mockPage);

        this.presenter.NavigationManager.prototype.goLeft();

        assertTrue(this.stubs.changeToPage.calledOnce);
        assertTrue(this.stubs.changeToPage.calledWith(this.expectedIndex));
    },

    'test go left shouldnt change page if page retrieved from get previous page is undefined': function () {
        this.stubs.getPreviousPageToCurrent.returns(undefined);

        this.presenter.NavigationManager.prototype.goLeft();

        assertFalse(this.stubs.changeToPage.called);
    }
});

TestCase("[Assessments_Navigation_Bar] [Navigation Manager] Clear State and Buttons", {
    setUp: function () {
        this.presenter = AddonAssessments_Navigation_Bar_create();
        this.stubs = {
            initView: sinon.stub(this.presenter.NavigationManager.prototype, 'initView'),
            removeSections: sinon.stub(this.presenter.NavigationManager.prototype, 'removeSections'),
            removeHellips: sinon.stub(this.presenter.NavigationManager.prototype, 'removeHellips'),
            removeInactiveClassFromNavigationButtons: sinon.stub(this.presenter.NavigationManager.prototype, 'removeInactiveClassFromNavigationButtons')
        };

        this.manager = new this.presenter.NavigationManager();
    },

    tearDown: function () {
        this.presenter.NavigationManager.prototype.initView.restore();
        this.presenter.NavigationManager.prototype.removeSections();
        this.presenter.NavigationManager.prototype.removeHellips();
        this.presenter.NavigationManager.prototype.removeInactiveClassFromNavigationButtons();
    },

    'test should remove sections': function () {
        this.manager.clearStateAndButtons();

        assertTrue(this.stubs.removeSections.calledOnce);
    },

    'test should remove hellips': function () {
        this.manager.clearStateAndButtons();

        assertTrue(this.stubs.removeHellips.calledOnce);
    },

    'test should remove inactive class from navigation buttons': function () {
        this.manager.clearStateAndButtons();

        assertTrue(this.stubs.removeInactiveClassFromNavigationButtons.calledOnce);
    },

    'test should set buttons to empty array': function () {
        this.manager.clearStateAndButtons();

        assertEquals([], this.manager.buttons);
    },

    'test should set actualPages to empty array': function () {
        this.manager.clearStateAndButtons();

        assertEquals([], this.manager.actualPages);
    }
});