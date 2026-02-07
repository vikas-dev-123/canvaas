"use client";

import { NotificationWithUser } from "@/lib/types";
import { UserButton } from "@clerk/nextjs";
import { Bell } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Card } from "../ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Switch } from "../ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ModeToggle } from "./mode-toggle";

type Props = {
  notifications: NotificationWithUser | [];
  role?: string;
  className?: string;
  subAccountId?: string;
};

const InfoBar = ({ notifications, role, className, subAccountId }: Props) => {
  const [allNotifications, setAllNotifications] = useState(notifications);
  const [showAll, setShowAll] = useState(true);

  const handleClick = () => {
    if (!showAll) {
      setAllNotifications(notifications);
    } else {
      if (notifications?.length !== 0) {
        setAllNotifications(
          notifications?.filter(
            (item) => item.subAccountId === subAccountId
          ) ?? []
        );
      }
    }
    setShowAll((prev) => !prev);
  };

  return (
    <div
      className={twMerge(
        `
        fixed z-20 top-0 left-0 right-0 md:left-[300px]
        h-16 px-6
        flex items-center justify-between
        backdrop-blur-md
        border-b border-gray-800
        `,
        className
      )}
    >
      {/* LEFT: PATH / CONTEXT */}
      <div className="flex items-center gap-3 text-sm font-mono text-gray-400">
        <span className="text-emerald-400">root</span>
        <span>/</span>
        <span>dashboard</span>
        <span>/</span>
        <span className="text-white">control_deck</span>
      </div>

      {/* RIGHT: ACTIONS */}
      <div className="flex items-center gap-4">

        {/* Notifications */}
        <Sheet>
          <SheetTrigger asChild>
            <button
              className="relative p-2 rounded-full
              hover:bg-gray-800 transition"
            >
              <Bell className="w-5 h-5 text-gray-400 hover:text-white" />
              {allNotifications?.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full
                  bg-red-500 animate-pulse" />
              )}
            </button>
          </SheetTrigger>

          <SheetContent
            className="
              bg-black text-white
              border-l border-gray-800
              w-[420px] max-w-full
              overflow-y-auto
            "
          >
            <SheetHeader className="mb-6">
              <SheetTitle className="font-mono">
                Notifications_Stream
              </SheetTitle>
              <SheetDescription className="text-gray-400">
                Real-time system events
              </SheetDescription>
            </SheetHeader>

            {(role === "AGENCY_ADMIN" || role === "AGENCY_OWNER") && (
              <Card className="mb-6 p-4 bg-black/60 border border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono text-gray-300">
                    Current_Sub_Account
                  </span>
                  <Switch onCheckedChange={handleClick} />
                </div>
              </Card>
            )}

            <div className="space-y-4">
              {allNotifications?.map((notification) => (
                <div
                  key={notification.id}
                  className="flex gap-3 p-3 rounded-xl
                  bg-black/60 border border-gray-800"
                >
                  <Avatar>
                    <AvatarImage src={notification.User.avatarUrl} />
                    <AvatarFallback className="bg-gray-800 text-xs font-mono">
                      {notification.User.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col gap-1 text-sm">
                    <p className="leading-snug">
                      <span className="font-semibold">
                        {notification.notification.split("|")[0]}
                      </span>
                      <span className="text-gray-400">
                        {notification.notification.split("|")[1]}
                      </span>
                      <span className="font-semibold">
                        {notification.notification.split("|")[2]}
                      </span>
                    </p>
                    <span className="text-xs font-mono text-gray-500">
                      {new Date(notification.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}

              {allNotifications?.length === 0 && (
                <div className="text-center text-sm text-gray-500 font-mono mt-12">
                  No_System_Notifications
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Theme toggle */}
        <ModeToggle />

        {/* User */}
        <div className="scale-90">
          <UserButton />
        </div>

      </div>
    </div>
  );
};

export default InfoBar;
