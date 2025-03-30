import { icons } from "@/constants/icons";
import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";

const Saved = () => {
  const [savedMovies, setSavedMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedMovies = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("savedDataKey");
      console.log("Retrieved saved data:", jsonValue);

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
    <Link
      href={{
        pathname: "../movies/[id]",
        params: { id: item.imdbID }, // Pass imdbID as the dynamic route parameter
      }}
      asChild
    >
      <View className="flex-row items-center p-4 border-b border-gray-800">
        <Image
          source={{
            uri:
              item.Poster !== "N/A"
                ? item.Poster
                : "https://placehold.co/600x400/1a1a1a/FFFFFF.png",
          }}
          className="w-16 h-24 rounded-md mr-4"
          resizeMode="cover"
        />
        <View className="flex-1">
          <Text className="text-white font-bold text-lg" numberOfLines={1}>
            {item.Title}
          </Text>
          <Text className="text-gray-400 text-sm">{item.Year}</Text>
          <View className="flex-row items-center mt-1">
            <Image source={icons.star} className="w-4 h-4 mr-1" />
            <Text className="text-yellow-400 text-sm">
              {item.imdbRating !== "N/A"
                ? Math.round(parseFloat(item.imdbRating) / 2)
                : "N/A"}
            </Text>
          </View>
        </View>
      </View>
    </Link>
  );

  if (loading) {
    return (
      <SafeAreaView className="bg-primary flex-1 px-10">
        <View className="flex justify-center items-center flex-1">
          <Text className="text-white">Loading...</Text>
        </View>
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
      <View className="px-4 py-6 pb-32">
        <Text className="text-white text-2xl font-bold mb-6">Saved Movies</Text>
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
