const games = {
  Rocket: {
    name: "Rocketo",
    app_id: 252950,
    className: "Rocketo"
  },
  Arena: {
    name: "Arena 😴",
    app_id: 2073620,
    className: "Arena"
  }
};
let lastWinner = null;
let RocketUsers = null;
let ArenaUsers = null;

const button = document.getElementById("load");
const container = document.getElementById("newsContainer");

button.addEventListener("click", async () => {
  container.innerHTML = "Cargando...";

  try {
    const results = await Promise.all(
      Object.values(games).map(async (game) => {
        try {
          const res = await chrome.runtime.sendMessage({
            action: "fetchPlayers",
            appid: game.app_id
          });
          console.log(`Respuesta para ${game.name}:`, res);
          return { ...res, game };
        } catch (error) {
          console.error(`Error en ${game.name}:`, error);
          return { success: false, error: error.message, game };
        }
      })
    );

    container.innerHTML = "";

    results.forEach(({ success, data, error, game }) => {
      if (!success) {
        container.innerHTML += `<p>Error en ${game.name}: ${error || 'Desconocido'}</p>`;
        return;
      }

      if (!data || !data.response) {
        container.innerHTML += `<p>Error en ${game.name}: Datos inválidos</p>`;
        console.error(`Datos recibidos para ${game.name}:`, data);
        return;
      }

      if (data.response.result !== 1) {
        container.innerHTML += `<p>Error en ${game.name}: resultado ${data.response.result}</p>`;
        return;
      }

      const players = data.response.player_count;

      if (game.name === "Rocketo") {
        RocketUsers = players;
      } else {
        ArenaUsers = players;
      }

      container.innerHTML += `
        <div class="players-box ${game.className}">
          <div class="player-count">${players.toLocaleString("es-AR")}</div>
          <div class="player-label">
            bots en ${game.name}
          </div>
        </div>
        <div class="timestamp">
        Última actualización ${new Date().toLocaleTimeString("es-AR")}
        </div>
        `;
      });
      
      if (RocketUsers !== null && ArenaUsers !== null) {
        const diff = RocketUsers - ArenaUsers;
        handleResult(diff);
      }
      
  } catch (err) {
    container.innerHTML = `Api error: ${err.message}`;
    console.error("Error completo:", err);
  }
});

function handleResult(diff) {
  let winner;

  if (diff > 0) winner = "rocket";
  else if (diff < 0) winner = "arena";
  else winner = "draw";

  if (winner === lastWinner) return;
  lastWinner = winner;

  if (winner === "rocket") {
    showVideo("doggo.mp4");
  } 
  else if (winner === "arena") {
    showVideo("");
  } 
  else {
    showVideo("");
  }
}


function showVideo(src) {
  const videoContainer = document.getElementById("videoContainer");

  videoContainer.innerHTML = `
    <video
      src="${src}"
      autoplay
      playsinline
      loop
      style="
        width:100%;
        border-radius:12px;
        margin-top:12px;
        box-shadow: 0 10px 30px rgba(0,0,0,.4);
      "
    ></video>
  `;
}


window.addEventListener("DOMContentLoaded", () => {
  button.click();
});