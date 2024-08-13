import { defineString } from "firebase-functions/params";

const mailgunApiKey = defineString("MAILGUN_API_KEY");

export const sendEmailNotification = async ({
  title,
  body,
  to,
  from,
}: {
  from?: string;
  to: string[];
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
    .create("delivfree.com", {
      from: from || "DelivFree Canada Inc. <admin@delivfree.com>",
      to: to,
      subject: title,
      text: body,
      // html: "<h1>Testing some Mailgun awesomeness!</h1>",
    })
    .then((msg) => console.log(msg)) // logs response data
    .catch((err) => console.log(err)); // logs any error
};
