import { google } from 'googleapis';

export default async function handler(req, res) {
  const { firstName, dob } = req.body;
  const fileName = `${firstName}_${dob}.pdf`; // Match your naming convention

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

  const drive = google.drive({ version: 'v3', auth });

  // 1. Search for the file
  const response = await drive.files.list({
    q: `name = '${fileName}' and 'FOLDER_ID_HERE' in parents`,
    fields: 'files(id, webContentLink)',
  });

  if (response.data.files.length > 0) {
    // 2. Redirect the student to the download link
    res.redirect(response.data.files[0].webContentLink);
  } else {
    res.status(404).send("Report not found. Please check your details.");
  }
}