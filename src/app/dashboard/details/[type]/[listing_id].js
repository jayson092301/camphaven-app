import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, ActivityIndicator, StyleSheet, Image, ScrollView, TouchableOpacity, Modal, Linking } from 'react-native';
import supabase from '../../../../../supabase';
import { IconButton } from 'react-native-paper';

const ListingDetails = () => {
  const { type, listing_id } = useLocalSearchParams();
  const [details, setDetails] = useState(null);
  const [ownerName, setOwnerName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ownerPhoneNumber, setOwnerPhoneNumber] = useState('');

  useEffect(() => {
    if (!type || !listing_id) {
      setError('Invalid parameters');
      setLoading(false);
      return;
    }
    fetchDetails(type, listing_id);
  }, [type, listing_id]);

  const fetchDetails = async (type, listing_id) => {
    if (!['Room', 'Dorm', 'Apartment'].includes(type)) {
      setError(`Invalid type: ${type}`);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from(type.toLowerCase())
        .select('title, description, price, status, address, amenities, owner_id')
        .eq('listing_id', listing_id)
        .single();

      if (error) {
        setError('Error fetching details');
        setLoading(false);
        return;
      }

      const { data: fetchedImages, error: imageError } = await supabase
        .from('tblimage')
        .select('image_url, is_primary')
        .eq(`${type.toLowerCase()}_listing_id`, listing_id);

      if (imageError) {
        console.error('Image fetch error:', imageError);
      }

      setImages(fetchedImages);
      const primaryImage = fetchedImages?.find((img) => img.is_primary) || fetchedImages?.[0];
      setImage(primaryImage?.image_url || null);

      setDetails(data);

      // Fetch owner's name
      fetchOwnerName(data.owner_id);

      setLoading(false);
    } catch (err) {
      setError('Unexpected error occurred');
      setLoading(false);
    }
  };

  const fetchOwnerName = async (owner_id) => {
    try {
      const { data, error } = await supabase
        .from('apartment_owners')
        .select('name, phone_number')
        .eq('owner_id', owner_id)
        .single();
  
      if (error) {
        console.error('Error fetching owner details:', error);
        setOwnerName('Unknown');
        setOwnerPhoneNumber('');
      } else {
        setOwnerName(data.name || 'Unknown');
        setOwnerPhoneNumber(data.phone_number || '');
      }
    } catch (err) {
      console.error('Unexpected error fetching owner details:', err);
      setOwnerName('Unknown');
      setOwnerPhoneNumber('');
    }
  };

  const renderAmenities = (amenities) => {
    try {
      const parsedAmenities = JSON.parse(amenities);
      return Object.keys(parsedAmenities)
        .filter((key) => parsedAmenities[key])
        .join(' | ');
    } catch {
      return 'None';
    }
  };

  const handleImageClick = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const handleMessagePress = (phoneNumber) => {
    if (!phoneNumber) {
      alert('Phone number not available.');
      return;
    }
  
    const url = `whatsapp://send?phone=${phoneNumber}`;
    Linking.openURL(url).catch(() => {
      alert('WhatsApp is not installed on your device.');
    });
  };

  const handleCallPress = (phoneNumber) => {
    if (!phoneNumber) {
      alert('Phone number not available.');
      return;
    }
  
    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch(() => {
      alert('Unable to make a call.');
    });
  };
  

  return (
    <View style={styles.detailsContainer}>
      <ScrollView style={{ marginBottom: 150, borderBottomWidth: 1, borderBottomColor: 'black', paddingBottom: 30 }}>
        {image && (
          <TouchableOpacity onPress={handleImageClick}>
            <Image source={{ uri: image }} style={styles.image} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{details.title}</Text>
        <Text style={styles.description}>{details.description}</Text>
        <Text style={styles.address}>Address: {details.address}</Text>
        <Text style={styles.price}>Price: ₱ {details.price}</Text>
        <Text style={styles.status}>{details.status}</Text>
        <Text style={styles.amenities}>
          Amenities: {details.amenities ? renderAmenities(details.amenities) : 'None'}
        </Text>
      </ScrollView>

      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{ownerName}</Text>
          <View style={{ flexDirection: 'row' }}>
            <IconButton
              icon="message"
              iconColor={'black'}
              size={20}
              onPress={() => handleMessagePress(ownerPhoneNumber)}
            />

            <IconButton
              icon="phone"
              iconColor={'black'}
              size={20}
              onPress={() => handleCallPress(ownerPhoneNumber)}
            />

          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => console.log('Press')}>
            <Text style={styles.buttonText}>Rent Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for showing images */}
      <Modal visible={isModalVisible} animationType="slide" onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {images.map((img, index) => (
              <Image key={index} source={{ uri: img.image_url }} style={styles.modalImage} />
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', fontSize: 16 },
  detailsContainer: { padding: 20, backgroundColor: '#fff', flex: 1 },
  image: { width: '100%', height: 200, marginBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, color: '#555', marginBottom: 10 },
  address: { fontSize: 16, marginBottom: 10 },
  price: { fontSize: 18, fontWeight: 'bold', color: '#007BFF', marginBottom: 10 },
  status: { fontSize: 11, color: 'green' },
  amenities: { fontSize: 14, color: '#777' },
  buttonContainer: { flexDirection: "row", justifyContent: "space-around", marginTop: 20 },
  button: { width: 380, height: 40, backgroundColor: "#000", justifyContent: "center", alignItems: "center", borderRadius: 10 },
  buttonText: { color: "#E8CDB2", fontSize: 18 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalImage: { width: 200, height: 200, marginHorizontal: 10 },
  closeButton: { padding: 10, backgroundColor: '#000', borderRadius: 5, marginTop: 20 },
  closeButtonText: { color: '#fff', fontSize: 16 },
});

export default ListingDetails;
