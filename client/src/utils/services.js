//perform all the HTTP requests CRUD here
export const baseURL = "http://localhost:3000/api"; //this is the base url for our backend api

export const postRequest = async (url, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  const data = await response.json();

  if (!response.ok) {
    let message;

    if (data?.message) {
      message = data.message;
    } else {
      message = data;
    }

    return { error: true, message };
  }

  return data;
};

export const getRequest = async (url) => {
  //fetch the data
  const response = await fetch(url);

  //convert the data to jason (an obj)
  const data = await response.json();

  if (!response.ok) {
    let message = "An error occured...";

    if (data?.message) {
      message = data.message;
    }
    return { error: true, message };
  }
  return data;
};
