package com.lorepo.icplayer.client.module.imagesource;

import com.google.gwt.dom.client.Style.Unit;
import com.google.gwt.dom.client.Element;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.DragStartEvent;
import com.google.gwt.event.dom.client.DragStartHandler;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.MouseUpEvent;
import com.google.gwt.event.dom.client.MouseUpHandler;
import com.google.gwt.event.dom.client.TouchEndEvent;
import com.google.gwt.event.dom.client.TouchEndHandler;
import com.google.gwt.user.client.ui.Image;
import com.lorepo.icf.utils.JavaScriptUtils;
import com.lorepo.icplayer.client.framework.module.StyleUtils;
import com.lorepo.icplayer.client.module.IWCAG;
import com.lorepo.icplayer.client.module.imagesource.ImageSourcePresenter.IDisplay;

public class ImageSourceView extends Image implements IDisplay, IWCAG {

	private static final String DEFAULT_STYLE = "ic_sourceImage";
	private static final String SELECTED_STYLE = "selected";
	private static final String DISABLED_STYLE = "disabled";
	
	private ImageSourceModule module;
	private IViewListener listener;
	private boolean isDragged = false;
	private boolean isTouchSupported = false;
	private boolean isPreview;
	private int initialLeft;
	private int initialTop;
	private boolean disabled = false;
	
	public ImageSourceView(ImageSourceModule module, boolean isPreview) {
		this.module = module;
		this.isPreview = isPreview;
		createUI();
		connectHandlers();
	}

	private void createUI() {
		setStyleName(DEFAULT_STYLE);
		StyleUtils.applyInlineStyle(this, module);
		if (isPreview && module.isDisabled()) {
			StyleUtils.addStateDisableClass(this);
		}

		String imageUrl = module.getUrl();
		if (imageUrl.length() > 0) {
			setUrl(imageUrl);
		}
		
		getElement().setId(module.getId());
		if (!isPreview) {
			setVisible(module.isVisible());
		}
		
		getElement().setAttribute("alt", this.module.getAlttext());
	}
	
	@Override
	public boolean getDisabled() {
		return this.disabled;
	}
	
	@Override
	public void setDisabled(boolean disable) {
		this.disabled = disable;
		if (disabled) {
			addStyleDependentName(DISABLED_STYLE);
			removeDraggable(getElement());
		} else {
			removeStyleDependentName(DISABLED_STYLE);
			reDraggableElement(getElement());
		}
	}
	
	public native static void removeDraggable(Element e) /*-{
		$wnd.$(e).draggable( "option", "disabled", true );
	}-*/;

	public native static void reDraggableElement(Element e) /*-{
		$wnd.$(e).draggable( "option", "disabled", false );
	}-*/;
	
	public void makeDraggable(ImageSourcePresenter p) {
		if (!isPreview) {
			JavaScriptUtils.makeDraggable(getElement(), p.getAsJavaScript());
		}
	}
	
	protected void connectHandlers() {
		addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				event.stopPropagation();
				event.preventDefault();
			}
		});

		addDragStartHandler(new DragStartHandler() {
			@Override
			public void onDragStart(DragStartEvent event) {
				if (listener != null && !disabled) {
					listener.onDragged();
				}
			}
		});
		
		addMouseUpHandler(new MouseUpHandler() {
			@Override
			public void onMouseUp(MouseUpEvent event) {
				if (!isDragged && !isTouchSupported) {
					if (listener != null && !disabled) {
						listener.onClicked();
					}
				}
			}
		});
		
		addTouchEndHandler(new TouchEndHandler() {
			@Override
			public void onTouchEnd(TouchEndEvent event) {
				isTouchSupported = true;
				if (!isDragged) {
					if (listener != null && !disabled) {
						listener.onClicked();
					}
				}
			}
		});
	}

	@Override
	public void select() {
		setStyleDependentName(SELECTED_STYLE, true);
	}

	@Override
	public void deselect() {
		setStyleDependentName(SELECTED_STYLE, false);
	}

	@Override
	public void addListener(IViewListener l) {
		listener = l;
	}
	
	public void show(boolean refreshPosition) {
		setVisible(true);
		if (refreshPosition) {
			setInitialPosition();
		}
	}
	
	public void setDragMode() {
		isDragged = true;
	}
	
	public void unsetDragMode() {
		isDragged = false;
	}

	@Override
	public void hide() {
		setVisible(false);
	}
	
	public void getInitialPosition() {
		initialLeft = Integer.parseInt(getElement().getStyle().getLeft().replace("px", ""));
		initialTop = Integer.parseInt(getElement().getStyle().getTop().replace("px", ""));
	}
	
	private void setInitialPosition() {
		getElement().getStyle().setLeft(initialLeft, Unit.PX);
		getElement().getStyle().setTop(initialTop, Unit.PX);
	}

	@Override
	public void enter(boolean isExiting) {
		this.listener.onClicked();
	}

	@Override
	public void space() {
	}

	@Override
	public void tab() {
	}

	@Override
	public void left() {
	}

	@Override
	public void right() {
	}

	@Override
	public void down() {
	}

	@Override
	public void up() {
	}

	@Override
	public void escape() {
	}

	@Override
	public void customKeyCode(KeyDownEvent event) {
	}

	@Override
	public void shiftTab() {
	}
}
