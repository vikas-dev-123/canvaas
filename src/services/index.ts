// Export all services for easy access

export { UserService } from './user-service';
export { AgencyService } from './agency-service';
export { SubAccountService } from './sub-account-service';
export { PermissionsService } from './permissions-service';
export { PipelineService } from './pipeline-service';
export { LaneService } from './lane-service';
export { TicketService } from './ticket-service';
export { TagService } from './tag-service';
export { ContactService } from './contact-service';
export { MediaService } from './media-service';
export { FunnelService } from './funnel-service';
export { FunnelPageService } from './funnel-page-service';
export { NotificationService } from './notification-service';

export { TriggerService } from './trigger-service';
export { AutomationService } from './automation-service';

export { ActionService } from './action-service';
export { SubscriptionService } from './subscription-service';
export { AddOnsService } from './addons-service';
export { InvitationService } from './invitation-service';

export { AgencySidebarOptionService } from './agency-sidebar-option-service';
export { SubAccountSidebarOptionService } from './subaccount-sidebar-option-service';
export { ClassNameService } from './classname-service';
export { AutomationInstanceService } from './automation-instance-service';

// Services object will be available after all services are imported
// You can access individual services via their named exports

// Example usage:
// import { UserService } from '@/services';
// const user = await UserService.findById('userId');