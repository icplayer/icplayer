package com.lorepo.icplayer.client.module.text;

import com.google.gwt.event.dom.client.BlurEvent;
import com.google.gwt.event.dom.client.BlurHandler;
import com.google.gwt.event.dom.client.FocusEvent;
import com.google.gwt.event.dom.client.FocusHandler;
import com.google.gwt.user.client.Element;
import com.lorepo.icplayer.client.module.text.TextPresenter.TextElementDisplay;

public class FilledGapWidget extends GapWidget implements TextElementDisplay {

	public FilledGapWidget(GapInfo gi, final ITextViewListener listener){
		super(gi, listener);
	}

	// initialize will be called in super constructor and in reconnectHandlers
	@Override
	protected void initialize(final ITextViewListener listener) {
		super.initialize(listener);

		Element element = getElement();
		
		if (element.getAttribute("class").contains("ui-droppable")) {
			setStylePrimaryName("ic_draggableGapEmpty");
		} else {
			setStylePrimaryName("ic_filled_gap");
		}
		
		element.setPropertyString("placeholder", this.gapInfo.getPlaceHolder());
	}
	
	@Override
	protected void connectHandlers(final ITextViewListener listener) {
		if (listener != null) {
			super.connectHandlers(listener);
			
			addFocusHandler(new FocusHandler() {
				public void onFocus(FocusEvent event) {
					listener.onGapFocused(getGapInfo().getId(), event.getRelativeElement());
				}
			});
			
			addBlurHandler(new BlurHandler() {
				public void onBlur(BlurEvent event) {
					listener.onGapBlured(getGapInfo().getId(), event.getRelativeElement());
					listener.onKeyAction(getGapInfo().getId(), event.getRelativeElement());
				}
			});
		}
	}

}
