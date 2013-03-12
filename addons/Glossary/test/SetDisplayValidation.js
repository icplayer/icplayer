SetDisplayValidation = TestCase("Set Display Validation");

SetDisplayValidation.prototype.testSetDisplayTrue = function() {
    // Given
	var presenter = AddonGlossary_create();
	
	/*:DOC element = <div class="modal-dialog" style="display:none"></div> */
    
    // When
    presenter.setDisplay(this.element, true);

    // Then
    assertTrue("After calling setDisplay(true) element should be diplayed block.", $(this.element).css('display') == 'block');
};

SetDisplayValidation.prototype.testSetDisplayFalse = function() {
    // Given
	var presenter = AddonGlossary_create();
	
	/*:DOC element = <div class="modal-dialog" style="display:none"></div> */
    
    // When
    presenter.setDisplay(this.element, false);

    // Then
    assertTrue("After calling setDisplay(false) on element with diplay set to none should be still none.", $(this.element).css('display') == 'none');
};