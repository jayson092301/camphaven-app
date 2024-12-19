import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import supabase from '../../../supabase'; // Adjust the import according to your Supabase client configuration

const RentNow = () => {
  const { type, title } = useLocalSearchParams(); // Changed listing_id to title for dynamic fetching

  // State to manage the input values
  const [titleInput, setTitleInput] = useState('');
  const [typeInput, setTypeInput] = useState(type || '');
  const [ownerName, setOwnerName] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [univName, setUnivName] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (title) {
      fetchListingDetails(title);
    }
  }, [title]);

  const fetchListingDetails = async (listingTitle) => {
    try {
      const { data: listingData, error: listingError } = await supabase
        .from('listings')
        .select('title, owner_id')
        .eq('title', listingTitle)
        .single();

      if (listingError) {
        throw listingError;
      }

      if (listingData) {
        setTitleInput(listingData.title);
        fetchOwnerName(listingData.owner_id);
      }
    } catch (error) {
      console.error('Error fetching listing details:', error.message);
    }
  };

  const fetchOwnerName = async (ownerId) => {
    try {
      const { data: ownerData, error: ownerError } = await supabase
        .from('apartment_owners')
        .select('name')
        .eq('owner_id', ownerId)
        .single();

      if (ownerError) {
        throw ownerError;
      }

      if (ownerData) {
        setOwnerName(ownerData.name);
      }
    } catch (error) {
      console.error('Error fetching owner name:', error.message);
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleDateInputChange = (text) => {
    const parsedDate = new Date(text);
    if (!isNaN(parsedDate)) {
      setDate(parsedDate);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>Booking Form</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TextInput
          label="Title"
          value={titleInput}
          onChangeText={setTitleInput}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Type"
          value={typeInput}
          onChangeText={setTypeInput}
          mode="outlined"
          style={styles.input}
          editable={false}
        />
        <TextInput
          label="Owner Name"
          value={ownerName}
          onChangeText={setOwnerName}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="User Name"
          value={userName}
          onChangeText={setUserName}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Phone"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Address"
          value={address}
          onChangeText={setAddress}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="University"
          value={univName}
          onChangeText={setUnivName}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Date"
          value={date.toLocaleDateString()}
          mode="outlined"
          style={styles.input}
          onChangeText={handleDateInputChange}
          onPressIn={() => setShowDatePicker(true)}
        />
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
          />
        )}
      </ScrollView>
      <View style={styles.submitContainer}>
        <TouchableOpacity style={styles.button} onPress={() => console.log('Submit')}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  submitContainer: {
    alignItems: 'center',
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#000',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#E8CDB2',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default RentNow;
