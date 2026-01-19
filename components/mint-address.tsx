"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { RefreshCwIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

function MintAddress({
  mintAddress,
  generateNewMint,
}: {
  mintAddress?: string;
  generateNewMint: () => void;
}) {
  return (
    <div>
      <Label htmlFor="mint-address">Mint address</Label>
      <InputGroup>
        <InputGroupInput
          className="disabled:opacity-80"
          id="mint-address"
          placeholder="Your mint address"
          value={mintAddress ? mintAddress : ""}
          disabled
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton onClick={generateNewMint}>
            {!mintAddress && <Spinner />}
            <RefreshCwIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

export { MintAddress };
