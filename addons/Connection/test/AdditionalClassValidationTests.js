TestCase("[Connection] Additional Class Validation", {

    setUp: function () {
        this.presenter = AddonConnection_create();

        this.stubs = {
            setLengthOfSideObjectsStub: sinon.stub(),
        };
        this.presenter.setLengthOfSideObjects = this.stubs.setLengthOfSideObjectsStub;

        this.presenter.configuration = {};
        this.presenter.isHorizontal = false;
        this.presenter.model = {
            'Left column': [{
                'additional class':"",
                'connects to': "c",
                'content': " Sky is ",
                'id': "1"
            }, {
                'additional class':"someAdditionalClass",
                'connects to': "c",
                'content': " Grass is ",
                'id': "2"
            }],
            'Right column': [{
                'additional class':"",
                'connects to': "1",
                'content': " blue ",
                'id': "c"
            }, {
                'additional class':"",
                'connects to': "",
                'content': " yellow ",
                'id': "d"
            }]
        };
   },

    createViewBase: function() {
       this.presenter.view = document.createElement("div");

       const connectionContainer = document.createElement("div");
       connectionContainer.classList.add(this.presenter.CSS_CLASSES.CONNECTION_CONTAINER);
       this.presenter.view.append(connectionContainer);

       this.presenter.setUpViewBody(this.presenter.view);
       this.presenter.loadElements(this.presenter.view, this.presenter.model);
    },

    getInnerWrapperOfElementWithId: function (id) {
        for (let i = 0; i < this.presenter.elements.length; i++) {
            if (this.presenter.elements[i].id == id) {
                const element = this.presenter.elements[i].element;
                return element.find(".innerWrapper");
            }
        }

        return null;
    },

    'test should not set additionalClass for innerWrapper in vertical orientation when not defined additional class for item': function () {
        this.createViewBase();
        const itemToCheck = this.getInnerWrapperOfElementWithId("1")[0];

        assertTrue(itemToCheck.classList.contains("innerWrapper"));
        assertEquals(1, itemToCheck.classList.length);
    },

    'test should set additionalClass for innerWrapper in vertical orientation when defined additional class for item': function () {
        this.createViewBase();
        const itemToCheck = this.getInnerWrapperOfElementWithId("2")[0];

        assertTrue(itemToCheck.classList.contains("someAdditionalClass"));
        assertTrue(itemToCheck.classList.contains("innerWrapper"));
        assertEquals(2, itemToCheck.classList.length);
    },

    'test should not set additionalClass for innerWrapper in horizontal orientation when not defined additional class for item': function () {
        this.presenter.isHorizontal = true;

        this.createViewBase();
        const itemToCheck = this.getInnerWrapperOfElementWithId("1")[0];

        assertTrue(itemToCheck.classList.contains("innerWrapper"));
        assertEquals(1, itemToCheck.classList.length);
    },

    'test should set additionalClass for innerWrapper in horizontal orientation when defined additional class for item': function () {
        this.presenter.isHorizontal = true;

        this.createViewBase();
        const itemToCheck = this.getInnerWrapperOfElementWithId("2")[0];

        assertTrue(itemToCheck.classList.contains("someAdditionalClass"));
        assertTrue(itemToCheck.classList.contains("innerWrapper"));
        assertEquals(2, itemToCheck.classList.length);
    },
});
