'use strict';

//Load required modules
var nodemailer = require('nodemailer');
var nodemailerSmtpTransport = require('nodemailer-smtp-transport');
var hbs = require('nodemailer-express-handlebars');

exports.sendEmail = function(to, subject, template, context) {
  context.domainName = (process.env.DOMAIN_NAME || 'localhost:3443');

  var viewOptions = {
    viewEngine: {
      extname: '.hbs',
      layoutsDir: './server/emails',
      defaultLayout: 'layout'
    },
    viewPath: './server/emails/partials',
    extName: '.hbs'
  };

  var mailOptions = {
    to: to,
    from: (process.env.EMAIL_SENT_FROM || 'donotreply@nationwide.com'),
    subject: subject,
    template: template,
    context: context
  };

  var transporter = nodemailer.createTransport(nodemailerSmtpTransport({
    host: 'mail-gw.ent.nwie.net',
  }));

  transporter.use('compile', hbs(viewOptions));

  return new Promise(function (resolve, reject) {
    transporter.sendMail(mailOptions, function(err, info) {
      if (err) {
        reject(err);
      } else {
        resolve(info)
      }
      transporter.close();
    });
  });
}
