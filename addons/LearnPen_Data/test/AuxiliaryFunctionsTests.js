TestCase("[LearnPen_Data] Auxiliary functions", {

    setUp: function() {
        this.presenter = AddonLearnPen_Data_create();
    },

    'test is sensor line check' : function() {
        assertTrue(this.presenter.isSensorLine('A'));
        assertTrue(this.presenter.isSensorLine('B'));
        assertTrue(this.presenter.isSensorLine('C'));
        assertTrue(this.presenter.isSensorLine('A;B;C'));

        assertFalse(this.presenter.isSensorLine('D'));
        assertFalse(this.presenter.isSensorLine('50%;red'));
        assertFalse(this.presenter.isSensorLine('ABC'));
    },

    'test is value line check' : function() {
        assertTrue(this.presenter.isValueLine("50%;red"));
        assertTrue(this.presenter.isValueLine("90% ; blue"));
        assertTrue(this.presenter.isValueLine("3%;#111111"));
        assertTrue(this.presenter.isValueLine("77%;#333"));
        assertTrue(this.presenter.isValueLine("77%                          ;                       #333"));

        assertFalse(this.presenter.isValueLine('D'));
        assertFalse(this.presenter.isValueLine("1000%;#333"));
        assertFalse(this.presenter.isValueLine("%45   ;    blelow"));
    }

});