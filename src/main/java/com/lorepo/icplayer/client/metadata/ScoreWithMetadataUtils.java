package com.lorepo.icplayer.client.metadata;
import org.apache.commons.lang.math.NumberUtils;

public class ScoreWithMetadataUtils {
    final static String ENUMERATE_START = "enumerate_start";
    final static String EXPORT_SCORE = "export_to_diagnostic_excel";
    final static String NUMERATION_TYPE = "numeration_type";
    final static String NUMERATION_ALPHABETIC = "alphabetic";
    final static String ALPHABET = "ABCDEFGHIJKLMNOPRSTUWXYZ";

    public static String getEnumerateStart(IMetadata metadata) {
        if (!metadata.hasKey(ENUMERATE_START)) return "";
        return metadata.getValue(ENUMERATE_START);
    }

    public static boolean validateMetadata(IMetadata metadata) {
        return metadata.hasKey(EXPORT_SCORE) && metadata.getValue(EXPORT_SCORE).equals("true")
                && metadata.hasKey(ENUMERATE_START) && metadata.getValue(ENUMERATE_START).length( ) != 0;
    }

    public static boolean enumerateAlphabetically(IMetadata metadata) {
        return metadata.hasKey(NUMERATION_TYPE) && metadata.getValue(NUMERATION_TYPE).equals(NUMERATION_ALPHABETIC);
    }

    public static String getQuestionNumber(String enumerationTemplate, int index, boolean isAlphabetical) {
        String enumerationStart = "";
        int startIndex = 0;
        if (!enumerationTemplate.contains(".")) {
            enumerationStart = enumerationTemplate + ".";
        } else if (enumerationTemplate.endsWith(".")) {
            enumerationStart = enumerationTemplate;
        } else {
            int lastDotIndex = enumerationTemplate.lastIndexOf(".");
            enumerationStart = enumerationTemplate.substring(0, lastDotIndex + 1);
            String postfix = enumerationTemplate.substring(lastDotIndex + 1).trim();
            if (isInt(postfix)) {
                startIndex = Integer.parseInt(postfix) - 1;
            } else if (postfix.length() == 1 && ALPHABET.indexOf(postfix) != -1) {
                startIndex = ALPHABET.indexOf(postfix);
            }
        }

        if (isAlphabetical) {
            return enumerationStart + getLetterWithIndex(startIndex + index);
        } else {
            return enumerationStart + String.valueOf(startIndex + index + 1);
        }
    }

    private static boolean isInt(String value) {
        try {
            int parsedValue = Integer.parseInt(value);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    public static String getLetterWithIndex(int index) {
        String result = "";
        int modLetter = index / ALPHABET.length();
        if (modLetter > 0) {
            modLetter = (modLetter - 1) % ALPHABET.length();
            result += ALPHABET.substring(modLetter, modLetter + 1);
        }
        int letterIndex = index % ALPHABET.length();
        result += ALPHABET.substring(letterIndex, letterIndex + 1);
        return result;
    }
}
