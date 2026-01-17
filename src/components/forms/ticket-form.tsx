"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { IContact } from "@/models/Contact";
import { ITag } from "@/models/Tag";
import { IUser } from "@/models/User";
import { CheckIcon, ChevronsUpDownIcon, User2 } from "lucide-react";
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
import { useToast } from "../ui/use-toast";
import TagCreator from "../global/tag-creator";

/* -------------------- TYPES -------------------- */
type Props = {
  laneId: string;
  subaccountId: string;
  getNewTicket: (ticket: TicketWithTags[0]) => void;
};

const currencyNumberRegex = /^\d+(\.\d{1,2})?$/;

/* -------------------- ZOD SCHEMA -------------------- */
const TicketFormSchema = z.object({
  name: z.string().min(1, "Ticket name is required"),
  description: z.string().optional(),
  value: z.string().refine((value) => currencyNumberRegex.test(value), {
    message: "Value must be a valid price.",
  }),
});

/* -------------------- COMPONENT -------------------- */
const TicketForm = ({ getNewTicket, laneId, subaccountId }: Props) => {
  const { data: defaultData, setClose } = useModal();
  const router = useRouter();
  const { toast } = useToast();

  const [tags, setTags] = useState<ITag[]>([]);
  const [contact, setContact] = useState("");
  const [search, setSearch] = useState("");
  const [contactList, setContactList] = useState<IContact[]>([]);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const [allTeamMembers, setAllTeamMembers] = useState<IUser[]>([]);
  const [assignedTo, setAssignedTo] = useState(
    defaultData.ticket?.Assigned?.id || ""
  );

  const form = useForm<z.infer<typeof TicketFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(TicketFormSchema),
    defaultValues: {
      name: defaultData.ticket?.name ?? "",
      description: defaultData.ticket?.description ?? "",
      value: String(defaultData.ticket?.value ?? 0),
    },
  });

  // ✅ correct loading flag
  const isLoading = form.formState.isSubmitting;

  /* -------------------- FETCH TEAM MEMBERS -------------------- */
  useEffect(() => {
    if (!subaccountId) return;

    const fetchData = async () => {
      const response = await getSubAccountTeamMembers(subaccountId);
      if (response) setAllTeamMembers(response);
    };

    fetchData();
  }, [subaccountId]);

  /* -------------------- RESET ON EDIT -------------------- */
  useEffect(() => {
    if (!defaultData.ticket) return;

    form.reset({
      name: defaultData.ticket.name ?? "",
      description: defaultData.ticket.description ?? "",
      value: String(defaultData.ticket.value ?? 0),
    });

    if (defaultData.ticket.customerId) {
      setContact(defaultData.ticket.customerId);
    }

    const fetchData = async () => {
      const response = await searchContacts(
        // @ts-ignore
        defaultData.ticket?.Customer?.name
      );
      setContactList(response);
    };

    fetchData();
  }, [defaultData, form]);

  /* -------------------- SUBMIT -------------------- */
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
        description: `Updated a ticket | ${response?.name}`,
        subAccountId: subaccountId,
      });

      toast({
        title: "Success",
        description: "Saved ticket details",
      });

      if (response) getNewTicket(response);
      router.refresh();
      setClose();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description: "Could not save ticket details",
      });
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ticket Details</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* NAME */}
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="ticketName">Ticket Name</FormLabel>
                  <FormControl>
                    <Input id="ticketName" {...field} />
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
                  <FormLabel htmlFor="ticketDescription">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea id="ticketDescription" {...field} />
                  </FormControl>
                  <FormMessage />
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
                  <FormLabel htmlFor="ticketValue">
                    Ticket Value
                  </FormLabel>
                  <FormControl>
                    <Input id="ticketValue" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <h3>Add tags</h3>
            <TagCreator
              subAccountId={subaccountId}
              getSelectedTags={setTags}
              defaultTags={defaultData.ticket?.Tags || []}
            />

            {/* ASSIGNED USER */}
            <FormLabel>Assigned To Team Member</FormLabel>
            <Select onValueChange={setAssignedTo} defaultValue={assignedTo}>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary text-sm text-white">
                          <User2 size={14} />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        Not Assigned
                      </span>
                    </div>
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {allTeamMembers.map((teamMember) => (
                  <SelectItem key={teamMember.id} value={teamMember.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={teamMember.avatarUrl} />
                        <AvatarFallback className="bg-primary text-sm text-white">
                          <User2 size={14} />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        {teamMember.name}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* CUSTOMER */}
            <FormLabel>Customer</FormLabel>
            <Popover>
              <PopoverTrigger asChild className="w-full">
                <Button
                  variant="outline"
                  role="combobox"
                  className="justify-between"
                >
                  {contact
                    ? contactList.find((c) => c.id === contact)?.name
                    : "Select Customer..."}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search..."
                    value={search}
                    onChangeCapture={async (e) => {
                      // @ts-ignore
                      const value = e.target.value;
                      setSearch(value);

                      if (saveTimerRef.current)
                        clearTimeout(saveTimerRef.current);

                      saveTimerRef.current = setTimeout(async () => {
                        const response = await searchContacts(value);
                        setContactList(response);
                        setSearch("");
                      }, 1000);
                    }}
                  />
                  <CommandList>
                    <CommandEmpty>No Customer found.</CommandEmpty>
                    <CommandGroup>
                      {contactList.map((c) => (
                        <CommandItem
                          key={c.id}
                          value={c.id}
                          onSelect={(currentValue) => {
                            setContact(
                              currentValue === contact ? "" : currentValue
                            );
                          }}
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

            <Button
              className="w-20 mt-4"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? <Loading /> : "Save"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TicketForm;
