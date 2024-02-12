INVIOLABL
---------
Technologies: NextJS, Clerk, NestJS, Alchemy, Filecoin and Privy.

**Roles**

**Admin**
- creates org
- completes profile
- creates wallet, attach wallet & maintains wallet
- invites uses
- does user mgmt for the org
- audits transaction on the wallet

**Non-Admin/Members**
- joins invited org
- completes profile
- upload files and shares it with users
- download shared files
- audits his own transactions on the platform
- Views notification on the platform

**Basic flow** 
- Admin of org11
- joins the platforms, create the org 1 and attaches a wallet to the org as part of the profile completion
- -invites non-admin or admin users to the platform
- --Invited members join the org
- --- Admin/Non-admin members upload the file and share it within the org or outside the org (with email)
- --- Gas fee gets deducted for the upload and sharing and notification is sent to the other party
- The other user is not part of the same org, creates and joins org2, and then attaches his wallet .. like admin of org 1
- - The other user can download the file from the filecoin by paying the gas fees (from the wallet of the parent org aka org2)
 
**Open Points**
- error handling use cases to be covered for the POC
- simplified stack i.e. clerk for identity and/or wallet through privy or alchemy
