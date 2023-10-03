import { Metadata } from "next";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const metadata: Metadata = {
  title: "Cart",
};

export default Layout;
