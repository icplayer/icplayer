TestCase('[Assessments_Navigation_Bar] Page class', {
   setUp: function () {
       this.presenter = AddonAssessments_Navigation_Bar_create();

       this.stubs = {
           changeToPageStub: sinon.stub()
       };

       this.presenter.changeToPage = this.stubs.changeToPageStub;

       this.pageParams = {
            pageNumber: 2,
            pageDescription: '2',
            pageSectionName: 'name',
            pageCssClass: 'class'
       };

       this.page = new this.presenter.Page(this.pageParams.pageNumber, this.pageParams.pageDescription, this.pageParams.pageSectionName, this.pageParams.pageCssClass);
   },

    'test executing changeToPageCommand should change page to 2': function () {
        var command = this.page.getChangeToPageCommand();
        command();
        var arguments = this.stubs.changeToPageStub.getCall(0).args;

        assertEquals(this.pageParams.pageNumber, arguments);
    }
});