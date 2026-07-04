// Mock Api Client Configuration
export const mockDelay = (ms: number = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiClient = {
  get: async <T>(url: string): Promise<T> => {
    await mockDelay();
    throw new Error(`Endpoint ${url} not implemented in mock environment.`);
  },
  post: async <T>(url: string, _body: any): Promise<T> => {
    await mockDelay();
    throw new Error(`Endpoint ${url} not implemented in mock environment.`);
  }
};
