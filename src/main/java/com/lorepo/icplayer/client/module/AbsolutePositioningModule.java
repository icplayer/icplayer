package com.lorepo.icplayer.client.module;

import java.util.HashMap;

import com.lorepo.icf.properties.BasicPropertyProvider;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.module.api.ILayoutDefinition;
import com.lorepo.icplayer.client.module.api.IRectangleItem;

/**
 * Function for positioning module on the page
 * 
 * @author Krzysztof Langner
 */
class AbsolutePositioningModule extends BasicPropertyProvider implements IRectangleItem {

	protected LayoutDefinition layout;
	private int	left;
	private int	right;
	private int	top;
	private int	bottom;
	private int	width;
	private int	height;

	private ILayoutProperty layoutProperty;
	private IProperty leftProperty;
	private IProperty rightProperty;
	private IProperty topProperty;
	private IProperty bottomProperty;
	private IProperty widthProperty;
	private IProperty heightProperty;
	
	private HashMap<String, HashMap<String, Integer>> positions = new HashMap<String, HashMap<String, Integer>>();
	
	private boolean disableChangeEvent = false;
	
	public AbsolutePositioningModule(String name){
		super(name);
		layout = new LayoutDefinition();
	}

	protected void registerPositionProperties() {
		addPropertyLayout();
		addPropertyLeft();
		addPropertyTop();
		addPropertyWidth();
		addPropertyHeight();
		addPropertyRight();
		addPropertyBottom();
	}
	
	@Override
	public ILayoutDefinition getLayout(){
		return layout;
	}
	
	@Override
	public int getLeft() {
		return left;
	}
	
	@Override
	public int getRight() {
		return right;
	}

	@Override
	public int getTop() {
		return top;
	}

	@Override
	public int getBottom() {
		return bottom;
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
	public void setRight(int right) {

		this.right = right;
		if(!disableChangeEvent){
			sendPropertyChangedEvent(rightProperty);
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
	public void setBottom(int bottom) {

		this.bottom = bottom;
		if(!disableChangeEvent){
			sendPropertyChangedEvent(bottomProperty);
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
	
	public void setPosition(String name, HashMap<String, Integer> position) {
		this.positions.put(name, position);
	}


	private void addPropertyLayout() {

		layoutProperty = new ILayoutProperty() {
			
			@Override
			public void setValue(String newValue) {
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return layout.getName();
			}
			
			@Override
			public String getName() {
				return "Layout";
			}

			@Override
			public LayoutDefinition getLayout() {
				return layout;
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("layout");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(layoutProperty);
	}


	private void addPropertyLeft() {

		leftProperty = new IProperty() {
			
			@Override
			public void setValue(String newValue) {
				if(newValue.length() > 0){
					left = Integer.parseInt(newValue);
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				if(layout.hasLeft()){
					return Integer.toString(left);
				}
				else{
					return "";
				}
			}
			
			@Override
			public String getName() {
				return "Left";
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("left");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(leftProperty);
	}

	
	private void addPropertyTop() {

		topProperty = new IProperty() {
			
			@Override
			public void setValue(String newValue) {
				if(newValue.length() > 0){
					top = Integer.parseInt(newValue);
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				if(layout.hasTop()){
					return Integer.toString(top);
				}
				else{
					return "";
				}
			}
			
			@Override
			public String getName() {
				return "Top";
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("top");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(topProperty);
	}

	private void addPropertyWidth() {

		widthProperty = new IProperty() {
			
			@Override
			public void setValue(String newValue) {
				if(newValue.length() > 0){
					width = Integer.parseInt(newValue);
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				if(layout.hasWidth()){
					return Integer.toString(width);
				}
				else{
					return "";
				}
			}
			
			@Override
			public String getName() {
				return "Width";
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("width");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(widthProperty);
	}

	private void addPropertyHeight() {

		heightProperty = new IProperty() {
			
			@Override
			public void setValue(String newValue) {
				if(newValue.length() > 0){
					height = Integer.parseInt(newValue);
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				if(layout.hasHeight()){
					return Integer.toString(height);
				}
				else{
					return "";
				}
			}
			
			@Override
			public String getName() {
				return "Height";
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("height");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(heightProperty);
	}


	@Override
	public void disableChangeEvent(boolean disable) {
		disableChangeEvent = disable;
	}

	private void addPropertyRight() {

		rightProperty = new IProperty() {
			
			@Override
			public void setValue(String newValue) {
				if(newValue.length() > 0){
					right = Integer.parseInt(newValue);
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				if(layout.hasRight()){
					return Integer.toString(right);
				}
				else{
					return "";
				}
			}
			
			@Override
			public String getName() {
				return "Right";
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("right");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(rightProperty);
	}


	private void addPropertyBottom() {

		bottomProperty = new IProperty() {
			
			@Override
			public void setValue(String newValue) {
				if(newValue.length() > 0){
					bottom = Integer.parseInt(newValue);
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				if(layout.hasBottom()){
					return Integer.toString(bottom);
				}
				else{
					return "";
				}
			}
			
			@Override
			public String getName() {
				return "Bottom";
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get("bottom");
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(bottomProperty);
	}

}
