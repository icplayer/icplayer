TestCase("[Paragraph Keyboard] getOpenEndedContent method test", {
   setUp: function () {
        this.presenter = AddonParagraph_Keyboard_create();
        this.presenter.editor = {
            id: "mce_1",
            content: '',
            getContent: function () {
                return this.content;
            },
            setContent: function (newContent) {
                this.content = newContent;
            }
        };
   },

   'test given empty content when getOpenEndedContent then return empty': function () {
       this.presenter.editor.setContent("");

       const result = this.presenter.getOpenEndedContent();

       assertEquals("", result);
   },

   'test given not empty content when getOpenEndedContent then return equals previously set content': function () {
       const content = "<p style=\"font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 11px;\"><strong>wwq</strong><br data-mce-bogus=\"1\"></p><p style=\"font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 11px;\"><em><strong>usj<br data-mce-bogus=\"1\"></strong></em></p><p style=\"font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 11px; text-align: right;\" data-mce-style=\"font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 11px; text-align: right;\"><span style=\"text-decoration: underline;\" data-mce-style=\"text-decoration: underline;\"><em><strong>dçççææçô<br data-mce-bogus=\"1\"></strong></em></span></p>";
       this.presenter.editor.setContent(content);

       const result = this.presenter.getOpenEndedContent();

       assertEquals(content, result);
   },
});
