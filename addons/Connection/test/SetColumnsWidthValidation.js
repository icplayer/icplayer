SetColumnsWidthValidation = TestCase("[Connection] Set Columns Width Validation");

SetColumnsWidthValidation.prototype.testWidthHasBeenSet = function() {
    // Given
	var presenter = AddonConnection_create();
    /*:DOC view = 
	    <table class="connectionContainer">
			<tr>
			    <td class="connectionLeftColumn">
			        <table class="content"></table>
			    </td>
			    <td class="connectionMiddleColumn">
			        <canvas class="connections"></canvas>
			    </td>
			    <td class="connectionRightColumn">
			        <table class="content"></table>
			    </td>
			</tr>
		</table>
     */
    var expectedColumnsWidth = {left: "40%", middle: "30%", right: "30%"};
	presenter.configuration = {
        columnsWidth: expectedColumnsWidth
    };
    var view = this.view;
    var leftColumn = $(view).find(".connectionLeftColumn:first");
    var middleColumn = $(view).find(".connectionMiddleColumn:first");
    var rightColumn = $(view).find(".connectionRightColumn:first");
    
    // When
    presenter.setLengthOfSideObjects(view);

    // Then
    assertTrue("", leftColumn.width() + "%" == expectedColumnsWidth.left);
    assertTrue("", middleColumn.width() + "%" == expectedColumnsWidth.middle);
    assertTrue("", rightColumn.width() + "%" == expectedColumnsWidth.right);
};

SetColumnsWidthValidation.prototype.testSetLengthOfSideObjectsWhenOnlyTwoWidthsAreSet = function() {
	// Given
	var presenter = AddonConnection_create();
    /*:DOC view = 
	    <table class="connectionContainer">
			<tr>
			    <td class="connectionLeftColumn">
			        <table class="content"></table>
			    </td>
			    <td class="connectionMiddleColumn">
			        <canvas class="connections"></canvas>
			    </td>
			    <td class="connectionRightColumn">
			        <table class="content"></table>
			    </td>
			</tr>
		</table>
     */
	var expectedColumnsWidth = {left: "40%", middle: "30%", right: ""};
	presenter.configuration = {
        columnsWidth: expectedColumnsWidth
    };
    var view = this.view;
    var leftColumn = $(view).find(".connectionLeftColumn:first");
    var middleColumn = $(view).find(".connectionMiddleColumn:first");
    var rightColumn = $(view).find(".connectionRightColumn:first");
    
    // When
    presenter.setLengthOfSideObjects(view);
    
    // Then
    assertTrue("", leftColumn.width() + "%" == expectedColumnsWidth.left);
    assertTrue("", middleColumn.width() + "%" == expectedColumnsWidth.middle);
    assertTrue("", rightColumn.width() + "%" == "0%");
};