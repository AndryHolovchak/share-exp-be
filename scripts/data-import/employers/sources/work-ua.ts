import * as cheerio from 'cheerio';
import { EmployerDetails } from '../../../../src/common/interfaces/employer.interface';
import { removeSequentialSpaces, scrapePage } from '../../utilts';
import { IEmployersSource } from '../types';

const BASE_URL = 'https://www.work.ua';

export async function getEmployers(page: number) {
  console.log(`starting to scrap employers ${page} page`);
  const pageHtml = await scrapePage(
    `${BASE_URL}/jobs/by-company/all_companies/?page=${page}`,
  );

  const $ = cheerio.load(pageHtml);
  const companyIds = new Map<string, { id: string; logoUrl?: string }>();

  $('.card').each((_, card) => {
    const link = $(card).find('a[href^="/jobs/by-company/"]');

    if (link.length) {
      const href = link.attr('href');
      const match = href?.match(/\/by-company\/(\d+)\//);
      if (match) {
        const id = match[1];
        const logoUrl = $(card).find('img').attr('src');
        companyIds.set(id, {
          id,
          logoUrl: logoUrl && `https:${logoUrl}`,
        });
      }
    }
  });

  return Array.from(companyIds.values());
}
export async function getDetails(id: string) {
  console.log(`fetching employer details ${id}`);

  const pageHtml = await scrapePage(`${BASE_URL}/jobs/by-company/${id}/`);
  const $ = cheerio.load(pageHtml);

  const descriptionCard = $('.card:first-child');
  const nameNode = descriptionCard.find('h1');
  const categoryDescription = removeSequentialSpaces(
    nameNode.next().text().replaceAll('\n', ' '),
  );
  const website = descriptionCard.find('.website-company a').attr('href');

  const descriptionNode = $('.company-description');
  const shortDescriptionNode = descriptionNode
    .children()
    .filter(function () {
      return $(this).find('img').length === 0;
    })
    .first();

  const result: Omit<EmployerDetails, 'logoUrl'> = {
    name: nameNode.text(),
    categoryDescription,
    shortDescriptionHtml: shortDescriptionNode.html() || '',
    website,
    // fullDescriptionHtml: descriptionNode.html() || '',
  };

  console.log(result);

  if (!result.name) {
    return null;
  }

  return result;
}

export const WORK_UA_SOURCE: IEmployersSource = {
  getEmployers,
  getDetails,
};
