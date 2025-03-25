'use client';

import Link from 'next/link';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import { ThemeToggle } from './comps';
import { useCredits } from '@/hooks/useCredits';
import { P } from '../typography';

const NavBar = () => {
  const { credits } = useCredits();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto  px-4  flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 w-[200px]">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">ST</span>
          </div>
          <span className="font-bold text-xl">Strive</span>
        </Link>
        <div className="flex items-center gap-2">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">Courses</MenubarTrigger>
              <MenubarContent>
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
          <P className="text-sm font-medium mr-2 opacity-80">Cr. {credits}</P>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default NavBar;
