import {DataSource} from "typeorm";
import {DataSourceOptions} from "typeorm/data-source/DataSourceOptions";

let connectionOptions: DataSourceOptions = process.env.NODE_ENV === "production" ? {
        type: "postgres",
        host: "postgres",
        port: 5432,
        username: "admin", // postgre username
        database: "sport_hub", // postgre database, needs to be created before
        synchronize: false, // if true, you don't really need migrations
        logging: true,
        entities: ["src/database/entities/**/*.ts"], // where our entities reside
        migrations: ["src/database/migrations/*.ts"], // where our migrations reside
    } :
    {
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "admin", // postgre username
        database: "sport_hub", // postgre database, needs to be created before
        synchronize: false, // if true, you don't really need migrations
        logging: true,
        entities: ["src/database/entities/**/*.ts"], // where our entities reside
        migrations: ["src/database/migrations/*.ts"], // where our migrations reside
    };

export default new DataSource({
    ...connectionOptions,
});