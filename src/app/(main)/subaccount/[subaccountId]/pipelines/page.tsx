import { redirect } from "next/navigation";
import { PipelineService } from "@/services";


type Props = {
    params: {
        subaccountId: string;
    };
};

const Page = async ({ params }: Props) => {
    const pipelineExits = await PipelineService.findBySubAccountId(params.subaccountId);
    const pipeline = pipelineExits.length > 0 ? pipelineExits[0] : null;

    if (pipeline) {
        return redirect(`/subaccount/${params.subaccountId}/pipelines/${pipeline.id}`);
    }

    try {
        const response = await PipelineService.create({
            name: `First Pipeline`,
            subAccountId: params.subaccountId,
        });

        return redirect(`/subaccount/${params.subaccountId}/pipelines/${response.id}`);
    } catch (err) {
        console.error(err);
    }
};

export default Page;