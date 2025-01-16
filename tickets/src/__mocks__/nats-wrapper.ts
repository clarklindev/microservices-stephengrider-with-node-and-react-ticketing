export const natsWrapper = {
  client: {
    publish:
      //MOCK FUNCTION
      jest.fn().mockImplementation(  
        (
          subject: string, data: string, callback: () => void) => {
          callback();
        }
      )
  }
};