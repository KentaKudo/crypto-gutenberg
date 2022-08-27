import addresses from "../cache/addresses.json";

interface ContractAddresses {
  archive: string;
  botchan: string;
  winnieThePooh: string;
}

const getContractAddresses = (chainId: number): ContractAddresses => {
  const addrs: Record<string, ContractAddresses> = addresses;
  if (!addrs[chainId]) {
    throw new Error(
      `Unknown chain id (${chainId}). No known contracts have been deployed on this chain.`
    );
  }
  return addrs[chainId];
};

export { getContractAddresses };
