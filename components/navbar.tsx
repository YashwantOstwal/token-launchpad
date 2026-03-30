"use client";

import ConnectButton from "./connect-button";

export function Navbar() {
  return (
    <div className="fixed top-0 inset-x-0 p-1 px-3 flex justify-end">
      <ConnectButton />
    </div>
  );
}
