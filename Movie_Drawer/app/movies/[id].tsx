import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";

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
      } catch (err: any) {
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
  const getRating = (rating = "N/A") => {
    return rating !== "N/A"
      ? Math.round(parseFloat(rating) / 2)
      : Math.floor(Math.random() * 5) + 1;
  };

  if (loading) {
    return (
      <View className="bg-primary flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text className="text-white mt-4">Loading movie details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="bg-primary flex-1 justify-center items-center p-4">
        <Text className="text-white text-center text-lg">
          Failed to load movie details.
        </Text>
        <Text className="text-light-200 text-center mt-2">{error}</Text>
        <TouchableOpacity
          className="mt-6 bg-accent px-6 py-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!movie) return null;

  const displayRating = getRating(movie.imdbRating);

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Hero Section with Poster */}
        <View>
          <Image
            source={{
              uri:
                movie.Poster !== "N/A"
                  ? movie.Poster
                  : "https://placehold.co/600x400/1a1a1a/FFFFFF.png",
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />

          {/* Custom Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-10 left-5 bg-dark-100 p-2 rounded-full"
          >
            <Image
              source={icons.arrow}
              className="size-6 rotate-180"
              tintColor="#fff"
            />
          </TouchableOpacity>

          {/* Play Button */}
          <TouchableOpacity className="absolute bottom-5 right-5 rounded-full size-14 bg-white flex items-center justify-center">
            <Image
              source={icons.play}
              className="w-6 h-7 ml-1"
              resizeMode="stretch"
            />
          </TouchableOpacity>
        </View>

        {/* Movie Info */}
        <View className="flex-col items-start justify-center mt-5 px-5">
          {/* Title and Year */}
          <Text className="text-white font-bold text-xl">{movie.Title}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">{movie.Year} •</Text>
            <Text className="text-light-200 text-sm">{movie.Runtime}</Text>
          </View>

          {/* Rating */}
          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />
            <Text className="text-white font-bold text-sm">
              {displayRating}/5
            </Text>
            <Text className="text-light-200 text-sm">({movie.imdbRating})</Text>
          </View>

          {/* Genre Pills */}
          <View className="flex-row flex-wrap gap-2 mt-4">
            {movie.Genre.split(", ").map((genre, index) => (
              <View key={index} className="bg-dark-100 px-3 py-1 rounded-md">
                <Text className="text-white text-xs">{genre}</Text>
              </View>
            ))}
          </View>

          {/* Plot */}
          <View className="mt-5">
            <Text className="text-white font-bold text-lg mb-2">Storyline</Text>
            <Text className="text-light-200 text-sm">{movie.Plot}</Text>
          </View>

          {/* Cast */}
          <View className="mt-5">
            <Text className="text-white font-bold text-lg mb-2">Cast</Text>
            <Text className="text-light-200 text-sm">{movie.Actors}</Text>
          </View>

          {/* Director */}
          <View className="mt-5">
            <Text className="text-white font-bold text-lg mb-2">Director</Text>
            <Text className="text-light-200 text-sm">{movie.Director}</Text>
          </View>

          {/* Additional Info */}
          <View className="mt-5">
            <Text className="text-white font-bold text-lg mb-2">Details</Text>
            <View className="flex-row justify-between mb-2 gap-4">
              <Text className="text-light-200 text-sm">Released</Text>
              <Text className="text-white text-sm">{movie.Released}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-light-200 text-sm">Language</Text>
              <Text className="text-white text-sm">{movie.Language}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-light-200 text-sm">Box Office</Text>
              <Text className="text-white text-sm">
                {movie.BoxOffice || "N/A"}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-light-200 text-sm">Production</Text>
              <Text className="text-white text-sm">
                {movie.Production || "N/A"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Go Back Button */}
      <TouchableOpacity
        className="absolute bottom-14 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={() => router.back()}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetails;
