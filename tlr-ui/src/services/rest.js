// options: { logger: logHandlerFunction }
export default async function getJSON(baseURL, options) {
  try {
    console.log(process.env.NODE_ENV);
    let url = new URL(`http://localhost${baseURL}`);
    if (options) {
      for (const key in options) {
        url.searchParams.append(key, options[key]);
      }
    }
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const json = await res.json();
    return json;
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
}
// Example POST method implementation:
export async function postJSON(baseURL = "", data = {}, options) {
  // Default options are marked with *
  try {
    let url = new URL(`http://localhost${baseURL}`);
    if (options) {
      for (const key in options) {
        url.searchParams.append(key, options[key]);
      }
    }
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
}