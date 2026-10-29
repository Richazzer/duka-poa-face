import api from '../../../services/api';

export const queryAiAssistant = async (question) => {
  const response = await api.post('/ai/query/', { question });
  return response.data;
};
