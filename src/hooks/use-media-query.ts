import { useState, useEffect } from "react";

// Custom hook to check media queries
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const documentChangeHandler = () => setMatches(mediaQueryList.matches);

    mediaQueryList.addListener(documentChangeHandler);
    documentChangeHandler(); // Initial check

    return () => mediaQueryList.removeListener(documentChangeHandler);
  }, [query]);

  return matches;
}

export default useMediaQuery;