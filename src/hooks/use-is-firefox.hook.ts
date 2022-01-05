import { useEffect, useState } from "react";

export function useIsFirefox() {
  const [isFirefox, setIsFirefox] = useState(false);

  useEffect(() => {
    if (navigator.userAgent.indexOf("Firefox") !== -1) {
      console.log("firefox");
      setIsFirefox(true);
    }
  }, []);

  return isFirefox;
}
