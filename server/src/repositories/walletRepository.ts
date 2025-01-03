import WalleModel from "../models/WalletModel";

interface Transactions {
  description: string;
  amount: string | undefined;
  date: Date;
}

const createTransaction = async (transaction: Transactions, userId: string) => {
  try {
    const wallet = await WalleModel.findOne({ userId: userId });
    if (!wallet) {
      const newWallet = await WalleModel.create({
        userId: userId,
        balance: parseFloat(transaction.amount || "0"),
        transactions: [transaction],
      });
      if (newWallet) {
        console.log(newWallet);
        return newWallet;
      }
    } else {
      wallet.transactions.push(transaction);
      if (transaction.description === "Credit") {
        wallet.balance += parseFloat(transaction.amount || "0");
      } else {
        wallet.balance -= parseFloat(transaction.amount || "0");
      }

      await wallet.save();
      console.log(wallet);
      return wallet;
    }
  } catch (error) {
    throw new Error("Error in updating wallet");
  }
};

const getWallet = async (id: string) => {
  try {
    return await WalleModel.findOne({ userId: id });
  } catch (error) {
    throw new Error("Error in fetching wallet");
  }
};
export default { createTransaction, getWallet };
