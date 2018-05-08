TestCase("[Hierarchical Lesson Report - WCAG] keyboard controller", {
    setUp: function () {
        this.presenter = AddonHierarchical_Lesson_Report_create();


        this.cellIsVisible = function(rowNumber, columnNumber){
            if(columnNumber<0 || columnNumber>5) return false;
            if(rowNumber<1 || rowNumber > 8 || (1<rowNumber && rowNumber<6)) return false; // the report has 9 rows (including headers) and rows from 2 to 5 are collapsed
            return true;
        };

        this.presenter.$view = $('<div>');
        this.presenter.$view.append('<div class="hier_report" style="height: 390px" id="Hierarchical_Lesson_Report1">\n' +
            '     <table style="width: 100%">\n' +
            '     <tbody><tr class="hier_report-header"><td> lesson report</td><td class="hier_report-progress"> results</td><td class="hier_report-checks"> checks</td><td class="hier_report-mistakes"> mistakes</td><td class="hier_report-errors"> errors</td><td class="hier_report-page-score">score</td></tr><tr class="treegrid-0 hier_report-chapter treegrid-collapsed"><td class=""><div class="treegrid-expander treegrid-expander-collapsed"></div><div class="text-wrapper">Chapter A</div></td><td class="hier_report-progress"><div id="progressbar-0" class="hier_report-progressbar ui-progressbar ui-widget ui-widget-content ui-corner-all" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="ui-progressbar-value ui-widget-header ui-corner-left" style="display: none; width: 0%;"></div></div><div style="float: right">0%</div></td><td class="hier_report-checks">0</td><td class="hier_report-mistakes">0</td><td class="hier_report-errors">0</td><td class="hier_report-page-score">-</td></tr><tr class="treegrid-1 treegrid-parent-0 hier_report-odd" style="display: none;"><td class=""><span class="treegrid-indent"></span><div class="treegrid-expander"></div><div class="text-wrapper"><a href="#" data-page-id="vLVuE5yLDTPg5pxI">Page 1</a></div></td><td class="hier_report-progress"><div id="progressbar-1" class="hier_report-progressbar ui-progressbar ui-widget ui-widget-content ui-corner-all" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="ui-progressbar-value ui-widget-header ui-corner-left" style="display: none; width: 0%;"></div></div><div style="float: right">0%</div></td><td class="hier_report-checks">0</td><td class="hier_report-mistakes">0</td><td class="hier_report-errors">0</td><td class="hier_report-page-score">-</td></tr><tr class="treegrid-2 treegrid-parent-0 hier_report-even" style="display: none;"><td class=""><span class="treegrid-indent"></span><div class="treegrid-expander"></div><div class="text-wrapper"><a href="#" data-page-id="k873Vz1h9tgTxRfN">Page 2</a></div></td><td class="hier_report-progress"><div id="progressbar-2" class="hier_report-progressbar ui-progressbar ui-widget ui-widget-content ui-corner-all" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="ui-progressbar-value ui-widget-header ui-corner-left" style="display: none; width: 0%;"></div></div><div style="float: right">0%</div></td><td class="hier_report-checks">0</td><td class="hier_report-mistakes">0</td><td class="hier_report-errors">0</td><td class="hier_report-page-score">-</td></tr><tr class="treegrid-3 treegrid-parent-0 hier_report-chapter treegrid-collapsed" style="display: none;"><td class=""><span class="treegrid-indent"></span><div class="treegrid-expander treegrid-expander-collapsed"></div><div class="text-wrapper">Chapter B</div></td><td class="hier_report-progress"><div id="progressbar-3" class="hier_report-progressbar ui-progressbar ui-widget ui-widget-content ui-corner-all" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="ui-progressbar-value ui-widget-header ui-corner-left" style="display: none; width: 0%;"></div></div><div style="float: right">0%</div></td><td class="hier_report-checks">0</td><td class="hier_report-mistakes">0</td><td class="hier_report-errors">0</td><td class="hier_report-page-score">-</td></tr><tr class="treegrid-4 treegrid-parent-3 hier_report-even" style="display: none;"><td><span class="treegrid-indent"></span><span class="treegrid-indent"></span><div class="treegrid-expander"></div><div class="text-wrapper"><a href="#" data-page-id="RWjwQ6vpJ2LO7tMo">Page 3</a></div></td><td class="hier_report-progress"><div id="progressbar-4" class="hier_report-progressbar ui-progressbar ui-widget ui-widget-content ui-corner-all" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="ui-progressbar-value ui-widget-header ui-corner-left" style="display: none; width: 0%;"></div></div><div style="float: right">0%</div></td><td class="hier_report-checks">0</td><td class="hier_report-mistakes">0</td><td class="hier_report-errors">0</td><td class="hier_report-page-score">-</td></tr><tr class="treegrid-5 hier_report-odd"><td class=""><div class="treegrid-expander"></div><div class="text-wrapper"><a href="#" data-page-id="rYSHicQ2JUNisev1">Page 4</a></div></td><td class="hier_report-progress"><div id="progressbar-5" class="hier_report-progressbar ui-progressbar ui-widget ui-widget-content ui-corner-all" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="ui-progressbar-value ui-widget-header ui-corner-left" style="display: none; width: 0%;"></div></div><div style="float: right">0%</div></td><td class="hier_report-checks">0</td><td class="hier_report-mistakes">0</td><td class="hier_report-errors">0</td><td class="hier_report-page-score">-</td></tr><tr class="treegrid-6 hier_report-even"><td class=""><div class="treegrid-expander"></div><div class="text-wrapper"><a href="#" data-page-id="n5W100IpP6cf6IFw">Page 5</a></div></td><td class="hier_report-progress"><div id="progressbar-6" class="hier_report-progressbar ui-progressbar ui-widget ui-widget-content ui-corner-all" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100"><div class="ui-progressbar-value ui-widget-header ui-corner-left ui-corner-right" style="width: 100%;"></div></div><div style="float: right">100%</div></td><td class="hier_report-checks">0</td><td class="hier_report-mistakes">0</td><td class="hier_report-errors">0</td><td class="hier_report-page-score">0<span class="hier_report-separator">/</span>0</td></tr><tr class="hier_report-footer"><td>total</td><td class="hier_report-progress"><div id="progressbar-undefined" class="hier_report-progressbar ui-progressbar ui-widget ui-widget-content ui-corner-all" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="20"><div class="ui-progressbar-value ui-widget-header ui-corner-left" style="width: 20%;"></div></div><div style="float: right">20%</div></td><td class="hier_report-checks">0</td><td class="hier_report-mistakes">0</td><td class="hier_report-errors">0</td><td class="hier_report-page-score">0<span class="hier_report-separator">/</span>0</td></tr></tbody></table>\n' +
            ' </div>');

        this.stubs = {
            speak: sinon.stub(this.presenter, 'speak'),
            readCell: sinon.stub(this.presenter, 'readCurrentCell'),
            readRowAndCell: sinon.stub(this.presenter, 'readCurrentRowAndCell'),
            cellIsVisible: sinon.stub(this.presenter,'cellIsVisible').callsFake(this.cellIsVisible),
        };

        this.presenter.configuration = {
            showResults: true,
            showChecks: true,
            showMistakes: true,
            showErrors: true,
            showPageScore: true
        };
        },

    tearDown: function () {
    },

    'test keyboard navigation - arrows': function () {
        this.presenter.keyboardController(13,false); // ENTER
        assertTrue(this.presenter.$view.find('tr:eq(1) > td:eq(0)').hasClass('keyboard_navigation_active_element'));
        this.presenter.keyboardController(39,false); // RIGHT
        this.presenter.keyboardController(39,false);
        assertFalse(this.presenter.$view.find('tr:eq(1) > td:eq(0)').hasClass('keyboard_navigation_active_element'));
        assertTrue(this.presenter.$view.find('tr:eq(1) > td:eq(2)').hasClass('keyboard_navigation_active_element'));
        this.presenter.keyboardController(40,false); // DOWN
        assertFalse(this.presenter.$view.find('tr:eq(1) > td:eq(2)').hasClass('keyboard_navigation_active_element'));
        assertFalse(this.presenter.$view.find('tr:eq(2) > td:eq(2)').hasClass('keyboard_navigation_active_element'));
        assertTrue(this.presenter.$view.find('tr:eq(6) > td:eq(2)').hasClass('keyboard_navigation_active_element'));
        this.presenter.keyboardController(37,false); // LEFT
        assertFalse(this.presenter.$view.find('tr:eq(6) > td:eq(2)').hasClass('keyboard_navigation_active_element'));
        assertTrue(this.presenter.$view.find('tr:eq(6) > td:eq(1)').hasClass('keyboard_navigation_active_element'));
        this.presenter.keyboardController(38,false); // UP
        assertFalse(this.presenter.$view.find('tr:eq(6) > td:eq(1)').hasClass('keyboard_navigation_active_element'));
        assertTrue(this.presenter.$view.find('tr:eq(1) > td:eq(1)').hasClass('keyboard_navigation_active_element'));
    },

    'test keyboard navigation - Escape': function () {
        this.presenter.keyboardController(13,false); // ENTER
        assertTrue(this.presenter.$view.find('tr:eq(1) > td:eq(0)').hasClass('keyboard_navigation_active_element'));
        this.presenter.keyboardController(39,false); // RIGHT
        assertFalse(this.presenter.$view.find('tr:eq(1) > td:eq(0)').hasClass('keyboard_navigation_active_element'));
        assertTrue(this.presenter.$view.find('tr:eq(1) > td:eq(1)').hasClass('keyboard_navigation_active_element'));
        this.presenter.keyboardController(27,false); //ESCAPE
        assertFalse(this.presenter.$view.find('tr:eq(1) > td:eq(0)').hasClass('keyboard_navigation_active_element'));
        assertFalse(this.presenter.$view.find('tr:eq(1) > td:eq(1)').hasClass('keyboard_navigation_active_element'));
        this.presenter.keyboardController(13,false); // ENTER
        assertTrue(this.presenter.$view.find('tr:eq(1) > td:eq(0)').hasClass('keyboard_navigation_active_element'));

    },

    'test keyboard navigation - Ctrl + Enter': function () {
        this.presenter.keyboardController(13,false); // ENTER
        assertTrue(this.presenter.$view.find('tr:eq(1) > td:eq(0)').hasClass('keyboard_navigation_active_element'));
        this.presenter.keyboardController(13,true); // RIGHT
        assertFalse(this.presenter.$view.find('tr:eq(1) > td:eq(0)').hasClass('keyboard_navigation_active_element'));
    },

    'test keyboard navigation - Tab': function () {
        this.presenter.keyboardController(13,false); // ENTER
        assertTrue(this.presenter.$view.find('tr:eq(1) > td:eq(0)').hasClass('keyboard_navigation_active_element'));
        this.presenter.keyboardController(9, false); // TAB
        assertFalse(this.presenter.$view.find('tr:eq(1) > td:eq(0)').hasClass('keyboard_navigation_active_element'));
        assertTrue(this.presenter.$view.find('tr:eq(1) > td:eq(1)').hasClass('keyboard_navigation_active_element'));
        for(var i=0; i < 6; i++) { // Press Tab multiple times in order to move to the next row
            this.presenter.keyboardController(9, false);
        }
        assertFalse(this.presenter.$view.find('tr:eq(1) > td:eq(1)').hasClass('keyboard_navigation_active_element'));
        assertTrue(this.presenter.$view.find('tr:eq(6) > td:eq(1)').hasClass('keyboard_navigation_active_element'));
        this.presenter.keyboardController(9, true); // SHIFT + TAB
        assertFalse(this.presenter.$view.find('tr:eq(6) > td:eq(1)').hasClass('keyboard_navigation_active_element'));
        assertTrue(this.presenter.$view.find('tr:eq(6) > td:eq(0)').hasClass('keyboard_navigation_active_element'));
        this.presenter.keyboardController(9, true); // SHIFT + TAB moving to a new row
        assertFalse(this.presenter.$view.find('tr:eq(6) > td:eq(0)').hasClass('keyboard_navigation_active_element'));
        assertTrue(this.presenter.$view.find('tr:eq(1) > td:eq(5)').hasClass('keyboard_navigation_active_element'));
    },

    'test keyboard navigation - detecting moving out of table bounds': function () {
        this.presenter.keyboardController(13,false); // ENTER
        assertTrue(this.presenter.$view.find('tr:eq(1) > td:eq(0)').hasClass('keyboard_navigation_active_element'));
        this.presenter.keyboardController(37,false); // LEFT
        assertTrue(this.presenter.$view.find('tr:eq(1) > td:eq(0)').hasClass('keyboard_navigation_active_element'));
        this.presenter.keyboardController(38,false); // UP
        assertTrue(this.presenter.$view.find('tr:eq(1) > td:eq(0)').hasClass('keyboard_navigation_active_element'));
        this.presenter.keyboardController(9,true); // SHIFT + TAB
        assertTrue(this.presenter.$view.find('tr:eq(1) > td:eq(0)').hasClass('keyboard_navigation_active_element'));
        for (var i = 0; i<5; i++){
            this.presenter.keyboardController(9,false); // Move to the right side of the table
        }
        assertTrue(this.presenter.$view.find('tr:eq(1) > td:eq(5)').hasClass('keyboard_navigation_active_element'));
        this.presenter.keyboardController(39,false); // RIGHT
        assertTrue(this.presenter.$view.find('tr:eq(1) > td:eq(5)').hasClass('keyboard_navigation_active_element'));
        for (var i = 0; i<3; i++){
            this.presenter.keyboardController(40,false); // Move to the bottom of the table
        }
        assertTrue(this.presenter.$view.find('tr:eq(8) > td:eq(5)').hasClass('keyboard_navigation_active_element'));
        this.presenter.keyboardController(40,false); // DOWN
        assertTrue(this.presenter.$view.find('tr:eq(8) > td:eq(5)').hasClass('keyboard_navigation_active_element'));
        this.presenter.keyboardController(9,false); // TAB
        assertTrue(this.presenter.$view.find('tr:eq(8) > td:eq(5)').hasClass('keyboard_navigation_active_element'));

    }
});