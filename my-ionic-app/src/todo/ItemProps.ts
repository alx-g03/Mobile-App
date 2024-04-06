export interface ItemProps {
  _id?: string;
  _failed?: boolean;
  warrantyExp: Date;
  delivered: boolean;
  numberOfCars: number;
  text: string;
  photo?: string;
  latitude?: number|undefined
  longitude?: number|undefined
}
