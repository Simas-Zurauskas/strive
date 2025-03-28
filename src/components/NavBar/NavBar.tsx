'use client';
import Link from 'next/link';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import { ThemeToggle } from './comps';
import { useCredits } from '@/hooks/useCredits';
import { P } from '../typography';
import Logo from '../Logo';

const NavBar = () => {
  const { credits, loading } = useCredits();

  return (
    <header className="sticky top-0 z-50000 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto  px-4  flex h-14 items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 w-[200px]">
          <Logo />
          <span
            className="font-bold text-xl hidden md:block"
            style={{ fontFamily: 'jost', letterSpacing: '0.15em', fontSize: '1.1em' }}
          >
            STRIVE
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">Courses</MenubarTrigger>
              <MenubarContent>
                <MenubarItem className="cursor-pointer" asChild>
                  <Link href="/dashboard">Home</Link>
                </MenubarItem>
                <MenubarItem className="cursor-pointer" asChild>
                  <Link href="/courses">My Courses</Link>
                </MenubarItem>
                <MenubarItem className="cursor-pointer" asChild>
                  <Link href="/courses/edit">Create New</Link>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">Account</MenubarTrigger>
              <MenubarContent>
                <MenubarItem className="cursor-pointer" asChild>
                  <Link href="/profile">Settings</Link>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
        <div className="w-[200px] flex items-center justify-end">
          {!loading && <P className="text-sm font-medium mr-2 opacity-80">Cr. {credits}</P>}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default NavBar;
