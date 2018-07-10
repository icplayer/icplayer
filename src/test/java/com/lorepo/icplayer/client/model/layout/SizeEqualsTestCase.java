package com.lorepo.icplayer.client.model.layout;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;

import org.junit.Test;

public class SizeEqualsTestCase {
	Size size = new Size("default", 100, 100);
	Size equalSize = new Size("default", 100, 100);
	Size differentID = new Size("sal.dkfj", 100, 100);
	Size differentWidth = new Size("default", 150, 100);
	Size differentHeight = new Size("default", 100, 150);
	
	@Test
	public void referenceToSameObjectIsEqual() {
		Size other = this.size;
		assertEquals(this.size, other);
	}
	
	@Test
	public void sizesAreEqualIfAllAttributesAreTheSame() {
		assertEquals(this.size, this.equalSize);
	}
	
	@Test
	public void isNotEqualWhenIDsDifferent() {
		assertNotEquals(this.size, this.differentID);
	}

	@Test
	public void isNotEqualWhenWidthDifferent() {
		assertNotEquals(this.size, this.differentWidth);
	}
	
	@Test
	public void isNotEqualWhenHeightDifferent() {
		assertNotEquals(this.size, this.differentHeight);
	}
}
