# Gym Occupancy Tracker

### Overview
The climbing gym that I frequent to gets very busy at times. Therefore, I thought of doing this quick project to determine the best times to visit the gym by tracking its occupancy. I scrape the gym's website to gather occupancy data; schedule it to run every 30 minutes on Google Cloud based on the gym's schedule, and then visualize the results.

### Features
**Web Scraping**: Uses Puppeteer to scrape gym occupancy data from the gym's website.
**Scheduling**: Utilizes Node.js cron jobs to automate the scraping process.
**Cloud Deployment**: Deployed on Google Cloud Platform to ensure continuous data collection.
**Data Visualization**: After a month, the collected data will be visualized using Tableau to determine the optimal gym hours.

### Technologies Used
* Javascript
    * Node-cron and Puppeteer libraries
* Google Cloud Platform
* Tableau

### Conclusion
By analyzing the gym's occupancy trends, I can make informed decisions about the best times to visit, ensuring a more efficient and pleasant workout experience.
