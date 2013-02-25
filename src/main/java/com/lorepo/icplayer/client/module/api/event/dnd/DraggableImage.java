package com.lorepo.icplayer.client.module.api.event.dnd;

/**
 * Reprezentuje dragowalny obiekt, który jest obrazkiem. 
 * Wartość przekazywana w obiekcie jest URL-em do obrazka.
 * 
 * @author Krzysztof Langner
 */
public class DraggableImage extends DraggableItem {

	public DraggableImage(String id, String imageUrl) {
		super(id, imageUrl);
	}
}
