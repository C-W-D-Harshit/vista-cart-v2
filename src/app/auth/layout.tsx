import { Metadata } from "next";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const metadata: Metadata = {
  title: {
    default: "Auth",
    template: "%s | Auth",
  },
};

export default Layout;
