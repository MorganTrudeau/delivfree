import { defineString } from "firebase-functions/params";

const mailgunApiKey = defineString("MAILGUN_API_KEY");

export const sendEmailNotification = async (
  data: {
    from?: string;
    to: string[];
    title: string;
  } & ({ html: string } | { body: string })
) => {
  // @ts-expect-error fix this typing
  const { from, to, title, html, body } = data;

  const formData = await import("form-data");
  const Mailgun = (await import("mailgun.js")).default;
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: "api",
    key: mailgunApiKey.value(),
  });

  const params = {
    text: body,
    to,
    subject: title,
    html,
    from: from || "DelivFree Canada Inc. <admin@mail.delivfree.com>",
  };

  return mg.messages.create("mail.delivfree.com", params);
};
