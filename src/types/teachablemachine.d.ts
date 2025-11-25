declare module "@teachablemachine/image" {
  export type Prediction = {
    className: string;
    probability: number;
  };

  export type CustomMobileNet = {
    predict(
      input:
        | HTMLVideoElement
        | HTMLImageElement
        | HTMLCanvasElement
        | ImageData
    ): Promise<Prediction[]>;
  };

  export function load(
    modelUrl: string,
    metadataUrl: string
  ): Promise<CustomMobileNet>;
}
