import {
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  Rpc,
  RpcSubscriptions,
  type SolanaRpcApiDevnet,
  type SolanaRpcSubscriptionsApi,
} from "@solana/kit";

interface Connection {
  rpc: Rpc<SolanaRpcApiDevnet>;
  rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>;
  chain: "solana:devnet";
}

const connection: Connection = {
  rpc: createSolanaRpc("https://api.devnet.solana.com"),
  rpcSubscriptions: createSolanaRpcSubscriptions("wss://api.devnet.solana.com"),
  chain: "solana:devnet",
};

export { connection, type Connection };
