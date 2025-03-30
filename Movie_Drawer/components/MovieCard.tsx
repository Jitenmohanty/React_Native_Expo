import { Link } from "expo-router";
import { Text, Image, TouchableOpacity, View, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

import { icons } from "@/constants/icons";

const MovieCard = ({
  Poster,
  Title,
  imdbRating = "N/A", // Default to "N/A" if not provided
  Year,
  imdbID,
}: {
  Poster: string;
  Title: string;
  imdbRating?: string; // Make imdbRating optional
  Year: string;
  imdbID: string;
}) => {
  const [isSaved, setIsSaved] = useState(false);

  // Check if movie is already saved
  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("savedDataKey");
        if (jsonValue !== null) {
          const savedMovies = JSON.parse(jsonValue);
          // Convert to array if it's not already
          const moviesArray = Array.isArray(savedMovies) ? savedMovies : [savedMovies];
          
          // Check if this movie exists in saved movies
          const exists = moviesArray.some((movie) => movie.imdbID === imdbID);
          setIsSaved(exists);
        }
      } catch (e) {
        console.error("Failed to check if movie is saved:", e);
      }
    };

    checkIfSaved();
  }, [imdbID]);

  const saveToStorage = async () => {
    try {
      // Create the data object to save
      const newMovie = {
        Poster,
        Title,
        imdbRating,
        Year,
        imdbID,
      };
      
      // Get existing saved movies
      const existingData = await AsyncStorage.getItem("savedDataKey");
      let savedMovies = [];
      
      if (existingData !== null) {
        savedMovies = JSON.parse(existingData);
        // Make sure it's an array
        if (!Array.isArray(savedMovies)) {
          savedMovies = [savedMovies];
        }
      }
      
      // Check if the movie is already saved
      const movieExists = savedMovies.some((movie) => movie.imdbID === imdbID);
      
      if (movieExists) {
        // Remove the movie if already saved
        const updatedMovies = savedMovies.filter((movie) => movie.imdbID !== imdbID);
        await AsyncStorage.setItem("savedDataKey", JSON.stringify(updatedMovies));
        setIsSaved(false); // Update the state to reflect removal
        Alert.alert("Success", "Movie removed from saved list!");
      } else {
        // Add the movie if not saved
        savedMovies.push(newMovie);
        await AsyncStorage.setItem("savedDataKey", JSON.stringify(savedMovies));
        setIsSaved(true); // Update the state to reflect saving
        Alert.alert("Success", "Movie saved successfully!");
      }
    } catch (e) {
      console.error("Failed to save data:", e);
      Alert.alert("Error", "Failed to update saved movies");
    }
  };

  // Generate a rating between 1 and 5
  const rating =
    imdbRating !== "N/A"
      ? Math.round(parseFloat(imdbRating) / 2) // Convert imdbRating to a number and divide by 2
      : Math.floor(Math.random() * 5) + 1; // Generate a random rating between 1 and 5

  return (
    <Link
      href={{
        pathname: "/movies/[id]",
        params: { id: imdbID }, // Pass imdbID as the dynamic route parameter
      }}
      asChild
    >
      <TouchableOpacity className="w-[30%] relative">
        {/* Movie Poster */}
        <Image
          source={{
            uri:
              Poster !== "N/A"
                ? Poster
                : "https://placehold.co/600x400/1a1a1a/FFFFFF.png", // Fallback image
          }}
          className="w-full h-52 rounded-lg"
          resizeMode="cover"
        />
        <TouchableOpacity
          className="absolute right-1 top-1"
          onPress={(e) => {
            e.stopPropagation(); // Prevent triggering the Link navigation
            saveToStorage();
          }}
        >
         {
          isSaved ?  <Image 
          source={icons.saved} 
          className="size-5" 
          tintColor=  "#990af2"  // Purple if saved, white if not
          
        />: <Image 
        source={icons.save} 
        className="size-5" 
        tintColor=  "#fff"  // Purple if saved, white if not
        
      />
         }
        </TouchableOpacity>

        {/* Movie Title */}
        <Text className="text-sm font-bold text-white mt-2" numberOfLines={1}>
          {Title}
        </Text>

        {/* Movie Rating */}
        <View className="flex-row items-center justify-start gap-x-1">
          <Image source={icons.star} className="size-4" />
          <Text className="text-xs text-white font-bold uppercase">
            {rating}
          </Text>
        </View>

        {/* Movie Year and Type */}
        <View className="flex-row items-center justify-between">
          <Text className="text-xs text-light-300 font-medium mt-1">
            {Year}
          </Text>
          <Text className="text-xs font-medium text-light-300 uppercase">
            Movie
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default MovieCard;