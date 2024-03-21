import { PowerUp, PowerUps } from "smarticus";

import Glory from "../../assets/svg/glory.svg";
import Truth from "../../assets/svg/truth.svg";
import Escape from "../../assets/svg/escape.svg";
import Time from "../../assets/svg/time.svg";

export const getPowerUpInfo = (powerUp: PowerUp) => {
  switch (powerUp) {
    case PowerUps.TRUTH:
      return {
        title: "Truth",
        description: "Remove an incorrect option from a question.",
        coins: 200,
        Icon: Truth,
      };
    case PowerUps.GLORY:
      return {
        title: "Glory",
        description: "Double rating from a correct answer.",
        coins: 250,
        Icon: Glory,
      };
    case PowerUps.ESCAPE:
      return {
        title: "Escape",
        description: "Skip a difficult question to avoid losing rating.",
        coins: 200,
        Icon: Escape,
      };
    case PowerUps.TIME:
      return {
        title: "Time",
        description: "Double the time to answer a question.",
        coins: 200,
        Icon: Time,
      };
  }
};
