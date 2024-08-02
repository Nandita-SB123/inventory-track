'use client'

import { useState, useEffect } from "react";
import { firestore } from "../firebase"; // Adjust this path based on your file structure
import { Box, Button, TextField, Typography, Modal, Stack } from "@mui/material";
import { collection, getDocs, query, getDoc, deleteDoc, setDoc, addDoc, doc } from "@firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setitemName] = useState('');

  // Now we wanna fetch database from firebase
  // Function 1: update inventory

  /* Convention, if u have an async function u wanna call in useEffect, better to define it in the useEffect and call it immediately. */ 

  const updateInventory = async () => {
    // First, snapshot of collection database from firebase
    // So this means I made a query, to fetch a collection from my firestore instance named inventory.
    const snapshot = query(collection(firestore, 'inventory'));
    // coz u wanna get all docs
    const docs = await getDocs(snapshot);
    // Now adding each doc to inventory list.
    const inventorylist = [];
    docs.forEach((doc) => {
      // ur pushing an object for every doc w name
      // Coz all its data comes as an object itself, so ur just adding name to it then pushing.
      inventorylist.push({
        name: doc.id,
        ...doc.data()
      })
    })
    setInventory(inventorylist);
    console.log(inventorylist);
  }

  useEffect(() => {
    // Async so firebase can take its own time
  // Otherwise entire site freezes while fetching

  updateInventory();
  }, []);

  const removeItems = async (item) => {
    /* Difference btwn this code and previous code:
    This one: creates reference to item doc and then gets the doc using getDoc
    Previous one: creates reference to collection, then gets all docs from it using getDocs */
    if (!item) return;
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // takes just the quantity property of data object
      const {quantity} = docSnap.data;
      if (quantity === 1) {
        await deleteDoc(docRef)
      }
      else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }
    // Coz it won't automatically be updated locally. U need to call this.
    await updateInventory();
  }

  const addItems = async (item) => {
    if (!item) return;
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const {quantity} = docSnap.data();
      await setDoc(docRef, {quantity: quantity + 1})
    }
    else {
      // ig setDoc just makes one if its not there
      await setDoc(docRef, {quantity: 1})
    }
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // Note: stack like box, but everything stored in stack like form, not sure what that means, check.

  return (
    <>
    <Box width="100vw" height="100vh" display="flex" justifyContent="center" alignItems="center" gap={2}>
      <Typography variant="h1">Inventory Tracker</Typography>
      <Modal open={open} onClose={handleClose}>
      <Box position="absolute" top="50%" left="50%"
      width={400}
      bgcolor="pink"
      border= "2px solid black"
      boxShadow={24}
      p={4}
      display="flex"
      flexDirection="column"
      gap={3}
      sx={
        {transform: "translate(-50%, -50%)"}
      }
      >
        <Typography variant="h6">
          Add Item
        </Typography>
        <Stack width="100%" direction="row" spacing ={2}>
          <TextField variant="outlined" fullWidth value={itemName} onChange={(e) => setitemName(e.target.value)}>
          </TextField>
          <Button variant="outlined" onClick={() => {
            addItems(itemName)
            setitemName('')
            handleClose();
          }}>Add</Button>
        </Stack>

      </Box>

    </Modal>
    <Button variant="contained" onClick={() =>
      handleOpen()
    }> Add Item </Button>
    </Box>
    
    
    </>
  );
}