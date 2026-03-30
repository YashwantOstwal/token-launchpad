import { InputAsAddress } from "../input-as-address";
import { InputWithLabel } from "../input-with-label";

import {
  FieldSet,
  FieldLegend,
  FieldDescription,
  FieldGroup,
} from "../ui/field";

function TokenMetadata() {
  return (
    <FieldSet>
      <FieldLegend>Token metadata</FieldLegend>
      <FieldDescription>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ex,
        perferendis.
      </FieldDescription>
      <FieldGroup>
        <InputWithLabel
          registrationField="extensions.TokenMetadata.name"
          placeholder="USD coin"
          label="Name of your token"
          defaultValue="Lorem"
        />
        <InputWithLabel
          registrationField="extensions.TokenMetadata.symbol"
          placeholder="USDC"
          label="Symbol of your token"
          className="uppercase placeholder:lowercase"
          defaultValue="LOR"
        />
        <InputWithLabel
          registrationField="extensions.TokenMetadata.uri"
          placeholder="Enter Uri of your token"
          label="Uri of your token"
          defaultValue="https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json"
        />
        <InputAsAddress
          placeholder="Enter Update Authority Address..."
          label="Update Authority Address"
          registrationField="extensions.TokenMetadata.updateAuthority"
        />
      </FieldGroup>
    </FieldSet>
  );
}

export { TokenMetadata };
