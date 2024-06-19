import { Menu } from "delivfree/types";
import moment, { Moment } from "moment";

export const hasActiveMenu = (menus: Menu[]) => {
  return menus.find((menu) => {
    const now = moment();
    const today = now.day();
    const hours = menu.hours[0];
    return (
      menu.active &&
      hours.days.includes(today) &&
      (hours.allDay ||
        now.isBetween(hours.startTime, hours.endTime, undefined, "[]"))
    );
  });
};

export const isMenuActive = (menu: Menu) => {
  const now = moment();
  const today = now.day();
  const hours = menu.hours[0];
  return (
    menu.active &&
    hours.days.includes(today) &&
    (hours.allDay ||
      now.isBetween(hours.startTime, hours.endTime, undefined, "[]"))
  );
};

export const getMenuNextOpen = (menus: Menu[]) => {
  const now = moment();
  const today = now.day();

  const nextTimes = menus
    .map((m) => {
      const hours = m.hours[0];
      let nextDay = m.hours[0].days.find(
        (d) => typeof d === "number" && d >= today
      );
      if (!nextDay) {
        nextDay = m.hours[0].days.find(
          (d) => typeof d === "number" && d < today
        );
      }
      if (nextDay === undefined) {
        return null;
      }
      let nextMoment = moment().day(nextDay);
      if (now.isAfter(nextMoment, "day")) {
        nextMoment.add(1, "week");
      }
      if (!hours.allDay) {
        nextMoment = nextMoment
          .hours(hours.startTime?.hours || 0)
          .minutes(hours.startTime?.minutes || 0);
      } else {
        nextMoment = nextMoment.startOf("day");
      }

      const format = hours.allDay
        ? "dddd"
        : nextMoment.isSame(now, "day")
        ? "h:mma"
        : "ddd h:mma";

      return {
        moment: nextMoment,
        format: format,
      };
    })
    .filter((d) => !!d)
    .sort((a, b) =>
      (a as { moment: Moment; format: string }).moment.isBefore(b?.moment)
        ? -1
        : 1
    );

  const nextTime = nextTimes[0] as
    | { moment: Moment; format: string }
    | undefined;

  return nextTime ? nextTime.moment.format(nextTime.format) : "";
};
