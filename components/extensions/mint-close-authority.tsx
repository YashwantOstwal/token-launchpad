import { InputAsAddress } from "../input-as-address";

function MintCloseAuthority() {
  return (
    <div className="p-5">
      <InputAsAddress
        placeholder="Enter Mint Close Authority Address..."
        label="Mint Close Authority Address"
        registrationField="extensions.mintCloseAuthority.closeAuthority"
      />
    </div>
  );
}

export { MintCloseAuthority };
