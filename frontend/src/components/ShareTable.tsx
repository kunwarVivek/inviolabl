const ShareTable = ({ shares }) => {
  const shareOptions = ['Serial No.', 'Email', 'Date of Invite', 'Action'];

  const revoke = async (inv) => {
    await inv.revoke();
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    // Format the date as desired, for example: "YYYY-MM-DD HH:mm:ss"
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  }

  return (
    <div className="shadow overflow-hidden border-b border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr >
            {shareOptions.map((perm) => (
              <th key={perm} scope="col" className="px-6 py-3 pl-10 text-left text-sm font-medium text-gray-500  capitalize">
                {perm}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {shares?.map((i, index) => (
            <tr key={i.id}>
              <td className="px-6 pl-10 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {index+1}
              </td>
              <td className="px-6 pl-10 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {i.emailAddress}
              </td>
              <td className="px-6 pl-10 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {formatDate(i.createdAt)}
              </td>
              <td className="px-6 pl-10 py-4 whitespace-nowrap text-sm text-green-900 font-semibold ">
                <button onClick={() => revoke(i)}>Revoke</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShareTable;
