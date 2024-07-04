var nodemailer = require("nodemailer");
const { optionalRequire } = require("optional-require");

const config = optionalRequire("../../../config") || { mail: "", sender: "" };

const sendMail = (data) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    auth: {
      user: config.mail.sender || process.env.SENDER,
      pass: config.mail.senderPass || process.env.SENDERPASS,
    },
  });
  transporter
    .verify()
    .then("*** TRANSPORTER SUCCESS ***", console.log)
    .catch("*** TRANSPORTER ERROR ***", console.error);

  var mailOptions = {
    from: '"Portfolio Site " <' + config.mail.sender + "@zoho.com>", // sender address
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
