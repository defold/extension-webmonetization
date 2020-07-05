// https://kripken.github.io/emscripten-site/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html

var WebMonetizationLibrary = {

    $Context: {
        listener: null
    },

    WebMonetization_PlatformSetEventListener: function(listener) {
        console.log("WebMonetization set event listener");
        Context.listener = listener;

        document.monetization.addEventListener("monetizationpending", event => {
    		console.log("monetizationpending");
            dynCall("vi", Context.listener, [allocate(intArrayFromString("monetizationpending"), "i8", ALLOC_STACK)]);
    	});
    	document.monetization.addEventListener("monetizationstart", event => {
    		console.log("monetizationstart");
            dynCall("vi", Context.listener, [allocate(intArrayFromString("monetizationstart"), "i8", ALLOC_STACK)]);
    	});
    	document.monetization.addEventListener("monetizationprogress", event => {
    		console.log("monetizationprogress");
            dynCall("vi", Context.listener, [allocate(intArrayFromString("monetizationprogress"), "i8", ALLOC_STACK)]);
    	});
    	document.monetization.addEventListener("monetizationstop", event => {
    		console.log("monetizationstop");
            dynCall("vi", Context.listener, [allocate(intArrayFromString("monetizationstop"), "i8", ALLOC_STACK)]);
    	});
    },

    WebMonetization_PlatformIsMonetized: function() {
        console.log("WebMonetization ismonetized");
        return document.monetization != undefined && document.monetization.state == "started";
    }

};

autoAddDeps(WebMonetizationLibrary, "$Context");

mergeInto(LibraryManager.library, WebMonetizationLibrary);
