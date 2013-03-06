SetColumnsWidthValidation = TestCase("Set Columns Width Validation");

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
	var threeColumnsWidth = [{left: "40%", middle: "30%", right: "30%"}];
    var view = this.view;
    var leftColumn = $(view).find(".connectionLeftColumn:first");
    var middleColumn = $(view).find(".connectionMiddleColumn:first");
    var rightColumn = $(view).find(".connectionRightColumn:first");
    
    // When
    presenter.setColumnsWidth(view, threeColumnsWidth);

    // Then
    assertTrue("", leftColumn.width() + "%" == threeColumnsWidth[0].left);
    assertTrue("", middleColumn.width() + "%" == threeColumnsWidth[0].middle);
    assertTrue("", rightColumn.width() + "%" == threeColumnsWidth[0].right);
};

SetColumnsWidthValidation.prototype.testSetWidthWhenOnlyTwoWidthsAreSet = function() {
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
	var threeColumnsWidth = [{left: "40%", middle: "30%", right: ""}];
    var view = this.view;
    var leftColumn = $(view).find(".connectionLeftColumn:first");
    var middleColumn = $(view).find(".connectionMiddleColumn:first");
    var rightColumn = $(view).find(".connectionRightColumn:first");
    
    // When
    presenter.setColumnsWidth(view, threeColumnsWidth);
    
    // Then
    assertTrue("", leftColumn.width() + "%" == threeColumnsWidth[0].left);
    assertTrue("", middleColumn.width() + "%" == threeColumnsWidth[0].middle);
    assertTrue("", rightColumn.width() + "%" == "0%");
};