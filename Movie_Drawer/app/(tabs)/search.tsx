import React, { useState } from "react";
import { View, FlatList, ActivityIndicator, Text } from "react-native";
import { useRouter } from "expo-router";

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
    <View className="flex-1 bg-primary p-5">
      {/* Search Bar */}
      <SearchBar
        placeholder="Search for a movie"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onPress={handleSearch} // Trigger search when the user presses Enter
      />

      {/* Loading State */}
      {loading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          className="mt-10 self-center"
        />
      )}

      {/* Error State */}
      {error && (
        <Text className="text-red-500 text-center mt-5">{error}</Text>
      )}

      {/* Search Results */}
      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <MovieCard
              Poster={item.Poster}
              Title={item.Title}
              imdbRating={item.imdbRating}
              Year={item.Year}
              imdbID={item.imdbID}
            />
          )}
          keyExtractor={(item) => item.imdbID}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: "flex-start",
            gap: 20,
            paddingRight: 5,
            marginBottom: 10,
          }}
          className="mt-5"
          scrollEnabled={false}
        />
      ) : (
        // No Results Found
        !loading && searchQuery && (
          <Text className="text-white text-center mt-5">No movies found.</Text>
        )
      )}
    </View>
  );
};

export default Search;