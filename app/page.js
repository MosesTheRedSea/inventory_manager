'use client';

import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField, Grid, Card, CardContent } from '@mui/material';
import { firestore } from '../app/firebase';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
  where,
} from 'firebase/firestore';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column', 
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updateInventory = async () => {
    try {
      let inventoryQuery = collection(firestore, 'inventory');
  
      // Fetch all items
      const snapshot = await getDocs(inventoryQuery);
      const inventoryList = [];
      snapshot.forEach((doc) => {
        inventoryList.push({ id: doc.id, ...doc.data() });
      });
  
      // Filter items by searchQuery
      const filteredList = inventoryList.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
      setInventory(filteredList);
    } catch (error) {
      console.error('Error updating inventory:', error);
    }
  };
  

  useEffect(() => {
    updateInventory();
  }, [searchQuery]); // Update inventory when searchQuery changes

  const addItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity, name } = docSnap.data();
        await setDoc(docRef, { quantity: quantity + 1, name });
      } else {
        await setDoc(docRef, { quantity: 1, name: item });
      }
      await updateInventory();
    } catch (error) {
      console.error('Error adding item:', error); 
    }
  };

  const removeItem = async (item) => {
    try {
      console.log(`Removing item: ${item}`);
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        if (quantity === 1) {
          await deleteDoc(docRef);
          console.log(`Item ${item} quantity is 1. Deleted the item`);
        } else {
          await setDoc(docRef, { quantity: quantity - 1 });
          console.log(`Item ${item} quantity is ${quantity}. Decreased quantity to ${quantity - 1}`);
        }
      }
      await updateInventory();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
      sx={{ p: 2 }}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <TextField
        label="Search Items"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          mb: 2,
          width: '800px',
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'white', // Set background color of the input field
          },
          '& .MuiInputLabel-root': {
            color: 'black', // Optional: Set label color if needed
          },
        }}
      />
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <Box border={'1px solid #333'}>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Grid container spacing={2} padding={2}>
          {inventory.map(({ id, name, quantity }) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={id}>
              <Card sx={{ padding: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardContent>
                  <Typography variant={'h6'} component="div">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant={'body2'} color="text.secondary">
                    Quantity: {quantity}
                  </Typography>
                </CardContent>
                <Button variant="contained" color="error" onClick={() => removeItem(name)}>
                  Remove
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}