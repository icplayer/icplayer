package com.lorepo.icplayer.client.module.text;

import com.google.gwt.event.dom.client.BlurEvent;
import com.google.gwt.event.dom.client.BlurHandler;
import com.google.gwt.event.dom.client.FocusEvent;
import com.google.gwt.event.dom.client.FocusHandler;
import com.lorepo.icplayer.client.module.text.TextPresenter.TextElementDisplay;

public class FilledGapWidget extends GapWidget implements TextElementDisplay{

	public FilledGapWidget(GapInfo gi, final ITextViewListener listener){
		
		super(gi, listener);
		
		setStylePrimaryName("ic_filled_gap");
		
		getElement().setPropertyString("placeholder", gi.getPlaceHolder());
		
		if (listener != null) {
			addFocusHandler(new FocusHandler() {
				public void onFocus(FocusEvent event) {
					listener.onGapFocused(getGapInfo().getId(), event.getRelativeElement());
				}
			});
			
			addBlurHandler(new BlurHandler() {
				public void onBlur(BlurEvent event) {
					listener.onGapBlured(getGapInfo().getId(), event.getRelativeElement());
				}
			});
		}
	}

}
