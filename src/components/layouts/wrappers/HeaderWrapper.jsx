import { useLocation } from "react-router-dom";
import Header from "../../Header";

export default function HeaderWrapper() {
  const location = useLocation();
  const hideHeaderPaths = ["/admin"];
  const shouldShowHeader = !hideHeaderPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return shouldShowHeader ? <Header /> : null;
}
