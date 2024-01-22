import React from "react";
import useCookies from './useCookies';
export default function TEST3() {
    const { getCookie } = useCookies('role');
    const userRole = getCookie();
    let role = [];
    try {
        role = userRole.split('+');
    } catch (error) {
        role = ["",0]
    }

    // console.log(userRole);
    return (
        <div>
            <h1>Welcome to the Dashboard</h1>

            {role[0] === 'Admin' && (
                <div>
                    <h2>Admin Section</h2>
                </div>
            )}

            {/* Common content for all users */}
            <p>This content is visible for all users.</p>
        </div>
    );
}