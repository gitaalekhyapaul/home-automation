let socket;
let devices = [];

const searchForDevices = async (ev) => {
  try {
    const response = await fetch("/api/v1/device/search", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
      },
    });
    if (!response.ok) {
      if (response.status !== 403) throw await response.json();
      else {
        alert("Session expired! Please login again!");
        window.location.replace("/");
      }
    }
  } catch (err) {
    console.dir(err);
    alert("APIError");
  }
};

const render = async () => {
  let html = "";
  if (devices.length > 0) {
    devices.forEach((device) => {
      html += generateCard(device);
    });
    const deviceCards = document.getElementById("device-cards");
    deviceCards.innerHTML = html;
    const connectButtons = document.querySelectorAll("#connect-new");
    connectButtons.forEach((e) =>
      e.addEventListener("click", async (ev) => {
        try {
          const btn = ev.target;
          let identity = {};
          btn.parentElement.parentElement.parentElement
            .querySelectorAll("input")
            .forEach((input) => {
              identity[input.name] = input.value;
            });
          console.log(identity);
          const response = await fetch("/api/v1/device/add", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(identity),
          });
          if (!response.ok) {
            if (response.status !== 403) throw await response.json();
            else {
              alert("Session expired! Please login again!");
              window.location.replace("/");
            }
          }
          devices.map((index) => {
            if (index.uuid === identity.uuid) {
              index.exists = true;
            }
          });
          await render();
        } catch (err) {
          console.dir(err);
          alert("APIError");
        }
      })
    );
    const redLedButtons = document.querySelectorAll("#red-led");
    const yellowLedButtons = document.querySelectorAll("#yellow-led");
    const greenLedButtons = document.querySelectorAll("#green-led");
    redLedButtons.forEach((e) =>
      e.addEventListener("click", async (ev) => {
        try {
          const btn = ev.target;
          let identity = {};
          btn.parentElement.parentElement.parentElement
            .querySelectorAll("input")
            .forEach((input) => {
              identity[input.name] = input.value;
            });
          console.log(identity);
          await fetch(`${identity.link}api/v1/ledChange`, {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify({ ledType: "red" }),
          });
        } catch (err) {
          console.dir(err);
          alert("APIError");
        }
      })
    );
    yellowLedButtons.forEach((e) =>
      e.addEventListener("click", async (ev) => {
        try {
          const btn = ev.target;
          let identity = {};
          btn.parentElement.parentElement.parentElement
            .querySelectorAll("input")
            .forEach((input) => {
              identity[input.name] = input.value;
            });
          console.log(identity);
          await fetch(`${identity.link}api/v1/ledChange`, {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify({ ledType: "yellow" }),
          });
        } catch (err) {
          console.dir(err);
          alert("APIError");
        }
      })
    );
    greenLedButtons.forEach((e) =>
      e.addEventListener("click", async (ev) => {
        try {
          const btn = ev.target;
          let identity = {};
          btn.parentElement.parentElement.parentElement
            .querySelectorAll("input")
            .forEach((input) => {
              identity[input.name] = input.value;
            });
          console.log(identity);
          await fetch(`${identity.link}api/v1/ledChange`, {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify({ ledType: "green" }),
          });
        } catch (err) {
          console.dir(err);
          alert("APIError");
        }
      })
    );
  }
};
if (!sessionStorage.getItem("authToken")) {
  alert("Session timeout! Please login!");
  window.location.replace("/");
} else {
  alert("Welcome to dashboard!");
  socket = io();
  render();
  searchForDevices().then;
}

const generateCard = (device) => {
  return `
  <div class="col-sm-3 py-2">
              <div class="card">
                <div class="card-header">${device.modelNumber}</div>
                <div class="card-body">
                  <h5 class="card-title">NodeMCU </h5>
                  <p class="card-text">
                    ${device.name}
                  </p>
                  <input type="hidden" name="urn" value="${device.urn}"></input>
                  <input type="hidden" name="uuid" value="${
                    device.uuid
                  }"></input>
                  <input type="hidden" name="link" value="${
                    device.link
                  }"></input>
                  <div class="btn-group d-flex align-items-center" role="group">
                    ${
                      device.exists === false
                        ? `<div id="connect-button">
                      <button type="button" class="btn btn-primary" id="connect-new">Connect</button>
                    </div>`
                        : `
                    <div id="connected-buttons">
                    <button type="button" class="btn btn-danger" id="red-led">Red</button>
                    <button type="button" class="btn btn-warning" id="yellow-led">
                      Yellow
                    </button>
                    <button type="button" class="btn btn-success" id="green-led" >
                      Green
                    </button>
                  </div>
                    `
                    }
                  </div>
                </div>
              </div>
            </div>
  `;
};

socket.on("new-device", async (data) => {
  try {
    const response = await fetch("/api/v1/device/find", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({
        urn: data.urn,
        uuid: data.uuid,
        link: data.link,
      }),
    });
    if (!response.ok) throw await response.json();
    const res = await response.json();
    console.log(res.exists);
    if (res) {
      const device = {
        exists: res.exists,
        ...data,
      };
      console.log(device);
      if (
        devices.findIndex(
          (p) => p.uuid === device.uuid && p.urn === device.urn
        ) === -1
      )
        devices.push(device);
      render();
    }
  } catch (err) {
    console.dir(err);
    alert("APIError");
  }
});

const searchButton = document.getElementById("search-button");
searchButton.onclick = searchForDevices;

const logoutButton = document.getElementById("logout-button");
logoutButton.onclick = (ev) => {
  sessionStorage.removeItem("authToken");
  alert("Bye-bye!");
  window.location.replace("/");
};
