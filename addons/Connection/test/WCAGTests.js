TestCase("[Connection - WCAG] build keyboard controller", {
   setUp: function () {
       this.presenter = AddonConnection_create();
       this.mocks = {
           $: sinon.mock(window, "$")
       };
   },

   tearDown: function () {
       this.mocks.$.restore();
   },

   'test controller will have properly build array with all elements from addon' : function () {
       this.presenter.elements = [{
           element: 1
       }, {
           element: 2
       }, {
           element: 3
       }, {
           element: 4
       }];
       this.presenter.buildKeyboardController();

       assertEquals(4, this.presenter.keyboardControllerObject.keyboardNavigationElementsLen);
       assertEquals(2, this.presenter.keyboardControllerObject.columnsCount);

   }
});

TestCase("[Connection - WCAG] navigation", {
   setUp: function () {
       this.presenter = AddonConnection_create();
       this.elements = [generateElementMocks(), generateElementMocks(), generateElementMocks(), generateElementMocks()];
       this.presenter.elements = [{
           element: this.elements[0]
       }, {
           element: this.elements[1]
       }, {
           element: this.elements[2]
       }, {
           element: this.elements[3]
       }];

       this.presenter.columnSizes = {
           "Left column":2,
           "Right column":2
       };

       this.jQuery = window.$;

       window.$ = function (a) {
           if (document == a) {
               return sinon.mock();
           } else {
               return a;
           }
       };

       this.getCurrentElement = this.presenter.getCurrentActivatedElement;

       var self = this;
       this.presenter.getCurrentActivatedElement = function(){
           return self.jQuery('div');
       };

       this.presenter.buildKeyboardController();

       this.handleFunction = this.presenter.keyboardControllerObject.handle;

       this.presenter.keyboardControllerObject.handle = function (keycode, isShiftDown) {
            var event = {
                which: keycode,
                preventDefault: sinon.stub()
            };
            this.mapping[keycode].call(this, event);
       };
   },

   tearDown: function () {
       window.$ = this.jQuery;
       this.presenter.keyboardControllerObject.handle = this.handleFunction;
       this.presenter.getCurrentActivatedElement = this.getCurrentElement;
   },

   'test keyboardController call will call properly dom events' : function () {
        this.presenter.keyboardController(13);  //Enter
        assertTrue(this.elements[0].addClass.calledOnce);

        this.presenter.keyboardController(40);  //Down
        assertTrue(this.elements[0].removeClass.calledOnce);
        assertTrue(this.elements[1].addClass.calledOnce);

        this.presenter.keyboardController(32);  //Space
        assertTrue(this.elements[1].click.calledOnce);

        this.presenter.keyboardController(39); //Right
        assertTrue(this.elements[1].removeClass.calledOnce);
        assertTrue(this.elements[3].addClass.calledOnce);

        this.presenter.keyboardController(38);  //Up
        assertTrue(this.elements[3].removeClass.calledOnce);
        assertTrue(this.elements[2].addClass.calledOnce);

        this.presenter.keyboardController(37); //Left
        assertTrue(this.elements[2].removeClass.calledOnce);
        assertTrue(this.elements[0].addClass.calledTwice);
    }
});

function generateElementMocks() {
    return {
        click: sinon.stub(),
        addClass: sinon.stub(),
        removeClass: sinon.stub()
    };
}