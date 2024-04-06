import React, {useContext, useEffect, useState} from 'react';
import { RouteComponentProps } from 'react-router';
import {
  createAnimation,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonLabel,
  IonList, IonLoading,
  IonPage, IonSearchbar, IonSelect, IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import {add, logOut} from 'ionicons/icons';
import Item from './Item';
import {getLogger, useNetwork} from '../core';
import { ItemContext } from './ItemProvider';
import {AuthContext} from "../auth";
import "./ItemList.css"
import {MyModal} from "./MyModal";

const log = getLogger('ItemList');

let MAX_PER_PAGE=5;

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {
  const { items, fetching, fetchingError,savingError } = useContext(ItemContext);
  const {logout}=useContext(AuthContext);

  const [end, setEnd] = useState(MAX_PER_PAGE);
  const [start, setStart] = useState(0);

  async function searchNext($event: CustomEvent<void>) {
    setEnd(end+MAX_PER_PAGE);
    ($event.target as HTMLIonInfiniteScrollElement).complete();
  }

  const [searchText, setSearchText] = useState('');

  const [wasDelivered, setWasDelivered] = useState('all');

  useEffect(()=>{
    setEnd(MAX_PER_PAGE);
  },[searchText,wasDelivered])

  useEffect(() => {
    const el = document.querySelector('.square-a');
    if (el) {
      const rotateAnimation = createAnimation()
          .addElement(el)
          .duration(3000)
          .iterations(Infinity)
          .keyframes([
            { offset: 0, transform: 'rotate(0deg) scale(1.3)', opacity: '1' },
            { offset: 0.2, transform: 'rotate(72deg) scale(0.6)', opacity: '0.6' },
            { offset: 0.4, transform: 'rotate(144deg) scale(0.2)', opacity: '0.2' },
            { offset: 0.6, transform: 'rotate(216deg) scale(0.2)', opacity: '0.2' },
            { offset: 0.8, transform: 'rotate(288deg) scale(0.6)', opacity: '0.6' },
            { offset: 1, transform: 'rotate(360deg) scale(1.3)', opacity: '1' }
          ]);
  
      rotateAnimation.play();
    }
  }, []);


  log('render');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Car Dealership</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="square-a">
          <p>LIST OF CARS</p>
        </div>
        <div><MyModal/></div>
        <IonItem>Filter (delivered/not delivered):</IonItem>
        <IonSelect value={wasDelivered} placeholder="Select Reception" onIonChange={e => setWasDelivered(e.detail.value)}>
          {['true','false','all'].map(option => <IonSelectOption key={option} value={option}>{option}</IonSelectOption>)}
        </IonSelect>
        <IonItem>Search by name of the car:</IonItem>
        <IonSearchbar
            value={searchText}
            debounce={1000}
            onIonChange={e => setSearchText(e.detail.value||'')}>
        </IonSearchbar>
        {savingError && (
            <div>{'Failed to save item to server - storing locally'}</div>
        )}
        {fetchingError && (
            <div>{fetchingError.message || 'Failed to fetch items'}</div>
        )}
        <IonLoading isOpen={fetching} message="Fetching items"/>
        {items && (
          <IonList>
            {items.filter((item)=> item.text.startsWith(searchText))
                .filter((item)=> wasDelivered==="all"? true : wasDelivered === item.delivered.toString())
                .slice(start,end).map(({ _id,  warrantyExp, delivered, numberOfCars,text,photo }) =>
              <Item key={_id} _id={_id} warrantyExp={warrantyExp} delivered={delivered} numberOfCars={numberOfCars} text={text} photo={photo} onEdit={id => history.push(`/item/${id}`)} onDelete={() => {}}/>)}
          </IonList>
        )}

        <IonInfiniteScroll threshold="100px" disabled={false}
                          onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
          <IonInfiniteScrollContent
              loadingText="Loading more items...">
          </IonInfiniteScrollContent>
        </IonInfiniteScroll>

        <IonFab vertical="bottom" horizontal="start" slot="fixed">
          <IonFabButton onClick={() => {
            logout?.();
            history.push('/login')
          }}>
            <IonIcon icon={logOut}/>
          </IonFabButton>
        </IonFab>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/item')}>
            <IonIcon icon={add}/>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ItemList;