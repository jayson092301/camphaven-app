import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Import icons from Expo
import supabase from '../../../../supabase';

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('booking').select('*');

        if (error) throw error;
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        Alert.alert('Error', 'Failed to fetch bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleDelete = async (bookingId) => {
    try {
      const { error } = await supabase
        .from('booking')
        .delete()
        .eq('booking_id', bookingId);

      if (error) throw error;

      Alert.alert('Deleted', 'The booking has been deleted successfully.');

      // Update the local state to reflect the deletion
      setBookings((prevBookings) => prevBookings.filter((booking) => booking.booking_id !== bookingId));
    } catch (error) {
      console.error('Error deleting booking:', error);
      Alert.alert('Error', 'Failed to delete the booking.');
    }
  };

  const renderStatusMessage = (status) => {
    switch (status) {
      case 'Pending':
        return <Text style={styles.pendingMessage}>Your booking is pending confirmation.</Text>;
      case 'Confirmed':
        return <Text style={styles.confirmedMessage}>Your booking has been confirmed! Please be on time to the said date.</Text>;
      case 'Canceled':
        return <Text style={styles.canceledMessage}>Your booking has been canceled.</Text>;
      default:
        return null;
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.bookingItem}>
      <View style={styles.bookingHeader}>
        <Text style={styles.bookingTitle}>{item.title}</Text>
        <TouchableOpacity onPress={() => handleDelete(item.booking_id)}>
          <MaterialIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
      <Text style={styles.bookingDetails}>
        Appointment Date: {new Date(item.date).toLocaleDateString()}
      </Text>
      <Text style={styles.bookingStatus}>Status: {item.status}</Text>
      {renderStatusMessage(item.status)}
    </View>
  );

  if (loading) {
    return <Text>Loading bookings...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Status</Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.booking_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  bookingItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    flex: 1,
  },
  bookingDetails: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  bookingStatus: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  pendingMessage: {
    fontSize: 16,
    color: '#FFA500',
    fontWeight: '600',
  },
  confirmedMessage: {
    fontSize: 16,
    color: 'green',
    fontWeight: '600',
  },
  canceledMessage: {
    fontSize: 16,
    color: 'red',
    fontWeight: '600',
  },
});

export default Booking;
