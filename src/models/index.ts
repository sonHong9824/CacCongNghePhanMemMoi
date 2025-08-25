import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/configdb";
import { initUserModel } from "./user";

interface Db {
  [key: string]: any;
  sequelize?: Sequelize;
  Sequelize?: typeof Sequelize;
}

const db: Db = {};

// Initialize models manually
db.User = initUserModel(sequelize);

// Set up associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
