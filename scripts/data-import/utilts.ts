export function removeSequentialSpaces(str: string) {
  return str.replace(/\s+/g, ' ').trim(); // Replace consecutive spaces with a single space and trim the string
}

export async function scrapePage(url: string) {
  try {
    const response = await fetch(url);
    return await response.text();
  } catch (error) {
    console.error('Error scraping page:', error);
    return '';
  }
}
