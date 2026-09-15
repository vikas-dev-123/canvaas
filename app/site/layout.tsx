import Navigation from "@/components/site/navigation";
import { getSession } from "@/lib/auth/getSession";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getSession();

    return (
        <main className="h-full">
            <Navigation user={session} />
            {children}
        </main>
    );
};

export default Layout;
