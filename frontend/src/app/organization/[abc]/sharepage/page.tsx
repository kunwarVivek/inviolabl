'use client'
import { Fragment, useEffect, useState } from 'react';
import AddRoleModal from '@/components/AddRoleModal';
import RolesTable from '@/components/RolesTable';
import Dashboard from '@/components/Dashboard';
import ShareTable from '@/components/ShareTable';
import { ShareIcon } from '@heroicons/react/24/solid'
import { ShareModal } from '@/components/ShareModal';
import { OrganizationList, OrganizationProfile, currentUser, useOrganization, useUser } from '@clerk/nextjs';
import InvitationList from '@/components/InvitationList';
import MemberList from '@/components/MemberList';
import axios from 'axios';
import MagicBellClient, { Notification } from '@magicbell/core';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';


export default function Page() {
  MagicBellClient.configure({ apiKey: '644b158683d2a357dc593625a99be3edc344a6fe', apiSecret: '8zQx0ykxUj89n9A7G6CmY5U+lcsjqNsqe7e/3VE0' });
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

  const [openOrgProfile, setOpenOrgProfile] = useState(false)

  const { user } = useUser();

  const router = useRouter();

  const {
    organization: currentOrganization,
    membership,
    isLoaded,
  } = useOrganization();

  useEffect(() => {
    const handleScroll = () => {
      router.replace(`https://alpha.inviolabl.io/organization/${currentOrganization?.name}/sharepage`)
    };
    handleScroll()
  }, [currentOrganization]);

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

  const closeModal = () => {
    setOpenOrgProfile(false);
  };

  const openModal = () => {
    setOpenOrgProfile(true)
  }



  const isAdmin = membership?.role === "admin";

  const onSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    try {
      const inviteData = {
        emailAddress: emailAddress,
        organizationId: organization.id,
        inviterUserId: user.id,
        role: role,
        redirectUrl: `http://localhost:3000/organization/${organization.name}/dashboard`
      };
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clerk/invite-user`, inviteData);
      console.log(response.data.message);
      const not = Notification.create({
        title: `Invitation to join ${organization.name}`,
        content: `You are invited to join the ${organization.name} organization by ${user?.primaryEmailAddress}.`,
        recipients: [{ email: emailAddress }],
      });
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
        <div className='flex justify-end p-10'>
          <button className="py-2 mt-5 flex justify-between text-white items-center bg-[#8364E2] hover:shadow-xl hover:bg-purple-700 rounded-md px-4 text-sm font-semibold" onClick={() => setOpenOrgProfile(true)}>Members list</button>
        </div>
        <div className='p-10 pt-0'>
          <form onSubmit={onSubmit}>
            <div className='flex items-center border-b border-gray-500 py-2 mb-5 mt-5 px-2'>
              <input
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 leading-tight focus:outline-none"
                type="text"
                placeholder="Email address"
                value={emailAddress}
                onChange={e => setEmailAddress(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={!emailAddress || disabled}
              className={`py-2 mt-5 flex justify-between text-white items-center bg-[#8364E2] ${!emailAddress ? "" : "hover:shadow-xl hover:bg-purple-700"} rounded-md px-4 text-sm font-semibold`}>
              <span>Invite</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="ms-2 fill-white" height="1em" viewBox="0 0 320 512"><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" /></svg>
            </button>
          </form>
        </div>
        {invitationList?.length > 0 && <div className="flex items-center gap-3 bg-white">
          <h1 className="text-xl font-bold pl-10 py-5 w-full bg-slate-100">Pending Invitations</h1>
          {/* <ShareIcon height={18} width={18} onClick={() => setIsModalOpen(true)} className='cursor-pointer text-blue-700'/> */}
        </div>}
        {invitationList?.length > 0 && <ShareTable shares={invitationList} />}
        <Transition appear show={openOrgProfile} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-max transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                    <div className="bg-transparent w-full">
                      <div className="container mx-auto p-6">
                        <OrganizationProfile />
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

      </div>
    </Dashboard>
  );
}
