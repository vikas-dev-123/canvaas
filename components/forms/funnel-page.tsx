"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import {
  deleteFunnelsPage,
  getFunnels,
  saveActivityLogsNotification,
  upsertFunnelPage,
} from "@/lib/queries";
import { FunnelPageSchema } from "@/lib/types";
import { FunnelPage } from "@prisma/client";
import { CopyPlusIcon, Trash } from "lucide-react";
import { v4 } from "uuid";
import Loading from "../global/loading";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

interface CreateFunnelPageProps {
  defaultData?: FunnelPage;
  funnelId: string;
  order: number;
  subaccountId: string;
}

const CreateFunnelPage: React.FC<CreateFunnelPageProps> = ({
  defaultData,
  funnelId,
  order,
  subaccountId,
}) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof FunnelPageSchema>>({
    resolver: zodResolver(FunnelPageSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      pathName: "",
    },
  });

  useEffect(() => {
    if (defaultData) {
      form.reset({
        name: defaultData.name,
        pathName: defaultData.pathName,
      });
    }
  }, [defaultData, form]);

  const onSubmit = async (values: z.infer<typeof FunnelPageSchema>) => {
    if (order !== 0 && !values.pathName) {
      return form.setError("pathName", {
        message:
          "Pages other than the first page require a path name (e.g. second-step)",
      });
    }

    try {
      const response = await upsertFunnelPage(
        subaccountId,
        {
          ...values,
          id: defaultData?.id || v4(),
          order: defaultData?.order || order,
          pathName: values.pathName || "",
        },
        funnelId
      );

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated a funnel page | ${response?.name}`,
        subAccountId: subaccountId,
      });

      toast({
        title: "Success",
        description: "Saved funnel page details",
      });
      router.refresh();
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "Could not save funnel page details",
      });
    }
  };

  return (
    <Card
      className="
        rounded-2xl
        border border-neutral-200 dark:border-neutral-800
        bg-white dark:bg-[#0f0f0f]
      "
    >
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-semibold text-black dark:text-white">
          Funnel Page
        </CardTitle>
        <CardDescription className="text-sm text-neutral-500">
          Funnel pages follow the order they are created. You can reorder them
          later.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* PAGE NAME */}
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Page Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Checkout Page"
                      className="h-11 rounded-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PATH NAME */}
            <FormField
              disabled={form.formState.isSubmitting || order === 0}
              control={form.control}
              name="pathName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Path Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. checkout"
                      className="h-11 rounded-lg lowercase"
                      {...field}
                      value={field.value?.toLowerCase()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ACTIONS */}
            <div className="flex items-center justify-between pt-2">
              <Button
                className="h-10 px-6 rounded-lg"
                disabled={form.formState.isSubmitting}
                type="submit"
              >
                {form.formState.isSubmitting ? <Loading /> : "Save Page"}
              </Button>

              {defaultData?.id && (
                <div className="flex items-center gap-2">
                  {/* DELETE */}
                  <Button
                    variant="outline"
                    className="
                      h-10
                      border-red-500 text-red-500
                      hover:bg-red-500 hover:text-white
                    "
                    disabled={form.formState.isSubmitting}
                    type="button"
                    onClick={async () => {
                      const response = await deleteFunnelsPage(
                        defaultData.id
                      );
                      await saveActivityLogsNotification({
                        agencyId: undefined,
                        description: `Deleted a funnel page | ${response?.name}`,
                        subAccountId: subaccountId,
                      });
                      router.refresh();
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>

                  {/* DUPLICATE */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    disabled={form.formState.isSubmitting}
                    type="button"
                    onClick={async () => {
                      const response = await getFunnels(subaccountId);
                      const lastIndex = response.find(
                        (funnel) => funnel.id === funnelId
                      )?.FunnelPages.length;

                      await upsertFunnelPage(
                        subaccountId,
                        {
                          ...defaultData,
                          id: v4(),
                          order: lastIndex || 0,
                          visits: 0,
                          name: `${defaultData.name} Copy`,
                          pathName: `${defaultData.pathName}copy`,
                          content: defaultData.content,
                        },
                        funnelId
                      );

                      toast({
                        title: "Success",
                        description: "Funnel page duplicated",
                      });
                      router.refresh();
                    }}
                  >
                    <CopyPlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateFunnelPage;
