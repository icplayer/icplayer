TestCase("Create Steps Tests", {

    setUp: function () {
        this.presenter = AddonLine_Number_create();
        this.presenter.configuration = {
            'axisXValues' : [1, 2, 3],
            'min' : -5,
            'max' : 5,
            'showAxisXValues' : true,
            'otherRanges' : [],
            'shouldDrawRanges' : [],
            'step' :  {
                parsedValue: 1,
                precision : 0
            }
        };
        this.presenter.$view = $('<div class="outer">' +
                                    '<div class="inner">' +
                                        '<div class="x-axis">' +
                                            '<div class="x-arrow"></div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>');

    },

    'test create steps append correct amount of elements when axisXValues is set': function() {
        this.presenter.createSteps();

        assertEquals('', 11, this.presenter.$view.find('.stepLine').length);
        assertEquals('Only texts which value is in axisXValues', 3, this.presenter.$view.find('.stepText').length);
    },

    'test create steps append correct amount of elements': function() {
        this.presenter.configuration.axisXValues = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4];
        this.presenter.createSteps();

        assertEquals('', 11, this.presenter.$view.find('.stepLine').length);
        assertEquals('Only texts which value is in axisXValues', 10, this.presenter.$view.find('.stepText').length);
    },

    'test create steps append correct amount of elements when Show Axis Values is set to false': function() {
        this.presenter.configuration.showAxisXValues = false;
        this.presenter.createSteps();

        assertEquals('', 11, this.presenter.$view.find('.stepLine').length);
        assertEquals('No texts if Show Axis X Values is set to false', 0, this.presenter.$view.find('.stepText').length);
    }
});