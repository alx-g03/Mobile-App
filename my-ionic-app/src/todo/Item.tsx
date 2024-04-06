import React from 'react';
import { IonImg, IonItem, IonLabel, IonButton } from '@ionic/react';
import { ItemProps } from './ItemProps';

interface ItemPropsExt extends ItemProps {
  onEdit: (_id?: string) => void;
  onDelete: (_id?: string) => void;
}

const Item: React.FC<ItemPropsExt> = ({ _id, text, photo, onEdit, onDelete }) => {
  return (
    <IonItem>
      {photo && <IonImg src={photo} />}
      <IonLabel>{text}</IonLabel>
      <IonButton onClick={() => onDelete(_id)}>Delete</IonButton>
      <IonButton onClick={() => onEdit(_id)}>Edit</IonButton>
    </IonItem>
  );
};

export default Item;
