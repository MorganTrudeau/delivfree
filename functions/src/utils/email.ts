import { defineString } from "firebase-functions/params";

const mailgunApiKey = defineString("MAILGUN_API_KEY");

export const sendEmailNotification = async ({
  title,
  body,
}: {
  from: string;
  to: string;
  title: string;
  body: string;
}) => {
  const formData = await import("form-data");
  const Mailgun = (await import("mailgun.js")).default;
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: "api",
    key: mailgunApiKey.value(),
  });
  mg.messages
    .create("sandbox-123.mailgun.org", {
      from: "Excited User <mailgun@sandbox224aead0ca5f431ba978753cfe19fb97.mailgun.org>",
      to: ["morgantrudeau@gmail.com"],
      subject: title,
      text: body,
      // html: "<h1>Testing some Mailgun awesomeness!</h1>",
    })
    .then((msg) => console.log(msg)) // logs response data
    .catch((err) => console.log(err)); // logs any error
};
