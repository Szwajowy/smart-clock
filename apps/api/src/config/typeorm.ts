import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config = {
  type: 'mongodb',

  url: `${process.env.MONGODB_CONNECTION_STRING}`,
  database: `${process.env.MONGODB_DATABASE}`,

  autoLoadEntities: true,
  entities: ['src/**/*.entity{.ts,.js}'],

  migrations: ['src/migrations/*{.ts,.js}'],

  synchronize: false,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
