(() => {
  let socket;
  let devices = [];

  const searchForDevices = async (ev) => {
    try {
      if (devices.length === 0) {
        searchSpinner.hidden = false;
      }
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
      searchSpinner.hidden = true;
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

  const generateCard = (device) => {
    return `
    <div class="col-sm-3 py-2">
  <div class="card bg-dark text-white shadow-lg">
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
                  <div class="btn-group w-100 d-flex justify-content-between align-items-center" role="group">
                  ${
                    device.exists === false
                      ? `<div id="connect-button mx-auto my-auto">
                      <button type="button" class="btn btn-primary shadow-lg" id="connect-new">Add Device</button>
                        </div>`
                      : `
                        <div id="connected-buttons mx-auto my-auto">
                        <button type="button" class="btn btn-danger mx-1" id="red-led">Red</button>
                        <button type="button" class="btn btn-warning mx-1" id="yellow-led">
                    Yellow
                    </button>
                    <button type="button" class="btn btn-success mx-1" id="green-led" >
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

  const searchSpinner = document.getElementById("search-button-spinner");

  const searchButton = document.getElementById("search-button");
  searchButton.onclick = searchForDevices;

  const logoutButton = document.getElementById("logout-button");
  logoutButton.onclick = (ev) => {
    sessionStorage.removeItem("authToken");
    alert("Bye-bye!");
    window.location.replace("/");
  };

  if (!sessionStorage.getItem("authToken")) {
    alert("Session timeout! Please login!");
    window.location.replace("/");
  } else {
    alert("Welcome to dashboard!");
    socket = io();
    searchForDevices()
      .then(() => {
        render();
      })
      .catch((err) => {});
  }
  setInterval(searchForDevices, 5000);

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
        searchSpinner.hidden = true;
        render();
      }
    } catch (err) {
      console.dir(err);
      alert("APIError");
    }
  });
})();
