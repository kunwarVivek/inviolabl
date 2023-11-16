'use client'
import { useState } from 'react';
import AddRoleModal from '@/components/AddRoleModal';
import RolesTable from '@/components/RolesTable'; // Component that renders roles in a table
import Dashboard from '@/components/Dashboard';
import ShareTable from '@/components/ShareTable';

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const shares =[
    { id:1,email: 'balajikrishna44589@gmail.com', status: "Invite Sent" },
    { id:2,email: 'rajkumar@gmail.com', status: "Invite Accepted" }];

 

  return (
    <Dashboard>

    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Invite Status</h1>
      
      
      <ShareTable shares={shares}/>

   
    </div>
    </Dashboard>
  );
}
