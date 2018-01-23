TestCase("Utils functions", {
    setUp: function () {
        this.presenter = AddonText_To_Speech_create();

    },

    'test getGapAppearanceAtIndexOfType' : function () {
        var gaps;

        gaps = ['#1#'];
        assertEquals(1, this.presenter.getGapAppearanceAtIndexOfType(gaps, 1));

        gaps = ['#1#', '#1#', '#1#', '#1#', '#1#'];
        assertEquals(5, this.presenter.getGapAppearanceAtIndexOfType(gaps, 5));

        gaps = ['#1#', '#2#', '#3#', '#4#', '#4#'];
        assertEquals(1, this.presenter.getGapAppearanceAtIndexOfType(gaps, 3));

        gaps = ['#1#', '#2#', '#3#', '#2#', '#1#'];
        assertEquals(2, this.presenter.getGapAppearanceAtIndexOfType(gaps, 5));

        gaps = ['#1#', '#2#', '#1#', '#2#', '#1#'];
        assertEquals(2, this.presenter.getGapAppearanceAtIndexOfType(gaps, 4));
    }

});
