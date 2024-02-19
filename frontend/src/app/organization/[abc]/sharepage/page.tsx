'use client'
import { useState } from 'react';
import AddRoleModal from '@/components/AddRoleModal';
import RolesTable from '@/components/RolesTable';
import Dashboard from '@/components/Dashboard';
import ShareTable from '@/components/ShareTable';
import { ShareIcon } from '@heroicons/react/24/solid'
import { ShareModal } from '@/components/ShareModal';
import { currentUser, useOrganization, useUser } from '@clerk/nextjs';
import InvitationList from '@/components/InvitationList';
import MemberList from '@/components/MemberList';
import axios from 'axios';

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { organization } = useOrganization();
  const [emailAddress, setEmailAddress] = useState('');
  const [role, setRole] = useState<'basic_member' | 'admin'>('basic_member');
  const [disabled, setDisabled] = useState(false);
  const { invitationList } = useOrganization({ invitationList: {} });
  const [shares, setShares] = useState([
    { id: 1, email: 'balajikrishna44589@gmail.com', status: "Invite Sent" },
    { id: 2, email: 'rajkumar@gmail.com', status: "Invite Accepted" }
  ]);

  const { user } = useUser();

  const {
    organization: currentOrganization,
    membership,
    isLoaded,
  } = useOrganization();

  const isAdmin = membership?.role === "admin";

  const sendInvite = (email) => {
    const newShare = { id: shares.length + 1, email, status: "Invite Sent" };
    setShares([...shares, newShare]);
  };

  // const onSubmit = async e => {
  //   e.preventDefault();
  //   setDisabled(true);
  //   await organization.inviteMember({ emailAddress, role });
  //   setEmailAddress('');
  //   setRole('basic_member');
  //   setDisabled(false);
  // };

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    try {
      const inviteData = {
        emailAddress: emailAddress,
        organizationId: organization.id,
        inviterUserId: user.id,
        role: role,
        redirectUrl: `https://alpha.inviolabl.io/organization/${organization.name}/dashboard`
      };
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clerk/invite-user`, inviteData);
      console.log(response.data.message);
      setEmailAddress('');
      setRole('basic_member');
    } catch (error) {
      console.error('Error sending invitation:', error.message);
    } finally {
      setDisabled(false);
    }
  };

  console.log(invitationList)

  return (
    <Dashboard>

      <div className="min-h-screen bg-white">

        {/* <ShareModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSend={sendInvite} /> */}
        <div className="flex items-center gap-3 bg-white">
          <h1 className="text-xl font-bold mt-14 pl-10 py-5 w-full bg-slate-100">Invite</h1>
        </div>
        <div className='p-10'>
          <form onSubmit={onSubmit}>
            <div className='flex items-center border-b border-gray-500 py-2 mb-5 mt-5 px-2'>
              <input
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 leading-tight focus:outline-none"
                type="text"
                disabled={!isAdmin}
                placeholder="Email address"
                value={emailAddress}
                onChange={e => setEmailAddress(e.target.value)}
              />
            </div>
            <label className='px-2 cursor-pointer'>
              <input
                type="radio"
                disabled={!isAdmin}
                checked={role === 'admin'}
                onChange={() => {
                  setRole('admin');
                }}
              />{' '}
              Admin
            </label>
            <label className='px-2 cursor-pointer'>
              <input
                type="radio"
                disabled={!isAdmin}
                checked={role === 'basic_member'}
                onChange={() => {
                  setRole('basic_member');
                }}
              />{' '}
              Member
            </label>{' '}
            <button
              type="submit"
              disabled={disabled || !isAdmin}
              className="py-2 mt-5 flex justify-between text-white items-center bg-[#8364E2] hover:shadow-xl hover:bg-purple-700 rounded-md px-4 text-sm font-semibold">
              <span>Invite</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="ms-2 fill-white" height="1em" viewBox="0 0 320 512"><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" /></svg>
            </button>
          </form>
        </div>
        {invitationList?.length > 0 && <div className="flex items-center gap-3 bg-white">
          <h1 className="text-xl font-bold mt-14 pl-10 py-5 w-full bg-slate-100">Pending Invitations</h1>
          {/* <ShareIcon height={18} width={18} onClick={() => setIsModalOpen(true)} className='cursor-pointer text-blue-700'/> */}
        </div>}

        {invitationList?.length > 0 && <ShareTable shares={invitationList} />}
      </div>
    </Dashboard>
  );
}
