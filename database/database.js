import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("biblioteca", "root", "mysql", {
    host: "localhost",
    dialect: "mysql",
    
  });