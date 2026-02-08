"use client";

import { Agency, SubAccount } from "@prisma/client";
import React, { useEffect } from "react";
import { useToast } from "../ui/use-toast";
import { useModal } from "@/providers/modal-provider";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
} from "../ui/form";
import FileUpload from "../global/file-upload";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Loading from "../global/loading";
import { useRouter } from "next/navigation";
import {
  saveActivityLogsNotification,
  upsertSubAccount,
} from "@/lib/queries";
import { v4 } from "uuid";

const formSchema = z.object({
  name: z.string(),
  companyEmail: z.string(),
  companyPhone: z.string(),
  address: z.string(),
  city: z.string(),
  subAccountLogo: z.string(),
  zipCode: z.string(),
  state: z.string(),
  country: z.string(),
});

interface SubAccountDetailsProps {
  agencyDetails: Agency;
  details?: Partial<SubAccount>;
  userName: string;
}

const SubAccountDetails: React.FC<SubAccountDetailsProps> = ({
  details,
  agencyDetails,
  userName,
}) => {
  const { toast } = useToast();
  const { setClose } = useModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: details?.name,
      companyEmail: details?.companyEmail,
      companyPhone: details?.companyPhone,
      address: details?.address,
      city: details?.city,
      zipCode: details?.zipCode,
      state: details?.state,
      country: details?.country,
      subAccountLogo: details?.subAccountLogo,
    },
  });

  useEffect(() => {
    if (details) form.reset(details);
  }, [details, form]);

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await upsertSubAccount({
        id: details?.id ?? v4(),
        ...values,
        createdAt: new Date(),
        updatedAt: new Date(),
        agencyId: agencyDetails.id,
        connectAccountId: "",
        goal: 5000,
      });

      if (response) {
        await saveActivityLogsNotification({
          agencyId: response.agencyId ?? null,
          description: `${userName} updated sub account • ${response.name}`,
          subAccountId: response.id,
        });
      }

      toast({
        title: "Saved successfully",
        description: "Sub account information updated.",
      });

      setClose();
      router.refresh();
    } catch {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "Unable to save sub account details.",
      });
    }
  }

  return (
    <Card
      className="
        w-full max-w-3xl mx-auto
        rounded-2xl
        border border-neutral-200 dark:border-neutral-800
        bg-white dark:bg-[#0f0f0f]
        shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]
      "
    >
      {/* HEADER */}
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-semibold">
          Sub Account Setup
        </CardTitle>
        <CardDescription>
          Manage business identity and contact details
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            {/* LOGO */}
            <section className="space-y-2">
              <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Branding
              </h3>

              <FormField
                disabled={isLoading}
                control={form.control}
                name="subAccountLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload
                        apiEndpoint="subaccountLogo"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </section>

            {/* BASIC INFO */}
            <section className="space-y-4">
              <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Business Information
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Company name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="companyEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="business@email.com" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                disabled={isLoading}
                control={form.control}
                name="companyPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+91 98765 43210" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </section>

            {/* ADDRESS */}
            <section className="space-y-4">
              <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Address
              </h3>

              <FormField
                disabled={isLoading}
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main Street" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-3 gap-4">
                {["city", "state", "zipCode"].map((key) => (
                  <FormField
                    key={key}
                    disabled={isLoading}
                    control={form.control}
                    name={key as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {key === "zipCode" ? "ZIP" : key}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <FormField
                disabled={isLoading}
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </section>

            {/* ACTION */}
            <div className="pt-4">
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
                {isLoading ? <Loading /> : "Save changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SubAccountDetails;
