import {
  View,
  Text,
  ActivityIndicator,
  Image,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import { getTrendingMovies } from "@/services/appwrite";
import TrendingCard from "@/components/TrendingCard";

type Movie = {
  Poster: string;
  Title: string;
  imdbRating: string | undefined;
  Year: string;
  imdbID: string;
};

const Index = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentYear, setCurrentYear] = useState("2025");
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreYears, setHasMoreYears] = useState(true); // For tracking if we've gone too far back in years

  //get trending movies
  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  // Fetch movies using a modified version of useFetch
  const {
    data: movieData,
    loading: moviesLoading,
    error: moviesError,
    refetch: refetchMovies,
  } = useFetch(() => fetchMovies({ 
    page: currentPage, 
    year: currentYear 
  }));

  console.log(trendingMovies,"trendingMovies")

  // Handle initial data load and page changes within the same year
  useEffect(() => {
    if (movieData) {
      // Add movies to our collection
      if (movieData.movies && movieData.movies.length > 0) {
        setAllMovies((prevMovies) => [...prevMovies, ...movieData.movies]);
      }
      
      // Update total results
      if (movieData.totalResults) {
        setTotalResults(movieData.totalResults);
      }
      
      // Reset loading more flag
      setIsLoadingMore(false);
    }
  }, [movieData]);

  // Handle errors
  useEffect(() => {
    if (moviesError) {
      console.log("Error occurred:", moviesError.message);
      
      // If we get an error for a year, move to the previous year
      if (moviesError.message.includes("Movie not found") || 
          moviesError.message.includes("No movies found")) {
        
        // If we're at a very old year (e.g., 1900), stop trying
        const yearNum = parseInt(currentYear, 10);
        if (yearNum <= 1900) {
          setHasMoreYears(false);
          return;
        }
        
        // Go to previous year and reset page to 1
        const prevYear = (parseInt(currentYear, 10) - 1).toString();
        console.log(`No movies found for ${currentYear}, switching to year ${prevYear}`);
        setCurrentYear(prevYear);
        setCurrentPage(1);
        
        // Delay the refetch to avoid rapid API calls
        setTimeout(() => {
          refetchMovies();
        }, 300);
      }
      
      setIsLoadingMore(false);
    }
  }, [moviesError]);

  // This effect watches for changes to currentYear and refetches data
  useEffect(() => {
    if (currentYear !== "2025" || currentPage > 1) {
      refetchMovies();
    }
  }, [currentYear, currentPage]);

  // Calculate if we need to move to the next year
  const shouldMoveToNextYear = () => {
    const maxPages = Math.ceil(totalResults / 10); // OMDB returns 10 results per page
    return currentPage >= maxPages;
  };

  // Fetch more movies when the user reaches the end of the list
  const fetchMoreMovies = () => {
    if (moviesLoading || isLoadingMore) return;
    
    setIsLoadingMore(true);
    
    if (shouldMoveToNextYear()) {
      // We've reached the end of results for this year, move to previous year
      const prevYear = (parseInt(currentYear, 10) - 1).toString();
      console.log(`Reached end of results for ${currentYear}, switching to year ${prevYear}`);
      setCurrentYear(prevYear);
      setCurrentPage(1);
    } else {
      // Still have more pages in the current year
      console.log(`Fetching more movies for year ${currentYear}, moving to page:`, currentPage + 1);
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // Header component for the FlatList
  const ListHeaderComponent = () => (
    <View>
      {/* Logo */}
      <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
  
      {/* Search Bar */}
      <SearchBar
        onPress={() => {
          router.push("/search");
        }}
        placeholder="Search for a movie"
      />
  
      {/* Trending Movies Section */}
      {trendingMovies && (
        <View className="mt-10">
          <Text className="text-lg text-white font-bold mb-3">
            Trending Movies
          </Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4 mt-3"
            data={trendingMovies}
            contentContainerStyle={{
              gap: 26,
            }}
            renderItem={({ item, index }) => (
              <TrendingCard movie={item} index={index} />
            )}
            keyExtractor={(item) => String(item?.imdbID)}
            ItemSeparatorComponent={() => <View className="w-4" />}
          />
        </View>
      )}
  
      {/* Latest Movies Section */}
      <Text className="text-lg text-white font-bold mt-5 mb-3">
        Latest Movies
      </Text>
      
      {/* Current Year Indicator */}
      <Text className="text-sm text-gray-300 mb-3">
        Showing movies from {currentYear} onwards
      </Text>
    </View>
  );

  // Footer component for the FlatList
  const ListFooterComponent = () => {
    if (moviesLoading || isLoadingMore) {
      return (
        <ActivityIndicator
          size="small"
          color="#0000ff"
          className="mt-5 mb-10"
        />
      );
    }
    
    if (!hasMoreYears && allMovies.length > 0) {
      return (
        <Text className="text-white text-center mt-5 mb-10">
          No more movies to load
        </Text>
      );
    }
    
    return null;
  };

  // Debug logging
  console.log(
    `Movies: ${allMovies.length}, Year: ${currentYear}, Page: ${currentPage}, Total: ${totalResults}`
  );

  return (
    <View className="flex-1 bg-primary">
      {/* Background Image */}
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      {/* Initial Loading State */}
      {moviesLoading && currentPage === 1 && currentYear === "2025" || trendingLoading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          className="mt-10 self-center"
        />
      ) : moviesError && trendingError &&  currentPage === 1 && !hasMoreYears ? (
        // Critical Error State - when we've tried all years and still have errors
        <Text className="text-red-500 text-center mt-10 px-5">
          Could not load any movies. Please try again later.
        </Text>
      ) : (
        // Success State or subsequent pages
        <FlatList
          data={allMovies}
          renderItem={({ item }) => (
            <MovieCard
              Poster={item.Poster}
              Title={item.Title}
              imdbRating={item.imdbRating}
              Year={item.Year}
              imdbID={item.imdbID}
            />
          )}
          keyExtractor={(item, index) => `${item.imdbID}-${index}`}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: "flex-start",
            gap: 20,
            paddingRight: 5,
            marginBottom: 10,
          }}
          contentContainerStyle={{ 
            paddingHorizontal: 20,
            paddingBottom: 32 
          }}
          ListHeaderComponent={ListHeaderComponent}
          onEndReached={fetchMoreMovies}
          onEndReachedThreshold={0.5}
          ListFooterComponent={ListFooterComponent}
        />

      )}
    </View>
  );
};

export default Index;