"use server";

import { Agency, Funnel, Lane, Prisma, Role, SubAccount, Tag, Ticket, User } from "@prisma/client";
import { redirect } from "next/navigation";
import { v4 } from "uuid";
import { db } from "./db";
import { CreateFunnelFormSchema, CreateMediaType, CreatePipeLineType, UpsertFunnelPage } from "./types";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getSession } from "./auth/getSession";
import { sendInviteEmail } from "./auth/mailer";
import { getOrSetCache, invalidateCache } from "./cache";

export const getUser = async (id: string) => {
    const user = await db.user.findUnique({
        where: {
            id,
        },
    });

    return user;
};

export const deleteUser = async (userId: string) => {
    const deletedUser = await db.user.delete({ where: { id: userId } });
    return deletedUser;
};

export const getAuthUserDetails = async () => {
    const session = await getSession();

    if (!session) {
        return;
    }

    const userData = await db.user.findUnique({
        where: {
            id: session.userId,
        },
        include: {
            Agency: {
                include: {
                    SidebarOption: true,
                    SubAccount: {
                        include: {
                            SidebarOption: true,
                        },
                    },
                },
            },
            Permissions: true,
        },
    });

    return userData;
};

export const saveActivityLogsNotification = async ({ agencyId, description, subAccountId }: { agencyId?: string | null; description?: string; subAccountId?: string }) => {
    const session = await getSession();
    let userData;
    if (!session) {
        const response = await db.user.findFirst({
            where: {
                Agency: {
                    SubAccount: {
                        some: { id: subAccountId as string },
                    },
                },
            },
        });
        if (response) {
            userData = response;
        }
    } else {
        userData = await db.user.findUnique({
            where: { id: session.userId },
        });
    }

    if (!userData) {
        console.log("Could not find a user");
        return;
    }

    let foundAgencyId = agencyId;
    if (!foundAgencyId || foundAgencyId === null) {
        if (!subAccountId) {
            console.log("No agencyId or subAccountId provided, skipping notification");
            return;
        }

        const response = await db.subAccount.findUnique({
            where: {
                id: subAccountId as string,
            },
        });

        if (response) foundAgencyId = response.agencyId.toString();
    }

    if (subAccountId) {
        await db.notification.create({
            data: {
                notification: `${userData.name} | ${description}`,
                User: {
                    connect: {
                        id: userData.id,
                    },
                },
                Agency: {
                    connect: {
                        id: foundAgencyId as string,
                    },
                },
                SubAccount: {
                    connect: {
                        id: subAccountId as string,
                    },
                },
            },
        });
    } else {
        await db.notification.create({
            data: {
                notification: `${userData.name} | ${description}`,
                User: {
                    connect: {
                        id: userData.id,
                    },
                },
                Agency: {
                    connect: {
                        id: foundAgencyId as string,
                    },
                },
            },
        });
    }
};

export const updateUser = async (id: string, userData: Partial<User>) => {
    const response = await db.user.update({
        where: {
            id: id,
        },
        data: {
            ...userData,
        },
    });

    return response;
};

export const changeUserPermission = async (permissionId: string, userEmail: string, subAccountId: string, permission: boolean) => {
    try {
        const response = await db.permissions.upsert({
            where: {
                id: permissionId,
            },
            update: {
                access: permission,
            },
            create: {
                access: permission,
                email: userEmail,
                subAccountId: subAccountId,
            },
        });
        return response;
    } catch (err) {
        console.log(err);
    }
};

export const createTeamUser = async (user: User) => {
    if (user.role === "AGENCY_OWNER") return null;
    const response = await db.user.create({ data: { ...user } });
    return response;
};

export const verifyAndAcceptInvitation = async () => {
    const session = await getSession();

    if (!session) {
        redirect("/agency/sign-in");
    }

    const invitationExists = await db.invitation.findUnique({
        where: {
            email: session.email,
            status: "PENDING",
        },
    });

    if (invitationExists) {
        // The user row already exists (created at sign-up) — join them to the inviting agency.
        const userDetails = await db.user.update({
            where: { email: invitationExists.email },
            data: {
                agencyId: invitationExists.agencyId,
                role: invitationExists.role,
            },
        });

        await saveActivityLogsNotification({
            agencyId: invitationExists?.agencyId,
            description: "Joined",
            subAccountId: undefined,
        });

        await db.invitation.delete({
            where: {
                email: userDetails.email,
            },
        });

        return userDetails.agencyId;
    } else {
        const user = await db.user.findUnique({
            where: {
                id: session.userId,
            },
        });

        return user ? user.agencyId : null;
    }
};

export const updateAgencyDetails = async (agencyId: string, agencyDetails: Partial<Agency>) => {
    const response = await db.agency.update({
        where: { id: agencyId },
        data: { ...agencyDetails },
    });
    await invalidateCache(`agency:full:${agencyId}`);
    return response;
};

export const getAgencyDetails = async (agencyId: string) => {
    const response = await db.agency.findUnique({
        where: { id: agencyId },
        include: {
            SubAccount: true,
        },
    });
    return response;
};

export const deleteAgency = async (agencyId: string) => {
    const response = await db.agency.delete({
        where: {
            id: agencyId,
        },
    });
    await invalidateCache(`agency:full:${agencyId}`);
    return response;
};

export const initUser = async (newUser: Partial<User>) => {
    const session = await getSession();
    if (!session) return;

    const userData = await db.user.update({
        where: {
            id: session.userId,
        },
        data: {
            ...newUser,
        },
    });

    return userData;
};

export const upsertAgency = async (agency: Agency, price?: string) => {
    if (!agency.companyEmail) return null;

    try {
        const agencyDetails = await db.agency.upsert({
            where: {
                id: agency.id,
            },
            update: agency,
            create: {
                users: {
                    connect: {
                        email: agency.companyEmail,
                    },
                },
                ...agency,
                SidebarOption: {
                    create: [
                        {
                            name: "Dashboard",
                            icon: "category",
                            link: `/agency/${agency.id}`,
                        },
                        {
                            name: "Launchpad",
                            icon: "clipboardIcon",
                            link: `/agency/${agency.id}/launchpad`,
                        },
                        {
                            name: "Billing",
                            icon: "payment",
                            link: `/agency/${agency.id}/billing`,
                        },
                        {
                            name: "Settings",
                            icon: "settings",
                            link: `/agency/${agency.id}/settings`,
                        },
                        {
                            name: "Sub Accounts",
                            icon: "person",
                            link: `/agency/${agency.id}/all-subaccounts`,
                        },
                        {
                            name: "Team",
                            icon: "shield",
                            link: `/agency/${agency.id}/team`,
                        },
                    ],
                },
            },
        });

        await invalidateCache(`agency:full:${agencyDetails.id}`);
        return agencyDetails;
    } catch (error) {
        console.log(error);
        throw new Error("Failed to upsert agency");
    }
};

export const getNotificationAndUser = async (agencyId: string) => {
    try {
        const response = await db.notification.findMany({
            where: {
                agencyId,
            },
            include: {
                User: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return response;
    } catch (error) {
        console.log(error);
    }
};

export const upsertSubAccount = async (subAccount: SubAccount) => {
    if (!subAccount.companyEmail) return null;

    const agencyOwner = await db.user.findFirst({
        where: {
            Agency: {
                id: subAccount.agencyId,
            },
            role: "AGENCY_OWNER",
        },
    });

    if (!agencyOwner) return console.log("Error could not create subaccount");
    const permissionId = v4();
    const response = await db.subAccount.upsert({
        where: { id: subAccount.id },
        update: subAccount,
        create: {
            ...subAccount,
            Permissions: {
                create: {
                    access: true,
                    email: agencyOwner.email,
                    id: permissionId,
                },
                connect: {
                    subAccountId: subAccount.id,
                    id: permissionId,
                },
            },
            Pipeline: {
                create: { name: "Lead Cycle" },
            },
            SidebarOption: {
                create: [
                    {
                        name: "Launchpad",
                        icon: "clipboardIcon",
                        link: `/subaccount/${subAccount.id}/launchpad`,
                    },
                    {
                        name: "Settings",
                        icon: "settings",
                        link: `/subaccount/${subAccount.id}/settings`,
                    },
                    {
                        name: "Funnels",
                        icon: "pipelines",
                        link: `/subaccount/${subAccount.id}/funnels`,
                    },
                    {
                        name: "Media",
                        icon: "database",
                        link: `/subaccount/${subAccount.id}/media`,
                    },
                    {
                        name: "Automations",
                        icon: "chip",
                        link: `/subaccount/${subAccount.id}/automations`,
                    },
                    {
                        name: "Pipelines",
                        icon: "flag",
                        link: `/subaccount/${subAccount.id}/pipelines`,
                    },
                    {
                        name: "Contacts",
                        icon: "person",
                        link: `/subaccount/${subAccount.id}/contacts`,
                    },
                    {
                        name: "Dashboard",
                        icon: "category",
                        link: `/subaccount/${subAccount.id}`,
                    },
                ],
            },
        },
    });

    await invalidateCache(`subaccount:dashboard:${response.id}`, `agency:full:${subAccount.agencyId}`);
    return response;
};

export const getUserDetailsByAuthEmail = async (email: string) => {
    try {
        const response = await db.user.findUnique({
            where: {
                email,
            },
        });

        return response;
    } catch (err) {
        console.log(err);
    }
};

export const getUserPermissions = async (userId: string) => {
    const response = await db.user.findUnique({
        where: { id: userId },
        select: {
            Permissions: {
                include: {
                    SubAccount: true,
                },
            },
        },
    });

    return response;
};

export const getSubAccountDetails = async (subaccountId: string) => {
    const response = await db.subAccount.findUnique({
        where: { id: subaccountId },
    });

    return response;
};

// Simplified query functions for dashboard pages
export const getSubAccountDashboardData = async (subaccountId: string) => {
    return getOrSetCache(`subaccount:dashboard:${subaccountId}`, 60, async () => {
        const [subAccount, funnels, media, contacts, tickets] = await Promise.all([
            db.subAccount.findUnique({
                where: { id: subaccountId },
                include: {
                    Agency: true,
                },
            }),
            db.funnel.findMany({
                where: { subAccountId: subaccountId },
                include: {
                    FunnelPages: true,
                },
            }),
            db.media.findMany({
                where: { subAccountId: subaccountId },
            }),
            db.contact.findMany({
                where: { subAccountId: subaccountId },
            }),
            db.ticket.findMany({
                where: {
                    Lane: {
                        Pipeline: {
                            subAccountId: subaccountId,
                        },
                    },
                },
                include: {
                    Assigned: true,
                    Customer: true,
                },
            }),
        ]);

        return {
            subAccount,
            funnels,
            media,
            contacts,
            tickets,
        };
    });
};

export const getAgencyWithAllData = async (agencyId: string) => {
  return getOrSetCache(`agency:full:${agencyId}`, 60, async () => {
    const response = await db.agency.findUnique({
        where: { id: agencyId },
        include: {
            SubAccount: {
                include: {
                    Funnels: {
                        include: {
                            FunnelPages: true,
                        },
                    },
                    Media: true,
                    Contact: true,
                    Pipeline: {
                        include: {
                            Lane: {
                                include: {
                                    Tickets: {
                                        include: {
                                            TicketTags: {
                                                include: {
                                                    Tag: true,
                                                },
                                            },
                                            Assigned: true,
                                            Customer: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    SidebarOption: true,
                },
            },
            Invitation: true,
            Notification: true,
            Subscription: true,
            AddOns: true,
        },
    });

    return response;
  });
};

export const deleteSubAccount = async (subaccountId: string) => {
    const response = await db.subAccount.delete({
        where: {
            id: subaccountId,
        },
    });

    await invalidateCache(`subaccount:dashboard:${subaccountId}`, `agency:full:${response.agencyId}`);
    return response;
};

export const sendInvitation = async (role: Role, email: string, agencyId: string) => {
    const response = await db.invitation.create({
        data: {
            email,
            agencyId,
            role,
        },
    });

    try {
        const agency = await db.agency.findUnique({ where: { id: agencyId } });
        await sendInviteEmail(email, agency?.name || "your agency");
    } catch (err) {
        console.log(err);
        throw err;
    }
    return response;
};

export const getMedia = async (subaccountId: string) => {
    const response = await db.subAccount.findUnique({
        where: {
            id: subaccountId,
        },
        include: {
            Media: true,
        },
    });
    return response;
};

export const createMedia = async (subaccountId: string, media: CreateMediaType) => {
    const response = await db.media.create({
        data: {
            link: media.link,
            name: media.name,
            subAccountId: subaccountId,
        },
    });

    return response;
};

export const deleteMedia = async (mediaId: string) => {
    const response = await db.media.delete({
        where: {
            id: mediaId,
        },
    });
    return response;
};

export const getPipelineDetails = async (pipelineId: string) => {
    const response = await db.pipeline.findUnique({
        where: {
            id: pipelineId,
        },
    });

    return response;
};

export const deletePipeline = async (pipelineId: string) => {
    const response = await db.pipeline.delete({
        where: {
            id: pipelineId,
        },
    });

    return response;
};

export const getLanesWithTicketAndTags = async (pipelineId: string) => {
  return await db.lane.findMany({
    where: { pipelineId },
    orderBy: { order: "asc" },
    include: {
      Tickets: {
        orderBy: { order: "asc" },
        include: {
          TicketTags: {
            include: { Tag: true },
          },
          Assigned: true,
          Customer: true,
        },
      },
    },
  });
};

export const upsertPipeline = async (pipeline: CreatePipeLineType) => {
    const response = await db.pipeline.upsert({
        where: {
            id: pipeline.id || v4(),
        },
        create: pipeline,
        update: pipeline,
    });

    return response;
};

export const getTicketsWithTags = async (pipelineId: string) => {
  return await db.ticket.findMany({
    where: {
      Lane: { pipelineId },
    },
    include: {
      TicketTags: {
        include: { Tag: true },
      },
      Assigned: true,
      Customer: true,
    },
  });
};


export const upsertFunnel = async (subaccountId: string, funnel: z.infer<typeof CreateFunnelFormSchema> & { liveProducts: string }, funnelId: string) => {
    const response = await db.funnel.upsert({
        where: {
            id: funnelId,
        },
        update: funnel,
        create: {
            ...funnel,
            id: funnelId || v4(),
            subAccountId: subaccountId,
        },
    });

    await invalidateCache(`funnel:${response.id}`, `funnels:${subaccountId}`);
    return response;
};

export const upsertLane = async (lane: Prisma.LaneUncheckedCreateInput) => {
    let order: number;

    if (!lane.order) {
        const lanes = await db.lane.findMany({
            where: {
                pipelineId: lane.pipelineId,
            },
        });
        order = lanes.length;
    } else {
        order = lane.order;
    }

    const response = await db.lane.upsert({
        where: {
            id: lane.id || v4(),
        },
        update: lane,
        create: {
            ...lane,
            order,
        },
    });

    return response;
};

export const deleteLane = async (laneId: string) => {
    const response = await db.lane.delete({
        where: {
            id: laneId,
        },
    });
    return response;
};

export const updateLanesOrder = async (lanes: Lane[]) => {
    try {
        const updateTrans = lanes.map((lane) =>
            db.lane.update({
                where: { id: lane.id },
                data: { order: lane.order },
            })
        );

        await db.$transaction(updateTrans);
        console.log("🟢 Done reordered 🟢");
    } catch (error) {
        console.log(error, "ERROR UPDATE LANES ORDER");
    }
};

export const updateTicketsOrder = async (tickets: Ticket[]) => {
    try {
        const updateTrans = tickets.map((ticket) =>
            db.ticket.update({
                where: { id: ticket.id },
                data: { order: ticket.order, laneId: ticket.laneId },
            })
        );

        await db.$transaction(updateTrans);
        console.log("🟢 Done reordered 🟢");
    } catch (error) {
        console.log(error, "ERROR UPDATE TICKETS ORDER");
    }
};

export const deleteTicket = async (ticketId: string) => {
    const response = await db.ticket.delete({
        where: {
            id: ticketId,
        },
    });

    return response;
};

export const _getTicketsWithAllRelations = async (laneId: string) => {
    const response = await db.ticket.findMany({
        where: { laneId: laneId },
        include: {
            Assigned: true,
            Customer: true,
            Lane: true,
            TicketTags: {
                include: {
                    Tag: true
                }
            },
        },
    });
    return response;
};

export const getSubAccountTeamMembers = async (subaccountId: string) => {
    const subaccountUsersWithAccess = await db.user.findMany({
        where: {
            Agency: {
                SubAccount: {
                    some: {
                        id: subaccountId,
                    },
                },
            },
            role: "SUBACCOUNT_USER",
            Permissions: {
                some: {
                    subAccountId: subaccountId,
                    access: true,
                },
            },
        },
    });
    return subaccountUsersWithAccess;
};

export const searchContacts = async (searchTerms: string) => {
    const response = await db.contact.findMany({
        where: {
            name: {
                contains: searchTerms,
            },
        },
    });
    return response;
};

export const upsertTicket = async (ticket: Prisma.TicketUncheckedCreateInput, tags: Tag[]) => {
    let order: number;
    if (!ticket.order) {
        const tickets = await db.ticket.findMany({
            where: { laneId: ticket.laneId },
        });
        order = tickets.length;
    } else {
        order = ticket.order;
    }

    const response = await db.ticket.upsert({
        where: {
            id: ticket.id || v4(),
        },
        update: { 
            ...ticket, 
            TicketTags: { 
                deleteMany: {}, // First delete all existing connections
                create: tags.map(tag => ({
                    tagId: tag.id
                }))
            }
        },
        create: { 
            ...ticket, 
            order,
            TicketTags: { 
                create: tags.map(tag => ({
                    tagId: tag.id
                }))
            }
        },
        include: {
            Assigned: true,
            Customer: true,
            TicketTags: {
                include: {
                    Tag: true
                }
            },
            Lane: true,
        },
    });

    return response;
};

export const upsertTag = async (subaccountId: string, tag: Prisma.TagUncheckedCreateInput) => {
    const response = await db.tag.upsert({
        where: { id: tag.id || v4(), subAccountId: subaccountId },
        update: tag,
        create: { ...tag, subAccountId: subaccountId },
    });

    return response;
};

export const getTagsForSubaccount = async (subaccountId: string) => {
    const response = await db.subAccount.findUnique({
        where: { id: subaccountId },
        include: { Tags: true },
    });
    return response;
};

export const deleteTag = async (tagId: string) => {
    const response = await db.tag.delete({ where: { id: tagId } });
    return response;
};

export const getContact = async (subaccountId: string) => {
    const response = await db.subAccount.findUnique({
        where: {
            id: subaccountId,
        },
        include: {
            Contact: {
                include: {
                    Ticket: {
                        select: {
                            value: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });

    return response;
};

export const upsertContact = async (contact: Prisma.ContactUncheckedCreateInput) => {
    const response = await db.contact.upsert({
        where: { id: contact.id || v4() },
        update: contact,
        create: contact,
    });

    return response;
};

export const getFunnels = async (subaccountId: string) => {
    return getOrSetCache(`funnels:${subaccountId}`, 60, async () => {
        return db.funnel.findMany({
            where: {
                subAccountId: subaccountId,
            },
            include: {
                FunnelPages: true,
            },
        });
    });
};

export const getFunnel = async (funnelId: string) => {
    return getOrSetCache(`funnel:${funnelId}`, 60, async () => {
        return db.funnel.findUnique({
            where: { id: funnelId },
            include: {
                FunnelPages: {
                    orderBy: {
                        order: "asc",
                    },
                },
            },
        });
    });
};

export const upsertFunnelPage = async (subaccountId: string, funnelPage: UpsertFunnelPage, funnelId: string) => {
    if (!subaccountId || !funnelId) return;

    const response = await db.funnelPage.upsert({
        where: {
            id: funnelPage.id || "",
        },
        update: {
            ...funnelPage,
        },
        create: {
            ...funnelPage,
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
        },
    });

    revalidatePath(`/subaccount/${subaccountId}/funnels/${funnelId}`);
    await invalidateCache(`funnel:${funnelId}`, `funnels:${subaccountId}`, `funnelpage:${funnelId}:${funnelPage.pathName ?? ""}`);
    return response;
};

export const deleteFunnelsPage = async (funnelPageId: string) => {
    const existing = await db.funnelPage.findUnique({
        where: { id: funnelPageId },
        include: { Funnel: true },
    });

    const response = await db.funnelPage.delete({
        where: {
            id: funnelPageId,
        },
    });

    if (existing) {
        await invalidateCache(`funnel:${existing.funnelId}`, `funnels:${existing.Funnel.subAccountId}`, `funnelpage:${existing.funnelId}:${existing.pathName}`);
    }
    return response;
};

export const updateFunnelProducts = async (products: string, funnelId: string) => {
    const data = await db.funnel.update({
        where: { id: funnelId },
        data: { liveProducts: products },
    });

    await invalidateCache(`funnel:${funnelId}`);
    return data;
};

export const getFunnelPageDetails = async (funnelPageId: string) => {
    const data = await db.funnelPage.findUnique({
        where: {
            id: funnelPageId,
        },
    });
    return data;
};

export const getDomainContent = async (subDomainName: string) => {
  return getOrSetCache(`domain:${subDomainName}`, 60, async () => {
    return db.funnel.findUnique({
      where: {
        subDomainName,
      },
      include: {
        FunnelPages: true,
      },
    });
  });
};

export const getFunnelPageByPath = async (funnelId: string, pathName: string) => {
  return getOrSetCache(`funnelpage:${funnelId}:${pathName}`, 60, async () => {
    return db.funnelPage.findFirst({
      where: {
        funnelId,
        pathName,
      },
    });
  });
};