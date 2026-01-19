import { InputAsAddress } from "../input-as-address";
import { InputWithLabel } from "../input-with-label";

function InterestBearingTokens() {
  return (
    <div className="p-5">
      <InputWithLabel
        registrationField="extensions.interestBearingTokens.rate"
        label="Interst rate in BPs (100BPs = 1%)"
        placeholder="100 (1%)"
        type="number"
        defaultValue={100}
      />
      <InputAsAddress
        placeholder="Enter Rate Authority Address..."
        label="Rate Authority Address"
        registrationField="extensions.interestBearingTokens.rateAuthority"
      />
    </div>
  );
}

export { InterestBearingTokens };
