package com.lorepo.icplayer.client.module;

import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.properties.BasicPropertyProvider;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.api.IRectangleItem;

/**
 * Klasa implementuje bazowe functionalności potrzebne wszystkim modułom
 * 
 * @author Krzysztof Langner
 */
class AbsolutePositioningModule extends BasicPropertyProvider implements IRectangleItem {

	private int	left;
	private int	top;
	private int	width;
	private int	height;
	
	private IProperty leftProperty;
	private IProperty topProperty;
	private IProperty widthProperty;
	private IProperty heightProperty;
	
	private boolean disableChangeEvent = false;
	
	public AbsolutePositioningModule(String name){
		super(name);
	}


	protected void registerPositionProperties() {
		addPropertyLeft();
		addPropertyTop();
		addPropertyWidth();
		addPropertyHeight();
	}
	
	
	@Override
	public int getLeft() {
		return left;
	}

	@Override
	public int getTop() {
		return top;
	}

	@Override
	public int getWidth() {
		return width;
	}

	@Override
	public int getHeight() {
		return height;
	}

	@Override
	public void setLeft(int left) {

		this.left = left;
		if(!disableChangeEvent){
			sendPropertyChangedEvent(leftProperty);
		}
	}

	@Override
	public void setTop(int top) {

		this.top = top;
		if(!disableChangeEvent){
			sendPropertyChangedEvent(topProperty);
		}
	}

	@Override
	public void setWidth(int width) {

		this.width = width;
		if(!disableChangeEvent){
			sendPropertyChangedEvent(widthProperty);
		}
	}

	@Override
	public void setHeight(int height) {

		this.height = height;
		if(!disableChangeEvent){
			sendPropertyChangedEvent(heightProperty);
		}
	}


	private void addPropertyLeft() {

		leftProperty = new IProperty() {
			
			@Override
			public void setValue(String newValue) {
				left = Integer.parseInt(newValue);
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return Integer.toString(left);
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("left");
			}
		};
		
		addProperty(leftProperty);
	}

	
	private void addPropertyTop() {

		topProperty = new IProperty() {
			
			@Override
			public void setValue(String newValue) {
				top = Integer.parseInt(newValue);
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return Integer.toString(top);
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("top");
			}
		};
		
		addProperty(topProperty);
	}

	private void addPropertyWidth() {

		widthProperty = new IProperty() {
			
			@Override
			public void setValue(String newValue) {
				width = Integer.parseInt(newValue);
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return Integer.toString(width);
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("width");
			}
		};
		
		addProperty(widthProperty);
	}

	private void addPropertyHeight() {

		heightProperty = new IProperty() {
			
			@Override
			public void setValue(String newValue) {
				height = Integer.parseInt(newValue);
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return Integer.toString(height);
			}
			
			@Override
			public String getName() {
				return DictionaryWrapper.get("height");
			}
		};
		
		addProperty(heightProperty);
	}


	@Override
	public void disableChangeEvent(boolean disable) {

		disableChangeEvent = disable;
	}

}
