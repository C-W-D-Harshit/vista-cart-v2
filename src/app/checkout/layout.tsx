import { Metadata } from "next";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const metadata: Metadata = {
  title: "Checkout",
};

export default Layout;
