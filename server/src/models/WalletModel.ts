import mongoose, { Schema, Model, Document } from "mongoose";

export interface IWallet {
  userId: Schema.Types.ObjectId;
  balance: number;
  transactions: {
    description: string;
    amount: string | undefined;
    date: Date;
  }[];
}

const WalletSchema: Schema<IWallet> = new Schema<IWallet>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Patient" },
    balance: { type: Number, required: true, default: 0 },
    transactions: [
      {
        description: { type: String, required: true },
        amount: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const WalleModel: Model<IWallet> = mongoose.model("Wallet", WalletSchema);

export default WalleModel;
