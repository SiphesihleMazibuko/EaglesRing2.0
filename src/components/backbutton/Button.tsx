
import React from 'react'
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';

const BackButton = () => {
    const router = useRouter();
  return (
    <Button
        onClick={() => router.back()}
        className="absolute top-4 left-10 text-white bg-gradient-to-r from-[#917953] to-[#CBAC7C] font-semibold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:text-[#917953] hover:bg-transparent border border-[#917953]"
      >
        <ArrowLeft />

      </Button>
  )
}

export default BackButton