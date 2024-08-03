'use client'

import { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { Box, Button, TextField, Typography, Modal, Stack } from "@mui/material";
import { collection, getDocs, query, getDoc, deleteDoc, setDoc, addDoc, doc } from "@firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setitemName] = useState('');
  const [search, setSearch] = useState('');
  const [result, setResult] = useState(null);


  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));

    const docs = await getDocs(snapshot);
    const inventorylist = [];
    docs.forEach((doc) => {
      inventorylist.push({
        name: doc.id,
        ...doc.data()
      })
    })
    setInventory(inventorylist);
    console.log(inventorylist);
  }

  useEffect(() => {
  updateInventory();
  }, []);

  const removeItems = async (item) => {
    if (!item) return;
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const {quantity} = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef)
      }
      else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }
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
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory();
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const searchItem = () => {
    if(!search) {
      setResult(null)
    }
    const res = inventory.filter(({name, quantity}) => name.toLowerCase() == search.toLowerCase())
    if (res.length > 0) {
      setResult(res[0]);
    }
  } 

  useEffect(() => searchItem(), [search]);

  return (
    <>
    <Typography variant="h1" align="center" justifyContent="center">Inventory Tracker</Typography>

    <Box display="flex" justifyContent="center" alignItems="center" gap={2}
    flexDirection="column" overflow="auto" marginTop={5}>
      <Button variant="contained" color="secondary" align="center" onClick={() =>
      handleOpen()
    }> Add New Item </Button>
    </Box>

    <Box display="flex" justifyContent="center" alignItems="center" gap={2}
    flexDirection="column" overflow="auto" marginTop={5}>
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
    <Box border="1 px solid #333" alignSelf="center">

      <Box width="800px" height="100px" bgcolor="violet">
        <Typography variant="h2" color="#333" alignItems="center" justifyContent="center" display="flex"
        > Inventory Items </Typography>
      </Box>

    <Stack width="800px" height="300px" spacing={2} overflow="auto" marginBottom={5}>

        {inventory.map(({name, quantity}) => (
          <Box key={name} width="100%" minHeight="150px" display="flex" 
          alignItems="center" justifyContent="space-between" bgcolor="#f0f0f0" padding={5}>

            <Typography variant="h3" color="#333" textAlign="center">
              {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
            <Typography variant="h3" color="#333" textAlign="center">
               {quantity}
              </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={() => addItems(name)}> Add </Button>
              <Button variant="contained" onClick={() => removeItems(name)}> Remove </Button>
              </Stack>        

          </Box>
        ))
        }
      </Stack>

      <TextField variant="outlined" fullWidth value={search} onChange={(e) => setSearch(e.target.value)}
        placeholder="Search for an item">
      </TextField>

      <Stack width="800px" height="300px" spacing={2} overflow="auto">

        {result ? (
          <Box key={result.name} width="100%" minHeight="150px" display="flex" border="1 px solid black" 
          alignItems="center" justifyContent="space-between" bgcolor="#d0d0d0" padding={5} >

            <Typography variant="h3" color="#333" textAlign="center">
              {result.name.charAt(0).toUpperCase() + result.name.slice(1)}
              </Typography>
            <Typography variant="h3" color="#333" textAlign="center">
               {result.quantity}
              </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={() => addItems(result.name)}> Add </Button>
              <Button variant="contained" onClick={() => removeItems(result.name)}> Remove </Button>
              </Stack>
          </Box>
        ) : 
        null
        }
      </Stack>
    </Box>
    </Box>
    </>
  );
}