import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import supabase from '../../supabase';

const Booking = () => {
  const [bookings, setBookings] = useState([]); // State to hold bookings data
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch pending bookings when the component mounts
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('booking') // Your bookings table
          .select('*')
          .eq('status', 'Pending'); // Only fetch pending bookings

        if (error) throw error;
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        Alert.alert("Error", "Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Function to handle changing the booking status
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const { data, error } = await supabase
        .from('booking')
        .update({ status: newStatus }) // Update the status (Confirmed or Canceled)
        .eq('booking_id', bookingId); // Use booking_id

      if (error) throw error;

      Alert.alert('Booking Status Updated', `Booking has been ${newStatus}.`);

      // Update the local state to reflect the changes
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.booking_id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
      Alert.alert("Error", "Failed to update booking status.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.bookingItem}>
      <Text style={styles.bookingTitle}>{item.title}</Text>
      <Text style={styles.bookingDetails}>
        User: {item.user_name} | Date: {new Date(item.date).toLocaleDateString()}
      </Text>
      <Text style={styles.bookingStatus}>Status: {item.status}</Text>

      {/* Action buttons to confirm or cancel the booking */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'green' }]}
          onPress={() => handleStatusChange(item.booking_id, 'Confirmed')} // Use booking_id
          disabled={item.status !== 'Pending'}
        >
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'red' }]}
          onPress={() => handleStatusChange(item.booking_id, 'Canceled')} // Use booking_id
          disabled={item.status !== 'Pending'}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <Text>Loading bookings...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pending Bookings</Text>

      {/* List of bookings */}
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.booking_id.toString()} // Use booking_id
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
  bookingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Booking;
