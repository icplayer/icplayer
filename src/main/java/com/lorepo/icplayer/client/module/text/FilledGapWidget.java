package com.lorepo.icplayer.client.module.text;

import java.util.ArrayList;

import com.google.gwt.event.dom.client.BlurEvent;
import com.google.gwt.event.dom.client.BlurHandler;
import com.google.gwt.event.dom.client.FocusEvent;
import com.google.gwt.event.dom.client.FocusHandler;
import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.user.client.Element;
import com.lorepo.icplayer.client.module.text.TextPresenter.TextElementDisplay;

public class FilledGapWidget extends GapWidget implements TextElementDisplay {
	private ArrayList<HandlerRegistration> filledGapHandlers = new ArrayList<HandlerRegistration>();
	
	public FilledGapWidget(GapInfo gi, final ITextViewListener listener){
		super(gi, listener);
		this.initialize(listener);
	}

	// initialize will be called in super constructor and in reconnectHandlers
	private final void initialize(final ITextViewListener listener) {
		Element element = getElement();
		
		if (element.getAttribute("class").contains("ui-droppable")) {
			setStylePrimaryName("ic_draggableGapEmpty");
		} else {
			setStylePrimaryName("ic_filled_gap");
		}
		
		element.setPropertyString("placeholder", this.gapInfo.getPlaceHolder());
		this.connectFilledGapHandlers(listener);
	}
	
	@Override
	public void reconnectHandlers(ITextViewListener listener) {
		super.reconnectHandlers(listener);
		this.initialize(listener);
	}
	
	private final void connectFilledGapHandlers(final ITextViewListener listener) {
		if (filledGapHandlers == null) {
			this.filledGapHandlers = new ArrayList<HandlerRegistration>();
		}

		if (listener != null) {
			super.connectHandlers(listener);
			
			filledGapHandlers.add(addFocusHandler(new FocusHandler() {
				public void onFocus(FocusEvent event) {
					listener.onGapFocused(getGapInfo().getId(), event.getRelativeElement());
				}
			}));
			
			filledGapHandlers.add(addBlurHandler(new BlurHandler() {
				public void onBlur(BlurEvent event) {
					listener.onGapBlured(getGapInfo().getId(), event.getRelativeElement());
					listener.onKeyAction(getGapInfo().getId(), event.getRelativeElement());
				}
			}));
		}
	}
	
	@Override
	protected void removeHandlers() {
		super.removeHandlers();
		
		for (HandlerRegistration handler: filledGapHandlers) {
			handler.removeHandler();
		}
		
		filledGapHandlers.clear();
	}

	@Override
	public boolean isActivity() {
		return true;
	}
}
