(() => { })();

const CHAT_MESSAGE_TYPES = {
  OTHER: 0,
  OOC: 1,
  IC: 2,
  EMOTE: 3,
  WHISPER: 4,
  ROLL: 5
};

let currentTab = "foundry";
let salonEnabled = false;
let turndown = undefined;


Hooks.on("renderChatLog", async function(chatLog, html, user) { // filtertabsFSM

  if (HideForStreamView()) return;

  var toPrepend = '<nav class="tabbedchatlog tabs">';
  toPrepend += `<a class="item ic" data-tab="foundry">${game.i18n.localize("TC.TABS.IC")}</a><i id="icNotification" class="notification-pip fas fa-exclamation-circle" style="display: none;"></i>`;
  //toPrepend += `<a class="item rolls" data-tab="rolls">${game.i18n.localize("TC.TABS.Rolls")}</a><i id="rollsNotification" class="notification-pip fas fa-exclamation-circle" style="display: none;"></i>`;
  toPrepend += `<a class="item ooc" data-tab="fsm">${game.i18n.localize("TC.TABS.OOC")}</a></nav><i id="oocNotification" class="notification-pip fas fa-exclamation-circle" style="display: none;"></i>`;
  html.prepend(toPrepend);

  var me = this;
  const tabs = new TabsV2({ 
    navSelector: ".tabs",
    contentSelector: ".content", 
    initial: "tab1", 
    callback: function(event, html, tab) { 
      currentTab = tab;

      if (tab == "foundry") {
        $(".type0").removeClass("hardHide");
        $(".type0").show();
        $(".type1").hide();
        $(".type2").removeClass("hardHide");
        $(".type2").show();
        $(".type3").removeClass("hardHide");
        $(".type3").show();
        $(".type4").removeClass("hardHide");
        $(".type4").show();
        $(".type5").removeClass("hardHide");
        $(".type5").not(".gm-roll-hidden").show();

        $("#rollsNotification").hide();
      }

      else if (tab == "fsm") {
        $(".type1").removeClass("hardHide");
        $(".type1").show();
        $(".type2").hide();
        $(".type3").hide();
        $(".type4").hide();
        $(".type5").hide();
        $(".type0").hide();

        $("#oocNotification").hide();
      } 
      else {
        console.log("Unknown tab " + tab + "!");
      }

      $("#chat-log").scrollTop(9999999);
    } 
  });
  tabs.bind(html[0]);
});

Hooks.on("renderChatMessage", (chatMessage, html, data) => { //rendertabs
  html.addClass("type" + data.message.type);

  var sceneMatches = true;

  if (data.message.type == 0 || data.message.type == 2 || data.message.type == 3 || data.message.type == 4 || data.message.type == 5) {
    if (data.message.speaker.scene != undefined) {
      html.addClass("scenespecific");
      html.addClass("scene" + data.message.speaker.scene);
      if (data.message.speaker.scene != game.user.viewedScene) {
        sceneMatches = false;
      }
    }
  }

  if (currentTab == "foundry") {
    if ((data.message.type == 2 || data.message.type == 0 || data.message.type == 4 || data.message.type == 3) && sceneMatches)
    {
      html.css("display", "list-item");
    }
    else if (data.message.type == 5 && sceneMatches) {
      if (!html.hasClass('gm-roll-hidden')) {
        if (game.dice3d && game.settings.get("dice-so-nice", "settings").enabled && game.settings.get("dice-so-nice", "enabled")) {
          if (!game.settings.get("dice-so-nice", "immediatelyDisplayChatMessages")) return;
        } 
        html.css("display", "list-item");
      }
    }
    else {
      html.css("display", "none");
      html.css("cssText", "display: none !important;");
      html.addClass("hardHide");
    }
  }
  else if (currentTab == "fsm") {
    if (data.message.type == 1) //|| data.message.type == 4)
    {
      html.css("display", "list-item");
    }
    else {
      html.css("display", "none");
    }
  }

});

Hooks.on("diceSoNiceRollComplete", (id) => {
  if (currentTab != "rolls") {
      $("#chat-log .message[data-message-id=" + id + "]").css("display", "none");
  }
});

Hooks.on("createChatMessage", (chatMessage, content) => {
  var sceneMatches = true;

  if (chatMessage.data.speaker.scene)
  {
    if (chatMessage.data.speaker.scene != game.user.viewedScene) {
      sceneMatches = false;
    }
  }

  if (chatMessage.data.type == 0) {
    if (currentTab != "foundry" && sceneMatches) {
      $("#rollsNotification").show();
    }
  }
  else if (chatMessage.data.type == 5) {
    if (currentTab != "foundry" && sceneMatches && chatMessage.data.whisper.length == 0) {
      $("#rollsNotification").show();
    }
  }
  else if (chatMessage.data.type == 2 || chatMessage.data.type == 3)
  {
    if (currentTab != "foundry" && sceneMatches)
    { 
      $("#icNotification").show();
    }
  }
  else
  {
    if (currentTab != "fsm") { 
      $("#oocNotification").show();
    }
  }
});

Hooks.on("preCreateChatMessage", (chatMessage, content) => {

  if (game.settings.get('tabbed-chatlog', 'icChatInOoc'))
  {
    if (currentTab == "fsm") {
      if (chatMessage.type == 2) {
        chatMessage.type = 1;
        delete(chatMessage.speaker);
        console.log(chatMessage);
      }
    }
  }
});

Hooks.on("renderSceneNavigation", (sceneNav, html, data) => {

  if (HideForStreamView()) return;

  var viewedScene = sceneNav.scenes.find(x => x.isView);
 
  $(".scenespecific").hide();
  if (currentTab == "fsm") {
    $(".type1.scene" + game.user.viewedScene).removeClass("hardHide");
    $(".type1.scene" + viewedScene.id).show();
    }
  else if (currentTab == "foundry") {
    $(".type0.scene" + game.user.viewedScene).removeClass("hardHide");
    $(".type0.scene" + viewedScene.id).show();
    $(".type2.scene" + game.user.viewedScene).removeClass("hardHide");
    $(".type2.scene" + viewedScene.id).show();
    $(".type3.scene" + game.user.viewedScene).removeClass("hardHide");
    $(".type3.scene" + viewedScene.id).show();
    $(".type4.scene" + game.user.viewedScene).removeClass("hardHide");
    $(".type4.scene" + viewedScene.id).show();
    $(".type5.scene" + game.user.viewedScene).removeClass("hardHide");
    $(".type5.scene" + viewedScene.id).not(".gm-roll-hidden").show();
  }
});

function HideForStreamView() {
  if (game.settings.get("tabbed-chatlog", "hideInStreamView")) {
    if (window.location.href.endsWith("/stream")) {
      return true;
    }
  }
  return false;
}


Hooks.on('init', () => {

  game.settings.register('tabbed-chatlog', 'oocWebhook', {
    name: game.i18n.localize("TC.SETTINGS.OocWebhookName"),
    hint: game.i18n.localize("TC.SETTINGS.OocWebhookHint"),
    scope: 'world',
    config: true,
    default: '',
    type: String,
  });

  game.settings.register('tabbed-chatlog', 'icBackupWebhook', {
    name: game.i18n.localize("TC.SETTINGS.IcFallbackWebhookName"),
    hint: game.i18n.localize("TC.SETTINGS.IcFallbackWebhookHint"),
    scope: 'world',
    config: true,
    default: '',
    type: String,
  });

  game.settings.register('tabbed-chatlog', 'icChatInOoc', {
    name: game.i18n.localize("TC.SETTINGS.IcChatInOocName"),
    hint: game.i18n.localize("TC.SETTINGS.IcChatInOocHint"),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });

  game.settings.register('tabbed-chatlog', 'hideInStreamView', {
    name: game.i18n.localize("TC.SETTINGS.HideInStreamViewName"),
    hint: game.i18n.localize("TC.SETTINGS.HideInStreamViewHint"),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });

}
);
