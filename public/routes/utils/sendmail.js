var nodemailer = require("nodemailer");
const { optionalRequire } = require("optional-require");

const { mail } = optionalRequire("../../../config");

const sendMail = (data) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    auth: {
      user: mail.sender || process.env.SENDER,
      pass: mail.senderPass || process.env.SENDERPASS,
    },
  });
  transporter
    .verify()
    .then(console.log)
    .catch("*** TRANSPORTER ERROR ***", console.error);

  var mailOptions = {
    from: '"Portfolio Site " <' + mail.sender + "@zoho.com>", // sender address
    to: "brentlawson23@gmail.com",
    subject: "Portfolio Contact Form",
    text: `${data.message} \n ${data.name} \n ${data.email}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = {
  sendMail,
};
