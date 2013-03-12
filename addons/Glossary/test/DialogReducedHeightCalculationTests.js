TestCase("Dialog reduced height calculation", {
    setUp: function() {
        this.presenter = AddonGlossary_create();
    },

    'test reduce dialog size': function() {
        /*:DOC += <div class="ui-dialog" style="padding: 10px;"><div class="ui-dialog-titlebar" style="height: 80px; border-width: 5px;"></div><div class="ui-dialog-content" style="margin: 3px;"></div></div> */

        var reducedHeight = this.presenter.calculateReducedDialogHeight($('body .ui-dialog:first'), 300);

        assertEquals(194, reducedHeight);
    }
});