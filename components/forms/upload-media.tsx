"use client";

import React from "react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
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
import FileUpload from "../global/file-upload";
import { Button } from "../ui/button";
import {
  createMedia,
  saveActivityLogsNotification,
} from "@/lib/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import Loading from "../global/loading";

type Props = {
  subaccountId: string;
};

const formSchema = z.object({
  link: z.string().min(1, {
    message: "Media file is required",
  }),
  name: z.string().min(1, {
    message: "File name is required",
  }),
});

const UploadMediaForm = ({ subaccountId }: Props) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      link: "",
      name: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await createMedia(subaccountId, values);

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Uploaded media • ${response.name}`,
        subAccountId: subaccountId,
      });

      toast({
        title: "Upload successful",
        description: "Your media file has been uploaded.",
      });

      router.refresh();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Unable to upload media file.",
      });
    }
  };

  return (
    <Card
      className="
        w-full
        rounded-2xl
        bg-white dark:bg-[#0f0f0f]
        border border-neutral-200 dark:border-neutral-800
        shadow-[0_24px_48px_-24px_rgba(0,0,0,0.7)]
      "
    >
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-semibold">
          Upload Media
        </CardTitle>
        <CardDescription className="text-neutral-500">
          Add files to your media library for this sub account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* FILE NAME */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Banner image, logo, video..."
                      className="
                        bg-transparent
                        border-neutral-300 dark:border-neutral-700
                        focus:border-black dark:focus:border-white
                      "
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* FILE UPLOAD */}
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media file</FormLabel>
                  <FormControl>
                    <div
                      className="
                        rounded-xl
                        border border-dashed
                        border-neutral-300 dark:border-neutral-700
                        bg-neutral-50 dark:bg-neutral-900/40
                        p-3
                      "
                    >
                      <FileUpload
                        apiEndpoint="subaccountLogo"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ACTION */}
            <Button
              type="submit"
              disabled={isLoading}
              className="
                w-full h-11 rounded-xl
                bg-black text-white
                dark:bg-white dark:text-black
                hover:opacity-90
              "
            >
              {isLoading ? <Loading /> : "Upload media"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UploadMediaForm;
