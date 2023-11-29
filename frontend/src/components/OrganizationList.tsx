import { useOrganizationList } from "@clerk/nextjs";
import Link from "next/link";

const OrganizationList = () => {
    const { organizationList, isLoaded, setActive } = useOrganizationList();
    if (!isLoaded) {
        return null;
    }

    const swapOrg = (id) => {
        {setActive({ organization: id });}
    }

    return (
        <div className="bg-gray-100 p-6 pl-0">
            <h2 className="text-lg font-bold mb-4">Your organizations</h2>

            {organizationList.length === 0 ? (
                <div className="text-gray-500">You do not belong to any organizations yet.</div>
            ) : (
                <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {organizationList.map(({ organization }) => (
                        <li key={organization.id} className="bg-white p-4 rounded-lg overflow-hidden shadow-md">
                            {/* <Link legacyBehavior
                                href={`/organization/switcher?selected=${organization.id}`}
                                className="block p-4 hover:bg-gray-50"
                            >
                                <a className="text-blue-500 font-semibold">{organization.name}</a>
                            </Link> */}
                            <Link legacyBehavior
                            
                                href={`/organization/${organization.name}/dashboard`}
                                className="block p-4 hover:bg-gray-50"
                            >
                                <a onClick={() => swapOrg(organization.id)} className="text-blue-500 font-semibold">{organization.name}</a>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>

    );
};

export default OrganizationList;