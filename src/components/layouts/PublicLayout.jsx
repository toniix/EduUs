import { Outlet, useLocation } from "react-router-dom";
import HeaderWrapper from "./wrappers/HeaderWrapper";
import FooterWrapper from "./wrappers/FooterWrapper";
import SiteCampaignModal from "../campaigns/SiteCampaignModal";

const PROMO_MODE =
  import.meta.env.VITE_HOME_PROMO_CAMPAIGN || "site-campaign";
const siteCampaignsEnabled =
  PROMO_MODE === "site-campaign" || PROMO_MODE === "edu-mentor";

const PublicLayout = () => {
  const location = useLocation();
  const hideFooter =
    location.pathname === "/edutracker" ||
    location.pathname.startsWith("/edutracker/oportunidad/") ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      <HeaderWrapper />
      <main className="pt-16">
        <Outlet />
      </main>
      {!hideFooter && <FooterWrapper />}
      {siteCampaignsEnabled && <SiteCampaignModal />}
    </>
  );
};

export default PublicLayout;
