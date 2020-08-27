package com.lorepo.icplayer.client.module.image;

import com.google.gwt.dom.client.Style;
import com.google.gwt.user.client.ui.Image;
import com.lorepo.icplayer.client.module.Printable.PrintableMode;
import com.lorepo.icplayer.client.module.image.ImageModule.DisplayMode;

public class ImagePrintable {
	
	private ImageModule model = null;
	
	public ImagePrintable(ImageModule model) {
		this.model = model;
	}
	
	private void keepAspect(Image image, int width, int height) {
		ImageViewUtils.keepAspect(image, model.getWidth(), model.getHeight());
		Style style = image.getElement().getStyle();
		style.setPosition(Style.Position.ABSOLUTE);
		style.setLeft((width - image.getWidth())/2, Style.Unit.PX);
	}

	public String getPrintableHTML(boolean showAnswers) {
		if (model.getPrintable() == PrintableMode.NO) return null;
		
		String rootStyle = "width:"+Integer.toString(model.getWidth())+"px;";
		rootStyle += "height:"+Integer.toString(model.getHeight())+"px;";
		rootStyle += "position: relative;";
		String result = "<div class=\"printable_ic_image printable_module\" id=\"" + model.getId() + "\" style=\"" + rootStyle + "\">";
		
		Image image = new Image();
		image.setUrl(model.getUrl());
		if(model.getDisplayMode() == DisplayMode.stretch){
			image.setPixelSize(model.getWidth(), model.getHeight());
		}
		else if(model.getDisplayMode() == DisplayMode.keepAspect){
			keepAspect(image, model.getWidth(), model.getHeight());
		}
		else if(model.getDisplayMode() == DisplayMode.originalSize){
			image.setVisibleRect(0, 0, model.getWidth(), model.getHeight());
		}
		result += image.getElement().getString();
		result += "</div>";
		
		return result;
	}
}
