TestCase("[Connection] Add tabindex for connection elements", {

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
                'additional class':"",
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

    'test should not set tabindex for innerWrapper when tabindex is false': function () {
        this.presenter.configuration.isTabindexEnabled = false;

        this.createViewBase();
        const itemToCheck = this.getInnerWrapperOfElementWithId("1")[0];

        assertFalse(itemToCheck.hasAttribute("tabindex"));
    },

    'test should set tabindex for innerWrapper when tabindex is true': function () {
        this.presenter.configuration.isTabindexEnabled = true;

        this.createViewBase();
        const itemToCheck = this.getInnerWrapperOfElementWithId("1")[0];

        assertTrue(itemToCheck.hasAttribute("tabindex"));
    },

    'test should not set tabindex for innerWrapper in horizontal orientation when tabindex is false': function () {
        this.presenter.isHorizontal = true;
        this.presenter.configuration.isTabindexEnabled = false;

        this.createViewBase();
        const itemToCheck = this.getInnerWrapperOfElementWithId("1")[0];

        assertFalse(itemToCheck.hasAttribute("tabindex"));
    },

    'test should set tabindex for innerWrapper in horizontal orientation when tabindex is true': function () {
        this.presenter.isHorizontal = true;
        this.presenter.configuration.isTabindexEnabled = true;

        this.createViewBase();
        const itemToCheck = this.getInnerWrapperOfElementWithId("1")[0];

        assertTrue(itemToCheck.hasAttribute("tabindex"));
    }
});
