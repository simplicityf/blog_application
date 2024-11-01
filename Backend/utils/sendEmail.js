const nodemail = require("nodemailer");
const { google } = require('googleapis');
const { clientId, clientSecret, refreshToken } = require("../config/keys");

const REDIRECT_URI = "https://developers.google.com/oauthplayground";  // Google’s OAuth playground for testing

const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI);

oAuth2Client.setCredentials({ refresh_token: refreshToken });


//Function to send email
const sendMail = async ({ emailTo, subject, code, content }) => {
try {
  const accessToken = await oAuth2Client.getAccessToken();

  const transporter = nodemail.createTransport({
    service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'omobolanlehazeezat@gmail.com',  //Gmail address
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        accessToken: accessToken.token,
    },
  });
  const message = {
    from: 'omobolanlehazeezat@gmail.com',
    to: emailTo,
    subject,
    html: ` <div>
  <h3> Use the code below to ${content} </h3>
  <p>
    <strong> ${code}</strong>
  </p>
        </div>`
    
  };

  await transporter.sendMail(message);
  console.log("Email sent successfully");
} catch(error) {
  console.error("Error sending email:", error);
  throw error;  // Rethrow error for middleware to handle
}
};

module.exports = sendMail;
