import { client } from '../client';
import { ApiResponse } from '../types';

// ----------------------------------------------------------------------------------------
type GenerateModule = (params: { identifier: { uxId: string; moduleId: string } }) => Promise<ApiResponse<unknown>>;

export const generateModule: GenerateModule = (data) => {
  return client({
    url: `/generate-module`,
    method: 'POST',
    data,
  }).then((res) => res.data);
};
