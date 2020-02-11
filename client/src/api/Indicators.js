import { API_ROOT } from "config/config";

export async function getMAD(valuesArray, params) {
  return new Promise((resolve, reject) => {
    fetch(`${API_ROOT}/indicators/mad`, {
      method: "post",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({
        valuesArray,
        params
      })
    })
      .then(Response => {
        return Response.json();
      })
      .then(MA => {
        resolve(MA);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export async function getMA(valuesArray, params) {
  return new Promise((resolve, reject) => {
    fetch(`${API_ROOT}/indicators/ma`, {
      method: "post",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({
        valuesArray,
        params
      })
    })
      .then(Response => {
        return Response.json();
      })
      .then(MA => {
        resolve(MA);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export async function getMACD(valuesArray, params) {
  return new Promise((resolve, reject) => {
    fetch(`${API_ROOT}/indicators/macd`, {
      method: "post",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({
        valuesArray,
        params
      })
    })
      .then(Response => {
        return Response.json();
      })
      .then(MA => {
        resolve(MA);
      })
      .catch(err => {
        reject(err);
      });
  });
}
