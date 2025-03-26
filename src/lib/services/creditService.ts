'use server';
import { getCurrentUser } from '../auth';
import mongoDb from '../mongo/db';
import CreditModel from '../mongo/models/CreditModel';

export const getCreditsService = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not found');
  }
  await mongoDb();

  const credit = await CreditModel.findOne({ user: user.id });
  return credit?.value || 0;
};

export const useCreditsService = async (value: number) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not found');
  }
  await mongoDb();

  const credit = await CreditModel.findOne({ user: user.id });
  if (!credit) {
    throw new Error('Credit not found');
  }
  credit.value = Math.max(0, credit.value - value);
  await credit.save();
};

export const addCreditsService = async (value: number) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not found');
  }
  await mongoDb();

  const credit = await CreditModel.findOne({ user: user.id });
  if (!credit) {
    throw new Error('Credit not found');
  }
  credit.value += value;
  await credit.save();
};
