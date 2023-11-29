import {DataSource} from 'typeorm';

export const connectToDb = async (dataSource: DataSource): Promise<DataSource> => {
    try {
        await dataSource.initialize();

        console.log('Data Source has been initialized');

        return dataSource;
    } catch (err: any) {
        console.error('Error when connecting to db', err);
        throw new Error('Error when connecting to db');
    }
}