'use client'; // Ensure this is client side

import { logoutUser } from '@/services/auth/logout';
import { signOut } from 'next-auth/react'; // Import signOut
import React from 'react';
import { Button } from '../ui/button';

const Logoutbutton = () => {
    const handleLogout = async () => {
        // 1. Clear NextAuth Session (for Google Users)
        // We don't use redirect: true here yet, we handle redirect manually or let logoutUser handle it
        await signOut({ redirect: false }); 

        // 2. Clear Custom Cookies (for Email/Password Users)
        await logoutUser();
        
        // Note: logoutUser in your code does a server-side redirect. 
        // If that conflicts with signOut, you might need to adjust logic, 
        // but typically running both ensures clean slate.
    };

    return (
        <div>
            <Button variant="gradient" onClick={handleLogout}>
                Log Out
            </Button>
        </div>
    );
};

export default Logoutbutton;