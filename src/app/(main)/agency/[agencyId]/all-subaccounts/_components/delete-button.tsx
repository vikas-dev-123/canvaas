"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useToast } from "@/components/ui/use-toast";

type Props = {
    subaccountId: string;
};

const DeleteButton = ({ subaccountId }: Props) => {
    const router = useRouter();

    const { toast } = useToast();
    
    const handleDelete = async () => {
        try {
            // Call API route to delete the subaccount
            const res = await fetch(`/api/subaccount/${subaccountId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!res.ok) {
                throw new Error(`Failed to delete subaccount: ${res.statusText}`);
            }
            
            toast({
                title: "Deleted Sub Account",
                description: "The subaccount has been deleted successfully",
            });
            
            router.refresh();
        } catch (error) {
            console.error("Error deleting subaccount:", error);
            toast({
                title: "Error",
                description: "Failed to delete subaccount",
                variant: "destructive",
            });
        }
    };
    
    return (
        <div
            onClick={handleDelete}
        >
            Delete Sub Account
        </div>
    );
};

export default DeleteButton;