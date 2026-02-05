import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const getSessionId = () => {
  let sessionId = sessionStorage.getItem("session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem("session_id", sessionId);
  }
  return sessionId;
};

export const usePresence = () => {
  const location = useLocation();
  const sessionId = useRef(getSessionId());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updatePresence = async () => {
      try {
        await supabase.from("online_users").upsert(
          {
            session_id: sessionId.current,
            page_path: location.pathname,
            last_seen_at: new Date().toISOString(),
          },
          { onConflict: "session_id" }
        );
      } catch (error) {
        // Silently fail
      }
    };

    const trackAnalytics = async () => {
      try {
        // Get geolocation data
        let country = null;
        let city = null;
        
        try {
          const geoResponse = await supabase.functions.invoke('get-visitor-location');
          if (geoResponse.data) {
            country = geoResponse.data.country;
            city = geoResponse.data.city;
          }
        } catch (geoError) {
          // Silently fail geolocation
        }

        await supabase.from("site_analytics").insert({
          session_id: sessionId.current,
          page_path: location.pathname,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
          country,
          city,
        });
      } catch (error) {
        // Silently fail
      }
    };

    updatePresence();
    trackAnalytics();

    intervalRef.current = setInterval(updatePresence, 30000);

    const handleBeforeUnload = async () => {
      try {
        await supabase
          .from("online_users")
          .delete()
          .eq("session_id", sessionId.current);
      } catch (error) {
        // Silently fail
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [location.pathname]);
};
