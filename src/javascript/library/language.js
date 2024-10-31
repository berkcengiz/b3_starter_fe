/* You can transfer this config to the head of your site to dynamically configure values using data from the CMS */

const googleTranslateConfig = {
    /* Original language */
    lang: "en",
    langFirstVisit: "en",

    /* If you want to subscribe to the "FinishTranslate" event (The moment when the script finished translating), uncomment and add any test word in the original language */
    // testWord: "Язык",

    /* If the script does not work or does not work correctly, uncomment and specify the main domain in the domain property */
    // domain: "Get-Web.Site"
};

$(function () {
    /* Connecting the google translate widget */
    let script = document.createElement("script");
    script.src = `https://translate.google.com/translate_a/element.js?cb=TranslateWidgetIsLoaded`;
    document.getElementsByTagName("head")[0].appendChild(script);
});

function TranslateWidgetIsLoaded() {
    TranslateInit(googleTranslateConfig);
}

function TranslateInit(config) {
    if (config.langFirstVisit && !$.cookie("googtrans")) {
        /* If the translation language is installed for the first visit and cookies are not assigned */
        TranslateCookieHandler("/auto/" + config.langFirstVisit);
    }

    let code = TranslateGetCode(config);

    TranslateHtmlHandler(code);

    if (code == config.lang) {
        /* If the default language is the same as the language we are translating into, then we clear the cookies */
        TranslateCookieHandler(null, config.domain);
    }

    if (config.testWord)
        TranslateMutationObserver(config.testWord, code == config.lang);

    /* Initialize the widget with the default language */
    new google.translate.TranslateElement({
        pageLanguage: config.lang,
        multilanguagePage: true, // Your page contains content in more than one languages
    });

    /* Assigning a handler to the flags */
    $(".selectable-lang[data-lang]").click(function () {
        TranslateCookieHandler(
            "/auto/" + $(this).attr("data-lang"),
            config.domain
        );
        /* Reloading the page */
        window.location.reload();
    });
}

function TranslateGetCode(config) {
    /* If there are no cookies, then we pass the default language */
    let lang =
        $.cookie("googtrans") != undefined && $.cookie("googtrans") != "null"
            ? $.cookie("googtrans")
            : config.lang;
    return lang.match(/(?!^\/)[^\/]*$/gm)[0];
}

function TranslateCookieHandler(val, domain) {
    /* Writing down cookies /language_for_translation/the_language_we_are_translating_into */
    $.cookie("googtrans", val, {
        domain: document.domain,
        path: "/",
    });
    $.cookie("googtrans", val, {
        domain: "." + document.domain,
        path: "/",
    });

    if (domain == "undefined") return;
    /* Writing down cookies for the domain, if it is assigned in the config */
    $.cookie("googtrans", val, {
        domain: domain,
        path: "/",
    });

    $.cookie("googtrans", val, {
        domain: "." + domain,
        path: "/",
    });
}

function TranslateHtmlHandler(code) {
    /* We get the language to which we translate and produce the necessary manipulations with DOM */
    $('.selectable-lang[data-lang="' + code + '"]').addClass("current-lang");

    var selectedLang = $('.selectable-lang[data-lang="' + code + '"]').data(
        "lang"
    );

    $(".selected-lang").attr("data-lang", selectedLang);
}

function TranslateMutationObserver(word, isOrigin) {
    if (isOrigin) {
        document.dispatchEvent(new CustomEvent("FinishTranslate"));
    } else {
        /* Creating a hidden block in which we add a test word in the original language. This will allow us to track the moment when the site is translated and trigger the "FinishTranslate" event  */

        let div = document.createElement("div");
        div.id = "googleTranslateTestWord";
        div.innerHTML = word;
        div.style.display = "none";
        document.body.prepend(div);

        let observer = new MutationObserver(() => {
            document.dispatchEvent(new CustomEvent("FinishTranslate"));
            observer.disconnect();
        });

        observer.observe(div, {
            childList: false,
            subtree: true,
            characterDataOldValue: true,
        });
    }
}
