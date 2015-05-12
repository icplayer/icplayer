TestCase("[Count_and_Graph] [Bar Object] Logic validation", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        this.column = new this.presenter.columnObject(0, 0, 0);

        this.createBarsArray = function (column, number, color, width) {
            var bars = [];
            for(var i = 0; i < number; i++) {
                bars.push(new this.presenter.barObject(column, color, width, i, i + 1));
            }

            return bars;
        };

        this.stubs = {
            update: sinon.stub(this.column, 'update')
        };
    },

    tearDown: function () {
        this.column.update.restore();
    },

    'test bar sending correct event when user clicks': function () {
        var expectedEvent = {
            type: this.presenter.GRAPH_EVENT_TYPE.BAR_SELECTED,
            barValue: 1
        };

        var bars = this.createBarsArray(this.column, 3, 1, 1);

        bars[0].handleEvent({
            type: "click",
            preventDefault: function () {},
            stopPropagation: function () {}
        });

        assertTrue(this.stubs.update.calledOnce);
        assertTrue(this.stubs.update.calledWith(expectedEvent));
    },

    'test bar creating correct event': function () {
        var expectedEvent = {
            type: this.presenter.GRAPH_EVENT_TYPE.BAR_SELECTED,
            barValue: 1
        };

        var bar = new this.presenter.barObject({}, 3, 3, 1, 1);

        var createdEvent = bar._createSelectEvent();

        assertEquals(expectedEvent, createdEvent);
    }
});

TestCase("[Count_and_Graph] [Bar Object] Set / remove css class", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        var _ = 1;
        this.bar = new this.presenter.barObject(null, _, _, _, _, _);
        this.expectedClass = "myExpectedTestCssClass";
    },

    'test adding a css class validation': function () {
        this.bar.setCssClass(this.expectedClass);

        assertTrue(this.bar._$innerDiv.hasClass(this.expectedClass));
    },

    'test removing a css class validation': function () {
        this.bar.$view.addClass(this.expectedClass);

        this.bar.removeCssClass(this.expectedClass);

        assertFalse(this.bar._$innerDiv.hasClass(this.expectedClass));
    }
});

TestCase("[Count_and_Graph] [Bar Object] Get initial class name", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        this.barValue = 1;
        this.columnIndex = 1;
        this.bar = new this.presenter.barObject(null, "red", 40, 40, this.barValue, this.columnIndex);
    },

    'test name should contain to which column it belongs and series index': function () {
        assertEquals("jqplot-point-label jqplot-series-0 jqplot-point-1", this.bar._getInitialClassName());
    }
});

TestCase("[Count_and_Graph] [Bar Object] Bar creation jqplot label validation", {
    setUp: function () {
        this.presenter = AddonCount_and_Graph_create();
        this.bar = new this.presenter.barObject(null, "red", 40, 40, 1, 1);
    },

    'test bar should contain 0x0 div with proper class name': function () {
        var innerDiv = this.bar._$innerDiv;
        assertTrue(innerDiv.hasClass(this.bar._getInitialClassName()));
        assertEquals("0px", innerDiv.css("width"));
        assertEquals("0px", innerDiv.css("height"));
        assertEquals("20px", innerDiv.css("left"));
        assertEquals("20px", innerDiv.css("top"));
    }
});