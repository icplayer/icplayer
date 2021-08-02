function AddonPage_Name_create() {
    var presenter = function () {};
    var presentationController;
    var printableController;

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

    presenter.setPrintableController = function (controller) {
        printableController = controller;
    };

    presenter.getPrintableHTML = function (model, showAnswers) {
        var $view = $("<div></div>");
        $view.attr("id", model.ID);
        $view.addClass("printable_addon_pagename");

        var $wrapper = $("<div></div>");
        $wrapper.addClass("printable_pagename_wrapper");
        $wrapper.html(printableController.getPageName());

        
        $view.append($wrapper);
        return $view[0].outerHTML;
    }

    return presenter;
}