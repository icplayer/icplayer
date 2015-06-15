TestCase("[Commons - Watermark] Watermark drawing", {
    'test draw element with default options': function() {
        /*:DOC += <div id="watermark-draw"></div> */

        Watermark.draw($('#watermark-draw'), undefined);

        assertEquals(1, $('#watermark-draw canvas').length);
    }
});