function AddonPage_Name_Development_create() {
    var presenter = function () {};
    var presentationController;

    function presenterLogic(view, name) {
        var nameElement = $(view).find('.pagename')[0];

        $(nameElement).text(name);
    }

    presenter.createPreview = function (view, model) {
        presenterLogic(view, "Page Name");
    };

    presenter.getPageName = function () {
        var presentation = presentationController.getPresentation();
        var currentPage = presentationController.getCurrentPageIndex();

        return presentation.getPage(currentPage).getName();
    };


    presenter.run = function (view, model) {
        var pageName = this.getPageName();

        presenterLogic(view, pageName);
    };

    presenter.setPlayerController = function(controller) {
        presentationController = controller;
    };

    return presenter;
}