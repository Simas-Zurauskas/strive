'use server';
import mongoDb from '../mongo/db';
import CreditModel from '../mongo/models/CreditModel';

export const getCreditsService = async (email: string) => {
  await mongoDb();

  const credit = await CreditModel.findOne({ email });
  return credit?.value || 0;
};

export const useCreditsService = async (email: string, value: number) => {
  await mongoDb();

  const credit = await CreditModel.findOne({ email });
  if (!credit) {
    throw new Error('Credit not found');
  }
  credit.value -= value;
  await credit.save();
};

export const addCreditsService = async (email: string, value: number) => {
  await mongoDb();

  const credit = await CreditModel.findOne({ email });
  if (!credit) {
    throw new Error('Credit not found');
  }
  credit.value += value;
  await credit.save();
};
