#include "webmonetization.h"
#include <dmsdk/sdk.h>

#define LIB_NAME "WebMonetization"
#define MODULE_NAME "webmonetization"
#define DLIB_LOG_DOMAIN LIB_NAME

#if defined(DM_PLATFORM_HTML5)

struct WebMonetization
{
	WebMonetization()
	{
		memset(this, 0, sizeof(*this));
	}
	dmScript::LuaCallbackInfo* m_Callback;
};

static WebMonetization g_WebMonetization;

static void lua_setfieldstringstring(lua_State* L, const char* key, const char* value)
{
	int top = lua_gettop(L);
	lua_pushstring(L, value);
	lua_setfield(L, -2, key);
	assert(top == lua_gettop(L));
}


static void WebMonetization_OnEventListener(const char* event)
{

	lua_State* L = dmScript::GetCallbackLuaContext(g_WebMonetization.m_Callback);

	DM_LUA_STACK_CHECK(L, 0);
	if (!dmScript::SetupCallback(g_WebMonetization.m_Callback))
	{
		return;
	}

	lua_pushstring(L, event);
	int ret = lua_pcall(L, 2, 0, 0);
	if (ret != 0)
	{
		lua_pop(L, 1);
	}

	dmScript::TeardownCallback(g_WebMonetization.m_Callback);
}

static int WebMonetization_SetListener(lua_State* L)
{
	DM_LUA_STACK_CHECK(L, 0);

	g_WebMonetization.m_Callback = dmScript::CreateCallback(L, 1);

	WebMonetization_PlatformSetEventListener((OnEventCallback)WebMonetization_OnEventListener);
	return 0;
}

static int WebMonetization_IsMonetized(lua_State* L)
{
	DM_LUA_STACK_CHECK(L, 1);

	int monetized = WebMonetization_PlatformIsMonetized();
	lua_pushboolean(L, monetized);

	return 1;
}


static const luaL_reg Module_methods[] =
{
	{"set_listener", WebMonetization_SetListener},
	{"is_monetized", WebMonetization_IsMonetized},
	{0, 0}
};

static void LuaInit(lua_State* L)
{
	int top = lua_gettop(L);
	luaL_register(L, MODULE_NAME, Module_methods);

	lua_setfieldstringstring(L, "EVENT_START", "monetizationstart");
	lua_setfieldstringstring(L, "EVENT_STOP", "monetizationstop");
	lua_setfieldstringstring(L, "EVENT_PROGRESS", "monetizationprogress");
	lua_setfieldstringstring(L, "EVENT_PENDING", "monetizationpending");

	lua_pop(L, 1);
	assert(top == lua_gettop(L));
}
#endif

dmExtension::Result AppInitializeWebMonetizationExtension(dmExtension::AppParams* params)
{
	return dmExtension::RESULT_OK;
}

dmExtension::Result InitializeWebMonetizationExtension(dmExtension::Params* params)
{
	#if defined(DM_PLATFORM_HTML5)
	LuaInit(params->m_L);
	#else
	printf("Extension %s is not supported\n", MODULE_NAME);
	#endif
	return dmExtension::RESULT_OK;
}

dmExtension::Result AppFinalizeWebMonetizationExtension(dmExtension::AppParams* params)
{
	if (g_WebMonetization.m_Callback != 0)
	{
		dmScript::DestroyCallback(g_WebMonetization.m_Callback);
		g_WebMonetization.m_Callback = 0;
	}
	return dmExtension::RESULT_OK;
}

dmExtension::Result FinalizeWebMonetizationExtension(dmExtension::Params* params)
{
	return dmExtension::RESULT_OK;
}

DM_DECLARE_EXTENSION(WebMonetization, LIB_NAME, AppInitializeWebMonetizationExtension, AppFinalizeWebMonetizationExtension, InitializeWebMonetizationExtension, 0, 0, FinalizeWebMonetizationExtension)
