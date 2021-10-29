package com.lorepo.icplayer.client.module.image;

import com.google.gwt.user.client.ui.Image;
import com.lorepo.icplayer.client.module.image.ImageModule.DisplayMode;
import com.lorepo.icplayer.client.printable.PrintableContentParser;
import com.lorepo.icplayer.client.printable.Printable.PrintableMode;

public class ImagePrintable {
	
	private ImageModule model = null;
	
	public ImagePrintable(ImageModule model) {
		this.model = model;
	}

	public String getPrintableHTML(String className, boolean showAnswers) {
		if (model.getPrintable() == PrintableMode.NO) return null;
		
		String rootStyle = "width:"+Integer.toString(model.getWidth())+"px;";
		rootStyle += "height:"+Integer.toString(model.getHeight())+"px;";
		rootStyle += "position: relative;";
		rootStyle += "left: 50%;";
		rootStyle += "transform: translateX(-50%);";
		String rootClass = "printable_ic_image";
		if (model.getDisplayMode() == DisplayMode.keepAspect) {
			rootClass += " keepAspect";
		}
		String result = "<div class=\"" + rootClass + "\" id=\"" + model.getId() + "\" style=\"" + rootStyle + "\">";
		
		final Image image = new Image();
		image.setUrl(model.getUrl());

		image.setPixelSize(model.getWidth(), model.getHeight());

		if(model.getDisplayMode() == DisplayMode.originalSize){
			image.setVisibleRect(0, 0, model.getWidth(), model.getHeight());
		}
		result += image.getElement().getString();
		result += "</div>";
		
		result = PrintableContentParser.addClassToPrintableModule(result, className);
		
		return result;
	}
}
