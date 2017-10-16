TestCase("[Gamememo] Upgrading model", {
    setUp: function () {
        this.presenter = Addongamememo_create();

        this.model = {

        }
    },

    'test should upgrade model': function () {
        var upgraded = this.presenter.upgradeModel(this.model);
        var expected = "False";

        assertEquals(expected, upgraded["Enable tabindex"]);
    },

    'test should not upgrade model when property already exists': function () {
        var expected = "True";
        this.model['Enable tabindex'] = expected;

        var upgraded = this.presenter.upgradeModel(this.model);

        assertEquals(expected, upgraded["Enable tabindex"]);
    }


});