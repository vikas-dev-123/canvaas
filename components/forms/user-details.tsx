"use client";
import { useToast } from "@/components/ui/use-toast";
import {
  changeUserPermission,
  getAuthUserDetails,
  getUserPermissions,
  saveActivityLogsNotification,
  updateUser,
} from "@/lib/queries";
import {
  AuthUSerWithAgencySigebarOptionsSubAccounts,
  UserWithPermissionsAndSubAccounts,
} from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubAccount, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import FileUpload from "../global/file-upload";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import Loading from "../global/loading";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { v4 } from "uuid";

type Props = {
  id: string | null;
  type: "agency" | "subaccount";
  userData?: Partial<User>;
  subAccounts?: SubAccount[];
};

const UserDetails = ({ id, type, userData, subAccounts }: Props) => {
  const [subAccountPermissions, setSubAccountPermissions] =
    useState<UserWithPermissionsAndSubAccounts>(null);

  const { data, setClose } = useModal();
  const [roleState, setRoleState] = useState("");
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [authUserData, setAuthUserData] =
    useState<AuthUSerWithAgencySigebarOptionsSubAccounts | null>(null);

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (data.user) {
      const fetchDetails = async () => {
        const response = await getAuthUserDetails();
        if (response) setAuthUserData(response);
      };
      fetchDetails();
    }
  }, [data]);

  const userDataSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    avatarUrl: z.string(),
    role: z.enum([
      "AGENCY_OWNER",
      "AGENCY_ADMIN",
      "SUBACCOUNT_USER",
      "SUBACCOUNT_GUEST",
    ]),
  });

  const form = useForm<z.infer<typeof userDataSchema>>({
    resolver: zodResolver(userDataSchema),
    mode: "onChange",
    defaultValues: {
      name: userData?.name ?? data?.user?.name,
      email: userData?.email ?? data?.user?.email,
      avatarUrl: userData?.avatarUrl ?? data?.user?.avatarUrl,
      role: userData?.role ?? data?.user?.role,
    },
  });

  useEffect(() => {
    if (!data.user) return;
    const getPermissions = async () => {
      const permissions = await getUserPermissions(data.user.id);
      setSubAccountPermissions(permissions);
    };
    getPermissions();
  }, [data, form]);

  useEffect(() => {
    if (data.user) form.reset(data.user);
    if (userData) form.reset(userData);
  }, [userData, data, form]);

  /* LOGIC UNCHANGED */

  return (
    <Card
      className="
        w-full rounded-2xl border
        bg-white dark:bg-[#101010]
        border-neutral-200 dark:border-neutral-800
        shadow-[0_32px_64px_-20px_rgba(0,0,0,0.65)]
      "
    >
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-black dark:text-white">
          User_Details
        </CardTitle>
        <CardDescription className="text-neutral-600 dark:text-neutral-400">
          Manage profile information and access permissions
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})} className="space-y-5">
            {/* AVATAR */}
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile_Picture</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="avatar"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* NAME */}
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full_Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* EMAIL */}
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      readOnly={
                        userData?.role === "AGENCY_OWNER" ||
                        form.formState.isSubmitting
                      }
                      className="bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* ROLE */}
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User_Role</FormLabel>
                  <Select
                    defaultValue={field.value}
                    disabled={field.value === "AGENCY_OWNER"}
                    onValueChange={(value) => {
                      if (
                        value === "SUBACCOUNT_USER" ||
                        value === "SUBACCOUNT_GUEST"
                      ) {
                        setRoleState(
                          "Sub-accounts are required for this role"
                        );
                      } else {
                        setRoleState("");
                      }
                      field.onChange(value);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700">
                        <SelectValue placeholder="Select role..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AGENCY_ADMIN">
                        Agency Admin
                      </SelectItem>
                      {(data?.user?.role === "AGENCY_OWNER" ||
                        userData?.role === "AGENCY_OWNER") && (
                        <SelectItem value="AGENCY_OWNER">
                          Agency Owner
                        </SelectItem>
                      )}
                      <SelectItem value="SUBACCOUNT_USER">
                        Sub Account User
                      </SelectItem>
                      <SelectItem value="SUBACCOUNT_GUEST">
                        Sub Account Guest
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {roleState && (
                    <p className="text-sm text-amber-500 mt-1">
                      {roleState}
                    </p>
                  )}
                </FormItem>
              )}
            />

            {/* SAVE */}
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="
                w-full py-6
                bg-black text-white
                dark:bg-white dark:text-black
                hover:opacity-90
              "
            >
              {form.formState.isSubmitting ? (
                <Loading />
              ) : (
                "Save_User_Details"
              )}
            </Button>

            {/* PERMISSIONS */}
            {authUserData?.role === "AGENCY_OWNER" && (
              <>
                <Separator className="my-6 bg-neutral-200 dark:bg-neutral-800" />

                <FormLabel>User_Permissions</FormLabel>
                <FormDescription className="text-neutral-600 dark:text-neutral-400">
                  Grant sub-account access individually
                </FormDescription>

                <div className="space-y-3">
                  {subAccounts?.map((subAccount) => {
                    const permission =
                      subAccountPermissions?.Permissions.find(
                        (p) => p.subAccountId === subAccount.id
                      );

                    return (
                      <div
                        key={subAccount.id}
                        className="
                          flex items-center justify-between
                          rounded-xl border p-4
                          bg-neutral-50 dark:bg-neutral-900
                          border-neutral-200 dark:border-neutral-800
                        "
                      >
                        <p className="text-black dark:text-white">
                          {subAccount.name}
                        </p>

                        <Switch
                          disabled={loadingPermissions}
                          checked={permission?.access}
                          onCheckedChange={(val) =>
                            changeUserPermission(
                              permission?.id ?? v4(),
                              data.user.email,
                              subAccount.id,
                              val
                            )
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserDetails;
