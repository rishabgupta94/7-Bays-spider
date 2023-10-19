import { launch } from 'puppeteer';

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

// Test cases
const testCases = [
  { date: '2023-10-16T00:00:00Z', expected: true }, // Monday 00:00 AM UTC - Sunday night
  { date: '2023-10-16T03:00:00Z', expected: false }, // Monday 3:00 AM UTC - Closed at this time
  { date: '2023-10-16T10:59:00Z', expected: false }, // Monday 10:59 AM UTC - Closed at this time. Opens at 11AM UTC
  { date: '2023-10-16T12:59:00Z', expected: true }, // Monday 12:59 AM UTC - Open
  { date: '2023-10-16T23:59:00Z', expected: true }, // Monday 23:59 AM UTC - Open
  { date: '2023-10-17T00:00:00Z', expected: true }, // Tuesday 00:00 AM UTC - Monday night

  { date: '2023-10-17T01:59:59Z', expected: true }, // Tuesday 1:59 AM UTC - Monday night
  { date: '2023-10-17T15:00:00Z', expected: false }, // Tuesday 3:00 PM UTC - Tuesday opens at 6PM UTC
  { date: '2023-10-17T22:59:59Z', expected: true }, // Tuesday 10:59 PM UTC
  { date: '2023-10-17T23:00:00Z', expected: true }, // Tuesday 11:00 PM UTC
  { date: '2023-10-18T01:00:00Z', expected: true }, // Wednesday 01:00 AM UTC - Tuesday night
  { date: '2023-10-18T02:00:00Z', expected: false }, // Wednesday 02:00 AM UTC - Tuesday night - just closed

  { date: '2023-10-18T07:59:59Z', expected: false }, // Wednesday 7:59 AM UTC - Wednesday opens at 11AM UTC
  { date: '2023-10-18T22:59:59Z', expected: true }, // Wednesday 10:59 PM UTC - already open
  { date: '2023-10-19T01:59:00Z', expected: true }, // Thursday 1:59 AM UTC - Wednesday night
  { date: '2023-10-20T10:59:00Z', expected: false }, // Friday 11:59 AM UTC - Opens in 1 minute
];

testCases.forEach((testCase) => {
  const result = shouldScriptRun(new Date(testCase.date));
  console.log(
    `For date ${testCase.date}, expected ${testCase.expected} and got ${result}. Test ${
      testCase.expected === result ? 'passed' : 'failed'
    }.`
  );
});

// async function scrapeGymOccupancy() {
//   let browser;
//   try {
//     browser = await launch({ headless: false });
//     const page = await browser.newPage();

//     // Navigate directly to the iframe link
//     await page.goto(
//       'https://portal.rockgympro.com/portal/public/da1bdc14b9e219e81de152ec2576d858/occupancy?&iframeid=occupancyCounter&fId=1347',
//       { waitUntil: 'networkidle0' }
//     );

//     // Wait for the dropdown to be visible
//     await page.waitForSelector('#gym-switcher', { timeout: 5000 }); // Wait for 5 seconds

//     // Select the "Seven Bays - Gottingen" option from the dropdown
//     await page.select('#gym-switcher', 'SBG');

//     // Wait for the counter value to update
//     await new Promise((r) => setTimeout(r, 10000)); // Wait for 10 seconds

//     // Extract the counter value
//     const occupancyData = await page.$eval('#count', (element) => {
//       return element.textContent;
//     });

//     console.log(`Gym occupancy: ${occupancyData}`);
//   } catch (error) {
//     console.error('An error occurred:', error.message);
//   } finally {
//     if (browser) {
//       await browser.close();
//     }
//   }
// }

// scrapeGymOccupancy();
