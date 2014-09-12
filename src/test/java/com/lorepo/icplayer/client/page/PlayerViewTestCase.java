package com.lorepo.icplayer.client.page;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

import com.lorepo.icplayer.client.ui.Dimensions;
import com.lorepo.icplayer.client.ui.PlayerViewUtils;
import com.lorepo.icplayer.client.ui.Position;

public class PlayerViewTestCase {
	static int TOP_WINDOW_HEIGHT = 1000;

	@Test
	public void playerHadNotBeenLoaded() {
		Position playerPosition = new Position(0,0);
		Dimensions clientDimensions = new Dimensions(1800,1000);
		Dimensions playerDimensions = new Dimensions(0,0);
		Dimensions offsetDimensions = new Dimensions(80,60);
		
		Position popupPosition = PlayerViewUtils.calculatePopupPosition(
				playerPosition, clientDimensions, playerDimensions, offsetDimensions, TOP_WINDOW_HEIGHT);

		assertEquals(860, popupPosition.getLeft());
		assertEquals(470, popupPosition.getTop());
	}
	
	@Test
	public void playerIsLongerThanWindow() {
		Position playerPosition = new Position(0,0);
		Dimensions clientDimensions = new Dimensions(1800,1000);
		Dimensions playerDimensions = new Dimensions(600,1600);
		Dimensions offsetDimensions = new Dimensions(80,60);
		
		Position popupPosition = PlayerViewUtils.calculatePopupPosition(
				playerPosition, clientDimensions, playerDimensions, offsetDimensions, TOP_WINDOW_HEIGHT);

		assertEquals(300, popupPosition.getLeft());
		assertEquals(470, popupPosition.getTop());
	}
	
	@Test
	public void playerIsLongerThenWindowAndIsInFrame() {
		Position playerPosition = new Position(0,0);
		Dimensions clientDimensions = new Dimensions(1800,2000);
		Dimensions playerDimensions = new Dimensions(600,1999);
		Dimensions offsetDimensions = new Dimensions(80,60);
		
		Position popupPosition = PlayerViewUtils.calculatePopupPosition(
				playerPosition, clientDimensions, playerDimensions, offsetDimensions, TOP_WINDOW_HEIGHT);

		assertEquals(300, popupPosition.getLeft());
		assertEquals(300, popupPosition.getTop());
	}
	
	@Test
	public void playerisShorterThanWindow() {
		Position playerPosition = new Position(300,300);
		Dimensions clientDimensions = new Dimensions(1800,1000);
		Dimensions playerDimensions = new Dimensions(600,600);
		Dimensions offsetDimensions = new Dimensions(80,60);
		
		Position popupPosition = PlayerViewUtils.calculatePopupPosition(
				playerPosition, clientDimensions, playerDimensions, offsetDimensions, TOP_WINDOW_HEIGHT);

		assertEquals(600, popupPosition.getLeft());
		assertEquals(570, popupPosition.getTop());
	}
}