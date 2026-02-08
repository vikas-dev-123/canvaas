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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
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

interface CreatePipelineFormProps {
  defaultData?: Pipeline;
  subAccountId: string;
}

const CreatePipelineFormSchema = z.object({
  name: z.string().min(1),
});

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
      name: defaultData?.name || "",
    },
  });

  useEffect(() => {
    if (defaultData) {
      form.reset({
        name: defaultData?.name || "",
      });
    }
  }, [defaultData, form]);

  const isLoading = form.formState.isLoading;

  const onSubmit = async (values: z.infer<typeof CreatePipelineFormSchema>) => {
    if (!subAccountId) return;

    try {
      const response = await upsertPipeline({
        ...values,
        id: defaultData?.id,
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
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "Could not save pipeline details",
      });
    }
    setClose();
  };

  return (
    <Card
      className="
        w-full
        rounded-2xl
        border border-neutral-200 dark:border-neutral-800
        bg-white dark:bg-[#0f0f0f]
        shadow-sm
      "
    >
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl font-semibold text-black dark:text-white">
          Pipeline Details
        </CardTitle>
        <CardDescription className="text-sm text-neutral-500">
          Create or update a pipeline stage flow
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Pipeline Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Sales Funnel"
                      className="
                        h-11 rounded-lg
                        border-neutral-300 dark:border-neutral-700
                      "
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-2">
              <Button
                className="
                  h-10
                  rounded-lg
                  px-6
                  font-medium
                "
                disabled={isLoading}
                type="submit"
              >
                {form.formState.isSubmitting ? <Loading /> : "Save Pipeline"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreatePipelineForm;
