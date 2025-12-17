chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchPlayers") {
    fetch(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${request.appid}`)
      .then(res => res.json())
      .then(data => {
        sendResponse({ success: true, data });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
});
