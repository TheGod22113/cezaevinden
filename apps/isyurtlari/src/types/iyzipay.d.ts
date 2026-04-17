declare module 'iyzipay' {
  class Iyzipay {
    constructor(config: {
      apiKey: string | undefined;
      secretKey: string | undefined;
      uri: string;
    });
    checkoutFormInitialize(request: any, callback: (err: any, result: any) => void): void;
  }
  export = Iyzipay;
}
