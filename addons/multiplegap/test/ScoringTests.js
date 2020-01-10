TestCase("[Multiple Gap] Scoring", {
    setUp: function () {
        this.presenter = Addonmultiplegap_create();
        this.presenter.configuration = {};
        this.presenter.items = [''];
    },

    'test not an activity mode': function() {
        this.presenter.configuration.isActivity = false;

        assertEquals(0, this.presenter.getMaxScore());
        assertEquals(0, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount());
    },

    'test an activity mode but list of items with empty value': function() {
        this.presenter.configuration.isActivity = false;

        assertEquals(0, this.presenter.getMaxScore());
        assertEquals(0, this.presenter.getScore());
        assertEquals(0, this.presenter.getErrorCount());
    },

    'test dragging items not being counted for score': function() {
        this.presenter.$view = $(
            '<div class="multiplegap_Images_HORIZONTAL" id="multiplegap2" style="width: 498px; height: 195px; position: absolute; left: 100px; top: 310px;">' +
                '<div class="multiplegap_container multiplegap_horizontal multiplegap_images ui-droppable" style="width: 498px; height: 195px;">' +
                    '<div class="multiplegap_placeholders">' +
                        '<div class="placeholder ui-draggable" draggablevalue="/file/serve/5954688688062464" draggableitem="500_2" draggabletype="image" style="width: 140px; height: 70px; top: 0px; left: 0px;">' +
                            '<img class="contents" alt="" lang="" src="/file/serve/5954688688062464" style="width: 140px; height: 70px; position: absolute; left: -4px; top: -4px;">' +
                            '<div class="handler" style="color: rgba(0, 0, 0, 0); font-size: 1px; display: block;"></div>' +
                        '</div>' +
                        '<div class="placeholder ui-draggable dragging" draggablevalue="/file/serve/5391738734641152" draggableitem="200_2" draggabletype="image" style="width: 140px; height: 70px; top: 0px; left: 166px;">' +
                            '<img class="contents" alt="" lang="" src="/file/serve/5391738734641152" style="width: 140px; height: 70px; position: absolute; left: -4px; top: -4px;">' +
                            '<div class="handler" style="color: rgba(0,0,0,0.0); font-size:1px"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>');

        this.presenter.configuration.itemsAnswersID = ["500_2","200_2"];
        this.presenter.configuration.isActivity = true;

        this.presenter.isShowAnswersActive = false;
        this.presenter.itemCounterMode = false;

        assertEquals(1, this.presenter.getScore());

    },

    'test given correct and redundant elements when getting score then score should not be affected by redundant elements': function() {
        this.presenter.$view = $(
            '<div class="multiplegap_Images_HORIZONTAL" id="multiplegap2" style="width: 498px; height: 195px; position: absolute; left: 100px; top: 310px;">' +
                '<div class="multiplegap_container multiplegap_horizontal multiplegap_images ui-droppable" style="width: 498px; height: 195px;">' +
                    '<div class="multiplegap_placeholders">' +
                        '<div class="placeholder ui-draggable" draggablevalue="/file/serve/5954688688062464" draggableitem="500_2" draggabletype="image" style="width: 140px; height: 70px; top: 0px; left: 0px;">' +
                            '<img class="contents" alt="" lang="" src="/file/serve/5954688688062464" style="width: 140px; height: 70px; position: absolute; left: -4px; top: -4px;">' +
                            '<div class="handler" style="color: rgba(0, 0, 0, 0); font-size: 1px; display: block;"></div>' +
                        '</div>' +
                        '<div class="placeholder ui-draggable" draggablevalue="/file/serve/5391738734641152" draggableitem="200_2" draggabletype="image" style="width: 140px; height: 70px; top: 0px; left: 166px;">' +
                            '<img class="contents" alt="" lang="" src="/file/serve/5391738734641152" style="width: 140px; height: 70px; position: absolute; left: -4px; top: -4px;">' +
                            '<div class="handler" style="color: rgba(0,0,0,0.0); font-size:1px"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>');

        this.presenter.configuration.itemsAnswersID = ["500_2"];
        this.presenter.configuration.isActivity = true;
        sinon.stub(this.presenter, 'countItems').returns(2);

        this.presenter.isShowAnswersActive = false;
        this.presenter.itemCounterMode = false;

        assertEquals(1, this.presenter.getScore());
        assertEquals(1, this.presenter.getErrorCount());

    }
});

TestCase("[Multiple Gap] AllOK", {
    setUp: function () {
        this.presenter = Addonmultiplegap_create();
        this.presenter.configuration = {
            isActivity: true
        };

        this.getMaxScoreStub = sinon.stub(this.presenter, 'getMaxScore');
        this.getMaxScoreStub.returns(3);
        this.getScoreStub = sinon.stub(this.presenter, 'getScore');
        this.getErrorCountStub = sinon.stub(this.presenter, 'getErrorCount');
    },

    tearDown: function () {
        this.presenter.getMaxScore.restore();
        this.presenter.getScore.restore();
        this.presenter.getErrorCount.restore();
    },

    'test allOK should return true': function () {
        this.getScoreStub.returns(3);
        this.getErrorCountStub.returns(0);

        var isAllOK = this.presenter.isAllOK();

        assertTrue(isAllOK);
        assertTrue(this.getMaxScoreStub.calledOnce);
        assertTrue(this.getScoreStub.calledOnce);
        assertTrue(this.getErrorCountStub.calledOnce);
    },

    'test allOK should return false': function () {
        this.getScoreStub.returns(2);
        this.getErrorCountStub.returns(1);

        var isAllOK = this.presenter.isAllOK();

        assertFalse(isAllOK);
        assertTrue(this.getMaxScoreStub.calledOnce);
        assertTrue(this.getScoreStub.calledOnce);
    },

    'test allOK should return nothing because addon is not an activity': function () {
        this.getMaxScoreStub.returns(undefined);
        this.getScoreStub.returns(undefined);
        this.getErrorCountStub.returns(undefined);
        this.presenter.configuration.isActivity = false;

        var isAllOK = this.presenter.isAllOK();

        assertUndefined(isAllOK);
        assertFalse(this.getMaxScoreStub.calledOnce);
        assertFalse(this.getScoreStub.calledOnce);
        assertFalse(this.getErrorCountStub.calledOnce);
    }
});