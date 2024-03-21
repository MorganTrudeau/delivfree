const en = {
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back",
    logOut: "Log Out",
    home: "Home",
    leaderboard: "Leaderboard",
    profile: "Profile",
    ranked_game: "Ranked Game",
    casual_game: "Training Game",
    versus: "Versus",
    loading: "Loading...",
    versus_instruction: "Show them your QR code or send them a link.",
    try_that_again: "Try that again",
    next_question: "Next Question",
    see_your_results: "See your results",
  },
  ios_terms: {
    payment_charge_text:
      "One time payment will be charged to your iTunes Account at confirmation of purchase.",
    auto_renew:
      "Subscription automatically renews unless auto-renew is turned off at least 24-hours before the end of the current period",
    account_will_charge:
      "Account will be charged for renewal within 24 hours of the end of the current period. The cost of subscription will be identified.",
    subs_may_managed:
      "Subscriptions may be managed by the user and auto-renewal may be turned off after purchase through the user's Account Settings.",
    free_trial_unused_portion:
      "Any unused portion of a free trial period, if offered, will be forfeited when the user purchases a subscription of Employee Link, where applicable.",
    privacy_policy: "Privacy Policy",
    terms_of_use: "Terms of Use",
  },
  trivia: {
    choose_category: "Choose a category",
    versus_heading: "Challenge someone",
    share_link_button: "Share a link",
  },
  welcomeScreen: {
    postscript:
      "Your first skill testing question is: Do you have an account? (If no, sign up)",
    readyForLaunch: "Your app, almost ready for launch!",
    exciting: "(ohh, this is exciting!)",
    letsGo: "Let's go!", // @demo remove-current-line
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle:
      "Sorry for the interruption. Please reset the app to start playing.",
    reset: "Reset App",
    traceTitle: "Error from %{name} stack", // @demo remove-current-line
  },
  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content:
        "No data found yet. Try clicking the button to refresh or reload the app.",
      button: "Let's try this again",
    },
  },
  errors: {
    heading: "Oops had an error...",
    invalidEmail: "Invalid email address.",
    auth_email_already_in_use:
      "Email address is already in use by another account.",
    auth_invalid_email: "Email address is badly formatted.",
    auth_user_not_found: "There is no account with this email.",
    auth_weak_password: "Password must be at least 6 characters.",
    auth_wrong_password: "Password is incorrect.",
    "auth_requires-recent-login": "Please try logging in again",
    "auth_network-request-failed": "Please check your internet and try again",
    "already-request-failed": "You've already created an account",
    common: "Something went wrong. Please try again.",
  },
  loginScreen: {
    signIn: "Log In",
    enterDetails:
      "Enter your details below to unlock top secret info. You'll never guess what we've got waiting. Or maybe you will; it's not rocket science here.",
    emailFieldLabel: "Email",
    passwordFieldLabel: "Password",
    emailFieldPlaceholder: "Enter your email address",
    passwordFieldPlaceholder: "Enter your password",
    tapToSignIn: "Tap to log in!",
    hint: "Hint: you can use any email address and your favorite password :)",
  },
  signUpScreen: {
    signIn: "Sign Up",
    enterDetails:
      "Enter your details below to unlock top secret info. You'll never guess what we've got waiting. Or maybe you will; it's not rocket science here.",
    emailFieldLabel: "Email",
    passwordFieldLabel: "Password",
    emailFieldPlaceholder: "Enter your email address",
    passwordFieldPlaceholder: "Create a password",
    tapToSignIn: "Tap to sign up!",
    hint: "Hint: you can use any email address and your favorite password :)",
  },
  demoNavigator: {
    componentsTab: "Components",
    debugTab: "Debug",
    communityTab: "Community",
    podcastListTab: "Podcast",
  },
  demoCommunityScreen: {
    title: "Connect with the community",
    tagLine:
      "Plug in to Infinite Red's community of React Native engineers and level up your app development with us!",
    joinUsOnSlackTitle: "Join us on Slack",
    joinUsOnSlack:
      "Wish there was a place to connect with React Native engineers around the world? Join the conversation in the Infinite Red Community Slack! Our growing community is a safe space to ask questions, learn from others, and grow your network.",
    joinSlackLink: "Join the Slack Community",
    makeIgniteEvenBetterTitle: "Make Ignite even better",
    makeIgniteEvenBetter:
      "Have an idea to make Ignite even better? We're happy to hear that! We're always looking for others who want to help us build the best React Native tooling out there. Join us over on GitHub to join us in building the future of Ignite.",
    contributeToIgniteLink: "Contribute to Ignite",
    theLatestInReactNativeTitle: "The latest in React Native",
    theLatestInReactNative:
      "We're here to keep you current on all React Native has to offer.",
    reactNativeRadioLink: "React Native Radio",
    reactNativeNewsletterLink: "React Native Newsletter",
    reactNativeLiveLink: "React Native Live",
    chainReactConferenceLink: "Chain React Conference",
    hireUsTitle: "Hire Infinite Red for your next project",
    hireUs:
      "Whether it's running a full project or getting teams up to speed with our hands-on training, Infinite Red can help with just about any React Native project.",
    hireUsLink: "Send us a message",
  },
  demoShowroomScreen: {
    jumpStart: "Jump into a game",
    lorem2Sentences:
      "Nulla cupidatat deserunt amet quis aliquip nostrud do adipisicing. Adipisicing excepteur elit laborum Lorem adipisicing do duis.",
    demoHeaderTxExample: "Yay",
    demoViaTxProp: "Via `tx` Prop",
    demoViaSpecifiedTxProp: "Via `{{prop}}Tx` Prop",
  },
  demoDebugScreen: {
    howTo: "HOW TO",
    title: "Debug",
    tagLine:
      "Congratulations, you've got a very advanced React Native app template here.  Take advantage of this boilerplate!",
    reactotron: "Send to Reactotron",
    reportBugs: "Report Bugs",
    demoList: "Demo List",
    demoPodcastList: "Demo Podcast List",
    androidReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running, run adb reverse tcp:9090 tcp:9090 from your terminal, and reload the app.",
    iosReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    macosReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    webReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    windowsReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
  },
  demoPodcastListScreen: {
    title: "React Native Radio episodes",
    onlyFavorites: "Only Show Favorites",
    favoriteButton: "Favorite",
    unfavoriteButton: "Unfavorite",
    accessibility: {
      cardHint:
        "Double tap to listen to the episode. Double tap and hold to {{action}} this episode.",
      switch: "Switch on to only show favorites",
      favoriteAction: "Toggle Favorite",
      favoriteIcon: "Episode not favorited",
      unfavoriteIcon: "Episode favorited",
      publishLabel: "Published {{date}}",
      durationLabel:
        "Duration: {{hours}} hours {{minutes}} minutes {{seconds}} seconds",
    },
    noFavoritesEmptyState: {
      heading: "This looks a bit empty",
      content:
        "No favorites have been added yet. Tap the heart on an episode to add it to your favorites!",
    },
  },
};

export default en;
export type Translations = typeof en;
