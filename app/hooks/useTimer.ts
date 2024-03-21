import { useEffect, useRef, useState } from "react";

export const useTimer = (length: number, active: boolean) => {
  const [time, setTime] = useState(length);

  const interval = useRef<NodeJS.Timeout>();
  useEffect(() => {
    const stopTimer = () => {
      interval.current && clearInterval(interval.current);
      interval.current = undefined;
    };

    const startTimer = () => {
      setTime(length);
      interval.current = setInterval(
        () =>
          setTime((t) => {
            if (t <= 0) {
              clearInterval(interval.current);
              return 0;
            }
            return t - 1;
          }),
        1000
      );
    };

    stopTimer();

    if (active) {
      startTimer();
    }

    return () => {
      stopTimer();
    };
  }, [active]);

  return { time, setTime };
};
