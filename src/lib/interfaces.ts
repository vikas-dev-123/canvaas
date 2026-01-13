// Compatibility interfaces mapping to MongoDB models
// This maintains backward compatibility with existing frontend components

import { IUser } from '../models/User';
import { IAgency } from '../models/Agency';
import { ISubAccount } from '../models/SubAccount';
import { IPermissions } from '../models/Permissions';
import { IInvitation } from '../models/Invitation';
import { INotification } from '../models/Notification';
import { IMedia } from '../models/Media';
import { IPipeline } from '../models/Pipeline';
import { ILane } from '../models/Lane';
import { ITicket } from '../models/Ticket';
import { ITag } from '../models/Tag';
import { IContact } from '../models/Contact';
import { IFunnel } from '../models/Funnel';
import { IFunnelPage } from '../models/FunnelPage';
import { ISubscription } from '../models/Subscription';
import { IAddOns } from '../models/AddOns';
import { IAgencySidebarOption } from '../models/AgencySidebarOption';
import { ISubAccountSidebarOption } from '../models/SubAccountSidebarOption';
import { ITrigger } from '../models/Trigger';
import { IAutomation } from '../models/Automation';
import { IAutomationInstance } from '../models/AutomationInstance';
import { IAction } from '../models/Action';
import { IClassName } from '../models/ClassName';
import { Role as RoleEnum, Plan as PlanEnum } from './enums';

// Export all MongoDB model interfaces as the old interface names
export type User = IUser;
export type Agency = IAgency;
export type SubAccount = ISubAccount;
export type Permissions = IPermissions;
export type Invitation = IInvitation;
export type Notification = INotification;
export type Media = IMedia;
export type Pipeline = IPipeline;
export type Lane = ILane;
export type Ticket = ITicket;
export type Tag = ITag;
export type Contact = IContact;
export type Funnel = IFunnel;
export type FunnelPage = IFunnelPage;
export type Subscription = ISubscription;
export type AddOns = IAddOns;
export type AgencySidebarOption = IAgencySidebarOption;
export type SubAccountSidebarOption = ISubAccountSidebarOption;
export type Trigger = ITrigger;
export type Automation = IAutomation;
export type AutomationInstance = IAutomationInstance;
export type Action = IAction;
export type ClassName = IClassName;
export type Role = RoleEnum;
export type Plan = PlanEnum;