import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useConfig() {
  return useQuery({
    queryKey: [api.config.get.path],
    queryFn: async () => {
      try {
        const res = await fetch(api.config.get.path, { credentials: "include" });
        if (!res.ok) return null; // Graceful fallback if not configured
        
        const data = await res.json();
        return api.config.get.responses[200].parse(data);
      } catch (err) {
        console.error("Config fetch failed, using fallback:", err);
        return null;
      }
    },
    // The config rarely changes on this placeholder page
    staleTime: Infinity,
    retry: false,
  });
}
