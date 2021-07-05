const nodemailer = require("nodemailer");

const enviaEmail = (destinatario) => {
  const transport = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "brigitte92@ethereal.email",
      pass: "Xjpm2pK2f8bxdF4kgz",
    },
  });

  const mensaje = {
    from: "aplicaciontmb@tmb.cat",
    to: destinatario,
    subject: "Paradas de metro solicitadas",
    html: "Aquí te enviamos el listado de paradas de metro solicitadas",
    attachments: [
      {
        path: "paradas.txt",
      },
    ],
  };

  transport.sendMail(mensaje, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

module.exports = {
  enviaEmail,
};
