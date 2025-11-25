
      import * as React from "react"
      
      const MOBILE_BREAKPOINT = 1024
      
      export function useIsMobile() {
        const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);
      
        React.useEffect(() => {
          const checkIsMobile = () => {
          setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        };
      
        checkIsMobile(); // Initial check on mount
        window.addEventListener("resize", checkIsMobile);
      
        return () => {
          window.removeEventListener("resize", checkIsMobile);
        };
      }, []);
      
      return isMobile;
      }
