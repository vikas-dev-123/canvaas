import React from "react";
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
import { Button } from "../ui/button";
import { ContactUserFormSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Loading from "../global/loading";

type Props = {
  title: string;
  subTitle: string;
  apiCall: (values: z.infer<typeof ContactUserFormSchema>) => any;
};

const ContactForm = ({ title, subTitle, apiCall }: Props) => {
  const form = useForm<z.infer<typeof ContactUserFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(ContactUserFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const isLoading = form.formState.isLoading;

  return (
    <Card
      className="
        w-full max-w-[520px]
        rounded-2xl
        border border-neutral-200 dark:border-neutral-800
        bg-white dark:bg-[#0f0f0f]
        shadow-sm
      "
    >
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl font-semibold text-black dark:text-white">
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-neutral-500">
          {subTitle}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(apiCall)}
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
                        h-11 rounded-lg
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
                        h-11 rounded-lg
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
                "Get a Free Quote"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
