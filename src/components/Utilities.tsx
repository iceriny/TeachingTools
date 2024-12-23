import { useEffect, useRef } from "react";

function useLastStage<T>(value: T) {
    const ref = useRef<T>(value);
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
}

export { useLastStage };
