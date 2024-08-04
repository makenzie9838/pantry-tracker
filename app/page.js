"use client";
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDoc,
  querySnapshot,
  onSnapshot,
  query,
  deleteDoc,
  doc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";

export default function Home() {
  const [items, setItems] = useState([
    // { name: "Banana", amount: "1" },
    // { name: "Apple", amount: "2" },
    // { name: "Oranges", amount: "5" },
  ]);
  const [newItem, setNewItem] = useState({ name: "", amount: "" });
  const [total, setTotal] = useState(0);

  // Add Item from Database
  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.name !== "" && newItem.amount !== "") {
      // setItems([...items, newItem]);

      let itemsArr = [];
      const q = query(collection(db, "items"));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });

      const itemNames = itemsArr.map((item) => item.name);

      const itemNameTrimmed = newItem.name.trim();
      const existingItem = itemsArr.find(
        (item) => item.name === itemNameTrimmed
      );

      if (!existingItem) {
        await addDoc(collection(db, "items"), {
          name: itemNameTrimmed,
          amount: newItem.amount,
        });
      } else {
        const itemDocRef = doc(db, "items", existingItem.id);
        await updateDoc(itemDocRef, {
          amount: newItem.amount,
        });
      }

      setNewItem({ name: "", amount: "" });
    }
  };

  //Read Item from Database
  useEffect(() => {
    const q = query(collection(db, "items"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];

      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArr);

      //Read total from itemsArr
      const calculateTotal = () => {
        const totalPrice = itemsArr.reduce(
          (sum, item) => sum + parseFloat(item.amount),
          0
        );
        setTotal(totalPrice);
      };

      calculateTotal();
      return () => unsubscribe();
    });
  }, []);

  //Delete Item from Database
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "items", id));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl p-4 text-center">Pantry Tracker</h1>
        <div className="bg-slate-800 p-4 rounded-lg">
          <form className="grid grid-cols-6 items-center text-black">
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="col-span-3 p-3 border"
              type="text"
              placeholder="Enter Item"
            />
            <input
              value={newItem.amount}
              onChange={(e) =>
                setNewItem({ ...newItem, amount: e.target.value })
              }
              className="col-span-2 p-3 border mx-3"
              type="text"
              placeholder="Amount"
            />
            <button
              onClick={addItem}
              className="text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl"
              type="submit"
            >
              +
            </button>
          </form>
          <ul>
            {items.map((item, id) => (
              <li
                key={id}
                className="my-4 w-full flex justify-between bg-slate-950"
              >
                <div className="text-white p-4 w-full flex justify-between">
                  <span className="capitalize">{item.name}</span>
                  <span>{item.amount}</span>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-white ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16"
                >
                  X
                </button>
              </li>
            ))}
          </ul>
          {items.length < 1 ? (
            ""
          ) : (
            <div className="text-white flex justify-between p-3">
              <span>Total</span>
              <span>{total}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
