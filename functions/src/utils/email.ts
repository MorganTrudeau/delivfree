import { defineString } from "firebase-functions/params";

const mailgunApiKey = defineString("MAILGUN_API_KEY");

export const sendEmailNotification = async (
  data: {
    from?: string;
    to: string[];
    title: string;
  } & ({ html: string } | { body: string })
) => {
  const { title, to, from } = data;
  const formData = await import("form-data");
  const Mailgun = (await import("mailgun.js")).default;
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: "api",
    key: mailgunApiKey.value(),
  });

  const baseParams = {
    from: from || "DelivFree Canada Inc. <admin@delivfree.com>",
    to: to,
    subject: title,
  };

  const params =
    "body" in data
      ? { ...baseParams, text: data.body }
      : { ...baseParams, html: data.html };

  mg.messages
    .create("delivfree.com", params)
    .then((msg) => console.log(msg)) // logs response data
    .catch((err) => console.log(err)); // logs any error
};
