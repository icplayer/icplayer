package com.lorepo.icplayer.client;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;

import org.junit.Test;

import com.lorepo.icplayer.client.dimensions.ModuleDimensions;

public class ModuleDimensionsEqualsTestCase {
	ModuleDimensions dimension = new ModuleDimensions(100, 100, 100, 100, 100, 100);
	ModuleDimensions equalDimension = new ModuleDimensions(100, 100, 100, 100, 100, 100);
	
	ModuleDimensions otherDifferentLeft = new ModuleDimensions(150, 100, 100, 100, 100, 100);
	ModuleDimensions otherDifferentRight = new ModuleDimensions(100, 150, 100, 100, 100, 100);
	ModuleDimensions otherDifferentTop = new ModuleDimensions(100, 100, 150, 100, 100, 100);
	ModuleDimensions otherDifferentBottom = new ModuleDimensions(100, 100, 100, 150, 100, 100);
	ModuleDimensions otherDifferentHeight = new ModuleDimensions(100, 100, 100, 100, 150, 100);
	ModuleDimensions otherDifferentWidth = new ModuleDimensions(100, 100, 100, 100, 100, 150);
	
	@Test
	public void comparingTheSameObjectShouldBeEqual() {
		ModuleDimensions other = this.dimension;
		assertEquals(this.dimension, other);
	}
	
	@Test
	public void onlyWhenAllValuesAreEqualModuleDimensionsAreEqual() {
		assertEquals(this.dimension, this.equalDimension);
	}
	
	@Test
	public void areNotEqualWhenLeftIsDifferent() {
		assertNotEquals(this.dimension, this.otherDifferentLeft);
	}
	
	@Test
	public void areNotEqualWhenRightIsDifferent() {
		assertNotEquals(this.dimension, this.otherDifferentRight);
	}
	
	@Test
	public void areNotEqualWhenTopIsDifferent() {
		assertNotEquals(this.dimension, this.otherDifferentTop);
	}
	
	@Test
	public void areNotEqualWhenBottomIsDifferent() {
		assertNotEquals(this.dimension, this.otherDifferentBottom);
	}
	
	@Test
	public void areNotEqualWhenHeightIsDifferent() {
		assertNotEquals(this.dimension, this.otherDifferentHeight);
	}
	
	@Test
	public void areNotEqualWhenWidthIsDifferent() {
		assertNotEquals(this.dimension, this.otherDifferentWidth);
	}
}
