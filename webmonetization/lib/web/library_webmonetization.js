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
                allocate(intArrayFromString("monetizationpending"), ALLOC_STACK),
                allocate(intArrayFromString(JSON.stringify(event.detail !== undefined ? event.detail : {})), ALLOC_STACK)
            );
        });
        document.monetization.addEventListener("monetizationstart", event => {
            {{{ makeDynCall("vii", "Context.listener") }}} (
                allocate(intArrayFromString("monetizationstart"), ALLOC_STACK),
                allocate(intArrayFromString(JSON.stringify(event.detail !== undefined ? event.detail : {})), ALLOC_STACK)
            );
        });
        document.monetization.addEventListener("monetizationprogress", event => {
            {{{ makeDynCall("vii", "Context.listener") }}} (
                allocate(intArrayFromString("monetizationprogress"), ALLOC_STACK),
                allocate(intArrayFromString(JSON.stringify(event.detail !== undefined ? event.detail : {})), ALLOC_STACK)
            );
        });
        document.monetization.addEventListener("monetizationstop", event => {
            {{{ makeDynCall("vii", "Context.listener") }}} (
                allocate(intArrayFromString("monetizationstop"), ALLOC_STACK),
                allocate(intArrayFromString(JSON.stringify(event.detail !== undefined ? event.detail : {})), ALLOC_STACK)
            );
        });
    },

    WebMonetization_PlatformIsMonetized: function() {
        return document.monetization !== undefined && document.monetization.state == "started";
    }

};

autoAddDeps(WebMonetizationLibrary, "$Context");

mergeInto(LibraryManager.library, WebMonetizationLibrary);
