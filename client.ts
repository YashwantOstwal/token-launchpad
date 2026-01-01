import {
  appendTransactionMessageInstruction,
  type BaseTransactionMessage,
  type TransactionMessageWithFeePayer,
} from "@solana/kit";
import {
  estimateComputeUnitLimitFactory,
  getSetComputeUnitLimitInstruction,
} from "@solana-program/compute-budget";
import { connection, type Connection } from "./connection";

interface Client extends Connection {
  estimateAndSetComputeUnitLimit: ReturnType<
    typeof estimateAndSetComputeUnitLimitFactory
  >;
}

function estimateAndSetComputeUnitLimitFactory(
  ...inputs: Parameters<typeof estimateComputeUnitLimitFactory>
) {
  const estimateComputeUnitLimit = estimateComputeUnitLimitFactory(...inputs);
  return async <
    T extends BaseTransactionMessage & TransactionMessageWithFeePayer
  >(
    transactionMessage: T
  ) => {
    const units = await estimateComputeUnitLimit(transactionMessage);
    return appendTransactionMessageInstruction(
      getSetComputeUnitLimitInstruction({ units }),
      transactionMessage
    );
  };
}
function createClient() {
  return {
    ...connection,
    estimateAndSetComputeUnitLimit: estimateAndSetComputeUnitLimitFactory({
      rpc: connection.rpc,
    }),
  };
}

export { createClient, type Client };
