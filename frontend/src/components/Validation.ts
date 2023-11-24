'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

export const useValidation = (slug) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tenants`);
        const fetchedTenantId = response.data;

        const foundTenant = await fetchedTenantId.find((tenant) => tenant.name === slug);
        
        if (foundTenant) {
          setIsLoading(false);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching tenant ID:', error);
      }
    };

    fetchData();
    
  }, []);

  return isLoading;
};
