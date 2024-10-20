const { google } = require('googleapis');

async function getSheetData() {
   const auth = new google.auth.GoogleAuth({
      credentials: {
         type: process.env.GOOGLE_TYPE,
         project_id: process.env.GOOGLE_PROJECT_ID,
         private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
         private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
         client_email: process.env.GOOGLE_CLIENT_EMAIL,
         client_id: process.env.GOOGLE_CLIENT_ID,
         auth_uri: process.env.GOOGLE_AUTH_URI,
         token_uri: process.env.GOOGLE_TOKEN_URI,
         auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
         client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
         universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
   });

   const sheets = google.sheets({ version: 'v4', auth: await auth.getClient() });
   const result = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: process.env.SHEET_NAME,
   });

   return result.data.values;
}

const fetchData = async (req, res) => {
   try {
      const { startDate, endDate, ageGroup, gender } = req.query;
      const data = await getSheetData();
      const [header, ...rows] = data;

      if (header.length < 9) {
         return res.status(400).json({ success: false, message: 'Invalid spreadsheet format' });
      }

      const timeSpent = Array(header.length - 3).fill(0);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      for (const row of rows) {
         const rowDate = new Date(row[0]);

         if ((start && rowDate < start) || (end && rowDate > end)) {
            continue;
         }
         if (ageGroup && row[1] !== ageGroup) {
            continue;
         }
         if (gender && row[2].toLowerCase() !== gender.toLowerCase()) {
            continue;
         }

         for (let i = 0; i < timeSpent.length; i++) {
            timeSpent[i] += parseInt(row[i + 3]) || 0;
         }
      }
      res.json({ success: true, data: { features: header.slice(3), timeSpent } });
   } catch (error) {
      res.status(500).json({ success: false, message: error.message });
   }
};

const fetchCategoryData = async (req, res) => {
   try {
      const { category, startDate, endDate, ageGroup, gender } = req.query;

      if (!category) {
         return res.status(400).json({ success: false, message: 'Category is required.' });
      }

      const data = await getSheetData();
      const [header, ...rows] = data;

      const categoryIndex = header.indexOf(category);
      if (categoryIndex === -1) {
         return res.status(400).json({ success: false, message: `Category ${category} not found.` });
      }

      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if ((startDate && isNaN(start)) || (endDate && isNaN(end))) {
         return res.status(400).json({ success: false, message: 'Invalid date format.' });
      }

      const timeData = [];

      for (const row of rows) {
         const dateParts = row[0].split('/'); 
         const rowDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);

         if (isNaN(rowDate.getTime())) {
            continue;
         }
         if ((start && rowDate < start) || (end && rowDate > end)) {
            continue;
         }
         if (ageGroup && row[1] !== ageGroup) {
            continue;
         }
         if (gender && row[2].toLowerCase() !== gender.toLowerCase()) {
            continue;
         }
         const categoryValue = parseInt(row[categoryIndex], 10) || 0;
         timeData.push({ date: rowDate, value: categoryValue });
      }

      timeData.sort((a, b) => a.date - b.date);
      const time = timeData.map(item => item.date.toISOString().split('T')[0]);
      const values = timeData.map(item => item.value);

      res.json({ success: true, data: { time, values } });
   } catch (error) {
      res.status(500).json({ success: false, message: error.message });
   }
};

module.exports = { fetchData, fetchCategoryData };
