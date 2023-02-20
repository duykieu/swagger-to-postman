const config = require("./config");
const axios = require("axios");

const options = {
  headers: {
    "X-API-Key": process.env.POSTMAN_API_KEY,
  },
};

async function importOpenApi(url, { collections }, workspace) {
  try {
    const { data: schema } = await axios.get(url);

    for (const collection of collections) {
      if (collection.name === schema.info.title) {
        await axios.delete(
          `https://api.getpostman.com/collections/${collection.id}?workspace=${workspace.id}`,
          options
        );
      }
    }

    const { data: result } = await axios.post(
      `https://api.getpostman.com/import/openapi?workspace=${workspace.id}`,
      {
        type: "json",
        input: schema,
      },
      options
    );

    console.log(result);
  } catch (error) {
    console.log(error);
  }
}

async function main() {
  // Get workspace
  const {
    data: { workspaces },
  } = await axios.get("https://api.getpostman.com/workspaces", options);

  const workspace = workspaces.find((w) => w.name === "DMS");

  // Get all current collection
  const { data: collections } = await axios.get(
    `https://api.getpostman.com/collections?workspace=${workspace.id}`,
    options
  );

  for (const url of config.urls) {
    importOpenApi(url, collections, workspace);
  }
}

main();
