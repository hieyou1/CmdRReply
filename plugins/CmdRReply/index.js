module.exports = (Plugin, Zere) => {
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
            msg.jumpTo();

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
            if (buttonContainer == false) return BdApi.showToast("Invalid message or problem accessing reply functionality");

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
            if (replyFound == false) return BdApi.showToast("Invalid message or problem accessing reply functionality");
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