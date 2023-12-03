import { useAuth, useOrganizationList, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEventHandler, useState } from "react";
import { toast } from "react-toastify";

export default function CreateOrganization() {
    const { createOrganization, setActive } = useOrganizationList();
    const [organizationName, setOrganizationName] = useState("");
    const { isLoaded, isSignedIn, user } = useUser();
    const {  userId, sessionId, getToken } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const router = useRouter();

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        try {
            const organization = await createOrganization({ name: organizationName });
            setOrganizationName("");
            setActive({ organization });
            const tenantData = {
                "name": organization.name,
                "domain": organization.id,
                "email": user?.primaryEmailAddress.emailAddress,
                "phone": "12345678"
            };

            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tenants`, tenantData, {
                headers: {
                  'Session_id': sessionId,
                },
            })
            .then(tenantResponse => {
                console.log(tenantResponse.data);
                // toast.success(`Hi ${name}, a tenant with the domain ${organizationName}.inviolabl.com has been created, and a user has been associated. You will receive an email notification.`, {
                //     pauseOnHover: true,
                //     theme: 'colored',
                //     progressStyle: { background: 'rgb(216 180 254)' },
                //     style: { background: 'rgb(126 34 206)' },
                // });
            });
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error');
        }
    };

    return (
        <form className="w-full" onSubmit={handleSubmit}>
            <div className="flex items-center border-b border-gray-500 py-2 mb-8">
                <input
                    className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 px-2 leading-tight focus:outline-none"
                    type="text"
                    placeholder="Organization Name"
                    name="organizationName"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.currentTarget.value)}
                />
            </div>
            {/* <button type="submit">Create organization</button> */}
            <button
                type="submit"
                className="py-2 flex justify-between text-white items-center bg-[#8364E2] hover:shadow-xl hover:bg-purple-700 rounded-md px-4 text-sm font-semibold">
                <span>Create organization</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="ms-2 fill-white" height="1em" viewBox="0 0 320 512"><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" /></svg>
            </button>

        </form>
    );
}
