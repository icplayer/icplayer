TEST_BASE_URL = 'https://test.com/file/serve/content/lessons/pages/';
TEST_RESOURCES_URL = TEST_BASE_URL + '../resources/';

CSS_TEXT_WITH_FILE_SERVE_SYNTAX = `
@font-face {
    font-family: "Avenir";
    font-weight: normal;
    text-rendering: optimizeLegibility;
    src:
        url("/file/serve/5340707192832") format("woff"),
        url("/file/serve/6451119054848") format("woff2");
}

@font-face {
    font-family: "Avenir";
    font-style: italic;
    font-weight: normal;
    text-rendering: optimizeLegibility;
    src:
        url("/file/serve/2628306698240") format("woff"),
        url("/file/serve/9126390317056") format("woff2");
}

body {
    font-family: "Avenir";
}
`;

TEST_1_EXPECTED_CSS_TEXT = `
@font-face {
    font-family: "Avenir";
    font-weight: normal;
    text-rendering: optimizeLegibility;
    src:
        url("${TEST_RESOURCES_URL}5340707192832.woff") format("woff"),
        url("${TEST_RESOURCES_URL}6451119054848.woff2") format("woff2");
}

@font-face {
    font-family: "Avenir";
    font-style: italic;
    font-weight: normal;
    text-rendering: optimizeLegibility;
    src:
        url("${TEST_RESOURCES_URL}2628306698240.woff") format("woff"),
        url("${TEST_RESOURCES_URL}9126390317056.woff2") format("woff2");
}

body {
    font-family: "Avenir";
}
`;

TEST_2_CSS_TEXT = `
@font-face {
    font-family: "Avenir";
    font-weight: normal;
    text-rendering: optimizeLegibility;
    src:
        url("https://test2.com/file/serve/content/lessons/res/2628306698240") format("woff"),
        url("/file/serve/6451119054848") format("woff2");
}

@font-face {
    font-family: "Avenir";
    font-style: italic;
    font-weight: normal;
    text-rendering: optimizeLegibility;
    src:
        url("https://test2.com/file/serve/content/lessons/res/font.woff") format("woff"),
        url("/file/serve/9126390317056") format("woff2");
}

@font-face {
    font-family: "Avenir";
    font-weight: bold;
    text-rendering: optimizeLegibility;
    src:
        url("https://test2.com/file/serve/content/lessons/res/font_bold.woff") format("woff"),
        url("https://test2.com/file/serve/content/lessons/res/font_blod.woff2") format("woff2"),
}

body {
    font-family: "Avenir";
}
`;

TEST_2_EXPECTED_CSS_TEXT = `
@font-face {
    font-family: "Avenir";
    font-weight: normal;
    text-rendering: optimizeLegibility;
    src:
        url("https://test2.com/file/serve/content/lessons/res/2628306698240") format("woff"),
        url("${TEST_RESOURCES_URL}6451119054848.woff2") format("woff2");
}

@font-face {
    font-family: "Avenir";
    font-style: italic;
    font-weight: normal;
    text-rendering: optimizeLegibility;
    src:
        url("https://test2.com/file/serve/content/lessons/res/font.woff") format("woff"),
        url("${TEST_RESOURCES_URL}9126390317056.woff2") format("woff2");
}

@font-face {
    font-family: "Avenir";
    font-weight: bold;
    text-rendering: optimizeLegibility;
    src:
        url("https://test2.com/file/serve/content/lessons/res/font_bold.woff") format("woff"),
        url("https://test2.com/file/serve/content/lessons/res/font_blod.woff2") format("woff2"),
}

body {
    font-family: "Avenir";
}
`;

TEST_3_CSS_TEXT = `
@font-face {
    font-family: "Avenir";
    font-weight: normal;
    text-rendering: optimizeLegibility;
    src:
        url("/file/serve/5340707192832") format("woff"),
        url("/file/serve/6451119054848") format("woff2");
}

@font-face {
    font-family: "Avenir";
    font-style: italic;
    font-weight: normal;
    text-rendering: optimizeLegibility;
    src:
        url("/file/serve/2628306698240") format("woff"),
        url("/file/serve/2628306698240") format("woff2");
}

body {
    font-family: "Avenir";
}
`;


TEST_3_EXPECTED_CSS_TEXT = `
@font-face {
    font-family: "Avenir";
    font-weight: normal;
    text-rendering: optimizeLegibility;
    src:
        url("${TEST_RESOURCES_URL}5340707192832.woff") format("woff"),
        url("${TEST_RESOURCES_URL}6451119054848.woff2") format("woff2");
}

@font-face {
    font-family: "Avenir";
    font-style: italic;
    font-weight: normal;
    text-rendering: optimizeLegibility;
    src:
        url("${TEST_RESOURCES_URL}2628306698240.woff") format("woff"),
        url("${TEST_RESOURCES_URL}2628306698240.woff") format("woff2");
}

body {
    font-family: "Avenir";
}
`;

TEST_4_EXPECTED_CSS_TEXT = `
@font-face {
    font-family: "Avenir";
    font-weight: normal;
    text-rendering: optimizeLegibility;
    src:
        url("${TEST_RESOURCES_URL}5340707192832.woff") format("woff"),
        url("${TEST_RESOURCES_URL}6451119054848.woff2") format("woff2");
}

@font-face {
    font-family: "Avenir";
    font-style: italic;
    font-weight: normal;
    text-rendering: optimizeLegibility;
    src:
        url("/file/serve/2628306698240") format("woff"),
        url("${TEST_RESOURCES_URL}9126390317056.woff2") format("woff2");
}

body {
    font-family: "Avenir";
}
`;
