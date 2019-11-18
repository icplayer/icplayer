package com.lorepo.icplayer.client.model.alternativeText;

import com.google.gwt.core.client.GWT;
import com.google.gwt.safehtml.client.SafeHtmlTemplates;
import com.google.gwt.safehtml.shared.SafeHtml;

public class AlternativeTextTemplates {
    public interface AltTextTemplate extends SafeHtmlTemplates {
        @Template("\\altEscaped{0}&altTextSeperator&{1}&altTextEnd&")
        SafeHtml altTextEscaped(String visible, String readable);

        @Template("[lang {0}]")
        SafeHtml langTag(String lang);
    }

    public static final AltTextTemplate TEMPLATES = GWT.create(AltTextTemplate.class);
}
