import React, { useState } from 'react';
import { createAnimation, IonModal, IonButton, IonContent } from '@ionic/react';
import { useNetwork } from '../core';

export const MyModal: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { networkStatus } = useNetwork();

  const enterAnimation = (baseEl: any) => {
    const root = baseEl;
    const backdropAnimation = createAnimation()
      .addElement(root.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = createAnimation()
      .addElement(root.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0.8)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' }
      ]);

    return createAnimation()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  const leaveAnimation = (baseEl: any) => {
    return enterAnimation(baseEl).direction('reverse');
  };

  return (
    <>
      <IonModal isOpen={showModal} enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
        <IonContent>
          <div className="modal-content">
            <p>Network status: {networkStatus.connected ? 'Connected' : 'Not Connected'}</p>
            <p>The connection type of the app is {networkStatus.connectionType}</p>
            <IonButton onClick={() => setShowModal(false)} className="close-button">
              X
            </IonButton>
          </div>
        </IonContent>
      </IonModal>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <IonButton onClick={() => setShowModal(true)}>Check connection</IonButton>
      </div>
    </>
  );
};
