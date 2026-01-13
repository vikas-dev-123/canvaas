"use client";

import React, { useEffect } from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Lane } from "@/lib/interfaces";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Loading from "../global/loading";
import {
  getPipelineDetails,
  saveActivityLogsNotification,
  upsertLane,
} from "@/lib/queries";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/providers/modal-provider";
import { useToast } from "../ui/use-toast";

/* -------------------- PROPS -------------------- */
interface CreateLaneFormProps {
  defaultData?: Lane;
  pipelineId: string;
}

/* -------------------- ZOD SCHEMA -------------------- */
const LaneFormSchema = z.object({
  name: z.string().min(1, "Lane name is required"),
});

/* -------------------- COMPONENT -------------------- */
const LaneForm: React.FC<CreateLaneFormProps> = ({
  defaultData,
  pipelineId,
}) => {
  const { setClose } = useModal();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof LaneFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(LaneFormSchema),
    defaultValues: {
      name: defaultData?.name ?? "",
    },
  });

  /* -------------------- RESET ON EDIT -------------------- */
  useEffect(() => {
    if (defaultData) {
      form.reset({
        name: defaultData.name ?? "",
      });
    }
  }, [defaultData, form]);

  // ✅ Correct loading flag
  const isLoading = form.formState.isSubmitting;

  /* -------------------- SUBMIT -------------------- */
  const onSubmit = async (values: z.infer<typeof LaneFormSchema>) => {
    if (!pipelineId) return;

    try {
      const response = await upsertLane({
        id: defaultData?.id,
        name: values.name,
        pipelineId,
        order: defaultData?.order,
      });

      const pipeline = await getPipelineDetails(pipelineId);
      if (!pipeline) return;

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated a lane | ${response?.name}`,
        subAccountId: pipeline.subAccountId,
      });

      toast({
        title: "Success",
        description: "Saved lane details",
      });

      router.refresh();
      setClose();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description: "Could not save lane details",
      });
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Lane Details</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="laneName">
                    Lane Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="laneName"
                      placeholder="Lane Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-20 mt-4"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? <Loading /> : "Save"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LaneForm;
