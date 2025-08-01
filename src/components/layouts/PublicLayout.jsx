import { Outlet, useLocation } from "react-router-dom";
import HeaderWrapper from "./wrappers/HeaderWrapper";
import FooterWrapper from "./wrappers/FooterWrapper";

const PublicLayout = () => {
  const location = useLocation();
  const hideFooter =
    location.pathname === "/edutracker" ||
    location.pathname.startsWith("/edutracker/opportunity/");

  return (
    <>
      <HeaderWrapper />
      <main>
        <Outlet />
      </main>
      {!hideFooter && <FooterWrapper />}
    </>
  );
};

export default PublicLayout;
