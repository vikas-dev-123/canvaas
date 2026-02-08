"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getSubAccountTeamMembers,
  saveActivityLogsNotification,
  searchContacts,
  upsertTicket,
} from "@/lib/queries";
import { TicketWithTags } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useModal } from "@/providers/modal-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contact, Tag, User } from "@prisma/client";
import {
  CheckIcon,
  ChevronsUpDownIcon,
  User2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Loading from "../global/loading";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";
import TagCreator from "../global/tag-creator";

type Props = {
  laneId: string;
  subaccountId: string;
  getNewTicket: (ticket: TicketWithTags[0]) => void;
};

const currencyNumberRegex = /^\d+(\.\d{1,2})?$/;

const TicketFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  value: z.string().refine((value) => currencyNumberRegex.test(value), {
    message: "Enter a valid amount",
  }),
});

const TicketForm = ({ getNewTicket, laneId, subaccountId }: Props) => {
  const { data: defaultData, setClose } = useModal();
  const router = useRouter();

  const [tags, setTags] = useState<Tag[]>([]);
  const [contact, setContact] = useState("");
  const [search, setSearch] = useState("");
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [allTeamMembers, setAllTeamMembers] = useState<User[]>([]);
  const [assignedTo, setAssignedTo] = useState(
    defaultData.ticket?.Assigned?.id || ""
  );

  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const form = useForm<z.infer<typeof TicketFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(TicketFormSchema),
    defaultValues: {
      name: defaultData.ticket?.name || "",
      description: defaultData.ticket?.description || "",
      value: String(defaultData.ticket?.value || 0),
    },
  });

  const isLoading = form.formState.isSubmitting;

  /* TEAM MEMBERS */
  useEffect(() => {
    if (!subaccountId) return;
    getSubAccountTeamMembers(subaccountId).then(setAllTeamMembers);
  }, [subaccountId]);

  /* EDIT MODE */
  useEffect(() => {
    if (!defaultData.ticket) return;

    form.reset({
      name: defaultData.ticket.name,
      description: defaultData.ticket.description || "",
      value: String(defaultData.ticket.value || 0),
    });

    if (defaultData.ticket.customerId)
      setContact(defaultData.ticket.customerId);

    searchContacts(defaultData.ticket.Customer?.name || "").then(
      setContactList
    );
  }, [defaultData, form]);

  const onSubmit = async (values: z.infer<typeof TicketFormSchema>) => {
    if (!laneId) return;

    try {
      const response = await upsertTicket(
        {
          ...values,
          laneId,
          id: defaultData.ticket?.id,
          assignedUserId: assignedTo,
          ...(contact ? { customerId: contact } : {}),
        },
        tags
      );

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated ticket • ${response?.name}`,
        subAccountId: subaccountId,
      });

      toast({
        title: "Ticket saved",
        description: "Your changes were saved successfully.",
      });

      if (response) getNewTicket(response);
      router.refresh();
      setClose();
    } catch {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "Unable to save ticket details.",
      });
    }
  };

  return (
    <Card
      className="
        w-full rounded-2xl
        bg-white dark:bg-[#0f0f0f]
        border border-neutral-200 dark:border-neutral-800
      "
    >
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Ticket Details
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* NAME */}
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket name</FormLabel>
                  <FormControl>
                    <Input placeholder="New ticket" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DESCRIPTION */}
            <FormField
              disabled={isLoading}
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the ticket…"
                      className="min-h-[90px]"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* VALUE */}
            <FormField
              disabled={isLoading}
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket value</FormLabel>
                  <FormControl>
                    <Input placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TAGS */}
            <div>
              <FormLabel>Tags</FormLabel>
              <TagCreator
                subAccountId={subaccountId}
                getSelectedTags={setTags}
                defaultTags={
                  defaultData.ticket?.TicketTags?.map((t) => t.Tag) || []
                }
              />
            </div>

            {/* ASSIGN */}
            <div>
              <FormLabel>Assigned to</FormLabel>
              <Select onValueChange={setAssignedTo} defaultValue={assignedTo}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-neutral-200 dark:bg-neutral-800">
                            <User2 size={14} />
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-neutral-500">
                          Not assigned
                        </span>
                      </div>
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {allTeamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={member.avatarUrl} />
                          <AvatarFallback>
                            <User2 size={14} />
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{member.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* CUSTOMER */}
            <div>
              <FormLabel>Customer</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                  >
                    {contact
                      ? contactList.find((c) => c.id === contact)?.name
                      : "Select customer"}
                    <ChevronsUpDownIcon className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[380px]">
                  <Command>
                    <CommandInput
                      placeholder="Search customers…"
                      onChangeCapture={(e) => {
                        const value = (e.target as HTMLInputElement).value;
                        setSearch(value);
                        if (saveTimerRef.current)
                          clearTimeout(saveTimerRef.current);
                        saveTimerRef.current = setTimeout(async () => {
                          setContactList(await searchContacts(value));
                        }, 600);
                      }}
                    />
                    <CommandList>
                      <CommandEmpty>No customers found</CommandEmpty>
                      <CommandGroup>
                        {contactList.map((c) => (
                          <CommandItem
                            key={c.id}
                            value={c.id}
                            onSelect={() =>
                              setContact(contact === c.id ? "" : c.id)
                            }
                          >
                            {c.name}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                contact === c.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

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
              {isLoading ? <Loading /> : "Save ticket"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TicketForm;
