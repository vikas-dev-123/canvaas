import BlurPage from "@/components/global/blur-page";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getContact } from "@/lib/queries";
import { Contact, SubAccount, Ticket } from "@prisma/client";
import { format } from "date-fns";
import React from "react";
import CreateContactButton from "./_components/create-contact-btn";

type Props = {
  params: {
    subaccountId: string;
  };
};

type SubAccountWithContacts = SubAccount & {
  Contact: (Contact & { Ticket: Ticket[] })[];
};

const Page = async ({ params }: Props) => {
  const contacts = (await getContact(
    params.subaccountId
  )) as SubAccountWithContacts;

  const allContacts = contacts.Contact;

  const formatTotal = (tickets: Ticket[]) => {
    if (!tickets || !tickets.length) return "$0.00";
    const amt = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
    });

    const laneAmt = tickets.reduce(
      (sum, ticket) => sum + (Number(ticket?.value) || 0),
      0
    );

    return amt.format(laneAmt);
  };

  return (
    <BlurPage>
      {/* HEADER */}
      <div className="flex items-center justify-between py-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">
            Contacts
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage customers & leads for this sub-account
          </p>
        </div>

        <CreateContactButton subaccountId={params.subaccountId} />
      </div>

      {/* TABLE CARD */}
      <div
        className="
          rounded-2xl
          border border-neutral-200 dark:border-neutral-800
          bg-white/80 dark:bg-[#0f0f0f]
          backdrop-blur
          shadow-sm
          overflow-hidden
        "
      >
        <Table>
          <TableHeader className="bg-neutral-100/80 dark:bg-neutral-900">
            <TableRow>
              <TableHead className="w-[80px] text-xs uppercase tracking-wider text-neutral-500">
                User
              </TableHead>
              <TableHead className="w-[300px] text-xs uppercase tracking-wider text-neutral-500">
                Email
              </TableHead>
              <TableHead className="w-[160px] text-xs uppercase tracking-wider text-neutral-500">
                Status
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider text-neutral-500">
                Created
              </TableHead>
              <TableHead className="text-right text-xs uppercase tracking-wider text-neutral-500">
                Total Value
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {allContacts.map((contact) => {
              const total = formatTotal(contact.Ticket);
              const active = total !== "$0.00";

              return (
                <TableRow
                  key={contact.id}
                  className="
                    border-b border-neutral-200 dark:border-neutral-800
                    hover:bg-neutral-50 dark:hover:bg-neutral-900/70
                    transition-all
                  "
                >
                  <TableCell>
                    <Avatar className="h-10 w-10">
                      <AvatarFallback
                        className="
                          bg-neutral-200 text-black
                          dark:bg-neutral-800 dark:text-white
                          font-semibold
                        "
                      >
                        {contact.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>

                  <TableCell className="text-sm font-medium text-black dark:text-white">
                    {contact.email}
                  </TableCell>

                  <TableCell>
                    {active ? (
                      <Badge className="rounded-full bg-emerald-600/90 px-3 py-1 text-white">
                        Active
                      </Badge>
                    ) : (
                      <Badge className="rounded-full bg-red-600/90 px-3 py-1 text-white">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-sm text-neutral-500">
                    {format(contact.createdAt, "MMM dd, yyyy")}
                  </TableCell>

                  <TableCell className="text-right font-semibold text-black dark:text-white">
                    {total}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* EMPTY STATE */}
        {!allContacts.length && (
          <div className="py-20 text-center text-neutral-500">
            No contacts found for this sub-account.
          </div>
        )}
      </div>
    </BlurPage>
  );
};

export default Page;
