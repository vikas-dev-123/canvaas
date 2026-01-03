import { ChildrenProps } from "@/@types";
import BlurPage from "@/components/global/blur-page";
import React from "react";

const Layout = ({ children }: ChildrenProps) => {
    return <BlurPage>{children}</BlurPage>;//children will be the Page component
};

export default Layout;