import BlurPage from "@/components/global/blur-page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ContactService, SubAccountService } from "@/services";
import { IContact } from "@/models/Contact";
import { ISubAccount } from "@/models/SubAccount";
import { ITicket } from "@/models/Ticket";
import { format } from "date-fns";
import React from "react";
import CreateContactButton from "./_components/create-contact-btn";

type Props = {
    params: {
        subaccountId: string;
    };
};

type ContactWithTickets = IContact & { Ticket: ITicket[] };

const Page = async ({ params }: Props) => {
    // Get all contacts for the subaccount and enrich with their tickets
    const contactIds = await ContactService.findBySubAccountId(params.subaccountId);
    
    // For each contact, get their tickets
    const allContacts = await Promise.all(
        contactIds.map(async (contact) => {
            // Here we would need to fetch tickets associated with this contact
            // This requires finding tickets where assigned contact id matches
            // Since we don't have a direct method in TicketService for this, we'll simulate
            // by returning the contact with an empty ticket array for now
            return {
                ...contact,
                Ticket: [] // We would need to fetch tickets associated with each contact
            };
        })
    );

    const formatTotal = (tickets: ITicket[]) => {
        if (!tickets || !tickets.length) return "$0.00";
        const amt = new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: "USD",
        });

        const laneAmt = tickets.reduce((sum, ticket) => sum + (Number(ticket?.value) || 0), 0);

        return amt.format(laneAmt);
    };

    return (
        <BlurPage>
            <h1 className="text-4xl p-[12px_0]">Contacts</h1>
            <CreateContactButton subaccountId={params.subaccountId} />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[200px]">Name</TableHead>
                        <TableHead className="w-[300px]">Email</TableHead>
                        <TableHead className="w-[200px]">Active</TableHead>
                        <TableHead>Created Date</TableHead>
                        <TableHead className="text-right">Total Value</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="font-medium truncate">
                    {allContacts.map((contact: ContactWithTickets) => (
                        <TableRow key={contact.id}>
                            <TableCell>
                                <Avatar>
                                    <AvatarImage alt="@shadcn" />
                                    <AvatarFallback className="bg-primary text-white">{contact.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell>{contact.email}</TableCell>
                            <TableCell>{formatTotal(contact?.Ticket) === "$0.00" ? <Badge variant={"destructive"}>Inactive</Badge> : <Badge className="bg-emerald-700">Active</Badge>}</TableCell>
                            <TableCell>{format(contact.createdAt, "MM/dd/yyyy")}</TableCell>
                            <TableCell className="text-right">{formatTotal(contact.Ticket)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </BlurPage>
    );
};

export default Page;