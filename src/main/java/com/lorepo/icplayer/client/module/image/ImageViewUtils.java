package com.lorepo.icplayer.client.module.image;

import com.google.gwt.user.client.ui.Image;

final public class ImageViewUtils {

	private ImageViewUtils() {
		// this class is static
	}
	
	public static void keepAspect(Image image, int width, int height) {
		if(image.getWidth() > 0 && image.getHeight() > 0){
		
			float aspectX = width/(float)image.getWidth();
			float aspectY = height/(float)image.getHeight();

			if(aspectX < aspectY){
				int newHeight = (int) (image.getHeight()*aspectX);
				image.setPixelSize(width, newHeight);
			}
			else{
				int newWidth = (int) (image.getWidth()*aspectY);
				image.setPixelSize(newWidth, height);
			}
		}
	}
}
