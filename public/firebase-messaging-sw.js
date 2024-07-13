importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const devConfig = {
  apiKey: "AIzaSyA9ET2nGLA1t-Am4PBtWRyVQVu3ZLEWZSU",
  authDomain: "delivfree-app-dev.firebaseapp.com",
  projectId: "delivfree-app-dev",
  storageBucket: "delivfree-app-dev.appspot.com",
  messagingSenderId: "1045793418822",
  appId: "1:1045793418822:web:e4672af6516939f4e6e447",
};
const liveConfig = {
  apiKey: "AIzaSyDDKuob3VoBk8B6YVcZL0Z_HuCrZ0saODY",
  authDomain: "delivfree-app.firebaseapp.com",
  projectId: "delivfree-app",
  storageBucket: "delivfree-app.appspot.com",
  messagingSenderId: "406179880402",
  appId: "1:406179880402:web:8ca561290bd87b61297c0b",
  measurementId: "G-C1X5PN737R",
};

firebase.initializeApp(liveConfig);

const FCM_MSG = "FCM_MSG";
const MessageType = {
  PUSH_RECEIVED: "push-received",
  NOTIFICATION_CLICKED: "notification-clicked",
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function claimClients() {
  return self.clients.claim();
}

function getClientList() {
  return self.clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });
}

function getWindowClient(clientList, url) {
  for (const client of clientList) {
    const clientUrl = new URL(client.url, self.location.href);
    if (url.host === clientUrl.host) {
      return client;
    }
  }
  return null;
}

function getLink(payload) {
  var _a, _b, _c;
  // eslint-disable-next-line camelcase
  const link =
    (_b =
      (_a = payload.fcmOptions) === null || _a === void 0
        ? void 0
        : _a.link) !== null && _b !== void 0
      ? _b
      : (_c = payload.notification) === null || _c === void 0
      ? void 0
      : _c.click_action;

  return link || null;
}

function interalizePayload(event) {
  let _b, _a;
  const payload =
    (_b =
      (_a = event.notification) === null || _a === void 0
        ? void 0
        : _a.data) === null || _b === void 0
      ? void 0
      : _b[FCM_MSG];
  return payload || null;
}

self.addEventListener("notificationclick", (event) => {
  event.waitUntil(
    getClientList().then((clients) => {
      const payload = interalizePayload(event);

      if (!payload) {
        return;
      }

      const link = getLink(payload);

      if (!link) {
        return;
      }

      const url = new URL(link);

      const client = getWindowClient(clients, url);

      if (client) {
        return sleep(500).then(() => {
          payload.messageType = MessageType.PUSH_RECEIVED;
          client.postMessage(payload);
        });
      }
    })
  );
});

const initMessaging = async function () {
  const isSupported = await firebase.messaging.isSupported();
  if (isSupported) {
    const messaging = firebase.messaging();
  }
};
initMessaging();
