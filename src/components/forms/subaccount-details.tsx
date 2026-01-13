"use client";

import { Agency, SubAccount } from "@/lib/interfaces";
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

/* -------------------- ZOD SCHEMA -------------------- */
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  companyEmail: z.string().optional(),
  companyPhone: z.string().min(10, "Phone is required"),
  address: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().min(4),
  state: z.string().min(1),
  country: z.string().min(1),
  subAccountLogo: z.string().optional(),
});

/* -------------------- PROPS -------------------- */
interface SubAccountDetailsProps {
  agencyDetails: Agency;
  details?: Partial<SubAccount>;
  userId: string;
  userName: string;
}

/* -------------------- COMPONENT -------------------- */
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
      name: details?.name ?? "",
      companyEmail: details?.companyEmail ?? "",
      companyPhone: details?.companyPhone ?? "",
      address: details?.address ?? "",
      city: details?.city ?? "",
      zipCode: details?.zipCode ?? "",
      state: details?.state ?? "",
      country: details?.country ?? "",
      subAccountLogo: details?.subAccountLogo ?? "",
    },
  });

  /* -------------------- SUBMIT -------------------- */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await upsertSubAccount({
        id: details?.id ?? v4(),
        agencyId: agencyDetails.id,
        name: values.name,
        companyEmail: values.companyEmail,
        companyPhone: values.companyPhone,
        address: values.address,
        city: values.city,
        zipCode: values.zipCode,
        state: values.state,
        country: values.country,
        subAccountLogo: values.subAccountLogo,
        goal: 5000,
        connectAccountId: "",
      });

      await saveActivityLogsNotification({
        agencyId: response.agencyId,
        description: `${userName} | updated sub account | ${response.name}`,
        subAccountId: response.id,
      });

      toast({
        title: "Subaccount details saved",
        description: "Successfully saved your subaccount details.",
      });

      setClose();
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Oops!",
        description: "Could not save sub account details.",
      });
    }
  }

  /* -------------------- RESET ON EDIT -------------------- */
  useEffect(() => {
    if (details) {
      form.reset({
        name: details.name ?? "",
        companyEmail: details.companyEmail ?? "",
        companyPhone: details.companyPhone ?? "",
        address: details.address ?? "",
        city: details.city ?? "",
        zipCode: details.zipCode ?? "",
        state: details.state ?? "",
        country: details.country ?? "",
        subAccountLogo: details.subAccountLogo ?? "",
      });
    }
  }, [details, form]);

  const isLoading = form.formState.isSubmitting;

  /* -------------------- UI -------------------- */
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sub Account Information</CardTitle>
        <CardDescription>Please enter business details</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* LOGO */}
            <FormField
              control={form.control}
              name="subAccountLogo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Logo</FormLabel>
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

            {/* NAME + EMAIL */}
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel htmlFor="name">Account Name</FormLabel>
                    <FormControl>
                      <Input id="name" placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyEmail"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel htmlFor="companyEmail">
                      Account Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="companyEmail"
                        placeholder="Email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* PHONE */}
            <FormField
              control={form.control}
              name="companyPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="companyPhone">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="companyPhone"
                      placeholder="Phone"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ADDRESS */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="address">Address</FormLabel>
                  <FormControl>
                    <Input id="address" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* CITY / STATE / ZIP */}
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel htmlFor="city">City</FormLabel>
                    <FormControl>
                      <Input id="city" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel htmlFor="state">State</FormLabel>
                    <FormControl>
                      <Input id="state" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel htmlFor="zipCode">Zipcode</FormLabel>
                    <FormControl>
                      <Input id="zipCode" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* COUNTRY */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="country">Country</FormLabel>
                  <FormControl>
                    <Input id="country" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loading /> : "Save Account Information"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SubAccountDetails;
