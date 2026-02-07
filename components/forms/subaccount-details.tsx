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
  FormMessage,
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
  userId: string;
  userName: string;
}

const SubAccountDetails: React.FC<SubAccountDetailsProps> = ({
  details,
  agencyDetails,
  userId,
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await upsertSubAccount({
        id: details?.id ? details.id : v4(),
        address: values.address,
        subAccountLogo: values.subAccountLogo,
        city: values.city,
        companyPhone: values.companyPhone,
        country: values.country,
        name: values.name,
        state: values.state,
        zipCode: values.zipCode,
        createdAt: new Date(),
        updatedAt: new Date(),
        companyEmail: values.companyEmail,
        agencyId: agencyDetails.id,
        connectAccountId: "",
        goal: 5000,
      });

      await saveActivityLogsNotification({
        agencyId: response.agencyId,
        description: `${userName} | updated sub account | ${response.name}`,
        subAccountId: response.id,
      });

      toast({
        title: "Subaccount saved",
        description: "Sub account details saved successfully.",
      });

      setClose();
      router.refresh();
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save sub account details.",
      });
    }
  }

  useEffect(() => {
    if (details) form.reset(details);
  }, [details, form]);

  const isLoading = form.formState.isSubmitting;

  return (
    <Card
      className="
        w-full
        bg-white dark:bg-[#101010]
        border border-neutral-200 dark:border-neutral-800
        rounded-2xl
        shadow-[0_24px_48px_-20px_rgba(0,0,0,0.8)]
      "
    >
      <CardHeader>
        <CardTitle className="text-2xl text-black dark:text-white">
          Sub_Account_Profile
        </CardTitle>
        <CardDescription className="text-neutral-500">
          Configure business & identity details
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* LOGO */}
            <FormField
              disabled={isLoading}
              control={form.control}
              name="subAccountLogo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-600 dark:text-neutral-400">
                    Account_Logo
                  </FormLabel>
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

            {/* NAME + EMAIL */}
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-600 dark:text-neutral-400">
                      Account_Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        required
                        placeholder="Sub account name"
                        className="bg-transparent border-neutral-300 dark:border-neutral-700"
                        {...field}
                      />
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
                    <FormLabel className="text-neutral-600 dark:text-neutral-400">
                      Account_Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email"
                        className="bg-transparent border-neutral-300 dark:border-neutral-700"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* PHONE */}
            <FormField
              disabled={isLoading}
              control={form.control}
              name="companyPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-600 dark:text-neutral-400">
                    Phone_Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="Phone"
                      className="bg-transparent border-neutral-300 dark:border-neutral-700"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* ADDRESS */}
            <FormField
              disabled={isLoading}
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-600 dark:text-neutral-400">
                    Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      required
                      placeholder="Street address"
                      className="bg-transparent border-neutral-300 dark:border-neutral-700"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* CITY / STATE / ZIP */}
            <div className="grid md:grid-cols-3 gap-4">
              {["city", "state", "zipCode"].map((key) => (
                <FormField
                  key={key}
                  disabled={isLoading}
                  control={form.control}
                  name={key as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-600 dark:text-neutral-400">
                        {key.toUpperCase()}
                      </FormLabel>
                      <FormControl>
                        <Input
                          required
                          className="bg-transparent border-neutral-300 dark:border-neutral-700"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {/* COUNTRY */}
            <FormField
              disabled={isLoading}
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-600 dark:text-neutral-400">
                    Country
                  </FormLabel>
                  <FormControl>
                    <Input
                      required
                      className="bg-transparent border-neutral-300 dark:border-neutral-700"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* SUBMIT */}
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
              {isLoading ? <Loading /> : "Save_Sub_Account"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SubAccountDetails;
