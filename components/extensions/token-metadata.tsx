import { InputAsAddress } from "../input-as-address";
import { InputWithLabel } from "../input-with-label";

function TokenMetadata() {
  return (
    <div className="p-5">
      <InputWithLabel
        registrationField="extensions.tokenMetadata.name"
        placeholder="USD coin"
        label="Name of your token"
        defaultValue="Lorem"
      />
      <InputWithLabel
        registrationField="extensions.tokenMetadata.symbol"
        placeholder="USDC"
        label="Symbol of your token"
        className="uppercase placeholder:lowercase"
        defaultValue="LOR"
      />
      <InputWithLabel
        registrationField="extensions.tokenMetadata.uri"
        placeholder="Enter Uri of your token"
        label="Uri of your token"
        defaultValue="https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json"
      />
      <InputAsAddress
        placeholder="Enter Update Authority Address..."
        label="Update Authority Address"
        registrationField="extensions.tokenMetadata.updateAuthority"
      />
    </div>
  );
}

export { TokenMetadata };
