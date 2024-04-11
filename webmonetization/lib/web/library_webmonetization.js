// https://kripken.github.io/emscripten-site/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html

var WebMonetizationLibrary = {

    $Context: {
        listener: null
    },

    WebMonetization_PlatformSetEventListener: function(listener) {
        Context.listener = listener;

        if (document.monetization === undefined) {
            return;
        }

        document.monetization.addEventListener("", event => {
            {{{ makeDynCall("vii", "Context.listener") }}} (
                stringToUTF8OnStack("monetizationpending"),
                stringToUTF8OnStack(JSON.stringify(event.detail !== undefined ? event.detail : {}))
            );
        });
        document.monetization.addEventListener("monetizationstart", event => {
            {{{ makeDynCall("vii", "Context.listener") }}} (
                stringToUTF8OnStack("monetizationstart"),
                stringToUTF8OnStack(JSON.stringify(event.detail !== undefined ? event.detail : {}))
            );
        });
        document.monetization.addEventListener("monetizationprogress", event => {
            {{{ makeDynCall("vii", "Context.listener") }}} (
                stringToUTF8OnStack("monetizationprogress"),
                stringToUTF8OnStack(JSON.stringify(event.detail !== undefined ? event.detail : {}))
            );
        });
        document.monetization.addEventListener("monetizationstop", event => {
            {{{ makeDynCall("vii", "Context.listener") }}} (
                stringToUTF8OnStack("monetizationstop"),
                stringToUTF8OnStack(JSON.stringify(event.detail !== undefined ? event.detail : {}))
            );
        });
    },

    WebMonetization_PlatformIsMonetized: function() {
        return document.monetization !== undefined && document.monetization.state == "started";
    }

};

autoAddDeps(WebMonetizationLibrary, "$Context");

addToLibrary(WebMonetizationLibrary);
