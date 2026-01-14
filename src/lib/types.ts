import { _getTicketsWithAllRelations, getAuthUserDetails, getFunnels, getMedia, getPipelineDetails, getTicketsWithTags, getUserPermissions } from "./queries";
import Stripe from "stripe";
import { z } from "zod";

// Import types from our MongoDB models
import { IContact } from "../models/Contact";
import { ILane } from "../models/Lane";
import { INotification } from "../models/Notification";
import { Role } from "./enums";
import { ITag } from "../models/Tag";
import { ITicket } from "../models/Ticket";
import { IUser } from "../models/User";

export type NotificationWithUser =
    | ({
          User: {
              id: string;
              name: string;
              avatarUrl: string;
              email: string;
              createdAt: Date;
              updatedAt: Date;
              role: Role;
              agencyId: string | null;
          };
      } & Notification)[]
    | undefined;

// Placeholder type definition for the function that was removed
// This function previously used Prisma directly, now we use the service layer
// const __getUsersWithAgencySubAccountPermissionsSidebarOptions = async (agencyId: string) => {
//     // This would need to be reimplemented with service calls
// };

// Create a placeholder function that mimics the old behavior
const __getUsersWithAgencySubAccountPermissionsSidebarOptions = async (agencyId: string) => {
    // This would need to be implemented with service calls
    return null;
};

export type UserWithPermissionsAndSubAccounts = Awaited<ReturnType<typeof getUserPermissions>>;

export type AuthUSerWithAgencySigebarOptionsSubAccounts = Awaited<ReturnType<typeof getAuthUserDetails>>;

// Extended Agency interface that includes the properties added dynamically by getAuthUserDetails
import { IAgency } from "../models/Agency";
import { ISubAccount } from "../models/SubAccount";
import { IAgencySidebarOption } from "../models/AgencySidebarOption";
import { ISubAccountSidebarOption } from "../models/SubAccountSidebarOption";

// Extended SubAccount interface that includes the properties added dynamically by getAuthUserDetails
export interface IExtendedSubAccount extends ISubAccount {
  SidebarOption?: ISubAccountSidebarOption[];
}

export interface IExtendedAgency extends IAgency {
  SubAccount?: IExtendedSubAccount[];
  SidebarOption?: IAgencySidebarOption[];
}

export interface UsersWithAgencySubAccountPermissionsSidebarOptions extends IUser {
  Agency: IExtendedAgency | null;
  Permissions: (import("../models/Permissions").IPermissions & { SubAccount: import("../models/SubAccount").ISubAccount | null })[];
}

export type GetMediaFiles = Awaited<ReturnType<typeof getMedia>>;

export type CreateMediaType = {
    link: string;
    name: string;
};

export type CreatePipeLineType = {
    id?: string;
    name: string;
    subAccountId: string;
};

export type TicketAndTags = ITicket & {
    Tags: ITag[];
    Assigned: IUser | null;
    Customer: IContact | null;
};

export type LaneDetails = ILane & {
    Tickets: TicketAndTags[];
};

export type PipelineDetailsWithLanesCardsTagsTickets = Awaited<ReturnType<typeof getPipelineDetails>>;

export type TicketWithTags = Awaited<ReturnType<typeof getTicketsWithTags>>;

export type TicketDetails = Awaited<ReturnType<typeof _getTicketsWithAllRelations>>;

export type PricesList = Stripe.ApiList<Stripe.Price>;

export type FunnelsForSubAccount = Awaited<ReturnType<typeof getFunnels>>[0];

export const CreateFunnelFormSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
    subDomainName: z.string().optional(),
    favicon: z.string().optional(),
});

export const FunnelPageSchema = z.object({
    name: z.string().min(1),
    pathName: z.string().optional(),
});

export type UpsertFunnelPage = {
    id?: string;
    name: string;
    pathName?: string;
    content?: string;
    order: number;
    funnelId: string;
    previewImage?: string;
    visits?: number;
};

export const ContactUserFormSchema = z.object({
    name: z.string().min(1, "Required"),
    email: z.string().email(),
});