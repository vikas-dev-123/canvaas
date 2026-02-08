"use client";
import { Agency, Role } from "@prisma/client";
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
  name: z.string().min(2),
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

  useEffect(() => {
    if (data) form.reset(data);
  }, [data, form]);

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      let customerId: string = "";

      if (!data?.id) {
        // Initialize the user first
        const bodyData = {
          email: form.getValues().companyEmail,
          name: form.getValues().name,
          role: Role.AGENCY_OWNER, // Set proper role for agency owner
        };
        
        try {
          const newUserData = await initUser(bodyData);
          if (!newUserData) {
            throw new Error("Failed to initialize user");
          }
          
          // Note: CustomerId in Agency model is likely a Stripe customer ID
          // which will be created during subscription process
          customerId = ""; // Default to empty string for new agencies
        } catch (error) {
          console.error("Error initializing user:", error);
          throw error;
        }
      } else if (data) {
        // For existing agency, preserve the current customerId
        customerId = data.customerId || "";
      }

      const response = await upsertAgency({
        id: data?.id || v4(),
        customerId: customerId || "",
        connectAccountId: "",
        goal: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...values,
      });

      if (response) {
        await saveActivityLogsNotification({
          agencyId: response.id,
          description: `Updated agency information | ${response.name}`,
          subAccountId: undefined,
        });
      } else {
        throw new Error("Failed to create or update agency");
      }

      toast({
        title: "Agency Updated",
        description: "Successfully saved agency information.",
      });

      router.refresh();
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "Could not save agency information",
      });
    }
  };

  const handleDeleteAgency = async () => {
    if (!data?.id) return;
    try {
      setDeletingAgency(true);
      await deleteAgency(data.id);
      toast({
        title: "Agency Deleted",
        description: "Successfully deleted agency.",
      });
      router.push("/");
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "Could not delete agency",
      });
    }
    setDeletingAgency(false);
  };

  return (
    <AlertDialog>
      <Card
        className="
          w-full rounded-2xl border
          bg-white dark:bg-[#101010]
          border-neutral-200 dark:border-neutral-800
          shadow-[0_32px_64px_-20px_rgba(0,0,0,0.65)]
        "
      >
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-black dark:text-white">
            Agency_Information
          </CardTitle>
          <CardDescription className="text-neutral-600 dark:text-neutral-400">
            Configure your agency identity and operational parameters.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              {/* LOGO */}
              <FormField
                disabled={isLoading}
                control={form.control}
                name="agencyLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-700 dark:text-neutral-300">
                      Agency_Logo
                    </FormLabel>
                    <FormControl>
                      <FileUpload
                        apiEndpoint="agencyLogo"
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
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
                      <FormLabel>Agency_Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700"
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          readOnly
                          className="bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700"
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
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* WHITE LABEL */}
              <FormField
                disabled={isLoading}
                control={form.control}
                name="whiteLabel"
                render={({ field }) => (
                  <FormItem
                    className="
                      flex items-center justify-between gap-4
                      rounded-xl border p-4
                      bg-neutral-50 dark:bg-neutral-900
                      border-neutral-200 dark:border-neutral-800
                    "
                  >
                    <div>
                      <FormLabel>Whitelabel_Mode</FormLabel>
                      <FormDescription className="text-neutral-600 dark:text-neutral-400">
                        Show agency branding across all sub-accounts.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
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
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700"
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
                        <FormLabel>{key.toUpperCase()}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700"
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
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700"
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
                  w-full py-6
                  bg-black text-white
                  dark:bg-white dark:text-black
                  hover:opacity-90
                "
              >
                {isLoading ? <Loading /> : "Save_Agency_Information"}
              </Button>
            </form>
          </Form>

          {/* DANGER ZONE */}
          {data?.id && (
            <div
              className="
                mt-6 rounded-xl border p-4
                border-red-500/40
                bg-red-50 dark:bg-red-950/30
              "
            >
              <div className="text-red-600 dark:text-red-400 font-semibold">
                Danger_Zone
              </div>
              <p className="text-sm text-red-500 mt-1">
                Deleting your agency is irreversible and removes all sub-accounts.
              </p>

              <AlertDialogTrigger
                className="
                  mt-3 w-full text-center
                  rounded-md border border-red-600
                  text-red-600 py-2
                  hover:bg-red-600 hover:text-white
                "
              >
                Delete_Agency
              </AlertDialogTrigger>
            </div>
          )}

          {/* CONFIRM */}
          <AlertDialogContent className="bg-white dark:bg-[#101010] border-neutral-200 dark:border-neutral-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-black dark:text-white">
                Confirm_Deletion
              </AlertDialogTitle>
              <AlertDialogDescription className="text-neutral-600 dark:text-neutral-400">
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDeleteAgency}
              >
                {deletingAgency ? <Loading /> : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default AgencyDetails;
