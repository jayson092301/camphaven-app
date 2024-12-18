import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';
import supabase from '../../../../../supabase'

const ListingDetails = () => {
  const { type, listing_id } = useLocalSearchParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        .select('*')
        .eq('listing_id', listing_id)
        .single();

      if (error) {
        setError('Error fetching details');
        setLoading(false);
        return;
      }
      setDetails(data);
      setLoading(false);
    } catch (err) {
      setError('Unexpected error occurred');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Type: {type}</Text>
      <Text>Listing ID: {listing_id}</Text>
      <Text>Details: {JSON.stringify(details, null, 2)}</Text>
    </View>
  );
};

export default ListingDetails;
