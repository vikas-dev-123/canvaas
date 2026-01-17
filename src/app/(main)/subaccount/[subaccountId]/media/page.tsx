import BlurPage from "@/components/global/blur-page";
import MediaComponent from "@/components/media";
import { MediaService, SubAccountService } from "@/services";
import React from "react";

type Props = {
    params: {
        subaccountId: string;
    };
};

const Page = async ({ params }: Props) => {
    const subAccount = await SubAccountService.findById(params.subaccountId);
    if (subAccount) {
        const media = await MediaService.findBySubAccountId(params.subaccountId);
        (subAccount as any).Media = media;
    }
    const data = subAccount;

    return (
        <BlurPage>
            <MediaComponent data={data} subaccountId={params.subaccountId} />
        </BlurPage>
    );
};

export default Page;