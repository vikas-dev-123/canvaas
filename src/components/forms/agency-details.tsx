'use client'

import { Agency } from '@prisma/client'
import React, { useState } from 'react'
import {useToast} from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { AlertDialog } from '../ui/alert-dialog';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
type Props = {
data?:Partial<Agency>
}

const  AgencyDetails = ({data}:Props) => {
    const { toast } = useToast();
    const router = useRouter();
    const [deletingCompany, setDeletingCompany] = useState(false);
    
  return (
     <AlertDialog>
        <Card>
            <CardHeader>
                <CardTitle>Agency Information</CardTitle>
                 <CardDescription>Lets create an agency for you business. You can edit agency settings later from the agency settings tab.</CardDescription>
            </CardHeader>
        </Card>
     </AlertDialog>
  )
}

export default  AgencyDetails
