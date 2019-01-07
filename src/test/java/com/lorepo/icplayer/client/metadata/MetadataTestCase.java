package com.lorepo.icplayer.client.metadata;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;

public class MetadataTestCase {
	
	Metadata metadata;
	
	@Before
	public void setUp() {
		this.metadata = new Metadata();
		this.metadata.put("k1", "v1");
		this.metadata.put("k2", "v2");
		this.metadata.put("k3", "v3");
	}
	
	@Test
	public void puttingValuesIntoMetadata() {
		this.metadata.put("1", "some");
		this.metadata.put("key2", "some2");
		this.metadata.put("key3", "some3");
		
		assertEquals("some", this.metadata.getValue("1"));
		assertEquals("some2", this.metadata.getValue("key2"));
		assertEquals("some3", this.metadata.getValue("key3"));
		assertTrue(this.metadata.hasEntries());
	}
	
	@Test
	public void removingValues() {
		this.metadata.remove("k2");
		
		assertNull(this.metadata.getValue("k2"));
	}
	
	@Test
	public void clearingMetadata() {
		this.metadata.clear();
		
		assertNull(this.metadata.getValue("k1"));
		assertNull(this.metadata.getValue("k2"));
		assertNull(this.metadata.getValue("k3"));
		assertFalse(this.metadata.hasEntries());
	}


}
