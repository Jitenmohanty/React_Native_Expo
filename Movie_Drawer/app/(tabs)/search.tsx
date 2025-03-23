import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, FlatList, Image } from "react-native";
import { useRouter } from "expo-router";

import { images } from "@/constants/images";
import { icons } from "@/constants/icons";

import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import { fetchBySearch, Movie } from "@/services/api";

const Search = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [searchResults, setSearchResults] = useState<Movie[]>([]); // State for search results
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState<string | null>(null); // State for error handling

  // Function to handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a movie name");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const movies = await fetchBySearch(searchQuery);
      setSearchResults(movies || []); // Ensure searchResults is always an array
    } catch (err) {
      setError("Failed to fetch movies. Please try again.");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-primary">
      {/* Background Image */}
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      {/* FlatList for Search Results */}
      <FlatList
        className="px-5"
        data={searchResults}
        keyExtractor={(item) => item.imdbID}
        renderItem={({ item }) => (
          <MovieCard
            Poster={item.Poster}
            Title={item.Title}
            imdbRating={item.imdbRating}
            Year={item.Year}
            imdbID={item.imdbID}
          />
        )}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            {/* Logo */}
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            {/* Search Bar */}
            <View className="my-5">
              <SearchBar
                placeholder="Search for a movie"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onPress={handleSearch}
              />
            </View>

            {/* Loading Indicator */}
            {loading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}

            {/* Error Message */}
            {error && (
              <Text className="text-red-500 px-5 my-3">Error: {error}</Text>
            )}

            {/* Search Results Title */}
            {!loading &&
              !error &&
              searchQuery.trim() &&
              searchResults.length > 0 && (
                <Text className="text-xl text-white font-bold">
                  Search Results for{" "}
                  <Text className="text-accent">{searchQuery}</Text>
                </Text>
              )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {searchQuery.trim()
                  ? "No movies found"
                  : "Start typing to search for movies"}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Search;