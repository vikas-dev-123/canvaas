"use client";
import { CreateFunnelFormSchema } from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Funnel } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
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
  CardDescription,
} from "@/components/ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import FileUpload from "../global/file-upload";
import { Button } from "../ui/button";
import Loading from "../global/loading";
import { v4 } from "uuid";
import {
  saveActivityLogsNotification,
  upsertFunnel,
} from "@/lib/queries";
import { toast } from "../ui/use-toast";

interface CreateFunnelProps {
  defaultData?: Funnel;
  subAccountId: string;
}

const FunnelForm: React.FC<CreateFunnelProps> = ({
  defaultData,
  subAccountId,
}) => {
  const { setClose } = useModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof CreateFunnelFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(CreateFunnelFormSchema),
    defaultValues: {
      name: defaultData?.name || "",
      description: defaultData?.description || "",
      favicon: defaultData?.favicon || "",
      subDomainName: defaultData?.subDomainName || "",
    },
  });

  useEffect(() => {
    if (defaultData) {
      form.reset({
        description: defaultData.description || "",
        favicon: defaultData.favicon || "",
        name: defaultData.name || "",
        subDomainName: defaultData.subDomainName || "",
      });
    }
  }, [defaultData, form]);

  const isLoading = form.formState.isLoading;

  const onSubmit = async (
    values: z.infer<typeof CreateFunnelFormSchema>
  ) => {
    if (!subAccountId) return;

    const response = await upsertFunnel(
      subAccountId,
      { ...values, liveProducts: defaultData?.liveProducts || "[]" },
      defaultData?.id || v4()
    );

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Update funnel | ${response.name}`,
      subAccountId,
    });

    if (response) {
      toast({
        title: "Success",
        description: "Saved funnel details",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "Could not save funnel details",
      });
    }

    setClose();
    router.refresh();
  };

  return (
    <Card
      className="
        flex-1
        rounded-2xl
        border border-neutral-200 dark:border-neutral-800
        bg-white dark:bg-[#0f0f0f]
        shadow-sm
      "
    >
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl font-semibold text-black dark:text-white">
          Funnel Details
        </CardTitle>
        <CardDescription className="text-sm text-neutral-500">
          Configure your funnel identity and domain
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* Funnel Name */}
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funnel Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Sales Funnel"
                      className="h-11 rounded-lg"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              disabled={isLoading}
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Describe what this funnel is used for…"
                      className="rounded-lg"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Subdomain */}
            <FormField
              disabled={isLoading}
              control={form.control}
              name="subDomainName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subdomain</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your-funnel"
                      className="h-11 rounded-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-neutral-500">
                    This will be used as <span className="font-mono">your-funnel.domain.com</span>
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* Favicon */}
            <FormField
              disabled={isLoading}
              control={form.control}
              name="favicon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Favicon</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="subaccountLogo"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end pt-2">
              <Button
                className="h-10 px-6 rounded-lg font-medium"
                disabled={isLoading}
                type="submit"
              >
                {form.formState.isSubmitting ? <Loading /> : "Save Funnel"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FunnelForm;
