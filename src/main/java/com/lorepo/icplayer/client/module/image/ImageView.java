package com.lorepo.icplayer.client.module.image;

import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.NodeList;
import com.google.gwt.event.dom.client.LoadEvent;
import com.google.gwt.event.dom.client.LoadHandler;
import com.google.gwt.http.client.Request;
import com.google.gwt.http.client.RequestBuilder;
import com.google.gwt.http.client.RequestCallback;
import com.google.gwt.http.client.RequestException;
import com.google.gwt.http.client.Response;
import com.google.gwt.user.client.ui.AbsolutePanel;
import com.google.gwt.user.client.ui.Image;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.api.player.IPlayerServices;
import com.lorepo.icplayer.client.module.image.ImageModule.DisplayMode;
import com.lorepo.icplayer.client.module.image.ImagePresenter.IDisplay;


public class ImageView extends AbsolutePanel implements IDisplay {

	private ImageModule module;
	private Image image;
	private IPlayerServices playerServices;
	boolean isSvg = false;
	
	
	public ImageView(ImageModule module, boolean isPreview, IPlayerServices services) {
		this.module = module;
		this.playerServices = services;

		createUI(isPreview);
	}
	
	private void createUI(boolean isPreview) {
		String imageUrl = module.getUrl();

		if(!isPreview){
			String contentType = playerServices.getAssetsService().getContentType(imageUrl);
			isSvg = contentType.toLowerCase().contains("image/svg+xml");
		}else{
			isSvg = false;
		}
			
		if(isSvg){
			setStyleName("ic_image");
			StyleUtils.applyInlineStyle(this, module);
			
			RequestBuilder requestBuilder = new RequestBuilder(RequestBuilder.GET, imageUrl);
			try {
				requestBuilder.sendRequest(null, new RequestCallback() {
					
					@Override
					public void onResponseReceived(Request request, Response response) {	
						getElement().setInnerHTML(response.getText());
						NodeList<Element> elem = getElement().getElementsByTagName("svg");
									
						if(module.getDisplayMode() == DisplayMode.stretch){
							elem.getItem(0).setAttribute("width", module.getWidth()+"px");
							elem.getItem(0).setAttribute("height", module.getHeight()+"px");
						}
						else if(module.getDisplayMode() == DisplayMode.keepAspect){														
							elem.getItem(0).setAttribute("width", module.getWidth()+"px");
							elem.getItem(0).setAttribute("height", module.getHeight()+"px");
						}
					}
					
					@Override
					public void onError(Request request, Throwable exception) {					
					}
				});
			} catch (RequestException e) {
				e.printStackTrace();
			}
		}else{			
			image = new Image();
			setStyleName("ic_image");
			StyleUtils.applyInlineStyle(this, module);
			add(image);
			
			if(imageUrl.length() > 0){
				image.addLoadHandler(new LoadHandler() {
					@Override
					public void onLoad(LoadEvent event) {
						if (!isVisible()) { //if not visible make it, just to work on IE9, 10
							setVisible(true);
							setImageSize();
							setVisible(false);
						} else {
							setImageSize();
						}
					}
				});
				
				image.setUrl(imageUrl);
			}
			setImageSize();
		}

		
		if(!isPreview){
			setVisible(module.isVisible());
		}
		getElement().setId(module.getId());
	}

	
	private void setImageSize() {
		if(module.getDisplayMode() == DisplayMode.stretch){
			image.setPixelSize(module.getWidth(), module.getHeight());
		}
		else if(module.getDisplayMode() == DisplayMode.keepAspect){
			keepAspect(module.getWidth(), module.getHeight());
		}
		else if(module.getDisplayMode() == DisplayMode.originalSize){
			image.setVisibleRect(0, 0, module.getWidth(), module.getHeight());
		}
	}

	
	private void keepAspect(int width, int height) {
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
			
			center();
		}
	}

	private void center() {

		int left = (getOffsetWidth()-image.getWidth())/2;
		int top = (getOffsetHeight()-image.getHeight())/2;
		setWidgetPosition(image, left, top);
	}


	@Override
	public void show() {

		setVisible(true);
		if(module.getDisplayMode() == DisplayMode.keepAspect){
			if(!isSvg){
				center();
			}
		}
	}


	@Override
	public void hide() {
		setVisible(false);
	}
}
