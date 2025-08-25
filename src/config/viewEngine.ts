import express from "express";

const configViewEngine = (app: express.Application): void => {
  app.use(express.static("./src/public")); // Thư mục tĩnh
  app.set("view engine", "ejs"); // View engine
  app.set("views", "./src/views"); // Thư mục views
};

export default configViewEngine;
