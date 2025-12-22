'use client';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  
  const handleSignUpClick = () => {
    router.push('/signup');
  };
  
  const handleSignInClick = () => {
    router.push('/signin');
  };
  
  return (
    <>
       <section className="h-full w-full pt-36 relative flex item-center justify-center flex-col ">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10"></div>
        <p className='text-center'>Build your own purpose</p>
        <div className='bg-gradient-to-r from-primary to-secondary-foreground 
        text-transparent bg-clip-text relative'>
          <h1 className='text-9xl font-bold text-center md:text-[300px]'>
              Canvaas
          </h1>
        </div>
        <div className='flex justify-center items-center relative md:mt[-70px]'>
          <Image src={'/assets/preview.png'}
           alt='image'
           height={700}
           width={700}
           className='rounded-tl-2xl rounded-tr-2xl border-2 border-muted'
           />
           <div className='bottom-0 top-[50%] bg-gradient-to-t dark:from-background left-0 right-0 absolute z-10'></div>
        </div>
       
       </section>
        <button 
          onClick={handleSignUpClick}
        >
          Sign Up
        </button>
        
        <button 
          onClick={handleSignInClick}
         >
          Sign In
        </button>
       
    </>
  );
}
