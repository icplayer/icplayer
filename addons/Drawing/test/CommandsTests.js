TestCase("[Drawing] Reset command", {
    setUp: function() {
        this.presenter = AddonDrawing_create();

        this.presenter.configuration = {
            context: {
                clearRect: function() { }
            },
            canvas: [
                {
                    width: 100,
                    height: 200
                }
            ]
        };

        this.presenter.model = {
            Color: "Pink",
            Thickness: 41
        };

        this.stubs = {
            clearRect: sinon.stub(this.presenter.configuration.context, 'clearRect'),
            setThickness: sinon.stub(this.presenter, 'setThickness'),
            setColor: sinon.stub(this.presenter, 'setColor'),
            setVisibility: sinon.stub(this.presenter, 'setVisibility')
        };
    },

    'test reset with default visibility as hidden' : function() {
        this.presenter.configuration.isVisible = true;
        this.presenter.configuration.isVisibleByDefault = false;

        this.presenter.reset();

        var clearRectCallArgs = this.stubs.clearRect.getCall(0).args;
        assertEquals(0, clearRectCallArgs[0]);
        assertEquals(0, clearRectCallArgs[1]);
        assertEquals(100, clearRectCallArgs[2]);
        assertEquals(200, clearRectCallArgs[3]);

        assertTrue(this.stubs.setColor.calledWith("Pink"));
        assertTrue(this.stubs.setThickness.calledWith(41));

        assertTrue(this.stubs.setVisibility.calledWith(false));
    },

    'test reset with default visibility as visible' : function() {
        this.presenter.configuration.isVisible = false;
        this.presenter.configuration.isVisibleByDefault = true;

        this.presenter.reset();

        var clearRectCallArgs = this.stubs.clearRect.getCall(0).args;
        assertEquals(0, clearRectCallArgs[0]);
        assertEquals(0, clearRectCallArgs[1]);
        assertEquals(100, clearRectCallArgs[2]);
        assertEquals(200, clearRectCallArgs[3]);

        assertTrue(this.stubs.setColor.calledWith("Pink"));
        assertTrue(this.stubs.setThickness.calledWith(41));

        assertTrue(this.stubs.setVisibility.calledWith(true));
    }
});