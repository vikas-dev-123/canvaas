"use client";
import { saveActivityLogsNotification, sendInvitation } from "@/lib/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Loading from "../global/loading";
import { Button } from "../ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../ui/use-toast";

interface SendInvitationProps {
  agencyId: string;
}

const SendInvitation: React.FC<SendInvitationProps> = ({ agencyId }) => {
  const { toast } = useToast();

  const userDataSchema = z.object({
    email: z.string().email(),
    role: z.enum([
      "AGENCY_ADMIN",
      "SUBACCOUNT_USER",
      "SUBACCOUNT_GUEST",
    ]),
  });

  const form = useForm<z.infer<typeof userDataSchema>>({
    resolver: zodResolver(userDataSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      role: "SUBACCOUNT_USER",
    },
  });

  const onSubmit = async (values: z.infer<typeof userDataSchema>) => {
    try {
      const response = await sendInvitation(
        values.role,
        values.email,
        agencyId
      );

      await saveActivityLogsNotification({
        agencyId,
        description: `Invitation ${response.email}`,
        subAccountId: undefined,
      });

      toast({
        title: "Invitation sent",
        description: "The user will receive an email shortly.",
      });

      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Could not send invitation",
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
      "
    >
      {/* HEADER */}
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-lg font-semibold text-black dark:text-white">
          Invite Team Member
        </CardTitle>
        <CardDescription className="text-sm text-neutral-500">
          Send an invitation to add someone to your agency.
        </CardDescription>
      </CardHeader>

      {/* CONTENT */}
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* EMAIL */}
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="user@company.com"
                      className="h-11 rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ROLE */}
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Access role</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-lg">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      className="
                        bg-white dark:bg-[#0f0f0f]
                        border-neutral-200 dark:border-neutral-800
                      "
                    >
                      <SelectItem value="AGENCY_ADMIN">
                        Agency Admin
                      </SelectItem>
                      <SelectItem value="SUBACCOUNT_USER">
                        Sub Account User
                      </SelectItem>
                      <SelectItem value="SUBACCOUNT_GUEST">
                        Sub Account Guest
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ACTION */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="
                  w-full h-11 rounded-xl
                  bg-black text-white
                  dark:bg-white dark:text-black
                  hover:opacity-90
                "
              >
                {form.formState.isSubmitting ? (
                  <Loading />
                ) : (
                  "Send Invitation"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SendInvitation;
