#pragma once

#include <dmsdk/sdk.h>

#if defined(DM_PLATFORM_HTML5)

typedef void (*OnEventCallback)(const char* event, const char* details);

extern "C" {
    void WebMonetization_PlatformSetEventListener(OnEventCallback callback);
    int WebMonetization_PlatformIsMonetized();
}

#endif
