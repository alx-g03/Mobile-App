import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  IonButton,
  IonButtons, IonCheckbox,
  IonContent, IonDatetime, IonFab, IonFabButton,
  IonHeader, IonIcon, IonImg,
  IonInput, IonItem, IonLabel,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import {getLogger, useMyLocation, usePhotos} from '../core';
import { ItemContext } from './ItemProvider';
import { RouteComponentProps } from 'react-router';
import { ItemProps } from './ItemProps';
import {camera} from "ionicons/icons";
import MyMap from "./MyMap";

const log = getLogger('ItemEdit');

interface ItemEditProps extends RouteComponentProps<{
  id?: string;
}> {}

const ItemEdit: React.FC<ItemEditProps> = ({ history, match }) => {
  const { items, saving, savingError, saveItem } = useContext(ItemContext);
  const [warrantyExp, setWarrantyExp] = useState<Date>(new Date());
  const [delivered, setDelivered] = useState<boolean>(false);
  const [numberOfCars, setNumberOfCars] = useState<number>(0);
  const [text, setText] = useState('');
  const [item, setItem] = useState<ItemProps>();

  const [photo, setPhoto] = useState<string|undefined>('');

  const [latitude, setLatitude] = useState<number|undefined>(0);
  const [longitude, setLongitude] = useState<number|undefined>(0);

  const myLocation = useMyLocation();
  const { latitude: lat, longitude: lng } = myLocation.position?.coords || {}

  useEffect(() => {
    log('useEffect');
    const routeId = match.params.id || '';
    const item = items?.find(it => it._id === routeId);
    setItem(item);
    if (item) {
      setWarrantyExp(item.warrantyExp);
      setDelivered(item.delivered)
      setNumberOfCars(item.numberOfCars);
      setText(item.text);
      setPhoto(item.photo);
      setLatitude(item.latitude||lat);
      setLongitude(item.longitude||lng);
    }else{
      setLatitude(lat);
      setLongitude(lng);
    }
  }, [match.params.id, items,lat,lng]);
  
  const handleSave = () => {
    const editedItem = item ? { ...item, warrantyExp, delivered, numberOfCars, text, photo, latitude, longitude } : { warrantyExp, delivered, numberOfCars, text, photo, latitude, longitude };
    saveItem && saveItem(editedItem).then(() => history.goBack());
  };


  const {photos, takePhoto, deletePhoto,}=usePhotos();
  const [photoTaken, setPhotoTaken]=useState(false);

  useEffect(() => {
    log('useEffect');
    photoTaken && photos && photos[0] && photos[0].webviewPath && setPhoto(photos[0].webviewPath)
  }, [photos,photoTaken]);

  log('render');
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add/Edit</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave}>
              Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          {photo &&
              <IonImg src={photo}
                      onClick={() => setPhoto('')}/>}
        </IonItem>
        {latitude && longitude &&
            <IonItem>
              <MyMap
                  lat={latitude}
                  lng={longitude}
                  onMapClick={(position)=>{
                    setLatitude(position.latitude);
                    setLongitude(position.longitude);
                  }}
                  onMarkerClick={()=>log('onMarker')}
              />
            </IonItem>
        }
        <IonItem>
          <IonLabel>Warranty Expiration Date:</IonLabel>
          <IonDatetime
              value={warrantyExp.toString()}
              onIonChange={e => setWarrantyExp(e.detail.value ? new Date(e.detail.value) : new Date())}
              displayFormat="YYYY-MM-DD"
          />
        </IonItem>
        <IonItem>
          <IonLabel>Delivered:</IonLabel>
          <IonCheckbox
              checked={delivered}
              onIonChange={e => setDelivered(e.detail.checked || false)}
          />
        </IonItem>
        <IonItem>
          <IonLabel>Number of cars:</IonLabel>
          <IonInput
              value={numberOfCars}
              type="number"
              onIonChange={e => setNumberOfCars(Number(e.detail.value) || 0)}
          />
        </IonItem>
        <IonItem>
          <IonLabel>Name of the car:</IonLabel>
        </IonItem>
        <IonInput value={text} onIonChange={e => setText(e.detail.value || '')} />
        <IonLoading isOpen={saving} />
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={async () => {
            try {
              await takePhoto();
              setPhotoTaken(true);
            }
            catch (e){

            }
          }}>
            <IonIcon icon={camera}/>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ItemEdit;
