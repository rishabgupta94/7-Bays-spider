import { launch } from 'puppeteer';
import fs from 'fs';
import cron from 'node-cron';

const filePath = '/Users/rishabgupta/Documents/7 Bays spider/gym_occupancy_data.csv';

// Run the script every 1 minute
cron.schedule('*/30 * * * *', () => {
  console.log('Running the cron job');
  try {
    if (shouldScriptRun()) {
      console.log('Running the script...');
      scrapeGymOccupancy();
    }
  } catch (error) {
    console.error('An error occurred when running the cron job', error.message);
  }
});

function shouldScriptRun(currentDate = new Date()) {
  //   const currentDate = new Date();
  const currentDay = currentDate.getUTCDay();
  const currentHour = currentDate.getUTCHours();

  if (currentDay === 2) {
    // First condition: Tuesday 6PM - 11:59PM UTC
    // Second condition: Tuesday 12AM - 2AM UTC -- For Monday night will be Tuesday morning
    return (currentHour >= 18 && currentHour < 24) || (currentHour >= 0 && currentHour < 2);
  }

  if (currentDay === 3) {
    // First condition: Wednesday 12AM - 2AM UTC -- For Tuesday night will be Wednesday morning
    // Second condition: Wednesday 11AM - 11:59PM UTC -- Is a regular day
    return (currentHour >= 0 && currentHour < 2) || (currentHour >= 11 && currentHour < 24);
  }

  return (currentHour >= 11 && currentHour < 24) || (currentHour >= 0 && currentHour < 2);
}

async function scrapeGymOccupancy() {
  let browser;
  try {
    browser = await launch({ headless: 'new' });
    const page = await browser.newPage();

    // Navigate directly to the iframe link
    await page.goto(
      'https://portal.rockgympro.com/portal/public/da1bdc14b9e219e81de152ec2576d858/occupancy?&iframeid=occupancyCounter&fId=1347',
      { waitUntil: 'networkidle0' }
    );

    // Wait for the dropdown to be visible
    await page.waitForSelector('#gym-switcher', { timeout: 5000 }); // Wait for 5 seconds

    // Select the "Seven Bays - Gottingen" option from the dropdown
    await page.select('#gym-switcher', 'SBG');

    // Wait for the counter value to update
    await new Promise((r) => setTimeout(r, 10000)); // Wait for 10 seconds

    // Extract the counter value
    const occupancyData = await page.$eval('#count', (element) => {
      return element.textContent;
    });

    console.log(`Gym occupancy: ${occupancyData}`);

    const currentDate = new Date();

    const formattedDate = `${currentDate.getUTCFullYear()}-${
      currentDate.getUTCMonth() + 1
    }-${currentDate.getUTCDate()} ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()}`;

    const dataToWrite = `${formattedDate},${occupancyData}\n`;

    // Check if the CSV file exists
    if (!fs.existsSync(filePath)) {
      // If not, create it and add the headers
      fs.writeFileSync(filePath, 'Date and Time (UTC),Gym Occupancy\n');
    }

    // Append the data to the CSV file
    fs.appendFileSync(filePath, dataToWrite);
  } catch (error) {
    console.error('An error occurred in the scrape script', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
