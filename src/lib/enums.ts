import mongoose from 'mongoose';

export enum Role {
  AGENCY_OWNER = 'AGENCY_OWNER',
  AGENCY_ADMIN = 'AGENCY_ADMIN',
  SUBACCOUNT_USER = 'SUBACCOUNT_USER',
  SUBACCOUNT_GUEST = 'SUBACCOUNT_GUEST',
}

export enum Icon {
  settings = 'settings',
  chart = 'chart',
  calendar = 'calendar',
  check = 'check',
  chip = 'chip',
  compass = 'compass',
  database = 'database',
  flag = 'flag',
  home = 'home',
  info = 'info',
  link = 'link',
  lock = 'lock',
  messages = 'messages',
  notification = 'notification',
  payment = 'payment',
  power = 'power',
  receipt = 'receipt',
  shield = 'shield',
  star = 'star',
  tune = 'tune',
  videorecorder = 'videorecorder',
  wallet = 'wallet',
  warning = 'warning',
  headphone = 'headphone',
  send = 'send',
  pipelines = 'pipelines',
  person = 'person',
  category = 'category',
  contact = 'contact',
  clipboardIcon = 'clipboardIcon',
}

export enum TriggerTypes {
  CONTACT_FORM = 'CONTACT_FORM',
}

export enum Plan {
  price_1Ppo69RwpqMc2iheOHp2rbzA = 'price_1Ppo69RwpqMc2iheOHp2rbzA',
  price_1Ppo73RwpqMc2ihef4jfoTTc = 'price_1Ppo73RwpqMc2ihef4jfoTTc',
}

export enum InvitationStatus {
  ACCEPTED = 'ACCEPTED',
  REVOKED = 'REVOKED',
  PENDING = 'PENDING',
}

export enum ActionType {
  CREATE_CONTACT = 'CREATE_CONTACT',
}