import { API_ROOT } from "config/config";

export async function getTests() {
  return new Promise((resolve, reject) => {
    fetch(`${API_ROOT}/tests`, {
      method: "get",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then(Response => {
        return Response.json();
      })
      .then(Tests => {
        resolve(Tests);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export async function getTest(testId) {
  return new Promise((resolve, reject) => {
    fetch(`${API_ROOT}/tests/${testId}`, {
      method: "get",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then(Response => {
        return Response.json();
      })
      .then(Test => {
        resolve(Test);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export async function createTest(testData) {
  return new Promise((resolve, reject) => {
    fetch(`${API_ROOT}/tests`, {
      method: "post",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify(testData)
    })
      .then(Response => {
        return Response.json();
      })
      .then(Test => {
        resolve(Test);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export async function deleteTest(testId) {
  return new Promise((resolve, reject) => {
    fetch(`${API_ROOT}/tests/${testId}`, {
      method: "delete",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then(Response => {
        return Response.json();
      })
      .then(Result => {
        resolve(Result);
      })
      .catch(err => {
        reject(err);
      });
  });
}
