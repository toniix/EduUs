import { Outlet } from "react-router-dom";
import HeaderWrapper from "./wrappers/HeaderWrapper";
import FooterWrapper from "./wrappers/FooterWrapper";

const PublicLayout = ({ children }) => {
  return (
    <>
      <HeaderWrapper />
      <main>
        <Outlet />
      </main>
      <FooterWrapper />
    </>
  );
};
export default PublicLayout;
