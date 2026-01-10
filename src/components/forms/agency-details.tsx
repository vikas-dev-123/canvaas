"use client";

import { Agency } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { v4 } from "uuid";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import FileUpload from "../global/file-upload";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { NumberInput } from "@tremor/react";

import {
  deleteAgency,
  initUser,
  saveActivityLogsNotification,
  updateAgencyDetails,
  upsertAgency,
} from "@/lib/queries";

import { Button } from "../ui/button";
import Loading from "../global/loading";

type Props = {
  data?: Partial<Agency>;
};

const FormSchema = z.object({
  name: z.string().min(2, "Agency name must be at least 2 characters"),
  companyEmail: z.string().min(1),
  companyPhone: z.string().min(1),
  whiteLabel: z.boolean(),
  address: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  agencyLogo: z.string().min(1),
});

const AgencyDetails = ({ data }: Props) => {
  const { toast } = useToast();
  const router = useRouter();
  const [deletingAgency, setDeletingAgency] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: data?.name ?? "",
      companyEmail: data?.companyEmail ?? "",
      companyPhone: data?.companyPhone ?? "",
      whiteLabel: data?.whiteLabel ?? false,
      address: data?.address ?? "",
      city: data?.city ?? "",
      zipCode: data?.zipCode ?? "",
      state: data?.state ?? "",
      country: data?.country ?? "",
      agencyLogo: data?.agencyLogo ?? "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  // ✅ SAFE reset (no undefined values)
  useEffect(() => {
    if (!data) return;
    form.reset({
      name: data.name ?? "",
      companyEmail: data.companyEmail ?? "",
      companyPhone: data.companyPhone ?? "",
      whiteLabel: data.whiteLabel ?? false,
      address: data.address ?? "",
      city: data.city ?? "",
      zipCode: data.zipCode ?? "",
      state: data.state ?? "",
      country: data.country ?? "",
      agencyLogo: data.agencyLogo ?? "",
    });
  }, [data, form]);

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      let customerId = data?.customerId;
      let agencyId = data?.id ?? v4();

      if (!data?.id) {
        const res = await fetch("/api/stripe/create-customer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.companyEmail,
            name: values.name,
            shipping: {
              name: values.name,
              address: {
                city: values.city,
                country: values.country,
                line1: values.address,
                postal_code: values.zipCode,
                state: values.state,
              },
            },
            address: {
              city: values.city,
              country: values.country,
              line1: values.address,
              postal_code: values.zipCode,
              state: values.state,
            },
          }),
        });

        const dataRes = await res.json();
        customerId = dataRes.customerId;

        await initUser({ role: "AGENCY_OWNER" });
      }

      await upsertAgency({
        id: agencyId,
        customerId: customerId ?? "",
        name: values.name,
        companyEmail: values.companyEmail,
        companyPhone: values.companyPhone,
        address: values.address,
        city: values.city,
        state: values.state,
        zipCode: values.zipCode,
        country: values.country,
        agencyLogo: values.agencyLogo,
        whiteLabel: values.whiteLabel,
        connectAccountId: "",
        goal: data?.goal ?? 5,
        createdAt: data?.createdAt ?? new Date(),
        updatedAt: new Date(),
      });

      toast({ title: "Agency saved successfully" });
      // ✅ Redirect directly to agency page with ID (bypass the /agency page)
      router.push(`/agency/${agencyId}`);
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save agency",
      });
    }
  };

  const handleDeleteAgency = async () => {
    if (!data?.id) return;
    setDeletingAgency(true);
    try {
      await deleteAgency(data.id);
      toast({ title: "Agency deleted" });
      router.refresh();
    } catch {
      toast({
        variant: "destructive",
        title: "Delete failed",
      });
    }
    setDeletingAgency(false);
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Agency Information</CardTitle>
          <CardDescription>
            Create or update your agency details
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              {/* Agency Logo */}
              <FormField
                control={form.control}
                name="agencyLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="agencyLogo">Agency Logo</FormLabel>
                    <FormControl>
                      <FileUpload
                        id="agencyLogo"
                        apiEndpoint="agencyLogo"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Agency Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Agency Name</FormLabel>
                    <FormControl>
                      <Input id="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="companyEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="companyEmail">Email</FormLabel>
                    <FormControl>
                      <Input id="companyEmail" {...field} readOnly />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="companyPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="companyPhone">Phone</FormLabel>
                    <FormControl>
                      <Input id="companyPhone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Whitelabel */}
              <FormField
                control={form.control}
                name="whiteLabel"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between border p-4 rounded-lg">
                    <div>
                      <FormLabel htmlFor="whiteLabel">
                        Whitelabel Agency
                      </FormLabel>
                      <FormDescription>
                        Show agency branding on sub-accounts
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        id="whiteLabel"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Address */}
              {["address", "city", "state", "zipCode", "country"].map((fieldName) => (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={fieldName as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={fieldName}>
                        {fieldName}
                      </FormLabel>
                      <FormControl>
                        <Input id={fieldName} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              {/* Goal */}
              {data?.id && (
                <NumberInput
                  defaultValue={data.goal}
                  min={1}
                  onValueChange={async (val) => {
                    if (!data.id) return;
                    await updateAgencyDetails(data.id, { goal: val });
                    await saveActivityLogsNotification({
                      agencyId: data.id,
                      description: `Updated agency goal to ${val}`,
                    });
                    router.refresh();
                  }}
                />
              )}

              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loading /> : "Save Agency"}
              </Button>
            </form>
          </Form>

          {data?.id && (
            <AlertDialogTrigger className="text-red-600 mt-4">
              Delete Agency
            </AlertDialogTrigger>
          )}

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive"
                onClick={handleDeleteAgency}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default AgencyDetails;