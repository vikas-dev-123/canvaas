"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Loading from "../global/loading";
import { useModal } from "@/providers/modal-provider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { saveActivityLogsNotification, upsertContact } from "@/lib/queries";
import { toast } from "../ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface ContactUserFormProps {
  subaccountId: string;
}

const ContactUserFormSchema = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email(),
});

const ContactUserForm: React.FC<ContactUserFormProps> = ({
  subaccountId,
}) => {
  const { setClose, data } = useModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof ContactUserFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(ContactUserFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (data.contact) {
      form.reset(data.contact);
    }
  }, [data, form.reset]);

  const isLoading = form.formState.isLoading;

  const handleSubmit = async (
    values: z.infer<typeof ContactUserFormSchema>
  ) => {
    try {
      const response = await upsertContact({
        email: values.email,
        subAccountId: subaccountId,
        name: values.name,
      });

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated a contact | ${response?.name}`,
        subAccountId: subaccountId,
      });

      toast({
        title: "Success",
        description: "Contact saved successfully",
      });
      setClose();
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Oops!",
        description: "Could not save contact details",
      });
    }
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
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-semibold">
          Contact Information
        </CardTitle>
        <CardDescription className="text-sm text-neutral-500">
          Create or update a contact. Contacts can later be linked to
          tickets and revenue.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      className="
                        h-11
                        rounded-lg
                        border-neutral-300 dark:border-neutral-700
                      "
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={isLoading}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      className="
                        h-11
                        rounded-lg
                        border-neutral-300 dark:border-neutral-700
                      "
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="
                mt-6
                h-11
                w-full
                rounded-lg
                font-medium
              "
              disabled={isLoading}
              type="submit"
            >
              {form.formState.isSubmitting ? (
                <Loading />
              ) : (
                "Save Contact"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContactUserForm;
