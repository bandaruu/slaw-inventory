const { google } = require('googleapis');

async function sendApplication({ accessToken, refreshToken, to, subject, body, attachmentContent, attachmentName }) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
  );

  oauth2Client.setCredentials({ access_token: accessToken, refresh_token: refreshToken });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  // Build MIME message with attachment
  const boundary = 'zuva_boundary_' + Date.now();
  const attachmentBase64 = Buffer.from(attachmentContent, 'utf8').toString('base64');

  const rawMessage = [
    `MIME-Version: 1.0`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/plain; charset=UTF-8`,
    ``,
    body,
    ``,
    `--${boundary}`,
    `Content-Type: text/plain; name="${attachmentName}"`,
    `Content-Disposition: attachment; filename="${attachmentName}"`,
    `Content-Transfer-Encoding: base64`,
    ``,
    attachmentBase64,
    `--${boundary}--`,
  ].join('\n');

  const encodedMessage = Buffer.from(rawMessage)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: encodedMessage },
  });

  return response.data.id;
}

module.exports = { sendApplication };
