TestCase("[Plot] PlotTests", {
    setUp: function() {
        this.presenter = AddonPlot_create();
        this.plot = this.presenter.getPlot();
    },
    'test calculate precision > 1': function() {
        this.plot.gridStepX = 1;
        this.plot.gridStepY = 1;
        this.plot.calculatePrecision();
        assertEquals(this.plot.precision, {x: 100, y: 100});

        this.plot.gridStepX = 1.006;
        this.plot.gridStepY = 1.006;
        this.plot.calculatePrecision();
        assertEquals(this.plot.precision, {x: 1000, y: 1000});
    },
    'test calculate precision < 1': function() {
        this.plot.gridStepX = 0.1;
        this.plot.gridStepY = 0.1;
        this.plot.calculatePrecision();
        assertEquals(this.plot.precision, {x: 10, y: 10});

        this.plot.gridStepX = 0.01;
        this.plot.gridStepY = 0.01;
        this.plot.calculatePrecision();
        assertEquals(this.plot.precision, {x: 100, y: 100});

        this.plot.gridStepX = 0.001;
        this.plot.gridStepY = 0.001;
        this.plot.calculatePrecision();
        assertEquals(this.plot.precision, {x: 1000, y: 1000});
    },
    'test calculate px to coords step 1': function() {
        this.plot.gridStepX = 1;
        this.plot.gridStepY = 1;
        this.plot.xMin = -10;
        this.plot.xMax = 10;
        this.plot.yMin = -10;
        this.plot.yMax = 10;
        this.plot.width = 100;
        this.plot.height = 100;
        this.plot.calculatePrecision();

        assertEquals(this.plot.px2coords(50, 50), {x: 0, y: 0});
        assertEquals(this.plot.px2coords(55, 50), {x: 1, y: 0});
        assertEquals(this.plot.px2coords(45, 50), {x: -1, y: 0});
        assertEquals(this.plot.px2coords(50, 55), {x: 0, y: -1});
        assertEquals(this.plot.px2coords(50, 45), {x: 0, y: 1});
    },
    'test calculate px to coords step 0.01': function() {
        this.plot.gridStepX = 0.01;
        this.plot.gridStepY = 0.01;
        this.plot.xMin = -0.1;
        this.plot.xMax = 0.1;
        this.plot.yMin = -0.1;
        this.plot.yMax = 0.1;
        this.plot.width = 100;
        this.plot.height = 100;
        this.plot.calculatePrecision();

        assertEquals(this.plot.px2coords(50, 50), {x: 0, y: 0});
        assertEquals(this.plot.px2coords(55, 50), {x: 0.01, y: 0});
        assertEquals(this.plot.px2coords(45, 50), {x: -0.01, y: 0});
        assertEquals(this.plot.px2coords(50, 55), {x: 0, y: -0.01});
        assertEquals(this.plot.px2coords(50, 45), {x: 0, y: 0.01});
    },
    'test compose style': function() {
        var props = {
            'color': '#ff0000',
            'stroke-dasharray': 5
        };

        assertEquals('color:#ff0000;stroke-dasharray:5;', this.plot._composeStyle(props));
    }
});