const API = "http://localhost:8000";

async function httpGetPlanets() {
  try {
    const res = await fetch(`${API}/planets`);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

async function httpGetLaunches() {
  const res = await fetch(`${API}/launches`);
  const resdata = await res.json();
  return resdata.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });
}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API}/launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });
  } catch (error) {
    return {
      ok: false,
    };
  }
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API}/launches/${id}`, {
      method: "delete",
    });
  } catch (error) {
    console.log(error);
    return {
      ok: false,
    };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
