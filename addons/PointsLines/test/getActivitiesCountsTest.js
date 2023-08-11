TestCase("[PointsLines] getActivitiesCount function", {
  setUp: function () {
    this.presenter = AddonPointsLines_create();

    this.presenter.points = [
      [100, 50],
      [50, 100],
      [125, 125],
      [200, 80],
    ];
    this.presenter.answer = [
      [0, 1, 0, 0],
      [null, 0, 0, 0],
      [null, null, 0, 1],
      [null, null, null, 0],
    ];
  },

  "test should return 1 when showAllAnswersInGradualShowAnswersMode is active":
    function () {
      this.presenter.showAllAnswersInGradualShowAnswersMode = true;

      assertTrue(this.presenter.getActivitiesCount() === 1);
    },

  "test should return answers count when showAllAnswersInGradualShowAnswersMode is inactive":
    function () {
      this.presenter.showAllAnswersInGradualShowAnswersMode = false;

      assertTrue(this.presenter.getActivitiesCount() === 2);
    },
});
