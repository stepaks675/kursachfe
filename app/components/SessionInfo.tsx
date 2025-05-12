"use client";

import { useSession, signOut } from "next-auth/react";

export default function SessionInfo() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading session...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Not signed in</div>;
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg text-white">
      <h3 className="text-lg font-medium">Session Info</h3>
      <p>Signed in as: {session?.user?.email}</p>
      <p>Name: {session?.user?.name}</p>
      <button 
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
} 