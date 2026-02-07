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
        title: "Success",
        description: "Invitation sent successfully",
      });

      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not send invitation",
      });
    }
  };

  return (
    <Card
      className="
        border border-neutral-200 dark:border-neutral-800
        bg-white dark:bg-[#101010]
        shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]
        rounded-2xl
      "
    >
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-semibold text-black dark:text-white">
          Invite_User
        </CardTitle>
        <CardDescription className="text-sm text-neutral-500">
          Send an invitation to add a new team member to this agency.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            {/* EMAIL */}
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-600 dark:text-neutral-400">
                    Email_Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="user@email.com"
                      className="
                        bg-white dark:bg-neutral-900
                        border-neutral-300 dark:border-neutral-700
                        focus:border-black dark:focus:border-white
                      "
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
                  <FormLabel className="text-neutral-600 dark:text-neutral-400">
                    Access_Role
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className="
                          bg-white dark:bg-neutral-900
                          border-neutral-300 dark:border-neutral-700
                        "
                      >
                        <SelectValue placeholder="Select role..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      className="
                        bg-white dark:bg-[#101010]
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

            {/* SUBMIT */}
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="
                w-full rounded-xl
                bg-black text-white
                dark:bg-white dark:text-black
                hover:opacity-90
              "
            >
              {form.formState.isSubmitting ? (
                <Loading />
              ) : (
                "Send_Invitation"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SendInvitation;
