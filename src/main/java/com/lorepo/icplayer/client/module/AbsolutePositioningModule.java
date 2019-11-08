package com.lorepo.icplayer.client.module;

import java.util.HashMap;
import java.util.Set;

import com.google.gwt.xml.client.Element;
import com.lorepo.icf.properties.BasicPropertyProvider;
import com.lorepo.icf.properties.IProperty;
import com.lorepo.icf.utils.i18n.DictionaryWrapper;
import com.lorepo.icplayer.client.dimensions.DimensionName;
import com.lorepo.icplayer.client.dimensions.ModuleDimensions;
import com.lorepo.icplayer.client.model.layout.PageLayout;
import com.lorepo.icplayer.client.model.page.group.GroupPropertyProvider;
import com.lorepo.icplayer.client.module.api.ILayoutDefinition;
import com.lorepo.icplayer.client.module.api.IRectangleItem;
import com.lorepo.icplayer.client.module.api.SemiResponsiveLayouts;

/**
 * Function for positioning module on the page
 * 
 * @author Krzysztof Langner
 */
public class AbsolutePositioningModule extends BasicPropertyProvider implements IRectangleItem, SemiResponsiveLayouts {

	private ILayoutProperty layoutProperty;
	protected IProperty leftProperty;
	private IProperty rightProperty;
	protected IProperty topProperty;
	private IProperty bottomProperty;
	protected IProperty widthProperty;
	protected IProperty heightProperty;
	
	private GroupPropertyProvider group = null; 	
	
	protected SemiResponsivePositions semiResponsivePositions = new SemiResponsivePositions();
	
	private boolean disableChangeEvent = false;
	
	public AbsolutePositioningModule(String name){
		super(name);
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
		return this.semiResponsivePositions.getCurrentLayoutDefinition();
	}
	
	protected int getPositionValue(String attribute) {
		return this.semiResponsivePositions.getPositionValue(attribute);
	}
	
	protected void setPositionValue(String attribute, int value) {
		this.semiResponsivePositions.setPositionValue(attribute, value);
	}
	
	@Override
	public int getLeft() {
		return this.getPositionValue(DimensionName.LEFT);
	}
	
	@Override
	public int getRight() {
		return this.getPositionValue(DimensionName.RIGHT);
	}

	@Override
	public int getTop() {
		return this.getPositionValue(DimensionName.TOP);
	}

	@Override
	public int getBottom() {
		return this.getPositionValue(DimensionName.BOTTOM);
	}

	@Override
	public int getWidth() {
		return this.getPositionValue(DimensionName.WIDTH);
	}

	@Override
	public int getHeight() {
		return this.getPositionValue(DimensionName.HEIGHT);
	}

	@Override
	public LayoutDefinition getCurrentLayoutDefinition() {
		return this.semiResponsivePositions.getCurrentLayoutDefinition();
	}
	
	@Override
	public void addSemiResponsiveDimensions(String name, ModuleDimensions dimensions) {
		this.semiResponsivePositions.addSemiResponsiveDimensions(name, dimensions);
	}
	
	@Override
	public HashMap<String,ModuleDimensions> getResponsiveLayouts() {
		return this.semiResponsivePositions.getAllLayoutsDefinitions();
	}
	
	@Override
	public void setSemiResponsiveLayoutID(String semiResponsiveLayout) {
		this.semiResponsivePositions.setSemiResponsiveLayoutID(semiResponsiveLayout);
	}
	
	@Override
	public void syncSemiResponsiveLayouts(Set<PageLayout> actualSemiResponsiveLayouts) {
		this.semiResponsivePositions.syncSemiResponsiveLayouts(actualSemiResponsiveLayouts);
	}
	
	public Element getLayoutsXML() {
		return this.semiResponsivePositions.toXML();
	}
	
	public void setRelativeLayout(String id, LayoutDefinition relativeLayout) {
		this.semiResponsivePositions.addRelativeLayout(id, relativeLayout);
	}
	
	@Override
	public void setLeft(int left) {

		this.setPositionValue(DimensionName.LEFT, left);
		if(!disableChangeEvent){
			sendPropertyChangedEvent(leftProperty);
		}
		update();
	}

	@Override
	public void setRight(int right) {

		this.setPositionValue(DimensionName.RIGHT, right);
		if(!disableChangeEvent){
			sendPropertyChangedEvent(rightProperty);
		}
	}

	@Override
	public void setTop(int top) {
		this.setPositionValue(DimensionName.TOP, top);
		if(!disableChangeEvent){
			sendPropertyChangedEvent(topProperty);
		}
		update();
	}

	@Override
	public void setBottom(int bottom) {

		this.setPositionValue(DimensionName.BOTTOM, bottom);
		if(!disableChangeEvent){
			sendPropertyChangedEvent(bottomProperty);
		}
	}

	@Override
	public void setWidth(int width) {

		this.setPositionValue(DimensionName.WIDTH, width);
		if(!disableChangeEvent){
			sendPropertyChangedEvent(widthProperty);
		}
	}

	@Override
	public void setHeight(int height) {

		this.setPositionValue(DimensionName.HEIGHT, height);
		if(!disableChangeEvent){
			sendPropertyChangedEvent(heightProperty);
		}
	}

	@Override
	public void copyConfiguration(String lastSeenLayout) {
		this.semiResponsivePositions.copyConfiguration(lastSeenLayout);
	}
	
	protected String getSemiResponsiveID() {
		return this.semiResponsivePositions.getSemiResponsiveLayoutID();
	}
	
	public String getDefaultSemiResponsiveID() {
		return this.semiResponsivePositions.getDefaultSemiResponsiveLayoutID();
	}


	private void addPropertyLayout() {

		layoutProperty = new ILayoutProperty() {
			
			@Override
			public void setValue(String newValue) {
				sendPropertyChangedEvent(this);
			}
			
			@Override
			public String getValue() {
				return getCurrentLayoutDefinition().getName();
			}
			
			@Override
			public String getName() {
				return "Layout";
			}

			@Override
			public LayoutDefinition getLayout() {
				return getCurrentLayoutDefinition();
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

		this.leftProperty = new IProperty() {
			
			public String ATTRIBUTE_KEY = DimensionName.LEFT;
			public String ATTRIBUTE_NAME = "Left";
			
			@Override
			public void setValue(String newValue) {
				if(newValue.length() > 0){
					setLeft(Integer.parseInt(newValue)); 
				}
			}
			
			@Override
			public String getValue() {
				if(getCurrentLayoutDefinition().hasLeft()){
					return Integer.toString(getLeft());
				}
				else{
					return "";
				}
			}
			
			@Override
			public String getName() {
				return ATTRIBUTE_NAME;
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get(ATTRIBUTE_KEY);
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(this.leftProperty);
	}

	
	private void addPropertyTop() {

		topProperty = new IProperty() {
			
			public String ATTRIBUTE_KEY = DimensionName.TOP;
			public String ATTRIBUTE_NAME = "Top";
			
			@Override
			public void setValue(String newValue) {
				if(newValue.length() > 0){
					setTop(Integer.parseInt(newValue));
				}
			}
			
			@Override
			public String getValue() {
				if(getCurrentLayoutDefinition().hasTop()){
					return Integer.toString(getTop());
				}
				else{
					return "";
				}
			}
			
			@Override
			public String getName() {
				return ATTRIBUTE_NAME;
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get(ATTRIBUTE_KEY);
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
			
			public String ATTRIBUTE_KEY = DimensionName.WIDTH;
			public String ATTRIBUTE_NAME = "Width";
			
			@Override
			public void setValue(String newValue) {
				if(newValue.length() > 0){
					setPositionValue(ATTRIBUTE_KEY, Integer.parseInt(newValue));
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				if(getCurrentLayoutDefinition().hasWidth()){
					return Integer.toString(getWidth());
				}
				else{
					return "";
				}
			}
			
			@Override
			public String getName() {
				return ATTRIBUTE_NAME;
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get(ATTRIBUTE_KEY);
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
			
			public String ATTRIBUTE_KEY = DimensionName.HEIGHT;
			public String ATTRIBUTE_NAME = "Height";
			
			@Override
			public void setValue(String newValue) {
				if(newValue.length() > 0){
					setPositionValue(ATTRIBUTE_KEY, Integer.parseInt(newValue));
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				if(getCurrentLayoutDefinition().hasHeight()){
					return Integer.toString(getHeight());
				}
				else{
					return "";
				}
			}
			
			@Override
			public String getName() {
				return ATTRIBUTE_NAME;
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get(ATTRIBUTE_KEY);
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
			
			public String ATTRIBUTE_KEY = DimensionName.RIGHT;
			public String ATTRIBUTE_NAME = "Right";
			
			@Override
			public void setValue(String newValue) {
				if(newValue.length() > 0){
					setPositionValue(ATTRIBUTE_KEY, Integer.parseInt(newValue));
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				if(getCurrentLayoutDefinition().hasRight()){
					return Integer.toString(getRight());
				}
				else{
					return "";
				}
			}
			
			@Override
			public String getName() {
				return ATTRIBUTE_NAME;
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get(ATTRIBUTE_KEY);
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
			
			public String ATTRIBUTE_KEY = DimensionName.BOTTOM;
			public String ATTRIBUTE_NAME = "Bottom"; 
			
			@Override
			public void setValue(String newValue) {
				if(newValue.length() > 0){
					setPositionValue(ATTRIBUTE_KEY, Integer.parseInt(newValue));
					sendPropertyChangedEvent(this);
				}
			}
			
			@Override
			public String getValue() {
				if(getCurrentLayoutDefinition().hasBottom()){
					return Integer.toString(getBottom());
				}
				else{
					return "";
				}
			}
			
			@Override
			public String getName() {
				return ATTRIBUTE_NAME;
			}

			@Override
			public String getDisplayName() {
				return DictionaryWrapper.get(ATTRIBUTE_KEY);
			}

			@Override
			public boolean isDefault() {
				return false;
			}
		};
		
		addProperty(bottomProperty);
	}
	
	public void loadLayout(Element node) {
		LayoutDefinition layout = new LayoutDefinition();
		layout.load(node);
		this.semiResponsivePositions.setLayoutDefinition("default", layout);
	}
	
	
	public boolean isModuleInEditorVisible() {
		return this.semiResponsivePositions.isModuleInEditorVisible();
	}
	
	public boolean isVisible() {
		return this.semiResponsivePositions.isVisible();
	}
	
	public boolean isLocked() {
		return this.semiResponsivePositions.isLocked();
	}
	
	public void setIsVisible(Boolean isVisible) {
		this.semiResponsivePositions.setIsVisible(isVisible);
	}
	
	public void setIsLocked(Boolean isLocked) {
		this.semiResponsivePositions.setIsLocked(isLocked);
	}
	
	public void setModuleInEditorVisibility(boolean isVisibleInEditor) {
		this.semiResponsivePositions.setIsVisibleInEditor(isVisibleInEditor);
	}
	
	public void setIsVisibleInEditor(String name, boolean isVisibleInEditor) {
		this.semiResponsivePositions.setIsVisibleInEditor(name, isVisibleInEditor);
	}
	
	public void setIsLocked(String name, boolean isLocked) {
		this.semiResponsivePositions.setIsLocked(name, isLocked);
	}
	
	public void lock(boolean state) {
		this.semiResponsivePositions.lock(state);
	}

	@Override
	public void translateSemiResponsiveIDs(HashMap<String, String> translationMap) {
		this.semiResponsivePositions.translateSemiResponsiveIDs(translationMap);
	}

	@Override
	public HashMap<String, Boolean> getResponsiveVisibilityInEditor() {
		return this.semiResponsivePositions.getResponsiveVisibilityInEditor();
	}

	@Override
	public HashMap<String, Boolean> getResponsiveLocked() {
		return this.semiResponsivePositions.getResponsiveLocked();
	}

	@Override
	public HashMap<String, LayoutDefinition> getResponsiveRelativeLayouts() {
		return this.semiResponsivePositions.getResponsiveRelativeLayouts();
	}
	
	public void setGroupPropertyProvider(GroupPropertyProvider group) {
		this.group = group; 
	}
	
	public boolean hasGroup() {
	    return group != null;
	}
	
	private void update() {
		if(hasGroup()) {
			group.update();
		}
	}
	
	
	public void changeAbsoluteToRelative(int deltaLeft, int deltaTop) {
		
		this.setPositionValue(DimensionName.LEFT, getLeft() - deltaLeft);
		if(!disableChangeEvent){
			sendPropertyChangedEvent(leftProperty);
		}
		
		this.setPositionValue(DimensionName.TOP, getTop() - deltaTop);
		if(!disableChangeEvent){
			sendPropertyChangedEvent(topProperty);
		}
	}
	
	
	public void changeRelativeToAbsolute(int deltaLeft, int deltaTop) {
	
		this.setPositionValue(DimensionName.LEFT, getLeft() + deltaLeft);
		if(!disableChangeEvent){
			sendPropertyChangedEvent(leftProperty);
		}
		
		this.setPositionValue(DimensionName.TOP, getTop() + deltaTop);
		if(!disableChangeEvent){
			sendPropertyChangedEvent(topProperty);
		}
		
	}
	
}
