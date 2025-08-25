import { Sequelize } from "sequelize";
import configJson from "./config.json";

const env = process.env.NODE_ENV || "development";
const config = (configJson as any)[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: false,
  }
);

const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // Sync database (create tables if they don't exist)
    await sequelize.sync({ force: false });
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { sequelize };
export default connectDB;
