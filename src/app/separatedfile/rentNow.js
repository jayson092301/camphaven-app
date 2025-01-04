import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import supabase from '../../../supabase';
import { useRouter } from 'expo-router';

const RentNow = () => {
  const { listing_id, type, title, ownerName } = useLocalSearchParams();

useEffect(() => {
  if (!type || !listing_id) {
    Alert.alert('Error', 'Invalid listing details.');
    router.replace('dashboard');
  }
}, [type, listing_id]);


  // State for input fields
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const router = useRouter();

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleSubmit = async () => {
    if (!userName || !phoneNumber || !email || !address || !universityName) {
      Alert.alert('Missing Fields', 'Please fill in all the required fields.');
      return;
    }
  
    try {
      const { data, error } = await supabase
        .from('booking')
        .insert([
          {
            title,
            owner_name: ownerName,
            user_name: userName,
            phone_number: phoneNumber,
            email,
            address,
            university_name: universityName,
            date: date.toISOString(),
            listing_id: parseInt(listing_id, 10),
            property_type: type, // Assign type as property_type
            status: 'Pending',
          },
        ]);
  
      if (error) {
        throw error;
      }
  
      Alert.alert(
        'Booking Submitted',
        'Your booking request has been submitted successfully.',
        [{ text: 'OK', onPress: () => router.replace('dashboard') }]
      );
    } catch (error) {
      console.error('Error submitting booking:', error);
      Alert.alert('Submission Error', 'Failed to submit your booking request. Please try again.');
    }
  };
  

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>Booking Form</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TextInput
          label="Title"
          value={title || ''}
          mode="outlined"
          style={styles.input}
          editable={false}
        />
        <TextInput
          label="Owner Name"
          value={ownerName || ''}
          mode="outlined"
          style={styles.input}
          editable={false}
        />
        <TextInput
          label="User Name"
          value={userName}
          onChangeText={setUserName}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Phone Number"
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
          keyboardType="email-address"
        />
        <TextInput
          label="Address"
          value={address}
          onChangeText={setAddress}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="University Name"
          value={universityName}
          onChangeText={setUniversityName}
          mode="outlined"
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
          <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}
      </ScrollView>
      <View style={styles.submitContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
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
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  datePicker: {
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  submitContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#000',
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#E8CDB2',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default RentNow;
