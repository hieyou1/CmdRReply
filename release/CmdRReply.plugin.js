/**
 * @name CmdRReply
 * @invite undefined
 * @authorLink undefined
 * @donate undefined
 * @patreon undefined
 * @website https://github.com/hieyou1/cmdrreply
 * @source https://raw.githubusercontent.com/hieyou1/cmdrreply/master/release/CmdRReply.plugin.js
 */
/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();

@else@*/

module.exports = (() => {
    const config = {"info":{"name":"CmdRReply","authors":[{"name":"hieyou1","discord_id":"288299360557465600","github_username":"hieyou1"}],"version":"0.0.1","description":"Command + R means reply, not reload!","github":"https://github.com/hieyou1/cmdrreply","github_raw":"https://raw.githubusercontent.com/hieyou1/cmdrreply/master/release/CmdRReply.plugin.js"},"changelog":[{"title":"V0.0.1","items":["N/A"]}],"main":"index.js"};

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {
            BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Zere) => {
    // so we don't have to exec this every time someone presses a key
    const OSType = require("os").type();

    /**
     * 
     * @param {KeyboardEvent} e 
     */
    const keyDownListener = (e) => {
        if (e.key == "r" && (OSType == "Darwin" && e.metaKey) || (OSType != "Darwin" && e.ctrlKey)) {
            // Prevent Discord from reloading
            e.preventDefault();

            // Get current Discord channel
            let channel = Zere.DiscordAPI.currentChannel;

            // Check validity of channel
            if (!channel) return BdApi.showToast("No channel selected");
            if (channel.messages.length == 0) return BdApi.showToast("Selected channel has no messages");

            // Get & jump to latest message
            let msg = channel.messages[channel.messages.length - 1];
            // msg.jumpTo();

            // Can't quick reply to self
            if (msg.author.id == Zere.DiscordAPI.currentUser.id) return BdApi.showToast("Can't quick reply to self");

            // Get button container. Fail gracefully if not found.

            // just for you, Intellisense users
            /**
             * @type {HTMLDivElement}
             */
            let buttonContainer = false;
            for (let i of document.getElementById(`chat-messages-${msg.id}`).children) {
                if (i.className.includes("buttonContainer")) {
                    buttonContainer = i;
                    break;
                }
            }
            if (buttonContainer == false) return BdApi.showToast("Invalid message or problem accessing reply functionality [Code 1]");

            // The actual button container is inside the container for the wrapper for the button container. Thanks for the headache, Discord.
            buttonContainer = buttonContainer.children[0].children[0];

            // Finally, find and click the Reply button. Fail gracefully if not found.
            let replyFound = false;
            for (let i of buttonContainer.children) {
                if (i.getAttribute("aria-label") == "Reply") {
                    i.click();
                    replyFound = true;
                    break;
                }
            }
            if (replyFound == false) return BdApi.showToast("Invalid message or problem accessing reply functionality [Code 2]");
        }
    };

    // because removing event listeners is painful
    let isActive = false;
    window.addEventListener("keydown", (e) => {
        if (isActive) keyDownListener(e);
    });

    // Actual plugin class
    class CmdRReply extends Plugin {
        onStart() {
            isActive = true;
        }
        onStop() {
            isActive = false;
        }
    }
    return CmdRReply;
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/