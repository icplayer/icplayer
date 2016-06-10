package com.lorepo.icplayer.client.module;

import java.util.HashMap;

import com.google.gwt.xml.client.Element;
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

	protected HashMap<String, LayoutDefinition> layoutsDefinitions = new HashMap<String, LayoutDefinition>();
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
	protected String positionType = "default";
	
	private boolean disableChangeEvent = false;
	
	public AbsolutePositioningModule(String name){
		super(name);
		this.layoutsDefinitions.put("default", new LayoutDefinition());
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
		return this.layoutsDefinitions.get(this.positionType);
	}
	
	private int getPositionValue(String attribute) {
		return this.positions.get(this.positionType).get(attribute);
	}
	
	private void setPositionValue(String attribute, int value) {
		HashMap<String, Integer> position = this.positions.get(this.positionType);
		position.put(attribute, value);
		
		this.positions.put(this.positionType, position);
	}
	
	@Override
	public int getLeft() {
		return this.getPositionValue("left");
	}
	
	@Override
	public int getRight() {
		return this.getPositionValue("right");
	}

	@Override
	public int getTop() {
		return this.getPositionValue("top");
	}

	@Override
	public int getBottom() {
		return this.getPositionValue("bottom");
	}

	@Override
	public int getWidth() {
		return this.getPositionValue("width");
	}

	@Override
	public int getHeight() {
		return this.getPositionValue("height");
	}
	
	protected String getLayoutXML() {
		return this.layoutsDefinitions.get(this.positionType).toXML();
	}

	@Override
	public void setLeft(int left) {

		this.setPositionValue("left", left);
		if(!disableChangeEvent){
			sendPropertyChangedEvent(leftProperty);
		}
	}

	@Override
	public void setRight(int right) {

		this.setPositionValue("right", right);
		if(!disableChangeEvent){
			sendPropertyChangedEvent(rightProperty);
		}
	}

	@Override
	public void setTop(int top) {

		this.setPositionValue("top", top);
		if(!disableChangeEvent){
			sendPropertyChangedEvent(topProperty);
		}
	}

	@Override
	public void setBottom(int bottom) {

		this.setPositionValue("bottom", bottom);
		if(!disableChangeEvent){
			sendPropertyChangedEvent(bottomProperty);
		}
	}

	@Override
	public void setWidth(int width) {

		this.setPositionValue("width", width);
		if(!disableChangeEvent){
			sendPropertyChangedEvent(widthProperty);
		}
	}

	@Override
	public void setHeight(int height) {

		this.setPositionValue("height", height);
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
				return layoutsDefinitions.get(positionType).getName();
			}
			
			@Override
			public String getName() {
				return "Layout";
			}

			@Override
			public LayoutDefinition getLayout() {
				return layoutsDefinitions.get(positionType);
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
					setPositionValue("left", Integer.parseInt(newValue));
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				if(getLayout().hasLeft()){
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
					setPositionValue("top", Integer.parseInt(newValue));
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				if(getLayout().hasTop()){
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
					setPositionValue("width", Integer.parseInt(newValue));
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				if(getLayout().hasWidth()){
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
					setPositionValue("height", Integer.parseInt(newValue));
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				if(getLayout().hasHeight()){
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
					setPositionValue("right", Integer.parseInt(newValue));
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				if(getLayout().hasRight()){
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
					setPositionValue("bottom", Integer.parseInt(newValue));
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				if(getLayout().hasBottom()){
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
	
	public void loadLayout(Element node) {
		LayoutDefinition layout = this.layoutsDefinitions.get("default");
		layout.load(node);
		this.layoutsDefinitions.put("default", layout);
	}
}
