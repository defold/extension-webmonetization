# Web Monetization

[Web Monetization](https://webmonetization.org/) is a JavaScript browser API which allows the creation of a payment stream from the user agent to the website. Web Monetization is being proposed as a W3C standard at the Web Platform Incubator Community Group.


## Web Monetization for Defold

This repository contains a native extension which integrates the Web Monetization JavaScript API with the [Defold game engine](https://www.defold.com). This allows game developers to detect if a player has an active payment stream or not and offer additional content or perks to paying players.


### Installation

#### Project dependency

To use Web Monetization in a Defold project this project has to be added as a [Defold library dependency](http://www.defold.com/manuals/libraries/). Open the **game.project** file and in the [Dependencies field in the Project section](https://defold.com/manuals/project-settings/#dependencies) add:

https://github.com/defold/extension-webmonetization/archive/master.zip

Or point to the ZIP file of [a specific release](https://github.com/defold/extension-webmonetization/releases).

#### Add payment pointer

The Web Monetization JavaScript API also requires a payment pointer to create a payment stream. The payment pointer must be added as a `<meta>` tag in the `<head>` section of the website. The extension will automatically add the `<meta>` tag when building or bundling a project but the payment pointer must be added to the **game.project** file. Payment pointers are provided by a number of different [companies offering digital wallets](https://webmonetization.org/) (Web Monetization Wallets). Open the **game.project** file using a text editor and add a new section with the payment pointer:

```
[webmonetization]
payment_pointer = ADD PAYMENT POINTER HERE
```


### Usage

When the extension and a payment pointer has been added to the **game.project** file it is possible to interact with the Web Monetization API from Defold:

```
local monetized = webmonetization.is_monetized()
if monetized then
	print("The user has an active payment stream")
end

webmonetization.set_listener(function(self, event, details)
	if event == webmonetization.EVENT_PENDING then
		print("The user is trying to make a first payment")
	elseif event == webmonetization.EVENT_START then
		print("The user has started paying")
	elseif event == webmonetization.EVENT_PROGRESS then
		print("The user is still paying")
	elseif event == webmonetization.EVENT_STOP then
		print("The user has stopped paying")
	end
	print(details.requestId)
end)
```

The details table contains additional information about the event. Example:

```
{
  paymentPointer = "$ilp.uphold.com/QkG86UgXzKq8",
  assetScale = 9,
  amount = "26009",
  requestId = "a1f728aa-21e0-4376-ae99-0ccb22642956",
  assetCode = "XRP"
}
```
