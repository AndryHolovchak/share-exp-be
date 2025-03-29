import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../../src/app.module';
import { EmployersService } from '../../../src/modules/employers/employers.service';
import { WORK_UA_SOURCE } from './sources/work-ua';
import mongoose from 'mongoose';

const source = WORK_UA_SOURCE;

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const employerService = app.get(EmployersService);

  // start from 453
  for (let page = 360; page < 1677; page++) {
    console.log(`Page ${page}`);
    const employers = await source.getEmployers(page);

    for (const employer of employers) {
      const details = await source.getDetails(employer.id);

      if (details) {
        await employerService.createOrUpdateBySource(
          {
            type: 'work-ua',
            externalId: employer.id,
          },
          {
            ...details,
            logoUrl: employer.logoUrl,
          },
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  await app.close();
}

main()
  .then(async () => {
    console.log('Імпорт завершено.');
    await mongoose.connection.close();
  })
  .catch((err) => console.error(err));
