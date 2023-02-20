#!/usr/bin/env node

const axios = require("axios");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
require("colors");

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

    console.log(`Import ${schema.info.title} success`.green);
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

  const workspace = workspaces.find(
    (w) => w.name === process.env.WORKSPACE_NAME
  );

  // Get all current collection
  const { data: collections } = await axios.get(
    `https://api.getpostman.com/collections?workspace=${workspace.id}`,
    options
  );

  const urls = process.env.API_URLS.split(",").map((s) => s.trim());

  for (const url of urls) {
    importOpenApi(url, collections, workspace);
  }
}

main();
