import { useCallback, useEffect, useState } from 'react';

export function useCountdownTimer(initialSeconds: number, onExpire?: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);

  const reset = useCallback(
    (nextSeconds: number = initialSeconds) => {
      setSecondsLeft(nextSeconds);
      setIsRunning(true);
    },
    [initialSeconds]
  );

  const pause = useCallback(() => setIsRunning(false), []);

  useEffect(() => {
    if (!isRunning) return;
    if (secondsLeft <= 0) {
      setIsRunning(false);
      onExpire?.();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, secondsLeft, onExpire]);

  return { secondsLeft, isRunning, reset, pause };
}
