import { useEffect } from 'react';

export function StudioCookie() {
  useEffect(() => {
    document.cookie = "visitedStudio=true; path=/; max-age=31536000; SameSite=Strict";
  }, []);

  return null; // no UI necessary
}
