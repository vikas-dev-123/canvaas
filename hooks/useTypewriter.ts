import { useEffect, useState } from "react";

type Options = {
    speed?: number;
    startDelay?: number;
};

export function useTypewriter(text: string, { speed = 28, startDelay = 400 }: Options = {}) {
    const [displayed, setDisplayed] = useState("");
    const [done, setDone] = useState(false);

    useEffect(() => {
        setDisplayed("");
        setDone(false);

        let i = 0;
        let interval: ReturnType<typeof setInterval>;

        const timeout = setTimeout(() => {
            interval = setInterval(() => {
                i += 1;
                setDisplayed(text.slice(0, i));
                if (i >= text.length) {
                    clearInterval(interval);
                    setDone(true);
                }
            }, speed);
        }, startDelay);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, [text, speed, startDelay]);

    return { displayed, done };
}
