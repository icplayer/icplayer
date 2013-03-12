PrepareDialogValidation = TestCase("Prepare Modal Validation");

PrepareDialogValidation.prototype.testAddTitle = function() {
    // Given
	var presenter = AddonGlossary_create();
    var title = "Notebook";
    
    /*:DOC element = <div class="modal-dialog"></div> */
   
    // When
    presenter.addTitle(this.element, title);
    
    // Then
    assertTrue("After calling addTitle() element should have attribute title.", $(this.element).attr('title') == "Notebook");
};

PrepareDialogValidation.prototype.testAddDescription = function() {
    // Given
	var presenter = AddonGlossary_create();
    var description = "Superior Class Dan-Mark";
    
    /*:DOC element = <div class="modal-dialog"></div> */
   
    // When
    sinon.stub(presenter, "updateLaTeX");
    presenter.addDescription(this.element, description);

    // Then
    assertTrue("After calling addDescription() element should have text inside the div.", $(this.element).html() == "Superior Class Dan-Mark");
};

