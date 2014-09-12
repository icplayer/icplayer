package com.lorepo.icplayer.client.ui;

public class PlayerViewUtils {

	public static Position calculatePopupPosition(Position playerPosition, Dimensions clientDimensions, Dimensions playerDimensions, Dimensions offsetDimensions, int topWindowHeight) {
		int top;
		int left = playerPosition.getLeft() + (playerDimensions.getWidth())/2;
		
		if(playerDimensions.getHeight() == 0 || playerDimensions.getWidth() == 0) { 
			//Player hadn't been loaded yet.
			top = (clientDimensions.getHeight() - offsetDimensions.getHeight())/2;
			left = (clientDimensions.getWidth() - offsetDimensions.getWidth())/2;
		} else {
			if(playerDimensions.getHeight() > clientDimensions.getHeight()) {
				//Player longer than window for embed and mCourser view
				top = (clientDimensions.getHeight() - offsetDimensions.getHeight())/2;
			} else if(clientDimensions.getHeight() - playerDimensions.getHeight() == 1 && topWindowHeight < playerDimensions.getHeight()) { 
				//Player longer than window for normal view
				top = (int) (topWindowHeight*0.3);
			} else {
				top = (playerDimensions.getHeight() - offsetDimensions.getHeight())/2 + playerPosition.getTop();
			}
		}

		return new Position(left, top);
	}
}