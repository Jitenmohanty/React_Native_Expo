import { icons } from "@/constants/icons";
import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";
import { images } from "@/constants/images";

const Saved = () => {
  const [savedMovies, setSavedMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedMovies = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("savedDataKey");

      if (jsonValue !== null) {
        // Parse the stored JSON array
        const parsedData = JSON.parse(jsonValue);

        if (Array.isArray(parsedData)) {
          setSavedMovies(parsedData);
        } else {
          // If it's not an array, put the single object in an array
          setSavedMovies([parsedData]);
        }
      } else {
        setSavedMovies([]);
      }
    } catch (error) {
      console.error("Failed to fetch saved movies:", error);
      setSavedMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // Remove a movie from saved list
  const removeMovie = async (id: string) => {
    try {
      // Filter out the movie with the matching ID
      const updatedMovies = savedMovies.filter((movie) => movie.imdbID !== id);

      // Update state
      setSavedMovies(updatedMovies);

      // Save updated list to AsyncStorage
      await AsyncStorage.setItem("savedDataKey", JSON.stringify(updatedMovies));
    } catch (error) {
      console.error("Failed to remove movie:", error);
      Alert.alert("Error", "Failed to remove movie from saved list");
      // Refresh the list to ensure UI is in sync with storage
      fetchSavedMovies();
    }
  };

  // Confirm before removing
  const confirmRemove = (id: string, title: string) => {
    Alert.alert(
      "Remove Movie",
      `Are you sure you want to remove "${title}" from your saved list?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: () => removeMovie(id),
          style: "destructive",
        },
      ]
    );
  };

  // Fetch on initial load
  useEffect(() => {
    fetchSavedMovies();
  }, []);

  // Refresh data when screen comes into focus (important for updates)
  useFocusEffect(
    useCallback(() => {
      fetchSavedMovies();
      return () => {};
    }, [])
  );

  const renderMovieItem = ({ item }: { item: any }) => (
    <View className="mb-4 mx-2 bg-gray-900 rounded-xl overflow-hidden shadow-lg">
      <View className="flex-row">
        {/* Movie Poster */}
        <Image
          source={{
            uri:
              item.Poster !== "N/A"
                ? item.Poster
                : "https://placehold.co/600x400/1a1a1a/FFFFFF.png",
          }}
          className="w-24 h-36"
          resizeMode="cover"
        />

        {/* Movie Details */}
        <Link
          href={{
            pathname: "/movies/[id]",
            params: { id: item.imdbID },
          }}
          className="flex-1"
        >
          <View className="p-3 flex-1 justify-between h-36">
            <View>
              <Text className="text-white font-bold text-lg" numberOfLines={1}>
                {item.Title}
              </Text>
              <Text className="text-gray-400 text-sm mb-1">{item.Year}</Text>

              <View className="flex-row items-center">
                <Image source={icons.star} className="w-4 h-4 mr-1" />
                <Text className="text-yellow-400 text-sm">
                  {item.imdbRating !== "N/A"
                    ? Math.round(parseFloat(item.imdbRating) / 2)
                    : "N/A"}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <Text className="text-gray-400 text-xs">{item.Type}</Text>
            </View>
          </View>
        </Link>

        {/* Remove Button - Positioned on the right side */}
        <TouchableOpacity
          onPress={() => confirmRemove(item.imdbID, item.Title)}
          className="p-3 justify-center items-center w-12"
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Image
            source={icons.removed}
            className="w-6 h-6"
            tintColor="#FF6B6B"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView className="bg-primary flex-1 px-10">
        <ActivityIndicator size="large" color="#0000ff" className="my-3" />
      </SafeAreaView>
    );
  }

  if (savedMovies.length === 0) {
    return (
      <SafeAreaView className="bg-primary flex-1 px-10">
        <View className="flex justify-center items-center flex-1 flex-col gap-5">
          <Image source={icons.save} className="size-10" tintColor="#fff" />
          <Text className="text-gray-500 text-base">No saved movies yet</Text>
          <Text className="text-white text-base font-light">
            Movies you save will appear here
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary flex-1">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />
      <View className="px-2 py-6 pb-36">
        <Text className="text-white text-2xl font-bold mb-6 px-2">
          Saved Movies
        </Text>
        <FlatList
          data={savedMovies}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.imdbID}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default Saved;
