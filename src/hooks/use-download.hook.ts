import { useCallback } from "react";

export const useDownload = () => {
  // todo: file extensions
  const download = useCallback((blobUrl) => {
    const link = document.createElement("a");

    link.href = blobUrl;
    link.download = `weave-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.dispatchEvent(
      new MouseEvent("click", {
        bubbles: false,
        cancelable: true,
        view: window,
      })
    );
    document.body.removeChild(link);
  }, []);

  return { download };
};
