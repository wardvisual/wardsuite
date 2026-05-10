import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { Supplier } from '@/src/types';

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'suppliers'));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Supplier));
        setSuppliers(list);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'suppliers');
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const addSupplier = async (data: Omit<Supplier, 'id'>) => {
    try {
      await addDoc(collection(db, 'suppliers'), {
        ...data,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'suppliers');
    }
  };

  return { suppliers, loading, addSupplier };
}
