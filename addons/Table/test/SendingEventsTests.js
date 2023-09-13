TestCase("[Table] Value Change Event Sendings", {
    setUp: function () {
        this.presenter = AddonTable_create();
        this.presenter.eventBus = function () {};

        this.presenter.configuration = {
            addonID: "addonID",
            gapMaxLength: {value: 12}
        };

        this.correctAnswer = ["test"];

        this.stubs = {
            validateConfiguration: sinon.stub(DraggableDroppableObject._internal, 'validateConfiguration'),
            connectEventsDDO: sinon.stub(DraggableDroppableObject._internal, 'connectEvents'),
            fillGapDDO: sinon.stub(DraggableDroppableObject.prototype, 'fillGap'),
            makeGapEmptyDDO: sinon.stub(DraggableDroppableObject.prototype, 'makeGapEmpty'),
            addCssClass: sinon.stub(DraggableDroppableObject.prototype, 'addCssClass'),
            removeCssClass: sinon.stub(DraggableDroppableObject.prototype, 'removeCssClass'),
            notify: sinon.stub(this.presenter.GapUtils.prototype, 'notify'),
            setGapWidth: sinon.stub(this.presenter.GapUtils.prototype, 'setGapWidth'),
            createViewEditableInputGap: sinon.stub(this.presenter.EditableInputGap.prototype, 'createView'),
            connectEventsEditableInputGap: sinon.stub(this.presenter.EditableInputGap.prototype, 'connectEvents'),
            getViewValue: sinon.stub(this.presenter.EditableInputGap.prototype, 'getViewValue'),
            createViewDDG: sinon.stub(this.presenter.DraggableDroppableGap.prototype, 'createView')
        };

        this.inputGap = new this.presenter.EditableInputGap('inputGap', this.correctAnswer);
        this.draggableGap = new this.presenter.DraggableDroppableGap('draggableGap', this.correctAnswer);
        this.renderMathJax = sinon.stub(this.presenter, 'renderMathJax');
        this.rerenderMathJax = sinon.stub(this.presenter, 'rerenderMathJax');
    },
    
    tearDown: function () {
        DraggableDroppableObject._internal.validateConfiguration.restore();
        DraggableDroppableObject._internal.connectEvents.restore();
        DraggableDroppableObject.prototype.fillGap.restore();
        DraggableDroppableObject.prototype.makeGapEmpty.restore();
        DraggableDroppableObject.prototype.addCssClass.restore();
        DraggableDroppableObject.prototype.removeCssClass.restore();
        this.presenter.GapUtils.prototype.notify.restore();
        this.presenter.GapUtils.prototype.setGapWidth.restore();
        this.presenter.EditableInputGap.prototype.createView.restore();
        this.presenter.EditableInputGap.prototype.getViewValue.restore();
        this.presenter.EditableInputGap.prototype.connectEvents.restore();
        this.presenter.DraggableDroppableGap.prototype.createView.restore();
        this.presenter.renderMathJax.restore();
        this.presenter.rerenderMathJax.restore();
    },

    'test editable input gap should notify value change observer at blur': function () {
        this.inputGap.blurHandler();

        assertTrue(this.stubs.notify.calledOnce);
    },

    'test draggable droppable gap should notify value change observer at fillGap': function () {
        this.draggableGap.fillGap();

        assertTrue(this.stubs.notify.calledOnce);
    },

    'test draggable droppable gap should notify value change observer at makeGapEmpty': function () {
        this.draggableGap.makeGapEmpty();

        assertTrue(this.stubs.notify.calledOnce);
    }
});
