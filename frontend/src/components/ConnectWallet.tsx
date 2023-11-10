'use client'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { TruncatedWalletAddress } from './TruncateFunction';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
const ConnectWallet =() => {
  const { data: session, status } = useSession();
  const router = useRouter()
  const MetaMaskAccount = useSelector((state: RootState) => state.metaMask.account);

  
  const handleConnect = () => {
    session?router.push("/"):router.push("/signin")
  }
  return (
    <div className={`${MetaMaskAccount&&'w-48'} text-white`}>
      {!MetaMaskAccount &&<button className='p-2 bg-red-700 rounded-md px-4' onClick={handleConnect}>Connect Wallet</button>}
      {MetaMaskAccount && <p className='text-center  p-2 w-fit rounded-md font-semibold'><span className='inline-block mt-1 bg-slate-300 p-1 rounded-md text-black px-4'>{TruncatedWalletAddress(MetaMaskAccount)}</span></p>}
    </div>
  );
}

export default ConnectWallet