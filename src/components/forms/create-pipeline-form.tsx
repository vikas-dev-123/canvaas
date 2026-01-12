"use client";

import { saveActivityLogsNotification, upsertPipeline } from "@/lib/queries";
import { useModal } from "@/providers/modal-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pipeline } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Loading from "../global/loading";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

/* -------------------- PROPS -------------------- */
interface CreatePipelineFormProps {
  defaultData?: Pipeline;
  subAccountId: string;
}

/* -------------------- ZOD SCHEMA -------------------- */
const CreatePipelineFormSchema = z.object({
  name: z.string().min(1, "Pipeline name is required"),
});

/* -------------------- COMPONENT -------------------- */
const CreatePipelineForm: React.FC<CreatePipelineFormProps> = ({
  defaultData,
  subAccountId,
}) => {
  const { setClose } = useModal();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof CreatePipelineFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(CreatePipelineFormSchema),
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
  const onSubmit = async (
    values: z.infer<typeof CreatePipelineFormSchema>
  ) => {
    if (!subAccountId) return;

    try {
      const response = await upsertPipeline({
        id: defaultData?.id,
        name: values.name,
        subAccountId,
      });

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated a pipeline | ${response?.name}`,
        subAccountId,
      });

      toast({
        title: "Success",
        description: "Saved pipeline details",
      });

      router.refresh();
      setClose();
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Oops!",
        description: "Could not save pipeline details",
      });
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pipeline Details</CardTitle>
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
                  <FormLabel htmlFor="pipelineName">
                    Pipeline Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="pipelineName"
                      placeholder="Name"
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

export default CreatePipelineForm;
