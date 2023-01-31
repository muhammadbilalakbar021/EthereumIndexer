import { Inject, Injectable } from '@nestjs/common';
import Web3 from 'web3';
import axios from 'axios';

@Injectable()
export class EthereumService {
  constructor(
    @Inject('EthWeb3')
    private readonly ethWeb3: Web3,
  ) {}

  async getBlockNumber() {
    try {
      const currentBlock = await this.ethWeb3.eth.getBlockNumber();
      return currentBlock;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getBlock(blockNumber: number) {
    try {
      return await this.ethWeb3.eth.getBlock(blockNumber);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getEthBalance(walletAddress: string) {
    const balance = await this.ethWeb3.eth.getBalance(walletAddress);
    return String(balance);
  }

  async getERC20Balance(
    tokenABI,
    contractAddress: string,
    walletAddress: string,
  ) {
    const contract = new this.ethWeb3.eth.Contract(tokenABI, contractAddress);
    const balance = await contract.methods.balanceOf(walletAddress).call();
    return String(balance);
  }

  async getNetworkFee() {
    try {
      const gasPrice = await axios.get(
        'https://ethgasstation.info/api/ethgasAPI.json?',
      );
      return {
        networkFeeAvg: gasPrice.data.average,
        networkFeeMax: gasPrice.data.fastest,
        networkFeeMin: gasPrice.data.safeLow,
      };
    } catch (error) {
      console.log('Error in getting fee');
    }
  }
}
