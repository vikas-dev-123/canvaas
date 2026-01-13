"use server";

// Import our MongoDB service classes
import { UserService } from '../services/user-service';
import { AgencyService } from '../services/agency-service';
import { SubAccountService } from '../services/sub-account-service';
import { InvitationService } from '../services/invitation-service';
import { NotificationService } from '../services/notification-service';
import { PermissionsService } from '../services/permissions-service';
import { MediaService } from '../services/media-service';
import { PipelineService } from '../services/pipeline-service';
import { LaneService } from '../services/lane-service';
import { TicketService } from '../services/ticket-service';
import { TagService } from '../services/tag-service';
import { ContactService } from '../services/contact-service';
import { FunnelService } from '../services/funnel-service';
import { FunnelPageService } from '../services/funnel-page-service';
import { SubscriptionService } from '../services/subscription-service';
import { AddOnsService } from '../services/addons-service';
import { AgencySidebarOptionService } from '../services/agency-sidebar-option-service';
import { SubAccountSidebarOptionService } from '../services/subaccount-sidebar-option-service';
import { TriggerService } from '../services/trigger-service';
import { AutomationService } from '../services/automation-service';
import { AutomationInstanceService } from '../services/automation-instance-service';
import { ActionService } from '../services/action-service';
import { ClassNameService } from '../services/classname-service';

import type { User as AuthUser } from "@clerk/nextjs/server";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { v4 } from "uuid";
import { revalidatePath } from "next/cache";

import { CreateFunnelFormSchema, CreateMediaType, CreatePipeLineType, UpsertFunnelPage } from "./types";
import { z } from "zod";

type UpsertSubAccountInput = {
  id: string;
  agencyId: string;
  name: string;
  companyEmail?: string;
  companyPhone: string;
  address: string;
  city: string;
  zipCode: string;
  state: string;
  country: string;
  subAccountLogo?: string;
  goal: number;
  connectAccountId?: string;
};

export const getUser = async (id: string) => {
  const user = await UserService.findById(id);
  return user;
};

export const deleteUser = async (userId: string) => {
  try {
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(userId, {
      privateMetadata: {
        role: undefined,
      },
    });
  } catch (error) {
    console.error('Error updating user metadata:', error);
  }
  const result = await UserService.delete(userId);
  return result;
};

export const getAuthUserDetails = async () => {
  const user = await currentUser();

  if (!user) {
    return;
  }

  // Find user by email
  const userData = await UserService.findByEmail(user.emailAddresses[0].emailAddress);
  
  if (!userData) {
    return null;
  }

  // Get agency with related data
  if (userData.agencyId) {
    const agency = await AgencyService.findById(userData.agencyId);
    if (agency) {
      const sidebarOptions = await AgencySidebarOptionService.findByAgencyId(agency._id.toString());
      const subAccounts = await SubAccountService.findByAgencyId(agency._id.toString());
      
      // Add sidebar options to agency
      (agency as any).SidebarOption = sidebarOptions;
      
      // Add subaccounts with their sidebar options
      for (const subAccount of subAccounts) {
        const subAccountSidebarOptions = await SubAccountSidebarOptionService.findBySubAccountId(subAccount._id.toString());
        (subAccount as any).SidebarOption = subAccountSidebarOptions;
      }
      
      (agency as any).SubAccount = subAccounts;
    }
    
    (userData as any).Agency = agency;
  }

  // Get user permissions
  const permissions = await PermissionsService.findByEmail(userData.email);
  (userData as any).Permissions = permissions;

  return userData;
};

export const getUserRoleFromDatabase = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const userData = await UserService.findByEmail(user.emailAddresses[0].emailAddress);
  
  if (!userData) {
    return null;
  }

  return {
    role: userData.role,
    agencyId: userData.agencyId
  };
};

export const saveActivityLogsNotification = async ({ 
  agencyId, 
  description, 
  subAccountId 
}: { 
  agencyId?: string; 
  description?: string; 
  subAccountId?: string 
}) => {
  const authUser = await currentUser();
  let userData;

  if (!authUser) {
    // Find user by subaccount relationship if no auth user
    if (subAccountId) {
      const subAccount = await SubAccountService.findById(subAccountId);
      if (subAccount && subAccount.agencyId) {
        const users = await UserService.findByAgencyId(subAccount.agencyId);
        if (users.length > 0) {
          userData = users[0]; // Get first user associated with the agency
        }
      }
    }
  } else {
    userData = await UserService.findByEmail(authUser?.emailAddresses[0].emailAddress);
  }

  if (!userData) {
    console.log("Could not find a user");
    return;
  }

  let foundAgencyId = agencyId;
  if (!foundAgencyId) {
    if (!subAccountId) {
      throw new Error("You need to provide at least an agency Id or subAccount id");
    }

    const response = await SubAccountService.findById(subAccountId);
    if (response) foundAgencyId = response.agencyId;
  }

  if (subAccountId) {
    await NotificationService.create({
      notification: `${userData.name} | ${description}`,
      agencyId: foundAgencyId as string,
      subAccountId: subAccountId,
      userId: userData._id.toString()
    } as any);
  } else {
    await NotificationService.create({
      notification: `${userData.name} | ${description}`,
      agencyId: foundAgencyId as string,
      userId: userData._id.toString()
    } as any);
  }
};

export const updateUser = async (user: Partial<any>) => {
  // First find the user by email to get their ID
  const existingUser = await UserService.findByEmail(user.email);
  if (!existingUser) {
    throw new Error("User not found");
  }
  
  // Update the user with the provided data
  const response = await UserService.update(existingUser._id.toString(), user);
  
  if (!response) {
    throw new Error("Failed to update user");
  }
  
  try {
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(response._id.toString(), {
      publicMetadata: {
        role: user.role || "SUBACCOUNT_USER",
      },
    });
  } catch (error) {
    console.error('Error updating user metadata:', error);
  }

  return response;
};

export const changeUserPermission = async (permissionId: string, userEmail: string, subAccountId: string, permission: boolean) => {
  try {
    const response = await PermissionsService.upsert({
      email: userEmail,
      subAccountId: subAccountId,
      access: permission
    });
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const createTeamUser = async (user: any) => {
  if (user.role === "AGENCY_OWNER") return null;
  const response = await UserService.create(user);
  return response;
};

export const verifyAndAcceptInvitation = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }
  
  const invitation = await InvitationService.findByEmail(user.emailAddresses[0].emailAddress);
  
  if (invitation && invitation.status === 'PENDING') {
    const existsUser = await getAuthUserDetails();

    if (existsUser) {
      return existsUser.agencyId;
    }

    const userDetails = await createTeamUser({
      name: `${user.firstName} ${user.lastName}`,
      avatarUrl: user.imageUrl,
      email: invitation.email,
      agencyId: invitation.agencyId,
      role: invitation.role,
    });
    
    await saveActivityLogsNotification({
      agencyId: invitation?.agencyId,
      description: "Joined",
      subAccountId: undefined,
    });
    
    if (userDetails) {
      try {
        const clerk = await clerkClient();
        await clerk.users.updateUserMetadata(user.id, {
          privateMetadata: {
            role: userDetails.role || "SUBACCOUNT_USER",
          },
        });
      } catch (error) {
        console.error('Error updating user metadata:', error);
      }
      
      await InvitationService.deleteByEmail(invitation.email);
      
      return userDetails.agencyId;
    } else {
      return null;
    }
  } else {
    const agencyUser = await UserService.findByEmail(user.emailAddresses[0].emailAddress);
    return agencyUser ? agencyUser.agencyId : null;
  }
};

export const updateAgencyDetails = async (agencyId: string, agencyDetails: Partial<any>) => {
  const response = await AgencyService.update(agencyId, agencyDetails);
  return response;
};

export const getAgencyDetails = async (agencyId: string) => {
  const response = await AgencyService.findById(agencyId);
  if (response) {
    const subAccounts = await SubAccountService.findByAgencyId(agencyId);
    (response as any).SubAccount = subAccounts;
  }
  return response;
};

export const deleteAgency = async (agencyId: string) => {
  const response = await AgencyService.delete(agencyId);
  return response;
};

export const initUser = async (newUser: Partial<any>) => {
  const user = await currentUser();
  if (!user) return;

  // Find or create user
  let userData = await UserService.findByEmail(user.emailAddresses[0].emailAddress);
  
  if (!userData) {
    // Create new user
    userData = await UserService.create({
      name: `${user.firstName} ${user.lastName}`,
      avatarUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
      role: newUser.role || "SUBACCOUNT_USER",
      agencyId: newUser.agencyId || null
    } as any);
  } else {
    // Update existing user
    userData = await UserService.update(
      userData._id.toString(),
      { 
        avatarUrl: user.imageUrl,
        name: `${user.firstName} ${user.lastName}`,
        role: newUser.role || userData.role,
        agencyId: newUser.agencyId || userData.agencyId
      }
    );
  }

  try {
    const clerk = await clerkClient();
    if (clerk.users && user.id) {
      await clerk.users.updateUserMetadata(user.id, {
        privateMetadata: {
          role: newUser.role || "SUBACCOUNT_USER",
        },
      });
    }
  } catch (error) {
    console.error('Error updating user metadata:', error);
  }

  return userData;
};

export const upsertAgency = async (agency: any, price?: any) => {
  if (!agency.companyEmail) return null;

  try {
    // Try to find existing agency
    let agencyDetails = await AgencyService.findById(agency._id);
    
    if (agencyDetails) {
      // Update existing agency
      agencyDetails = await AgencyService.update(agency._id, { ...agency });
    } else {
      // Create new agency
      const user = await UserService.findByEmail(agency.companyEmail);
      if (user) {
        agencyDetails = await AgencyService.create({
          ...agency,
        });
      } else {
        agencyDetails = await AgencyService.create(agency);
      }
    }

    return agencyDetails;
  } catch (error) {
    console.log(error);
  }
};

export const getNotificationAndUser = async (agencyId: string) => {
  try {
    const notifications = await NotificationService.findByAgencyId(agencyId);
    
    // Add user details to each notification
    for (const notification of notifications) {
      const user = await UserService.findById(notification.userId);
      (notification as any).User = user;
    }
    
    return notifications;
  } catch (error) {
    console.log(error);
  }
};

export const upsertSubAccount = async (subAccount: UpsertSubAccountInput) => {
  // Find agency owner
  const agencyUsers = await UserService.findByAgencyId(subAccount.agencyId);
  const agencyOwner = agencyUsers.find(user => user.role === 'AGENCY_OWNER');
  
  if (!agencyOwner) {
    throw new Error("No agency owner found");
  }

  const permissionId = v4();

  // Try to find existing subaccount
  let response = await SubAccountService.findById(subAccount.id);
  
  if (response) {
    // Update existing subaccount
    response = await SubAccountService.update(subAccount.id, {
      name: subAccount.name,
      companyEmail: subAccount.companyEmail ?? undefined,
      companyPhone: subAccount.companyPhone,
      address: subAccount.address,
      city: subAccount.city,
      zipCode: subAccount.zipCode,
      state: subAccount.state,
      country: subAccount.country,
      subAccountLogo: subAccount.subAccountLogo ?? undefined,
      goal: subAccount.goal,
    } as any);
  } else {
    // Create new subaccount
    response = await SubAccountService.create({
      _id: subAccount.id,
      agencyId: subAccount.agencyId,
      name: subAccount.name,
      companyEmail: subAccount.companyEmail ?? undefined,
      companyPhone: subAccount.companyPhone,
      address: subAccount.address,
      city: subAccount.city,
      zipCode: subAccount.zipCode,
      state: subAccount.state,
      country: subAccount.country,
      subAccountLogo: subAccount.subAccountLogo ?? undefined,
      goal: subAccount.goal,
      connectAccountId: subAccount.connectAccountId ?? undefined,
    } as any);

    // Create default permissions for agency owner
    await PermissionsService.create({
      email: agencyOwner.email,
      subAccountId: response._id.toString(),
      access: true
    } as any);
  }

  return response;
};

export const getUserDetailsByAuthEmail = async (authEmail: AuthUser) => {
  try {
    const response = await UserService.findByEmail(authEmail.emailAddresses[0].emailAddress);
    return response;
  } catch (err) {
    console.log(err);
  }
};

export const getUserPermissions = async (userId: string) => {
  const user = await UserService.findById(userId);
  if (user) {
    const permissions = await PermissionsService.findByEmail(user.email);
    if (permissions && permissions.length > 0) {
      const firstPermission = permissions[0];
      const subAccount = await SubAccountService.findById(firstPermission.subAccountId);
      (firstPermission as any).SubAccount = subAccount;
    }
    return {
      Permissions: permissions
    };
  }
  return null;
};

export const getSubAccountDetails = async (subaccountId: string) => {
  const response = await SubAccountService.findById(subaccountId);
  return response;
};

export const deleteSubAccount = async (subaccountId: string) => {
  const response = await SubAccountService.delete(subaccountId);
  return response;
};

export const sendInvitation = async (role: any, email: string, agencyId: string) => {
  const response = await InvitationService.create({
    email,
    agencyId,
    role,
    status: 'PENDING'
  } as any);

  try {
    const clerk = await clerkClient();
    await clerk.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: process.env.NEXT_PUBLIC_URL,
      publicMetadata: {
        throwDeprecation: true,
        role,
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
  return response;
};

export const getMedia = async (subaccountId: string) => {
  const subAccount = await SubAccountService.findById(subaccountId);
  if (subAccount) {
    const media = await MediaService.findBySubAccountId(subaccountId);
    (subAccount as any).Media = media;
    return subAccount;
  }
  return null;
};

export const createMedia = async (subaccountId: string, media: any) => {
  const response = await MediaService.create({
    link: media.link,
    name: media.name,
    subAccountId: subaccountId,
  } as any);

  return response;
};

export const deleteMedia = async (mediaId: string) => {
  const response = await MediaService.delete(mediaId);
  return response;
};

export const getPipelineDetails = async (pipelineId: string) => {
  const response = await PipelineService.findById(pipelineId);
  return response;
};

export const deletePipeline = async (pipelineId: string) => {
  const response = await PipelineService.delete(pipelineId);
  return response;
};

export const getLanesWithTicketAndTags = async (pipelineId: string) => {
  const lanes = await LaneService.findByPipelineId(pipelineId);
  
  for (const lane of lanes) {
    const tickets = await TicketService.findByLaneId(lane._id.toString());
    
    for (const ticket of tickets) {
      const tags = await TicketService.findTagsByTicketId(ticket._id.toString());
      (ticket as any).Tags = tags;
      
      if (ticket.assignedUserId) {
        const assignedUser = await UserService.findById(ticket.assignedUserId);
        (ticket as any).Assigned = assignedUser;
      }
      
      if (ticket.customerId) {
        const customer = await ContactService.findById(ticket.customerId);
        (ticket as any).Customer = customer;
      }
    }
    
    (lane as any).Tickets = tickets;
  }

  return lanes;
};

export const upsertPipeline = async (pipeline: CreatePipeLineType) => {
  let response;
  
  if (pipeline.id) {
    // Update existing pipeline
    response = await PipelineService.update(pipeline.id, {
      name: pipeline.name,
      subAccountId: pipeline.subAccountId,
    });
  } else {
    // Create new pipeline
    response = await PipelineService.create({
      name: pipeline.name,
      subAccountId: pipeline.subAccountId
    } as any);
  }

  return response;
};

export const getTicketsWithTags = async (pipelineId: string) => {
  const lanes = await LaneService.findByPipelineId(pipelineId);
  let allTickets: any[] = [];
  
  for (const lane of lanes) {
    const laneTickets = await TicketService.findByLaneId(lane._id.toString());
    allTickets = [...allTickets, ...laneTickets];
  }
  
  for (const ticket of allTickets) {
    const tags = await TicketService.findTagsByTicketId(ticket._id.toString());
    (ticket as any).Tags = tags;
    
    if (ticket.assignedUserId) {
      const assignedUser = await UserService.findById(ticket.assignedUserId);
      (ticket as any).Assigned = assignedUser;
    }
    
    if (ticket.customerId) {
      const customer = await ContactService.findById(ticket.customerId);
      (ticket as any).Customer = customer;
    }
  }

  return allTickets;
};

export const upsertFunnel = async (subaccountId: string, funnel: any, funnelId: string) => {
  let response;
  
  if (funnelId) {
    // Update existing funnel
    response = await FunnelService.update(funnelId, {
      ...funnel,
      subAccountId: subaccountId,
    });
  } else {
    // Create new funnel
    response = await FunnelService.create({
      ...funnel,
      _id: funnelId,
      subAccountId: subaccountId
    });
  }

  return response;
};

export const upsertLane = async (lane: any) => {
  if (!lane.name) {
    throw new Error("Lane name is required");
  }

  let order: number;

  if (lane.order === undefined || lane.order === null) {
    const lanes = await LaneService.findByPipelineId(lane.pipelineId);
    order = lanes.length;
  } else {
    order = lane.order;
  }

  let response;
  
  if (lane.id) {
    // Update existing lane
    response = await LaneService.update(lane.id, {
      name: lane.name,
      pipelineId: lane.pipelineId,
      order,
    });
  } else {
    // Create new lane
    response = await LaneService.create({
      name: lane.name,
      pipelineId: lane.pipelineId,
      order,
    } as any);
  }

  return response;
};

export const deleteLane = async (laneId: string) => {
  const response = await LaneService.delete(laneId);
  return response;
};

export const updateLanesOrder = async (lanes: any[]) => {
  try {
    for (const lane of lanes) {
      await LaneService.update(lane.id, { order: lane.order });
    }
    console.log("🟢 Done reordered 🟢");
  } catch (error) {
    console.log(error, "ERROR UPDATE LANES ORDER");
  }
};

export const updateTicketsOrder = async (tickets: any[]) => {
  try {
    for (const ticket of tickets) {
      await TicketService.update(ticket.id, { 
        order: ticket.order, 
        laneId: ticket.laneId 
      });
    }
    console.log("🟢 Done reordered 🟢");
  } catch (error) {
    console.log(error, "ERROR UPDATE TICKETS ORDER");
  }
};

export const deleteTicket = async (ticketId: string) => {
  const response = await TicketService.delete(ticketId);
  return response;
};

export const _getTicketsWithAllRelations = async (laneId: string) => {
  const tickets = await TicketService.findByLaneId(laneId);
  
  for (const ticket of tickets) {
    if (ticket.assignedUserId) {
      const assignedUser = await UserService.findById(ticket.assignedUserId);
      (ticket as any).Assigned = assignedUser;
    }
    
    if (ticket.customerId) {
      const customer = await ContactService.findById(ticket.customerId);
      (ticket as any).Customer = customer;
    }
    
    const lane = await LaneService.findById(ticket.laneId);
    (ticket as any).Lane = lane;
    
    const tags = await TicketService.findTagsByTicketId(ticket._id.toString());
    (ticket as any).Tags = tags;
  }

  return tickets;
};

export const getSubAccountTeamMembers = async (subaccountId: string) => {
  // Get subaccount to access its agency
  const subaccount = await SubAccountService.findById(subaccountId);
  if (!subaccount || !subaccount.agencyId) {
    return [];
  }
  
  // Get all users in the agency with SUBACCOUNT_USER role
  const agencyUsers = await UserService.findByAgencyId(subaccount.agencyId);
  const subaccountUsers = agencyUsers.filter(user => user.role === "SUBACCOUNT_USER");
  
  // Filter by permissions for this specific subaccount
  const filteredUsers = [];
  for (const user of subaccountUsers) {
    const permission = await PermissionsService.findByEmailAndSubAccountId(user.email, subaccountId);
    if (permission && permission.access) {
      filteredUsers.push(user);
    }
  }
  
  return filteredUsers;
};

export const searchContacts = async (searchTerms: string) => {
  const response = await ContactService.searchByName(searchTerms);
  return response;
};

export const upsertTicket = async (ticket: any, tags: any[]) => {
  let order: number;
  if (!ticket.order) {
    const tickets = await TicketService.findByLaneId(ticket.laneId);
    order = tickets.length;
  } else {
    order = ticket.order;
  }

  let response;
  
  if (ticket.id) {
    // Update existing ticket
    response = await TicketService.update(ticket.id, {
      ...ticket,
      order,
    });
  } else {
    // Create new ticket
    response = await TicketService.create({
      ...ticket,
      order,
    });
  }

  // Handle tags association
  if (response) {
    // Extract tag IDs from the tags array
    const tagIds = tags.map(tag => tag.id).filter(id => id); // Filter out any undefined/null IDs
    // Update ticket tags
    await TicketService.updateTicketTags(response._id.toString(), tagIds);
  }

  // Include related data in response
  if (response) {
    if (response.assignedUserId) {
      const assignedUser = await UserService.findById(response.assignedUserId);
      (response as any).Assigned = assignedUser;
    }
    
    if (response.customerId) {
      const customer = await ContactService.findById(response.customerId);
      (response as any).Customer = customer;
    }
    
    const lane = await LaneService.findById(response.laneId);
    (response as any).Lane = lane;
    
    const ticketTags = await TicketService.findTagsByTicketId(response._id.toString());
    (response as any).Tags = ticketTags;
  }

  return response;
};

export const upsertTag = async (subaccountId: string, tag: any) => {
  let response;
  
  if (tag.id) {
    // Update existing tag
    response = await TagService.update(tag.id, {
      ...tag,
      subAccountId: subaccountId,
    });
  } else {
    // Create new tag
    response = await TagService.create({
      ...tag,
      subAccountId: subaccountId,
    });
  }

  return response;
};

export const getTagsForSubaccount = async (subaccountId: string) => {
  const subAccount = await SubAccountService.findById(subaccountId);
  if (subAccount) {
    const tags = await TagService.findBySubAccountId(subaccountId);
    (subAccount as any).Tags = tags;
    return subAccount;
  }
  return null;
};

export const deleteTag = async (tagId: string) => {
  const response = await TagService.delete(tagId);
  return response;
};

export const getContact = async (subaccountId: string) => {
  const subAccount = await SubAccountService.findById(subaccountId);
  if (subAccount) {
    const contacts = await ContactService.findBySubAccountId(subaccountId);
    
    // Add ticket values to each contact
    for (const contact of contacts) {
      const tickets = await TicketService.findByCustomerId(contact._id.toString());
      (contact as any).Ticket = tickets; // Only getting tickets for this contact
    }
    
    // Sort contacts by creation date
    contacts.sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
    
    (subAccount as any).Contact = contacts;
    return subAccount;
  }
  return null;
};

export const upsertContact = async (contact: any) => {
  // Backend validation
  if (!contact.name || contact.name.trim() === "") {
    throw new Error("Contact name is required");
  }

  if (!contact.email || contact.email.trim() === "") {
    throw new Error("Contact email is required");
  }

  if (!contact.subAccountId) {
    throw new Error("SubAccountId is required");
  }

  let response;
  
  if (contact.id) {
    // Update existing contact
    response = await ContactService.update(contact.id, {
      name: contact.name,
      email: contact.email,
      subAccountId: contact.subAccountId,
    });
  } else {
    // Create new contact
    response = await ContactService.create({
      name: contact.name,
      email: contact.email,
      subAccountId: contact.subAccountId,
    } as any);
  }

  return response;
};

export const getFunnels = async (subaccountId: string) => {
  const funnels = await FunnelService.findBySubAccountId(subaccountId);
  
  // Add funnel pages to each funnel
  for (const funnel of funnels) {
    const funnelPages = await FunnelPageService.findByFunnelId(funnel._id.toString());
    (funnel as any).FunnelPages = funnelPages;
  }

  return funnels;
};

export const getFunnel = async (funnelId: string) => {
  const funnel = await FunnelService.findById(funnelId);
  
  if (funnel) {
    const funnelPages = await FunnelPageService.findByFunnelId(funnel._id.toString());
    // Sort pages by order
    funnelPages.sort((a, b) => (a.order || 0) - (b.order || 0));
    (funnel as any).FunnelPages = funnelPages;
  }

  return funnel;
};

export const upsertFunnelPage = async (subaccountId: string, funnelPage: any, funnelId: string) => {
  if (!subaccountId || !funnelId) return;

  let response;
  
  if (funnelPage.id) {
    // Update existing funnel page
    response = await FunnelPageService.update(funnelPage.id, {
      ...funnelPage,
      funnelId,
    });
  } else {
    // Create new funnel page
    response = await FunnelPageService.create({
      ...funnelPage,
      name: funnelPage.name,
      content: funnelPage.content
        ? funnelPage.content
        : JSON.stringify([
            {
              content: [],
              id: "__body",
              name: "Body",
              styles: {
                backgroundColor: "white",
                type: "_body",
              },
            },
          ]),
      funnelId,
    });
  }

  revalidatePath(`/subaccount/${subaccountId}/funnels/${funnelId}`);
  return response;
};

export const deleteFunnelsPage = async (funnelPageId: string) => {
  const response = await FunnelPageService.delete(funnelPageId);
  return response;
};

export const updateFunnelProducts = async (products: string, funnelId: string) => {
  const data = await FunnelService.update(funnelId, { liveProducts: products });
  return data;
};

export const getFunnelPageDetails = async (funnelPageId: string) => {
  const data = await FunnelPageService.findById(funnelPageId);
  return data;
};