import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { ethers } from "ethers";

export const useChatbotVerifier = () => {
  const { data: chatbotVerifier } = useScaffoldContract({
    contractName: "ChatbotVerifier",
  });

  const registerVersion = async (
    version: string,
    modelHash: string,
    metadata: any
  ) => {
    if (!chatbotVerifier) return;

    const metadataBytes = ethers.utils.defaultAbiCoder.encode(
      ['string'],
      [JSON.stringify(metadata)]
    );

    const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(modelHash));
    
    const tx = await chatbotVerifier.registerVersion(version, hash, metadataBytes);
    await tx.wait();
    return tx.hash;
  };

  const verifyVersion = async (version: string) => {
    if (!chatbotVerifier) return;
    
    const tx = await chatbotVerifier.verifyVersion(version);
    await tx.wait();
    return tx.hash;
  };

  const isVersionVerified = async (version: string) => {
    if (!chatbotVerifier) return false;
    return await chatbotVerifier.isVersionVerified(version);
  };

  return {
    registerVersion,
    verifyVersion,
    isVersionVerified,
    contract: chatbotVerifier,
  };
}; 