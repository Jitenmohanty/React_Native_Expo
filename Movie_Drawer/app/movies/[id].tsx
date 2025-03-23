import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { icons } from '@/constants/icons';
import { fetchMovieDetails } from '@/services/api';

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  interface MovieDetails {
    Title: string;
    Year: string;
    imdbRating: string;
    Runtime: string;
    Rated: string;
    Genre: string;
    Plot: string;
    Actors: string;
    Director: string;
    Released: string;
    Language: string;
    BoxOffice?: string;
    Production?: string;
    Poster: string;
  }
  
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMovieDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchMovieDetails(id as string);
        setMovie(data);
      } catch (err:any) {
        setError(err?.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getMovieDetails();
    }
  }, [id]);

  // Calculate rating for display (similar to MovieCard)
  const getRating = (rating = 'N/A') => {
    return rating !== 'N/A'
      ? Math.round(parseFloat(rating) / 2)
      : Math.floor(Math.random() * 5) + 1;
  };

  if (loading) {
    return (
      <View className="flex-1 bg-dark-100 justify-center items-center">
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text className="text-white mt-4">Loading movie details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-dark-100 justify-center items-center p-4">
        <Text className="text-white text-center text-lg">Failed to load movie details.</Text>
        <Text className="text-light-300 text-center mt-2">{error}</Text>
        <TouchableOpacity 
          className="mt-6 bg-primary px-6 py-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!movie) return null;

  const displayRating = getRating(movie.imdbRating);

  return (
    <>
      <StatusBar style="light" />
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: '#121212' },
          headerTintColor: '#FFFFFF',
          headerTitle: '',
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-row items-center"
            >
           <Image source={icons.back} className="size-7 mr-2 " />

              <Text className="text-white">Back</Text>
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView className="flex-1 bg-dark-100">
        {/* Hero Section with Poster */}
        <View className="relative">
          <Image
            source={{
              uri: movie.Poster !== 'N/A' 
                ? movie.Poster 
                : 'https://placehold.co/600x400/1a1a1a/FFFFFF.png',
            }}
            className="w-full h-72"
            resizeMode="cover"
          />
          
          {/* Gradient Overlay */}
          <View className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-dark-100 to-transparent" />
        </View>

        {/* Movie Info */}
        <View className="px-4 pt-2 pb-8">
          {/* Title and Year */}
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-2xl font-bold text-white flex-1 pr-2">
              {movie.Title}
            </Text>
            <Text className="text-light-300 text-base">
              {movie.Year}
            </Text>
          </View>

          {/* Rating, Runtime, Genre */}
          <View className="flex-row items-center mb-4">
            <View className="flex-row items-center mr-4">
              <Image source={icons.star} className="size-4 mr-1" />
              <Text className="text-white">{displayRating}/5</Text>
              <Text className="text-light-300 ml-1">({movie.imdbRating})</Text>
            </View>
            <Text className="text-light-300 mr-4">{movie.Runtime}</Text>
            <Text className="text-light-300">{movie.Rated}</Text>
          </View>

          {/* Genre Pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            {movie.Genre.split(', ').map((genre, index) => (
              <View key={index} className="mr-2 px-3 py-1 bg-dark-200 rounded-full">
                <Text className="text-white text-xs">{genre}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Plot */}
          <View className="mb-4">
            <Text className="text-white font-bold text-lg mb-2">Storyline</Text>
            <Text className="text-light-300 leading-5">{movie.Plot}</Text>
          </View>

          {/* Cast */}
          <View className="mb-4">
            <Text className="text-white font-bold text-lg mb-2">Cast</Text>
            <Text className="text-light-300">{movie.Actors}</Text>
          </View>

          {/* Director */}
          <View className="mb-4">
            <Text className="text-white font-bold text-lg mb-2">Director</Text>
            <Text className="text-light-300">{movie.Director}</Text>
          </View>

          {/* Additional Info */}
          <View>
            <Text className="text-white font-bold text-lg mb-2">Details</Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-light-300 flex-1">Released</Text>
              <Text className="text-white flex-2">{movie.Released}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-light-300 flex-1">Language</Text>
              <Text className="text-white flex-2">{movie.Language}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-light-300 flex-1">Box Office</Text>
              <Text className="text-white flex-2">{movie.BoxOffice || 'N/A'}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-light-300 flex-1">Production</Text>
              <Text className="text-white flex-2">{movie.Production || 'N/A'}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default MovieDetails;